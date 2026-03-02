<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

// Campos de formulario
const login = ref('')
const password = ref('')
const zusuario = ref('') 
const error = ref('')

// Función para acceder
const acceder = async () => {
    try {
      // POST al endpoint de login
      const res = await api.post('/auth/login', {
          login: login.value,
          password: password.value,
          zusuario: zusuario.value
      })

      // Guardar datos del usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(res.data))

      // Redirigir a dashboard
      router.push('/dashboard')
    }catch (err) {
      // Mostrar errores
      error.value = err.response?.data?.error || 'Error en la autenticación'
    }
}
</script>

<template>
  <h2>Login</h2>
  <div>
    <input v-model="login" placeholder="Usuario" />
  </div>
  <div>
    <input v-model="password" type="password" placeholder="Contraseña" />
  </div>
  <div>
    <input v-model="zusuario" placeholder="Zusuario" />
  </div>
  <button @click="acceder">Entrar</button>
  <p style="color:red">{{ error }}</p>
</template>