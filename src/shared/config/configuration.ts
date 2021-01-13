export default () => ({
  port: parseInt(process.env.BACKEND_APP_PORT, 10) || 3000,
})