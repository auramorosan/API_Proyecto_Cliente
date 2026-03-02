<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const espacios = ref([])
const editandoId = ref(null)

const estadosOperativos = [
  { id: 'OP', nombre: 'Operativo' },
  { id: 'MAN', nombre: 'Mantenimiento' },
  { id: 'AVE', nombre: 'Averiado' },
  { id: 'CLAU', nombre: 'Clausurado' }
]

const espacio = ref({
  id: '',
  nombre: '',
  ubicacion_planta: '',
  capacidad_max: '',
  equipamiento: '',
  estado_operativo: ''
})

const ahora = () => new Date().toISOString()

//cargar
const cargar = async () => {
  const res = await api.get(`/espacios?zusuario=${ZUSUARIO}`)
  espacios.value = res.data
}

//guardar
const guardar = async () => {

  const datos = {
    ...espacio.value,
    zfecha: ahora(),
    zusuario: ZUSUARIO
  }

  if (editandoId.value) {
    await api.put(`/espacios/${editandoId.value}`, datos)
  } else {
    await api.post('/espacios', datos)
  }

  limpiar()
  cargar()
}

//limpiar
const limpiar = () => {
  espacio.value = {
    id: '',
    nombre: '',
    ubicacion_planta: '',
    capacidad_max: '',
    equipamiento: '',
    estado_operativo: ''
  }
  editandoId.value = null
}

//editar
const editar = (e) => {
  editandoId.value = e.id
  espacio.value = { ...e }
}

//eliminar
const eliminar = async (id) => {
  await api.delete(`/espacios/${id}?zusuario=${ZUSUARIO}`)
  cargar()
}

onMounted(cargar)

</script>

<template>
  <h2>Gestión de Espacios</h2>

  <!-- formulario -->
  <div class="formulario">

    <input v-model="espacio.id" placeholder="ID (E01)" />
    <input v-model="espacio.nombre" placeholder="Nombre" />
    <input v-model="espacio.ubicacion_planta" placeholder="Planta" />
    <input type="number" v-model="espacio.capacidad_max" placeholder="Capacidad máxima"/>

    <textarea v-model="espacio.equipamiento" placeholder="Equipamiento"></textarea>

    <!-- estado -->
    <select v-model="espacio.estado_operativo">
      <option value="">Seleccione estado</option>
      <option v-for="e in estadosOperativos" :key="e.id" :value="e.id">
        {{ e.nombre }}
      </option>
    </select>

    <button @click="guardar">
      {{ editandoId ? 'Actualizar' : 'Crear Espacio' }}
    </button>

  </div>

  <!-- tabla -->
  <h3>Listado de Espacios</h3>

  <table border="1">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Planta</th>
        <th>Capacidad</th>
        <th>Equipamiento</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="e in espacios" :key="e.id">
        <td>{{ e.id }}</td>
        <td>{{ e.nombre }}</td>
        <td>{{ e.ubicacion_planta }}</td>
        <td>{{ e.capacidad_max }}</td>
        <td>{{ e.equipamiento }}</td>
        <td>{{ e.estado_operativo }}</td>

        <td>
          <button @click="editar(e)">Editar</button>
          <button @click="eliminar(e.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

</template>
