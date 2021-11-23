<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex gap-2 py-2">
      <div class="w-full">
        <div class="start">
          Main Title
        </div>
        <el-input v-model="form.email" class="w-full" />
        <el-input v-model="form.password" class="w-full" type="password" />
        <el-button @click="createUser">
          Register
        </el-button>

        <el-button @click="signInUser">
          Login
        </el-button>
        <el-button @click="logout">
          Log Out
        </el-button>
      </div>
    </div>
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
				await this.$fire.auth.createUserWithEmailAndPassword(this.form.email, this.form.password).then(async (res) => {
					const uid = await res.user._delegate.uid
					if (uid) {
						await this.postUserProfile(uid)
					} else {
						throw new Error('user id is null in register')
					}
				})
			} catch (e) { alert(e) }
		},
		async getUserProfile (id) {
			const database = this.$fire.firestore
			await database.collection('users')
				.doc(await id)
				.get()
				.then(async (doc) => {
					const response = await doc.data()
					console.log('hasil profile', response)
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		async postUserProfile (id) {
			try {
				const database = this.$fire.firestore
				await database.collection('users')
					.doc(id)
					.set({
						address: 'Tangerang, Indonesia',
						postalCode: '16424'
					})
					.then(async (res) => {
						console.log('response post', await res)
					})
			} catch (e) { alert(e) }
		},
		async signInUser () {
			try {
				await this.$fire.auth.signInWithEmailAndPassword(this.form.email, this.form.password).then(async (res) => {
					const uid = await res.user._delegate.uid
					if (uid) {
						await this.getUserProfile(uid)
					} else {
						throw new Error('user id is null in login')
					}
				})
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
