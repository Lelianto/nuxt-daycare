<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex flex-col gap-2 py-2">
      <div class="w-full mt-5">
        <el-input v-model="form.fullName" placeholder="Masukkan Nama Lengkap" class="w-full eye">
          <template slot="prepend">
            <font-awesome-icon :icon="['fas', 'user']" />
          </template>
        </el-input>
        <el-input v-model="form.phoneNumber" placeholder="Masukkan Nomor WhatsApp" class="w-full eye mt-3">
          <template slot="prepend">
            <font-awesome-icon :icon="['fas', 'phone']" />
          </template>
        </el-input>
        <el-input v-model="form.email" placeholder="Masukkan Email" class="w-full eye mt-3">
          <template slot="prepend">
            <font-awesome-icon :icon="['fas', 'envelope-square']" />
          </template>
        </el-input>
        <el-input v-model="form.address" placeholder="Masukkan Alamat Lengkap" class="w-full eye mt-3">
          <template slot="prepend">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          </template>
        </el-input>
        <el-input v-model="form.password" placeholder="Masukkan Password" :type="passType" class="w-full mt-3 eye">
          <template slot="prepend">
            <font-awesome-icon
              v-if="passType === 'password'"
              class="cursor-pointer"
              :icon="['fas', 'eye']"
              @click="passType = 'text'"
            />
            <font-awesome-icon
              v-else
              class="cursor-pointer"
              :icon="['fas', 'eye-slash']"
              @click="passType = 'password'"
            />
          </template>
        </el-input>
        <el-input v-model="form.confirmPassword" placeholder="Konfirmasi Password" :type="passConType" class="w-full mt-3 eye">
          <template slot="prepend">
            <font-awesome-icon
              v-if="passConType === 'password'"
              class="cursor-pointer"
              :icon="['fas', 'eye']"
              @click="passConType = 'text'"
            />
            <font-awesome-icon
              v-else
              class="cursor-pointer"
              :icon="['fas', 'eye-slash']"
              @click="passConType = 'password'"
            />
          </template>
        </el-input>
        <div class="w-full mt-3 mb-5 flex justify-around">
          <el-radio v-model="form.userType" label="seeker">
            Pencari
          </el-radio>
          <el-radio v-model="form.userType" label="owner">
            Pemilik
          </el-radio>
        </div>
        <el-button class="w-full border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="signUpUser">
          Daftar
        </el-button>
        <div v-if="form.error" class="text-left text-sm text-red-500 mt-2 cursor-pointer">
          {{ form.error }}
        </div>
        <div class="text-left mt-3 text-base text-blue-800">
          <span class="cursor-pointer" @click="$router.push('/register')">
            Masuk
          </span>
        </div>
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
				fullName: '',
				phoneNumber: '',
				email: '',
				address: '',
				password: '',
				confirmPassword: '',
				userType: '',
				error: ''
			},
			passType: 'password',
			passConType: 'password'
		}
	},
	methods: {
		async signUpUser () {
			try {
				await this.$fire.auth.createUserWithEmailAndPassword(this.form.email, this.form.password).then(async (res) => {
					const uid = await res.user._delegate.uid
					if (uid) {
						await this.postUserProfile(uid)
					} else {
						this.form.error = 'Pengguna tidak ditemukan'
					}
				})
			} catch (e) {
				this.form.error = 'Terjadi kesalahan sistem, silakan perbarui halaman'
			}
		},
		async postUserProfile (id) {
			try {
				const data = {
					fullName: this.form.fullName,
					phoneNumber: this.form.phoneNumber,
					email: this.form.email,
					address: this.form.address,
					userType: this.form.userType
				}
				const database = this.$fire.firestore
				await database.collection('users')
					.doc(id)
					.set(data)
					.then(async () => {
						await this.$router.push(`/home/${id}`)
					})
			} catch (e) {
				this.form.error = 'Terjadi kesalahan sistem, silakan perbarui halaman'
			}
		}
	}
}
</script>
