<template>
  <div>
    <b-container class="m-0 p-0 mw-100">
      <b-row no-gutters class="vh-100">
        <b-col class="col-md-5 col-12 d-flex align-items-center">
          <b-row no-gutters class="w-100" align-v="center">
            <b-col class="px-0">
              <b-jumbotron
                bg-variant="primary"
                class="d-flex flex-column vh-100 justify-content-center align-items-center"
              >
                <b-row class="justify-content-center w-75">
                  <b-col flex class="justify-content-center">
                    <template>
                      <div>
                        <b-row class="text-center my-3" align-v="center">
                          <b-col class="px-1">
                            <b-form-input
                              v-model="email"
                              placeholder="Email address"
                            ></b-form-input>
                          </b-col>
                        </b-row>
                        <b-row class="text-center my-3" align-v="center">
                          <b-col class="px-1">
                            <b-form-input
                              v-model="password"
                              type="password"
                              placeholder="Password"
                            ></b-form-input>
                          </b-col>
                        </b-row>
                      </div>
                    </template>
                  </b-col>
                </b-row>
                <b-row no-gutters class="justify-content-center w-75 h-5">
                  <b-col class="text-center mx-2 my-1">
                    <b-button
                      class="h-100"
                      block
                      pill
                      variant="warning"
                      v-on:click="createAccount"
                    >
                      Create Account</b-button
                    >
                  </b-col>
                  <b-col class="text-center mx-2 my-1">
                    <b-button
                      class="h-100"
                      block
                      pill
                      variant="warning"
                      v-on:click="login"
                    >
                      Login</b-button
                    >
                  </b-col>
                </b-row>
              </b-jumbotron>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="col-md-7 d-flex align-items-center px-4">
          <b-img
            fluid-grow
            alt="McGill logo"
            :src="require('../assets/McGill_logo.png')"
          ></b-img>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import { auth } from "../firebase";

export default {
  name: "Home",
  data: function() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    createAccount: async function() {
      let registrationDetails = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("register", registrationDetails);
      let isSignedIn = this.$store.getters.getIsSignedIn;

      if (isSignedIn) {
        this.$router.push({ name: "VideoChat" });
      }
    },
    login: async function() {
      let loginDetails = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("login", loginDetails);
      let isSignedIn = this.$store.getters.getIsSignedIn;

      if (isSignedIn) {
        this.$router.push({ name: "VideoChat" });
      }
    },
  },
};
</script>

<style></style>
