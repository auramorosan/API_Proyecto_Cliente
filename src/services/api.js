import axios from 'axios'
//Crea una instancia de Axios ya configurada
const api = axios.create({
  baseURL: 'http://44.207.19.239:3000/'
})
api.interceptors.request.use(config => {
  const zusuario = localStorage.getItem("zusuario")

  if (zusuario) {
    if (config.url.includes('?')) {
      config.url += `&zusuario=${zusuario}`
    } else {
      config.url += `?zusuario=${zusuario}`
    }
  }

  return config
})
export default api
