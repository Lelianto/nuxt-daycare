<template>
  <div>
    Hi {{ $store.state.authUser ? $store.state.authUser.email : '' }},
    Homepage after login
  </div>
</template>

<script>
export default {
	name: 'Home',
	data: () => {
		return {
			userData: {}
		}
	},
	async mounted () {
		await this.getUserProfile()
	},
	methods: {
		async getUserProfile () {
			if (!this.$route.params.id) {
				this.logout()
				return this.$router.push('/')
			}
			const database = this.$fire.firestore
			await database.collection('users')
				.doc(await this.$route.params.id)
				.get()
				.then(async (doc) => {
					const response = await doc.data()
					console.log('hasil profile', response)
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		async logout () {
			try { await this.$fire.auth.signOut() } catch (e) { alert(e) }
		}
	}
}
</script>
