<template>
  <div>
    <b-container align="center">
      <h1>Welcome to FirebaseRTC!</h1>
    </b-container>
    <div id="buttons">
    <button class="mdc-button mdc-button--raised" id="cameraBtn">
        <i class="material-icons mdc-button__icon" aria-hidden="true"></i>
        <span class="mdc-button__label">Open camera & microphone</span>
    </button>
    <button class="mdc-button mdc-button--raised" disabled id="createBtn">
        <i class="material-icons mdc-button__icon" aria-hidden="true"></i>
        <span class="mdc-button__label">Create room</span>
    </button>
    <button class="mdc-button mdc-button--raised" disabled id="joinBtn">
        <i class="material-icons mdc-button__icon" aria-hidden="true"></i>
        <span class="mdc-button__label">Join room</span>
    </button>
    <button class="mdc-button mdc-button--raised" disabled id="hangupBtn">
        <i class="material-icons mdc-button__icon" aria-hidden="true"></i>
        <span class="mdc-button__label">Hangup</span>
    </button>
</div>
  </div>
</template>

<script>
export default {
  name: 'VideoChat',
  data: function () {
    return {
    }
  },
  methods: {
  }  
}
</script>
  
<style>
</style>


