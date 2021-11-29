<template>
  <div v-if="daycares.length !== 0" class="w-full px-2 mt-6">
    <div v-for="(daycare, index) in daycares" :key="`key-product-${index}`" class="lg:container mx-4 flex flex-row gap-2 p-2 border-2 rounded-md mb-6">
      <div class="box-photo-product">
        <img :src="daycare.dayCarePics" alt="">
      </div>
      <div class="relative w-full">
        <div class="font-bold">
          {{ daycare.dayCareName }}
        </div>
        <div class="text-sm">
          {{ daycare.address }}
        </div>
        <div class="font-semibold">
          Rp {{ daycare.servicePrice[0] | formatMoney }} / hari
        </div>
        <el-button class="w-1/2 border-sm bg-gray-400 text-white cursor-pointer order-button absolute bottom-0 right-0" type="info" @click="handleToDetail(daycare.id)">
          Pesan
        </el-button>
      </div>
    </div>
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
			center: [-6.175392, 106.827153],
			daycares: []
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
		handleToDetail (id) {
			this.$router.push(`/products/${this.$route.params.id}/detail/${id}`)
		},
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
				.get()
				.then(async (doc) => {
					const response = await doc.docs
					const responseData = []

					response.forEach((data) => {
						const content = data.data()
						content.id = data.id
						responseData.push(content)
					})

					this.daycares = responseData.filter((item) => { return item.dayCareName })
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
