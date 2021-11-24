<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex flex-col gap-2 py-2">
      <div class="flex justify-center">
        <div v-if="userInformations.dayCarePics" class="box-photo">
          <img :src="userInformations.dayCarePics" alt="">
        </div>
      </div>
      <div class="text-base text-center font-bold mt-1">
        {{ userInformations.dayCareName || '-' }}
      </div>
      <div class="text-xs text-center mt-1">
        {{ userInformations.address || '-' }}
      </div>
      <div class="text-xs text-left font-bold mt-1">
        Jadwal Layanan
      </div>
      <div v-if="userInformations.ownerDate && userInformations.ownerDate.length !== 0" class="flex flex-wrap">
        <div v-for="(date, index) in userInformations.ownerDate" :key="`key-date-${index}`">
          <div class="bg-gray-500 text-xs rounded p-2 m-2 text-white">
            {{ $moment(date.seconds * 1000).format('DD-MM-YYYY') }}
          </div>
        </div>
      </div>
      <div class="text-xs text-left font-bold mt-1">
        Biaya Layanan
      </div>
      <div class="text-xs text-left mt-1 pl-2">
        Rp {{ userInformations.servicePrice || '-' }}
      </div>
      <div>
        {{ userData }}
      </div>
      <div>
        {{ userInformations }}
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
			center: [-6.175392, 106.827153]
		}
	},
	async mounted () {
		if (!this.$route.params.id) {
			this.logout()
			return this.$router.push('/')
		}
		await this.getUserProfile()
		await this.getUserInformations()
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
