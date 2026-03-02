<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'
const busqueda = ref('')
const alumnosMostrados = ref([])
const alumnos = ref([])
const cursos = ref([])


const estados = [
    { id: 'ACT', nombre: 'Activo' },
    { id: 'BAJ', nombre: 'Baja' },
    { id: 'BLOQ', nombre: 'Bloqueado' },
    { id: 'GRAD', nombre: 'Graduado' },
    { id: 'TEMP', nombre: 'Temporal' }
]

const alumno = ref({
    nia: '',
    nombre: '',
    apellidos: '',
    curso_id: '',
    correo_electronico: '',
    tutor_legal_contacto: '',
    estado_id: ''
})

const editandoNia = ref(null)
const ahora = () => new Date().toISOString()

//cargas
const cargarAlumnos = async () => {
    const res = await api.get(`/alumnos?zusuario=${ZUSUARIO}`)
    alumnos.value = res.data
    alumnosMostrados.value = res.data
}

const cargarCursos = async () => {
    const res = await api.get(`/cursos?zusuario=${ZUSUARIO}`)
    cursos.value = res.data
}

const buscarAlumno = () => {
    const texto = busqueda.value.toLowerCase()
    alumnosMostrados.value = alumnos.value.filter(a =>
        a.nia.toLowerCase().includes(texto) ||
        a.apellidos.toLowerCase().includes(texto) ||
        a.curso_id.toLowerCase().includes(texto)
    )

    // si está vacío → mostrar todos
    if (!texto) {
        alumnosMostrados.value = alumnos.value
    }
}

//crear usuario
const crearUsuarioAlumno = async (a) => {
    if (a.estado_id !== 'ACT') return
    const usuario = {
        login: a.nombre.toLowerCase(),
        password_hash: '123456',
        rol_id: 'ALUM01',
        ref_identidad_fk: a.nia,
        estado_id: 'ACT01',
        ultimo_acceso: ahora(),
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }
    await api.post('/usuarios', usuario)
}

//guardar
const guardar = async () => {
    const datos = {
        ...alumno.value, //...spread operator-> expande el objeto
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if (editandoNia.value) {
        await api.put(`/alumnos/${editandoNia.value}`, datos)
    } else {
        await api.post('/alumnos', datos)
        await crearUsuarioAlumno(datos)
    }

    limpiar()
    cargarAlumnos()
}

const limpiar = () => {
    alumno.value = {
        nia: '',
        nombre: '',
        apellidos: '',
        curso_id: '',
        correo_electronico: '',
        tutor_legal_contacto: '',
        estado_id: ''
    }
    editandoNia.value = null
}

//editar
const editar = (a) => {
    editandoNia.value = a.nia
    alumno.value = { ...a }
}

const eliminar = async (nia) => {
  await api.delete(`/alumnos/${nia}?zusuario=${ZUSUARIO}`)
  cargarAlumnos()
}

onMounted(() => {
    cargarAlumnos()
    cargarCursos()
})
</script>

<template>
  <h2>Gestión de Alumnos</h2>
  <!-- FORMULARIO -->
  <div class="formulario">
    <input v-model="alumno.nia" placeholder="NIA" />
    <input v-model="alumno.nombre" placeholder="Nombre" />
    <input v-model="alumno.apellidos" placeholder="Apellidos" />
    <!-- select cursos -->
    <select v-model="alumno.curso_id">
      <option value="">Seleccione curso</option>
      <option v-for="c in cursos" :key="c.id" :value="c.id">
        {{ c.nombre_curso }}
      </option>
    </select>

    <input v-model="alumno.correo_electronico" placeholder="Correo electrónico" />
    <input v-model="alumno.tutor_legal_contacto" placeholder="Contacto tutor legal" />

    <!-- select estados -->
    <select v-model="alumno.estado_id">
      <option value="">Seleccione estado</option>
      <option v-for="e in estados" :key="e.id" :value="e.id">
        {{ e.nombre }}
      </option>
    </select>

    <button @click="guardar">
      {{ editandoNia ? 'Actualizar' : 'Crear Alumno' }}
    </button>
  </div>

  <h3>Buscar alumno por NIA, apellidos o curso</h3>
  <input v-model="busqueda" @input="buscarAlumno" placeholder="Buscar por NIA, apellidos o curso"/>

  <!-- tabla -->
  <h3>Listado de alumnos</h3>
  <table border="1">
    <thead>
      <tr>
        <th>NIA</th>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Curso</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="a in alumnosMostrados" :key="a.nia">
        <td>{{ a.nia }}</td>
        <td>{{ a.nombre }}</td>
        <td>{{ a.apellidos }}</td>
        <td>{{ a.curso_id }}</td>
        <td>{{ a.estado_id }}</td>

        <td>
          <button @click="editar(a)">Editar</button>
          <button @click="eliminar(a.nia)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

</template>