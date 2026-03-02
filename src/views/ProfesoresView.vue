<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'
const busqueda = ref('')
const profesoresMostrados = ref([])
const profesores = ref([])
const departamentos = ref([])
const roles=ref([])

const profesor = ref({
    dni_nie: '',
    nombre: '',
    apellidos: '',
    correo_institucional: '',
    departamento_id: '',
    rol_id: '',
    password_hash: ''
})

const editandoDNI = ref(null)
const ahora = () => new Date().toISOString()

//cargas
const cargarProfesores = async () => {
    const res = await api.get(`/profesores?zusuario=${ZUSUARIO}`)
    profesores.value = res.data
    profesoresMostrados.value = res.data
}

const cargarDepartamentos = async () => {
    const res = await api.get(`/departamentos?zusuario=${ZUSUARIO}`)
    departamentos.value = res.data
}

const cargarRoles = async () => {
    const res = await api.get(`/roles?zusuario=${ZUSUARIO}`)
    roles.value = res.data
}

const existeDNI = (dni_nie) => {
    return profesores.value.some(p => p.dni_nie === dni_nie)
}

const buscarProfesor = () => {
    const texto = busqueda.value.toLowerCase()
    profesoresMostrados.value = profesores.value.filter(p =>
        p.dni_nie.toLowerCase().includes(texto) ||
        p.apellidos.toLowerCase().includes(texto) ||
        p.departamento_id.toLowerCase().includes(texto)
    )

    // si está vacío → mostrar todos
    if (!texto) {
        profesoresMostrados.value = profesores.value
    }
}

//crear usuario
const crearUsuarioProfesor = async (p) => {
    const usuario = {
        login: p.nombre.toLowerCase(),
        password_hash: p.password_hash,
        rol_id: 'PROF01', 
        ref_identidad_fk: p.dni_nie,
        estado_id: 'ACT01',
        ultimo_acceso: ahora(),
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }
    await api.post('/usuarios', usuario)
}

//guardar
const guardar = async () => {
    // comprobar duplicado SOLO al crear
    if (!editandoDNI.value && existeDNI(profesor.value.dni_nie)) {
        alert("Ya existe un profesor con ese DNI/NIE")
        return
    }

    const datos = {
        ...profesor.value, //...spread operator expande la const profesor
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if (editandoDNI.value) {
        await api.put(`/profesores/${editandoDNI.value}`, datos)
    } else {
        await api.post('/profesores', datos)
        await crearUsuarioProfesor(datos)
    }

    limpiar()
    cargarProfesores()
}

const limpiar = () => {
    profesor.value = {
        dni_nie: '',
        nombre: '',
        apellidos: '',
        correo_institucional: '',
        departamento_id: '',
        rol_id: '',
        password_hash: ''
    }
    editandoDNI.value = null
}

//editar
const editar = (p) => {
    editandoDNI.value = p.dni_nie
    profesor.value = { ...p }
}

const obtenerLoginProfesor = async (dni_nie) => {
    const res = await api.get(`/usuarios?ref_identidad_fk=${dni_nie}&zusuario=${ZUSUARIO}`)
    if (res.data.length > 0) {
        return res.data[0].login
    }
    return null
}

const eliminarReservasProfesor = async (login) => {
    const res = await api.get(`/reservas?usuario_login=${login}&zusuario=${ZUSUARIO}`)
    const reservas = res.data

    for (const r of reservas) {
        await api.delete(`/reservas/${r.id}?zusuario=${ZUSUARIO}`)
    }
}

const eliminar = async (dni_nie) => {
    const login = await obtenerLoginProfesor(dni_nie)
    if (!login) {
        await api.delete(`/profesores/${dni_nie}?zusuario=${ZUSUARIO}`)
        cargarProfesores()
        return
    }

    const decision = confirm(
        "Este profesor tiene reservas.\n\nAceptar → eliminar reservas\nCancelar → conservar reservas"
    )

    if (decision) {
        await eliminarReservasProfesor(login)
    }
    await api.delete(`/profesores/${dni_nie}?zusuario=${ZUSUARIO}`)
    cargarProfesores()
}

onMounted(() => {
    cargarProfesores()
    cargarDepartamentos()
    cargarRoles()
})
</script>

<template>
  <h2>Gestión de Profesores</h2>
  <!-- formulario -->
  <div class="formulario">
    <input v-model="profesor.dni_nie" placeholder="DNI/NIE" />
    <input v-model="profesor.nombre" placeholder="Nombre" />
    <input v-model="profesor.apellidos" placeholder="Apellidos" />
    <input v-model="profesor.correo_institucional" placeholder="Correo institucional" />
    <!-- select departamentos -->
    <select v-model="profesor.departamento_id">
      <option value="">Seleccione departamento</option>
      <option v-for="d in departamentos" :key="d.id" :value="d.id">
        {{ d.nombre }}
      </option>
    </select>
    <!-- select rol -->
    <select v-model="profesor.rol_id">
      <option value="">Seleccione rol</option>
      <option v-for="r in roles" :key="r.id" :value="r.id">
        {{ r.nombre }}
      </option>
    </select>
    
    <input v-model="profesor.password_hash" placeholder="Contraseña" />

    <button @click="guardar">
      {{ editandoDNI ? 'Actualizar' : 'Crear Profesor' }}
    </button>
  </div>

  <h3>Buscar profesor por DNI/NIE, apellidos o departamento</h3>
  <input v-model="busqueda" @input="buscarProfesor" placeholder="Buscar por DNI/NIE, apellidos o departamento"/>

  <!-- tabla -->
  <h3>Listado de profesores</h3>
  <table border="1">
    <thead>
      <tr>
        <th>DNI/NIE</th>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>Correo institucional</th>
        <th>Departamento</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="p in profesoresMostrados" :key="p.dni_nie">
        <td>{{ p.dni_nie }}</td>
        <td>{{ p.nombre }}</td>
        <td>{{ p.apellidos }}</td>
        <td>{{ p.correo_institucional }}</td>
        <td>{{ p.departamento_id }}</td>
        <td>{{ p.rol_id }}</td>

        <td>
          <button @click="editar(p)">Editar</button>
          <button @click="eliminar(p.dni_nie)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
