<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex flex-col gap-2 py-2">
      <el-input v-model="form.address" class="w-full eye mt-6" placeholder="Masukkan Lokasi Pencarian Daycare">
        <template slot="prepend">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
        </template>
      </el-input>
      <div id="map-wrap">
        <div class="text-base mb-2 mt-3">
          Tentukan Titik
        </div>
        <no-ssr>
          <l-map style="height: 250px" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" />
            <l-marker :draggable="true" :lat-lng="markerLatLng" @update:latLng="handleEvent" />
          </l-map>
        </no-ssr>
      </div>
      <div class="block w-full">
        <div class="demonstration mt-3 mb-2">
          Pilih Tanggal
        </div>
        <div class="w-full">
          <el-date-picker
            v-model="form.date1"
            class="date-size"
            :picker-options="pickerOptions"
            type="date"
            placeholder="Pick a day"
          />
        </div>
      </div>
      <div class="text-base mb-2 mt-3">
        Masukkan Jumlah Anak
      </div>
      <el-input-number v-model="form.numOfChildrens" class="counter mb-6" :min="1" :max="10" @change="handleChange" />
      <el-button class="w-full border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="updateDataSeeker">
        Masuk
      </el-button>
      <div v-if="form.error" class="text-left text-sm text-red-500 mt-2 cursor-pointer">
        {{ form.error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Home',
	data: () => {
		return {
			userData: {},
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			zoom: 13,
			center: [-6.175392, 106.827153],
			markerLatLng: [-6.175392, 106.827153],
			form: {
				latitude: '',
				longitude: '',
				date1: '',
				address: '',
				numOfChildrens: 1,
				error: ''
			},
			pickerOptions: {
				disabledDate (time) {
					return time.getTime() < Date.now() - 8.64e7
				},
				shortcuts: [{
					text: 'Today',
					onClick (picker) {
						picker.$emit('pick', new Date())
					}
				}, {
					text: 'Yesterday',
					onClick (picker) {
						const date = new Date()
						date.setTime(date.getTime() - 3600 * 1000 * 24)
						picker.$emit('pick', date)
					}
				}, {
					text: 'A week ago',
					onClick (picker) {
						const date = new Date()
						date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
						picker.$emit('pick', date)
					}
				}]
			}
		}
	},
	watch: {
		address (next) {
			if (next.length > 20) {
				this.getLongLat()
			}
		}
	},
	async mounted () {
		await this.getUserProfile()
		this.getUserPosition()
		if (!this.$route.params.id) {
			this.logout()
			return this.$router.push('/')
		}
	},
	methods: {
		async updateDataSeeker () {
			if (!this.$route.params.id) {
				this.logout()
				return this.$router.push('/')
			}

			try {
				const data = {
					latitude: this.form.latitude,
					longitude: this.form.longitude,
					date1: this.form.date1,
					address: this.form.address,
					numOfChildrens: this.form.numOfChildrens
				}
				const database = this.$fire.firestore
				await database.collection('user_informations')
					.doc(this.$route.params.id)
					.set(data)
					.then(async () => {
						this.form = {
							latitude: '',
							longitude: '',
							date1: '',
							address: '',
							numOfChildrens: 1,
							error: ''
						}
						await this.$router.push(`/products/${this.$route.params.id}`)
					})
			} catch (e) {
				this.form.error = 'Terjadi kesalahan sistem, silakan perbarui halaman'
			}
		},
		handleChange (value) {
			console.log(value)
		},
		async getLongLat () {
			await this.$axios.$get(`https://nominatim.openstreetmap.org/search.php?q=${this.form.address}&format=jsonv2`)
				.then((res) => {
					if (res.length !== 0) {
						this.form.longitude = res[0].lon
						this.form.latitude = res[0].lat
						this.center = [res[0].lat, res[0].lon]
						this.markerLatLng = [res[0].lat, res[0].lon]
					}
				})
		},
		handleEvent (event) {
			this.form.latitude = event.lat
			this.form.longitude = event.lng
		},
		getUserPosition () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((pos) => {
					this.center = [pos.coords.latitude, pos.coords.longitude]
					this.markerLatLng = [pos.coords.latitude, pos.coords.longitude]
				})
			}
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
		async logout () {
			try { await this.$fire.auth.signOut() } catch (e) { alert(e) }
		}
	}
}
</script>
