<template>
  <div>
    <b-container fluid class="text-center" align-v="center">
      <b-row>
        <b-col>
          <b-jumbotron bg-variant="primary">
            <b-row>
              <b-col md="2">
                <template>
                  <b-row>
                    <b-icon variant="danger" shift-h="-95" shift-v="-5" font-scale="4" icon="circle-fill"></b-icon>
                  </b-row>
                  <b-row>
                    <b-icon variant="danger" shift-h="-95" shift-v="-10" font-scale="4" icon="circle-fill"></b-icon>
                  </b-row>
                </template>          
              </b-col> 
              <b-col>    
                <template>
                  <b-form-input v-model="text" placeholder="Username"></b-form-input>
                </template>
              </b-col>  
            </b-row>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  }
}
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
