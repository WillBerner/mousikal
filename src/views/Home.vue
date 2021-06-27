<template>
  <div class="home">
    <LoginRegister/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginRegister from '@/components/LoginRegister.vue'

export default {
  name: 'home',
  components: {
    LoginRegister,
  }
}
</script>
