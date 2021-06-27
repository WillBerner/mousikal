<template>
  <v-app>
    <v-app-bar app color="green darken-1" dark>
      <v-btn id='backButton' style="float:left;" class="ma-2" v-on:click='handleBack' hidden>back
          <v-icon dark right>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title class="headline">Mousikal</v-toolbar-title>
      <v-spacer></v-spacer>
      <h4 style="float:left;" id='userName' hidden></h4>
      <v-btn hidden id='logoutButton' style="float:right;" @click="logOut">Logout</v-btn>
    </v-app-bar>

    <v-content class="">
      <br/>
      <LoginRegister/>
    </v-content>
  </v-app>
</template>

<script>
import LoginRegister from "./components/LoginRegister";
import { setToken } from "./config/Token";

export default {
  name: "App",

  components: {
    LoginRegister
  },

  data: () => ({
    //
  }),

  methods: {
    handleBack() {
      window.location.reload();
    },
    async logOut() {
      setToken("");
      window.location.reload();
      document.getElementById("logoutButton").hidden = true;
    },
  }
};
</script>
