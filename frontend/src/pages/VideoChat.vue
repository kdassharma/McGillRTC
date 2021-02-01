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
export default {
  name: 'VideoChat',
  data: function () {
    return {
        isInRoom: false,
        isMediaOpen: false,
        roomId: null
    }
  },
  methods: {
    joinRoom: function () {
        this.$refs["my-modal"].show()    
    }
  }  
}
</script>
  
<style>
</style>


