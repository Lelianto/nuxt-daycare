<template>
  <div v-if="transactions.length !== 0" class="w-full px-2 mt-6">
    <div v-for="(transaction, index) in transactions" :key="`key-transaction-${index}`" class="lg:container mx-4 flex flex-row gap-2 p-2 border-2 rounded-md mb-3">
      <div>
        <div class="box-photo-product">
          <img :src="transaction.daycare.dayCarePics" alt="">
        </div>
        <div class="text-center text-sm mt-1 font-semibold">
          {{ transactionStatus(transaction.transaction.status) }}
        </div>
      </div>
      <div class="relative w-full">
        <div class="font-bold">
          {{ transaction.daycare.dayCareName }}
        </div>
        <div class="text-sm">
          {{ transaction.daycare.address }}
        </div>
        <div class="font-semibold">
          Rp {{ transaction.transaction.price | formatMoney }} / hari
        </div>
        <div class="font-semibold mb-3">
          Tanggal {{ transaction.transaction.date.seconds | formatDateEpoch }}
        </div>
        <div v-if="transaction.transaction.status === 'booked'" class="flex">
          <el-button class="w-1/2 border-sm bg-red-400 text-white cursor-pointer order-button" type="danger" @click="cancelOrder(transaction.id)">
            Batalkan
          </el-button>
          <el-button class="w-1/2 border-sm bg-gray-400 text-white cursor-pointer order-button" type="info" @click="payOrder(transaction.id)">
            Bayar
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'Riwayat',
	data: () => {
		return {
			transactions: []
		}
	},
	async mounted () {
		await this.getTransactionList()
	},
	methods: {
		async updateTransaction (data, id) {
			const database = this.$fire.firestore
			await database.collection('transactions')
				.doc(this.$route.params.id)
				.collection('details')
				.doc(await id)
				.update(data)
				.then(async () => {
					await this.getTransactionList()
				})
		},
		cancelOrder (id) {
			this.updateTransaction({ status: 'cancelled' }, id)
		},
		payOrder (id) {
			this.updateTransaction({ status: 'paid' }, id)
		},
		transactionStatus (status) {
			switch (status) {
			case 'booked':
				return 'Booking'
			case 'cancelled':
				return 'Dibatalkan'
			case 'paid':
				return 'Dibayar'
			}
		},
		async getTransactionList () {
			const database = this.$fire.firestore
			await database.collection('transactions')
				.doc(await this.$route.params.id)
				.collection('details')
				.get()
				.then(async (response) => {
					const listResponse = await response.docs
					const transactions = []
					listResponse.forEach(async (res) => {
						const transaction = await this.getDetailTransaction(res.id)
						const daycare = await this.getUserProfile(transaction.daycareId)
						transactions.push({
							id: res.id,
							transaction,
							daycare
						})
					})
					this.transactions = transactions
					console.log('transactions', this.transactions)
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		async getDetailTransaction (id) {
			const database = this.$fire.firestore
			return await database.collection('transactions')
				.doc(this.$route.params.id)
				.collection('details')
				.doc(await id)
				.get()
				.then(async (response) => {
					return await response.data()
				})
				.catch((error) => {
					throw new Error(error)
				})
		},
		async getUserProfile (id) {
			const database = this.$fire.firestore
			return await database.collection('user_informations')
				.doc(await id)
				.get()
				.then(async (doc) => {
					return await doc.data()
				})
				.catch((error) => {
					throw new Error(error)
				})
		}
	}
}
</script>
