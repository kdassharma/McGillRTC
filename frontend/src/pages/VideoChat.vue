<template>
  <div class="bg-primary vh-100">
    <b-container class="d-flex flex-column" align="center">
      <!-- Heading -->
      <b-row class="my-2">
        <b-col>
          <h1 class="text-light">Welcome to McGillRTC!</h1>
        </b-col>
      </b-row>
      <b-row class="my-2" v-if="isInRoom">
        <b-col>
          <h5 class="text-light">
            Current room is {{ roomId }} - You are the caller!
          </h5>
        </b-col>
      </b-row>
      <!-- Buttons -->
      <b-row class="my-2" id="buttons">
        <b-col>
          <b-button
            pill
            class="mr-4"
            variant="success"
            v-on:click="openUserMedia"
            v-if="!isMediaOpen"
            >Open Camera & Microphone</b-button
          >
          <b-button
            pill
            class="mx-2"
            variant="warning"
            :disabled="!isMediaOpen"
            v-on:click="showScheduleModal"
            v-if="!isInRoom"
            >Schedule</b-button
          >
          <b-button
            pill
            class="mx-2"
            variant="warning"
            :disabled="!isMediaOpen"
            v-on:click="joinRoom"
            v-if="!isInRoom"
            >Join Room</b-button
          >
          <b-button
            pill
            class="ml-4"
            variant="success"
            v-if="isInRoom"
            v-on:click="copyRoomId"
            >Copy Join Link</b-button
          >
          <b-button
            pill
            class="ml-4"
            variant="danger"
            v-if="isInRoom"
            v-on:click="hangUp"
            >Hangup</b-button
          >
          <b-button pill class="ml-4" variant="danger" v-on:click="signOut"
            >Sign out</b-button
          >
        </b-col>
      </b-row>
      <!-- Videos -->
      <b-row class="mt-5 w-65">
        <div
          class="d-flex justify-content-center"
          id="videos"
          v-if="isMediaOpen"
        >
          <b-container class="position-relative">
            <video
              id="localVideo"
              class="mr-5 h-100 w-100"
              muted
              autoplay
              playsinline
            ></video>

            <div
              v-if="showIntroOverlay"
              class="position-absolute text-center d-block controls mr-3 mt-5"
            >
              <b-card class="mx-3 bg-secondary">
                <b-card-text class="mx-5">
                  Welcome! 👋 <br /><br />
                  Please introduce yourself and let your buddy know what you are
                  working on.
                </b-card-text>
              </b-card>
            </div>

            <!-- Mute Controls -->
            <b-button-group
              class="position-absolute text-center d-block controls"
              v-if="showControls"
            >
              <b-button
                class="shadow-none border-0 bg-transparent"
                v-on:click="muteMic"
              >
                <b-icon variant="dark" icon="mic" v-if="!isMicMuted"></b-icon>
                <b-icon
                  variant="dark"
                  icon="mic-mute-fill"
                  v-if="isMicMuted"
                ></b-icon>
              </b-button>
              <b-button
                class="shadow-none border-0 bg-transparent"
                v-on:click="muteVideo"
              >
                <b-icon
                  variant="dark"
                  icon="camera-video"
                  v-if="!isVideoMuted"
                ></b-icon>
                <b-icon
                  variant="dark"
                  icon="camera-video-off-fill"
                  v-if="isVideoMuted"
                ></b-icon>
              </b-button>
            </b-button-group>
          </b-container>
          <b-container class="position-relative">
            <video
              id="remoteVideo"
              :class="{ 'd-flex': isInRoom, 'd-none': !isInRoom }"
              class="ml-5 h-100 w-100"
              autoplay
              playsinline
            ></video>
          </b-container>
        </div>
      </b-row>
      <!-- Join Room Modal -->
      <b-row>
        <b-modal ref="join-room-modal" hide-footer title="Join Room">
          <b-row>
            <b-col class="col-10 pr-0">
              <b-form-input
                v-model="typedRoomId"
                placeholder="Paste Room ID"
              ></b-form-input>
            </b-col>
            <b-col class="col-2">
              <b-button
                pill
                variant="primary"
                v-on:click="joinRoomById(typedRoomId)"
                >Join!</b-button
              >
            </b-col>
          </b-row>
        </b-modal>
      </b-row>
      <!-- Schedule modal -->
      <b-row>
        <b-modal ref="schedule-modal" hide-footer title="Schedule Time">
          <b-row>
            <b-col class="col-10 pr-0">
              <b-form-input
                v-model="scheduledTime"
                placeholder="Select a time in HH:MM format"
              ></b-form-input>
            </b-col>
            <b-col class="col-2">
              <b-button
                pill
                variant="primary"
                v-on:click="schedule(scheduledTime)"
                >Schedule!</b-button
              >
            </b-col>
          </b-row>
        </b-modal>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { db } from "../firebase";
// import { auth } from "../firebase";
export default {
  name: "VideoChat",
  data: function() {
    return {
      configuration: {
        iceServers: [
          {
            urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      },
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      roomDialog: null,
      typedRoomId: null,
      roomId: null,
      isInRoom: false,
      isMediaOpen: false,
      scheduledTime: null,
      isMicMuted: false,
      isVideoMuted: false,
      hasPartnerJoined: false,
      showControls: false,
      showIntroOverlay: false,
    };
  },
  mounted: async function() {
    let roomId = this.$route.query.id;
    if (roomId) {
      await this.openUserMedia();
      this.joinRoomById(roomId);
    }
  },
  methods: {
    createRoom: async function() {
      const roomRef = await db.collection("rooms").doc();

      console.log(
        "Create this.peerConnection with configuration: ",
        this.configuration
      );
      this.peerConnection = new RTCPeerConnection(this.configuration);

      this.registerPeerConnectionListeners();

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Code for collecting ICE candidates below
      const callerCandidatesCollection = roomRef.collection("callerCandidates");

      this.peerConnection.addEventListener("icecandidate", (event) => {
        if (!event.candidate) {
          console.log("Got final candidate!");
          return;
        }
        console.log("Got candidate: ", event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above

      // Code for creating a room below
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log("Created offer:", offer);

      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      await roomRef.set(roomWithOffer);

      this.roomId = roomRef.id;
      await db
        .collection("users")
        .doc(this.$store.getters.getUser.id)
        .set({ room: roomRef.id }, { merge: true });

      console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);

      // Code for creating a room above
      this.peerConnection.addEventListener("track", (event) => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
          console.log("Add a track to the this.remoteStream:", track);
          this.remoteStream.addTrack(track);
        });
      });

      // Listening for remote session description below
      roomRef.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (
          !this.peerConnection.currentRemoteDescription &&
          data &&
          data.answer
        ) {
          console.log("Got remote description: ", data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await this.peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above

      // Listen for remote ICE candidates below
      roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`
            );
            await this.peerConnection.addIceCandidate(
              new RTCIceCandidate(data)
            );
          }
        });
      });

      this.isInRoom = true;
      // Listen for remote ICE candidates above
    },
    joinRoomById: async function(roomId) {
      console.log("This is room id:" + roomId);
      const roomRef = await db.collection("rooms").doc(roomId);
      const roomSnapshot = await roomRef.get();
      console.log("Got room:", roomSnapshot.exists);

      if (roomSnapshot.exists) {
        console.log(
          "Create PeerConnection with configuration: ",
          this.configuration
        );
        this.peerConnection = new RTCPeerConnection(this.configuration);
        this.registerPeerConnectionListeners();
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localStream);
        });

        // Code for collecting ICE candidates below
        const calleeCandidatesCollection = roomRef.collection(
          "calleeCandidates"
        );
        this.peerConnection.addEventListener("icecandidate", (event) => {
          if (!event.candidate) {
            console.log("Got final candidate!");
            return;
          }
          console.log("Got candidate: ", event.candidate);
          calleeCandidatesCollection.add(event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        this.peerConnection.addEventListener("track", (event) => {
          console.log("Got remote track:", event.streams[0]);
          event.streams[0].getTracks().forEach((track) => {
            console.log("Add a track to the remoteStream:", track);
            this.remoteStream.addTrack(track);
          });
        });

        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log("Got offer:", offer);
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await this.peerConnection.createAnswer();
        console.log("Created answer:", answer);
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
        roomRef.collection("callerCandidates").onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              console.log(
                `Got new remote ICE candidate: ${JSON.stringify(data)}`
              );
              await this.peerConnection.addIceCandidate(
                new RTCIceCandidate(data)
              );
            }
          });
        });

        this.isInRoom = true;
        this.roomId = roomId;

        this.$refs["join-room-modal"].hide();
        // Listening for remote ICE candidates above
      }
    },
    partnerJoined: function() {
      // Ensures it is only run once
      if (!this.hasPartnerJoined) {
        console.log("Partner joined!");
        this.showControls = true;
        this.showIntroOverlay = true;
        setTimeout(() => {
          this.showIntroOverlay = false;
        }, 5000);
      }
    },
    schedule: async function(time) {
      const usersCollection = await db.collection("users");

      const snapshot = await usersCollection
        .where("scheduledTime", "==", time)
        .get();
      var match = null;
      var found = false;

      if (snapshot.empty) {
        console.log("No users scheduled for this time.");
        this.createRoom();
        await usersCollection
          .doc(this.$store.getters.getUser.id)
          .set({ isMatched: false }, { merge: true });
      } else {
        snapshot.forEach(async (doc) => {
          if (
            !found &&
            doc.id != this.$store.getters.getUser.id &&
            !doc.data().isMatched
          ) {
            match = doc.data();
            found = true;
          }
          if (found) {
            console.log(match.room);
            await usersCollection
              .doc(match.id)
              .set({ isMatched: true }, { merge: true });
            await usersCollection
              .doc(this.$store.getters.getUser.id)
              .set({ isMatched: true }, { merge: true });
          }
          // console.log(doc.id, '=>', doc.data());
        });
      }

      await usersCollection
        .doc(this.$store.getters.getUser.id)
        .set({ scheduledTime: time }, { merge: true });

      this.$refs["schedule-modal"].hide();
    },
    openUserMedia: async function() {
      this.isMediaOpen = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      document.querySelector("#localVideo").srcObject = stream;
      this.localStream = stream;

      this.remoteStream = new MediaStream();
      document.querySelector("#remoteVideo").srcObject = this.remoteStream;

      console.log("Stream:", document.querySelector("#localVideo").srcObject);
    },
    closeUserMedia: async function() {
      this.isMediaOpen = false;

      if (this.localStream) {
        this.localStream.getTracks().forEach(function(track) {
          track.stop();
        });
      }

      if (document.querySelector("#localVideo")) {
        document.querySelector("#localVideo").srcObject = undefined;
      }
      this.localStream = undefined;

      this.remoteStream = undefined;
      if (document.querySelector("#remoteVideo")) {
        document.querySelector("#remoteVideo").srcObject = undefined;
      }
    },
    hangUp: async function() {
      this.isInRoom = false;
      this.isMediaOpen = false;
      this.showControls = false;

      if (this.localStream) {
        this.remoteStream.getTracks().forEach((track) => track.stop());
      }

      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach((track) => track.stop());
      }

      if (this.peerConnection) {
        this.peerConnection.close();
      }

      document.querySelector("#localVideo").srcObject = null;
      document.querySelector("#remoteVideo").srcObject = null;

      // Delete room on hangup
      if (this.roomId) {
        const roomRef = await db.collection("rooms").doc(this.roomId);
        const calleeCandidates = await roomRef
          .collection("calleeCandidates")
          .get();
        calleeCandidates.forEach(async (candidate) => {
          await candidate.ref.delete();
        });
        const callerCandidates = await roomRef
          .collection("callerCandidates")
          .get();
        callerCandidates.forEach(async (candidate) => {
          await candidate.ref.delete();
        });
        await roomRef.delete();
        this.roomId = "";
      }

      this.closeUserMedia();
    },
    registerPeerConnectionListeners: function() {
      this.peerConnection.addEventListener("icegatheringstatechange", () => {
        console.log(
          `ICE gathering state changed: ${this.peerConnection.iceGatheringState}`
        );
      });
      this.peerConnection.addEventListener("connectionstatechange", () => {
        console.log(
          `Connection state change: ${this.peerConnection.connectionState}`
        );

        if (this.peerConnection.connectionState == "connected") {
          this.partnerJoined();
          this.hasPartnerJoined = true;
        } else if (
          ["disconnected", "failed"].includes(
            this.peerConnection.connectionState
          )
        ) {
          this.hangUp();
        }
      });

      this.peerConnection.addEventListener("signalingstatechange", () => {
        console.log(
          `Signaling state change: ${this.peerConnection.signalingState}`
        );
      });

      this.peerConnection.addEventListener("iceconnectionstatechange ", () => {
        console.log(
          `ICE connection state change: ${this.peerConnection.iceConnectionState}`
        );
      });
    },
    joinRoom: function() {
      this.$refs["join-room-modal"].show();
    },
    showScheduleModal: function() {
      this.$refs["schedule-modal"].show();
    },
    signOut: async function() {
      await this.$store.dispatch("logout");
      this.$router.push({ name: "Home" });
      this.closeUserMedia();
    },
    muteMic: function() {
      this.isMicMuted = !this.isMicMuted;
      this.localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    },
    muteVideo: function() {
      this.isVideoMuted = !this.isVideoMuted;
      this.localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    },
    copyRoomId() {
      var Url =
        window.location.origin + this.$route.path + "?id=" + this.roomId;
      const el = document.createElement("textarea");
      el.value = Url;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
  },
};
</script>

<style>
button:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
.controls {
  top: 5px;
}
</style>
