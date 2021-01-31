<template>
  <div class="bg-primary vh-100 vw-100">
    <b-container>
        <b-row id="videos">
            <b-col>
                <video id="localVideo" muted autoplay playsinline></video>
            </b-col>
            <b-col>
                <video id="remoteVideo" autoplay playsinline></video>
            </b-col>
        </b-row>
    </b-container>
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
