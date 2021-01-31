<template>
  <div>
    <b-container class="mt-5 mx-0 px-0 mw-100">
      <b-row>
        <b-col class="px-0">
          <b-jumbotron bg-variant="primary">
            <b-row flex class="justify-content-center">
              <b-col flex class="justify-content-center" style="max-width:65%;">    
                <template> 
                  <div> 
                    <b-row class="text-center my-3" align-v="center">
                      <b-col class="px-0 col-1">
                        <b-icon variant="danger" icon="circle-fill"></b-icon>
                      </b-col>
                      <b-col class="px-1">
                        <b-form-input v-model="username" placeholder="Username"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="text-center my-3" align-v="center">
                      <b-col class="px-0 col-1">
                        <b-icon variant="danger" icon="circle-fill"></b-icon>
                      </b-col>
                      <b-col class="px-1">
                        <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>    
                      </b-col>
                    </b-row>              
                  </div>
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
