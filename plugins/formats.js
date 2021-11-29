import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'

Vue.filter('formatMoney', (value) => {
	return numeral(value).format('0,0')
})

Vue.filter('formatDateEpoch', (value, format = 'DD-MM-YYYY') => {
	return moment.unix(value).format(format)
})

Vue.filter('formatTime', (value) => {
	if (value !== 0) {
		return moment.utc(moment.duration(value, 'seconds').asMilliseconds()).format('HH:mm:ss')
	} else {
		return '00:00:00'
	}
})
