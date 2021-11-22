<template>
  <div>
    <div class="start">
      Main Title
    </div>
    <el-input v-model="form.email" class="w-full" />
    <el-input v-model="form.password" class="w-full" type="password" />
    <el-button @click="createUser">
      Register
    </el-button>

    <Tutorial />
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: () => {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async createUser () {
      try {
        const response = await this.$fire.auth.createUserWithEmailAndPassword(this.form.email, this.form.password)
        console.log('register', response)
      } catch (e) { alert(e) }
    },
    async signInUser () {
      try {
        const response = await this.$fire.auth.signInWithEmailAndPassword(this.form.email, this.form.password)
        console.log('register', response)
      } catch (e) {
        alert(e)
      }
    },
    async logout () {
      try { await this.$fire.auth.signOut() } catch (e) { alert(e) }
    }
  }
}
</script>
