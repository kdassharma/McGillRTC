<template>
  <div>
    <b-container class="m-0 p-0 mw-100">
      <b-row class="vh-100">
        <b-col class="col-7 d-flex align-items-center">
          <b-row class="w-100" align-v="center">
            <b-col class="px-0">
              <b-jumbotron bg-variant="primary" class="vh-100 justify-content-center m-0 d-flex align-items-center">
                <b-row flex class="justify-content-center w-75">
                  <b-col flex class="justify-content-center">    
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
        </b-col>
        <b-col class="col-5 d-flex align-items-center">
          <b-img fluid-grow alt="McGill logo" :src="require('../assets/McGill_logo.png')"></b-img>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: function () {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    createAccount: function () {
    },
    login: function () {
    }
  }
}
</script>
  
<style>
</style>
