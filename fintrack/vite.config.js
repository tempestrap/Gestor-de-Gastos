const { defineConfig } = require('vite')
// require the plugin so Vite can load in CJS environments
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  plugins: [react()],
})
