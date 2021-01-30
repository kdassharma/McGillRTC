<template>
  <div class="hello">
      <div>
      <b-jumbotron header="BootstrapVue" lead="Bootstrap v4 Components for Vue.js 2">
        <p>For more information visit website</p>
        <b-button variant="primary" href="#">More Info</b-button>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>