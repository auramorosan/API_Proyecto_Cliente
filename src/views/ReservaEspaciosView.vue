<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
const ZUSUARIO = 'auram'
const loginUsuario = usuarioLogueado.usuario

const espacios = ref([])
const horarios = ref([])
const reservas = ref([])

const hoy = new Date().toISOString().slice(0,10)
const motivo = ref("")

//cargas
const cargarEspacios = async () => {
  const res = await api.get(`/espacios?zusuario=${ZUSUARIO}`)
  espacios.value = res.data
}

const cargarHorarios = async () => {
  const res = await api.get(`/horarios?zusuario=${ZUSUARIO}`)
  horarios.value = res.data
}

const cargarReservasHoy = async () => {
  const res = await api.get(`/reservas?fecha_reserva=${hoy}&zusuario=${ZUSUARIO}`)
  reservas.value = res.data
}

//comprobar ocupado
const ocupado = (espacioId, horarioId) => {
  return reservas.value.find(r =>
    r.espacio_id === espacioId && r.horario_id === horarioId
  )
}

//reserva click
const reservar = async (espacioId, horarioId) => {
  if (motivo.value.length < 10) {
    alert("Motivo mínimo 10 caracteres")
    return
  }
  try {
    await api.post('/reservas', {
      espacio_id: espacioId,
      horario_id: horarioId,
      usuario_login: loginUsuario,
      fecha_reserva: hoy,
      motivo_reserva: motivo.value,
      zusuario: ZUSUARIO,
      zfecha: new Date().toISOString()
    })
    motivo.value = ""
    cargarReservasHoy()
  } catch (e) {
    if (e.response?.status === 409)
      alert("Conflicto de horarios")
    else
      alert("Error al reservar")
  }
}

//agrupar por planta
const plantas = () => {

  const agrupado = {}

  espacios.value.forEach(e => {
    if (!agrupado[e.ubicacion_planta])
      agrupado[e.ubicacion_planta] = []

    agrupado[e.ubicacion_planta].push(e)
  })

  return agrupado
}

onMounted(() => {
  cargarEspacios()
  cargarHorarios()
  cargarReservasHoy()
})
</script>

<template>
  <h2>Reservas de Hoy</h2>
  <input v-model="motivo" placeholder="Motivo reserva (mín 10)"/>
  <div v-for="(espaciosPlanta, planta) in plantas()" :key="planta">
    <h3>Planta {{ planta }}</h3>
    <table border="1">
      <thead>
        <tr>
          <th>Espacio</th>
          <th v-for="h in horarios" :key="h.id">
            {{ h.nombre }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="e in espaciosPlanta" :key="e.id">
          <td>{{ e.nombre }}</td>
          <td v-for="h in horarios" :key="h.id" @click="!ocupado(e.id,h.id) && reservar(e.id,h.id)"
              :style="{background: ocupado(e.id,h.id) ? '#ff6b6b' : '#51cf66',
                      cursor: ocupado(e.id,h.id) ? 'not-allowed' : 'pointer'}">
                {{ ocupado(e.id,h.id) ? 'Ocupado' : 'Libre' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
