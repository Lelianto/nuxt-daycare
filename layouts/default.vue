<template>
  <div class="w-full flex justify-center">
    <div class="scroll-hide w-full max-w-sm bg-gray-50 max-h-screen min-h-screen overflow-y-scroll border-4 border-light-blue-500 border-opacity-50">
      <div v-if="$route.params.id" class="flex w-full bg-indigo-100 justify-between">
        <div>
          <img width="50px" height="50px" src="@/assets/images/daycare-logo.png" alt="" @click="handleMenu('products')">
        </div>
        <div class="pt-1">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              Menu<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="products">
                Produk
              </el-dropdown-item>
              <el-dropdown-item command="history">
                Riwayat
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                Keluar
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
	name: 'Default',
	data: () => {
		return {}
	},
	methods: {
		handleCommand (command) {
			if (command === 'logout') {
				this.logout()
			} else {
				this.handleMenu(command)
			}
		},
		handleMenu (route) {
			this.$router.push(`/${route}/${this.$route.params.id}`)
		},
		async logout () {
			try {
				await this.$fire.auth.signOut()
				await this.$router.push('/')
			} catch (e) { alert(e) }
		}
	}
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scroll-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
