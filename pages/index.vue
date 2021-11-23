<template>
  <div class="w-full">
    <div class="lg:container mx-4 flex flex-col gap-2 py-2">
      <div class="w-full flex justify-center">
        <img class="w-2/3" src="@/assets/images/daycare-logo.png" alt="">
      </div>
      <div class="w-full">
        <el-input v-model="form.email" placeholder="Masukkan Email" class="w-full eye">
          <template slot="prepend">
            <font-awesome-icon :icon="['fas', 'user']" />
          </template>
        </el-input>
        <el-input v-model="form.password" placeholder="Masukkan Password" :type="passType" class="w-full mt-3 mb-3 eye">
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
        <el-button class="w-full border-sm bg-gray-400 text-white cursor-pointer" type="info" @click="signInUser">
          Masuk
        </el-button>
        <div v-if="form.error" class="text-left text-sm text-red-500 mt-2 cursor-pointer">
          {{ form.error }}
        </div>
        <div class="text-left mt-3 text-base text-blue-800">
          <span class="cursor-pointer" @click="$router.push('/register')">
            Daftar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Login',
	data: () => {
		return {
			form: {
				email: '',
				password: '',
				error: ''
			},
			passType: 'password'
		}
	},
	watch: {
		'form.email' () {
			this.form.error = ''
		},
		'form.password' () {
			this.form.error = ''
		}
	},
	async mounted () {

	},
	methods: {
		async signInUser () {
			try {
				await this.$fire.auth.signInWithEmailAndPassword(this.form.email, this.form.password).then(async (res) => {
					const uid = await res.user._delegate.uid
					if (uid) {
						this.$router.push(`/home/${uid}`)
					} else {
						this.form.error = 'Pengguna tidak ditemukan'
					}
				})
			} catch (e) {
				this.form.error = 'Terjadi kesalahan sistem, silakan perbarui halaman'
			}
		}
	}
}
</script>
