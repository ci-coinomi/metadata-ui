// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
			API_URL: process.env.API_URL
		}
	},
  app: {
		head: {
			// __dangerouslyDisableSanitizers: ['script'],
			title: 'Eucalyptus Labs - Metadata UI',
			meta: [
				{
					charset: 'utf-8'
				},
				{
					name: 'description',
					content: 'Tools for updates'
				},
			],
		}
	},
  devtools: { enabled: true },
})
