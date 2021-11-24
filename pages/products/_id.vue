<template>
  <div>
    Products
  </div>
</template>

<script>
export default {
	name: 'Products',
	data: () => {
		return {
			userData: {},
			userInformations: {},
			distance: 0,
			center: [-6.175392, 106.827153]
		}
	},
	async mounted () {
		if (!this.$route.params.id) {
			this.logout()
			return this.$router.push('/')
		}
		await this.getUserPosition()
	},
	methods: {
		async getUserPosition () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((pos) => {
					this.center = [pos.coords.latitude, pos.coords.longitude]
				})
			}
			await this.getUserInformations()
			await this.getUserProfile()
		},
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
					this.userData = response
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		async getUserInformations () {
			if (!this.$route.params.id) {
				this.logout()
				return this.$router.push('/')
			}
			const database = this.$fire.firestore
			await database.collection('user_informations')
				.doc(await this.$route.params.id)
				.get()
				.then(async (doc) => {
					const response = await doc.data()
					this.userInformations = response
					const distance = this.calcCrow(this.center[0], this.center[1], response.latitude * 1, response.longitude * 1)
					this.distance = distance
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		calcCrow (lat1, lon1, lat2, lon2) {
			const R = 6371 // km
			const dLat = this.toRad(lat2 - lat1)
			const dLon = this.toRad(lon2 - lon1)
			const lati1 = this.toRad(lat1)
			const lati2 = this.toRad(lat2)

			const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lati1) * Math.cos(lati2)
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
			const d = R * c
			return d
		},
		toRad (value) {
			return value * Math.PI / 180
		},
		async logout () {
			try { await this.$fire.auth.signOut() } catch (e) { alert(e) }
		}
	}
}
</script>
