export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'sqlian',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'@/assets/main.scss'
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'@/plugins/element-ui'
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://go.nuxtjs.dev/tailwindcss
		'@nuxtjs/tailwindcss',
		'@nuxtjs/firebase',
		'@nuxtjs/fontawesome'
	],
	fontawesome: {
		icons: {
			solid: ['faUser', 'faEye', 'faEyeSlash']
		}
	},

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa'
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		manifest: {
			lang: 'en'
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	},

	hooks: {
		generate: {
			async done (builder) {
				// This makes sure nuxt generate does finish without running into a timeout issue.
				// See https://github.com/nuxt-community/firebase-module/issues/93
				const appModule = await import('./.nuxt/firebase/app.js')
				const { session } = await appModule.default(
					builder.options.firebase.config,
					{
						res: null
					}
				)
				try {
					session.database().goOffline()
				} catch (e) {}
				try {
					session.firestore().terminate()
				} catch (e) {}
			}
		}
	},

	firebase: {
		lazy: false,
		config: {
			apiKey: process.env.K_FIREBASE_API_KEY,
			authDomain: process.env.K_FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.K_FIREBASE_DATABASE_URL,
			projectId: process.env.K_FIREBASE_PROJECT_ID,
			storageBucket: process.env.K_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.K_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.K_FIREBASE_APP_ID,
			measurementId: process.env.K_FIREBASE_MEASUREMENT_ID,
			fcmPublicVapidKey: process.env.K_FIREBASE_PUBLIC_KEY
		},
		services: {
			auth: {
				initialize: {
					onAuthStateChangedAction: 'onAuthStateChanged'
				},
				ssr: true
				// emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : false,
			},
			firestore: true,
			functions: true,
			storage: true,
			database: true,
			messaging: true,
			performance: true,
			analytics: true,
			remoteConfig: true
		},
		onFirebaseHosting: false
	}
}
