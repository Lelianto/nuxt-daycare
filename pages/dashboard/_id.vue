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
        Jadwal Layanan - Slot Tersedia - Biaya Layanan
      </div>
      <div v-if="userInformations.ownerDate && userInformations.ownerDate.length !== 0" class="flex flex-wrap mb-3">
        <div v-for="(date, index) in userInformations.ownerDate" :key="`key-date-${index}`">
          <div class="bg-gray-500 text-xs rounded p-2 m-2 text-white">
            {{ $moment(date.seconds * 1000).format('DD-MM-YYYY') }} - {{ userInformations.capOfChildrens[index] }} - Rp {{ userInformations.servicePrice[index] }}
          </div>
        </div>
      </div>
      <el-button class="w-1/2 border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="showAddSchedule = true">
        Tambah Jadwal
      </el-button>
      <div v-if="showAddSchedule" class="w-full mt-3">
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
        <div v-if="showDate.length !== 0" class="flex flex-wrap justify mb-3">
          <div v-for="(date, index) in showDate" :key="`key-date-${index}`">
            <div class="bg-gray-500 text-xs rounded p-2 m-2 text-white">
              {{ date }} - {{ form.capOfChildrens && form.capOfChildrens[index] }} - Rp{{ form.servicePrice && form.servicePrice[index] }} <span class="cursor-pointer" @click="deleteDate(index)">&#x2715;</span>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <el-button class="w-full border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="updateSchedule">
            Selesai Menambahkan Jadwal & Simpan
          </el-button>
        </div>
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
			center: [-6.175392, 106.827153],
			showAddSchedule: false,
			inputDate: '',
			numOfChildrens: 0,
			servicePrice: 0,
			showDate: [],
			form: {
				ownerDate: [],
				capOfChildrens: [],
				servicePrice: []
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
	async mounted () {
		if (!this.$route.params.id) {
			this.logout()
			return this.$router.push('/')
		}
		await this.getUserProfile()
		await this.getUserInformations()
	},
	methods: {
		async updateSchedule () {
			const data = {
				ownerDate: this.userInformations.ownerDate.concat(this.form.ownerDate),
				capOfChildrens: this.userInformations.capOfChildrens.concat(this.form.capOfChildrens),
				servicePrice: this.userInformations.servicePrice.concat(this.form.servicePrice)
			}
			const database = this.$fire.firestore
			await database.collection('user_informations')
				.doc(await this.$route.params.id)
				.update(data)
				.then(() => {
					this.getUserInformations()
					this.showAddSchedule = false
				})
		},
		handleChange (value) {
			console.log(value)
		},
		addSchedule () {
			const formatDate = this.$moment(this.inputDate).format('DD-MM-YYYY')
			if (!this.form.ownerDate.includes(formatDate)) {
				this.form.ownerDate.push(this.inputDate)
				this.form.capOfChildrens.push(this.numOfChildrens)
				this.form.servicePrice.push(this.servicePrice)
				this.showDate.push(formatDate)
			}
			this.inputDate = ''
			this.numOfChildrens = 0
			this.servicePrice = 0
		},
		deleteDate (index) {
			this.showDate.splice(index, 1)
			this.form.ownerDate.splice(index, 1)
			this.form.capOfChildrens.splice(index, 1)
			this.form.servicePrice.splice(index, 1)
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
