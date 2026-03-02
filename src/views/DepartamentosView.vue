<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const departamentos = ref([])
const editandoId = ref(null)

const departamento = ref({
  id: '',
  nombre: '',
  ubicacion: '',
  correo_contacto: ''
})

const ahora = () => new Date().toISOString()

//cargar
const cargar = async () => {
  const res = await api.get(`/departamentos?zusuario=${ZUSUARIO}`)
  departamentos.value = res.data
}

//guardar
const guardar = async () => {

  const datos = {
    ...departamento.value,
    zfecha: ahora(),
    zusuario: ZUSUARIO
  }

  if (editandoId.value) {
    await api.put(`/departamentos/${editandoId.value}`, datos)
  } else {
    await api.post('/departamentos', datos)
  }

  limpiar()
  cargar()
}

//limpiar
const limpiar = () => {
  departamento.value = {
    id: '',
    nombre: '',
    ubicacion: '',
    correo_contacto: ''
  }
  editandoId.value = null
}

//editar
const editar = (d) => {
  editandoId.value = d.id
  departamento.value = { ...d }
}

//eliminar
const eliminar = async (id) => {
  await api.delete(`/departamentos/${id}?zusuario=${ZUSUARIO}`)
  cargar()
}

onMounted(cargar)

</script>

<template>
  <h2>Gestión de Departamentos</h2>

  <!-- formulario -->
  <div class="formulario">
    <input v-model="departamento.id" placeholder="ID (INFO)" />
    <input v-model="departamento.nombre" placeholder="Nombre departamento"/>
    <input v-model="departamento.ubicacion" placeholder="Ubicación"/>
    <input v-model="departamento.correo_contacto" placeholder="Correo contacto"/>
    <button @click="guardar">
      {{ editandoId ? 'Actualizar' : 'Crear Departamento' }}
    </button>
  </div>

  <!-- tabla -->
  <h3>Listado de Departamentos</h3>

  <table border="1">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Ubicación</th>
        <th>Correo</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="d in departamentos" :key="d.id">
        <td>{{ d.id }}</td>
        <td>{{ d.nombre }}</td>
        <td>{{ d.ubicacion }}</td>
        <td>{{ d.correo_contacto }}</td>

        <td>
          <button @click="editar(d)">Editar</button>
          <button @click="eliminar(d.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

</template>
