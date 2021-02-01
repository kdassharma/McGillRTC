<template>
  <div class="bg-primary vh-100">  
    <b-container class="d-flex flex-column" align="center">
        <!-- Heading -->
        <b-row class="mt-5">
            <b-col>
                <h1 class="text-light">Welcome to McGillRTC!</h1>
            </b-col>
        </b-row>
        <b-row class="mt-4" v-if="isInRoom">
            <b-col>
                <h5 class="text-light">Room ID#: {{ roomId }}</h5>
            </b-col>
        </b-row>
        <!-- Videos -->
        <div id="videos" v-if="isInRoom || isMediaOpen">
            <video id="localVideo" muted autoplay playsinline></video>
            <video id="remoteVideo" autoplay playsinline></video>
        </div>   
        <!-- Buttons -->
        <b-row class="mt-4" id="buttons">
            <b-col>
                <b-button pill class="mr-4" variant="success" v-on:click="openUserMedia" v-if="!isMediaOpen">Open Camera & Microphone</b-button>
                <b-button pill class="mx-2" variant="warning" v-on:click="createRoom" v-if="!isInRoom">Create Room</b-button>
                <b-button pill class="mx-2" variant="warning" v-on:click="joinRoom" v-if="!isInRoom">Join Room</b-button>
                <b-button pill class="ml-4" variant="danger" v-if="isInRoom">Hangup</b-button>
            </b-col>
        </b-row>
        <!-- Join Room Modal -->
        <b-row>
            <b-modal ref="my-modal" hide-footer title="Join Room">
                <b-row>
                    <b-col class="col-10 pr-0">
                        <b-form-input v-model="typedRoomId" placeholder="Paste Room ID"></b-form-input>
                    </b-col>
                    <b-col class="col-2">
                        <b-button pill variant="primary">Join!</b-button>
                    </b-col>
                </b-row>
            </b-modal>   
        </b-row>     
    </b-container>
  </div>
</template>

<script>
import { db } from '../firebase'

export default {
  name: 'VideoChat',
  data: function () {
    return {
      configuration: {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      },
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      roomDialog: null,
      roomId: null,
      isInRoom: false,
      isMediaOpen: false,
    };
  },
  methods: {
    createRoom: async function () {
      // document.querySelector('#createBtn').disabled = true;
      // document.querySelector('#joinBtn').disabled = true;
      const roomRef = await db.collection('rooms').doc();

      console.log('Create this.peerConnection with configuration: ', this.configuration);
      this.peerConnection = new RTCPeerConnection(this.configuration);

      this.registerPeerConnectionListeners();

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Code for collecting ICE candidates below
      const callerCandidatesCollection = roomRef.collection('callerCandidates');

      this.peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above

      // Code for creating a room below
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log('Created offer:', offer);

      const roomWithOffer = {
        'offer': {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      await roomRef.set(roomWithOffer);
      this.roomId = roomRef.id;
      console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
      // document.querySelector(
      //     '#currentRoom').innerText = `Current room is ${roomRef.id} - You are the caller!`;
      // Code for creating a room above

      this.peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the this.remoteStream:', track);
          this.remoteStream.addTrack(track);
        });
      });

      // Listening for remote session description below
      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (!this.peerConnection.currentRemoteDescription && data && data.answer) {
          console.log('Got remote description: ', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await this.peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above

      // Listen for remote ICE candidates below
      roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // Listen for remote ICE candidates above
    },
    joinRoomById: async function(roomId) {
      const roomRef = db.collection('rooms').doc(`${roomId}`);
      const roomSnapshot = await roomRef.get();
      console.log('Got room:', roomSnapshot.exists);

      if (roomSnapshot.exists) {
        console.log('Create PeerConnection with configuration: ', this.configuration);
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.registerPeerConnectionListeners();
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });

        // Code for collecting ICE candidates below
        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
        this.peerConnection.addEventListener('icecandidate', event => {
          if (!event.candidate) {
            console.log('Got final candidate!');
            return;
          }
          console.log('Got candidate: ', event.candidate);
          calleeCandidatesCollection.add(event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        this.peerConnection.addEventListener('track', event => {
          console.log('Got remote track:', event.streams[0]);
          event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            this.remoteStream.addTrack(track);
          });
        });

        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await this.peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await roomRef.update(roomWithAnswer);
        // Code for creating SDP answer above

        // Listening for remote ICE candidates below
        roomRef.collection('callerCandidates').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
              let data = change.doc.data();
              console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
        // Listening for remote ICE candidates above
      }
    },
    openUserMedia: async function() {
      const stream = await navigator.mediaDevices.getUserMedia(
      {video: true, audio: true});
      document.querySelector('#localVideo').srcObject = stream;
      this.localStreamlocalStream = stream;
      this.remoteStream = new MediaStream();
      document.querySelector('#remoteVideo').srcObject = this.remoteStream;

      console.log('Stream:', document.querySelector('#localVideo').srcObject);
      document.querySelector('#cameraBtn').disabled = true;
      document.querySelector('#joinBtn').disabled = false;
      document.querySelector('#createBtn').disabled = false;
      document.querySelector('#hangupBtn').disabled = false;
    },
    
    hangUp: async function() {
      const tracks = document.querySelector('#localVideo').srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });

      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
      }

      if (this.peerConnection) {
        this.peerConnection.close();
      }

      document.querySelector('#localVideo').srcObject = null;
      document.querySelector('#remoteVideo').srcObject = null;
      document.querySelector('#cameraBtn').disabled = false;
      document.querySelector('#joinBtn').disabled = true;
      document.querySelector('#createBtn').disabled = true;
      document.querySelector('#hangupBtn').disabled = true;
      document.querySelector('#currentRoom').innerText = '';

      // Delete room on hangup
      if (this.roomId) {
        const roomRef = db.collection('rooms').doc(this.roomId);
        const calleeCandidates = await roomRef.collection('calleeCandidates').get();
        calleeCandidates.forEach(async candidate => {
          await candidate.ref.delete();
        });
        const callerCandidates = await roomRef.collection('callerCandidates').get();
        callerCandidates.forEach(async candidate => {
          await candidate.ref.delete();
        });
        await roomRef.delete();
      }

      document.location.reload(true);
      
    },
    registerPeerConnectionListeners: function() {
      this.peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${this.peerConnection.iceGatheringState}`);
      });
        this.peerConnection.addEventListener('connectionstatechange', () => {
        console.log(`Connection state change: ${this.peerConnection.connectionState}`);
      });

      this.peerConnection.addEventListener('signalingstatechange', () => {
        console.log(`Signaling state change: ${this.peerConnection.signalingState}`);
      });

      this.peerConnection.addEventListener('iceconnectionstatechange ', () => {
        console.log(
            `ICE connection state change: ${this.peerConnection.iceConnectionState}`);
      });
    },
    joinRoom: function () {
      this.$refs["my-modal"].show()    
    }

  },
}
</script>
  
<style>
</style>


