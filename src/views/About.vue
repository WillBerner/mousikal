<template>
  <div class="about">
    <h1>Registration</h1>

    <div v-if="loggedIn">
      Logged In, User: {{this.loggedInUserName}}
      <button v-on:click="logOut">Logout</button>
    </div>
    <div v-else>Logged Out</div>

    <form @submit.prevent="registerAccount">
      Register
      <div class="email">
        <input type="text" v-model="name_register" placeholder="name" />
      </div>
      <div class="password">
        <input type="password" v-model="password_register" placeholder="password" />
      </div>
      <button type="submit">Register</button>
    </form>

    <form @submit.prevent="loginAccount">
      Login
      <div class="email">
        <input type="text" v-model="name_login" placeholder="name" />
      </div>
      <div class="password">
        <input type="password" v-model="password_login" placeholder="password" />
      </div>
      <button type="submit">Login</button>
    </form>


  </div>
</template>


<script>
import {createAccount} from "../api/account/Account";
import {login} from "../api/account/Account";
import {getStatus} from "../api/account/Account";
import {setToken} from "../config/Token";

export default {
  data() {
    return {
      name_register: "",
      password_register: "",
      name_login: "",
      password_login: "",
      error: "",
      loggedIn: true,
      loggedInUserName: ""
    };
  },
  methods: {
    async registerAccount() {
      const namePass = {
        name: this.name_register,
        pass: this.password_register
      }
      await createAccount(namePass);
    },
    async loginAccount() {
      const namePass = {
        name: this.name_login,
        pass: this.password_login
      }
      await login(namePass);
    },
    async logOut() {
      setToken('');
    }
  },
  async created() {
    let res = await getStatus();
    this.loggedIn = res;
    this.loggedInUserName = res.user.name;
  }
};
</script>