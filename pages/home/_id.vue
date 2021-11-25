<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex flex-col gap-2 py-2">
      <el-input v-if="userData.userType && userData.userType === 'owner'" v-model="form.dayCareName" class="w-full eye mt-6" placeholder="Masukkan Nama Daycare">
        <template slot="prepend">
          <font-awesome-icon :icon="['fas', 'user']" />
        </template>
      </el-input>
      <input
        v-if="userData.userType && userData.userType === 'owner'"
        id="daycare"
        ref="daycare"
        class="mt-3"
        type="file"
        @change="getLocalPhoto($event)"
      >
      <div v-if="form.dayCarePics" class="box-photo">
        <img :src="form.dayCarePics" alt="">
      </div>
      <el-input v-model="form.address" class="w-full eye mt-3" :placeholder="userData.userType && userData.userType === 'seeker' ? 'Masukkan Lokasi Pencarian Daycare' : 'Masukkan Lokasi Daycare'">
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
          {{ userData.userType && userData.userType === 'seeker' ? 'Pesan Jadwal Layanan' : 'Buat Jadwal Layanan' }}
        </div>
        <div v-if="userData.userType && userData.userType === 'seeker'" class="w-full">
          <el-date-picker
            v-model="form.date1"
            class="date-size"
            :picker-options="pickerOptions"
            type="date"
            placeholder="Pick a day"
          />
        </div>
        <div v-else class="w-full">
          <el-date-picker
            v-model="inputDate"
            class="date-size"
            :picker-options="pickerOptions"
            type="date"
            placeholder="Pick a day"
          />
          <div class="text-base mb-2 mt-3">
            Masukkan Kapasitas Anak Daycare
          </div>
          <el-input-number
            v-model="numOfChildrens"
            class="counter"
            :min="1"
            :max="10"
            @change="handleChange"
          />
          <div class="text-base mb-2 mt-3">
            Masukkan Biaya Layanan per Hari
          </div>
          <el-input v-model="servicePrice" class="w-full eye mb-3" type="number" placeholder="Masukkan Harga Layanan">
            <template slot="prepend">
              Rp
            </template>
          </el-input>
          <el-button class="w-1/2 border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="addSchedule">
            Simpan Jadwal
          </el-button>
        </div>
      </div>
      <div class="flex flex-wrap justify">
        <div v-for="(date, index) in showDate" :key="`key-date-${index}`">
          <div class="bg-gray-500 text-xs rounded p-2 m-2 text-white">
            {{ date }} - {{ form.capOfChildrens && form.capOfChildrens[index] }} - Rp {{ (form.servicePrice && form.servicePrice[index]) | formatMoney }} <span class="cursor-pointer" @click="deleteDate(index)">&#x2715;</span>
          </div>
        </div>
      </div>
      <div v-if="userData.userType && userData.userType === 'seeker'" class="text-base mb-2 mt-3">
        Masukkan Jumlah Anak
      </div>
      <el-input-number
        v-if="userData.userType && userData.userType === 'seeker'"
        v-model="form.numOfChildrens"
        class="counter mb-6"
        :min="1"
        :max="10"
        @change="handleChange"
      />
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
				ownerDate: [],
				address: '',
				numOfChildrens: 0,
				capOfChildrens: [],
				servicePrice: [],
				dayCarePics: '',
				dayCareName: '',
				error: ''
			},
			inputDate: '',
			numOfChildrens: 0,
			servicePrice: 0,
			showDate: [],
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
		'form.address' (next) {
			if (next.length > 20) {
				this.getLongLat()
			}
		}
	},
	async mounted () {
		await this.getUserInformations()
		await this.getUserProfile()
		this.getUserPosition()
		if (!this.$route.params.id) {
			this.logout()
			return this.$router.push('/')
		}
	},
	methods: {
		addSchedule () {
			const formatDate = this.$moment(this.inputDate).format('DD-MM-YYYY')
			if (!this.showDate.includes(formatDate)) {
				this.form.ownerDate.push(this.inputDate)
				this.form.capOfChildrens.push(this.numOfChildrens)
				this.form.servicePrice.push(this.servicePrice)
				this.showDate.push(formatDate)
			}
			this.inputDate = ''
			this.numOfChildrens = 0
			this.servicePrice = 0
		},
		getLocalPhoto (e) {
			this.uploadDaycarePhoto(this.$route.params.id, e.target.files[0])
		},
		async uploadDaycarePhoto (id, file) {
			const storageRef = this.$fire.storage.ref('daycare').child(`${id || 'dev'}/${file.name}`)
			await storageRef.put(file).then(async (snapshot) => {
				await this.getFileUrl(id, file.name)
			}).catch((error) => {
				throw new Error(error)
			})
		},
		async getFileUrl (id, name) {
			const storageRef = this.$fire.storage.ref('daycare').child(`${id}`).child(`${name}`)
			await storageRef.getDownloadURL().then((response) => {
				this.form.dayCarePics = response
				console.log('response', response)
			})
		},
		deleteDate (index) {
			this.showDate.splice(index, 1)
			this.form.ownerDate.splice(index, 1)
			this.form.capOfChildrens.splice(index, 1)
			this.form.servicePrice.splice(index, 1)
		},
		async updateDataSeeker () {
			if (!this.$route.params.id) {
				this.logout()
				return this.$router.push('/')
			}

			try {
				let data = {
					latitude: this.form.latitude,
					longitude: this.form.longitude,
					date1: this.form.date1,
					address: this.form.address,
					numOfChildrens: this.form.numOfChildrens
				}
				if (this.userData.userType === 'owner') {
					data = {
						latitude: this.form.latitude,
						longitude: this.form.longitude,
						ownerDate: this.form.ownerDate,
						address: this.form.address,
						capOfChildrens: this.form.capOfChildrens,
						dayCareName: this.form.dayCareName,
						dayCarePics: this.form.dayCarePics,
						servicePrice: this.form.servicePrice
					}
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

						if (this.userData.userType === 'owner') {
							await this.$router.push(`/dashboard/${this.$route.params.id}`)
						} else {
							await this.$router.push(`/products/${this.$route.params.id}`)
						}
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
					if (response.address) {
						if (this.userData.userType === 'owner') {
							await this.$router.push(`/dashboard/${this.$route.params.id}`)
						} else {
							await this.$router.push(`/products/${this.$route.params.id}`)
						}
					}
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
