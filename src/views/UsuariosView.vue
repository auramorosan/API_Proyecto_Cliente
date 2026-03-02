<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const usuarios = ref([])
const usuariosMostrados = ref([])
const roles = ref([])
const estados = ref([])
const busqueda = ref('')

const editandoLogin = ref(null)

const ahora = () => new Date().toISOString()

const usuario = ref({
    login: '',
    password_hash: '',
    rol_id: '',
    ref_identidad_fk: '',
    estado_id: '',
    ultimo_acceso: '',
})

//cargas
const cargarUsuarios = async () => {
    const res = await api.get(`/usuarios?zusuario=${ZUSUARIO}`)
    usuarios.value = res.data
    usuariosMostrados.value = res.data
}

const cargarRoles = async () => {
    const res = await api.get(`/roles?zusuario=${ZUSUARIO}`)
    roles.value = res.data
}

const cargarEstados = async () => {
    const res = await api.get(`/estados_usuario?zusuario=${ZUSUARIO}`)
    estados.value = res.data
}

//buscador
const buscarUsuario = () => {
    const texto = busqueda.value.toLowerCase()
    
    usuariosMostrados.value = usuarios.value.filter(u =>
        u.login.toLowerCase().includes(texto) ||
        u.ref_identidad_fk.toLowerCase().includes(texto)
    )
    if(!texto){
        usuariosMostrados.value = usuarios.value
    }
}

//guardar
const guardar = async () => {
    const datos = {
        ...usuario.value,
        ultimo_acceso: ahora(),
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if(editandoLogin.value){
        await api.put(`/usuarios/${editandoLogin.value}`, datos)
    }else{
        await api.post('/usuarios', datos)
    }

    limpiar()
    cargarUsuarios()
}

//editar
const editar = (u) => {
    editandoLogin.value = u.login
    usuario.value = { ...u }
}

//eliminar
const eliminar = async (login) => {
    if(!confirm("¿Eliminar usuario?")) return

    await api.delete(`/usuarios/${login}?zusuario=${ZUSUARIO}`)
    cargarUsuarios()
}

//limpiar
const limpiar = () => {
    usuario.value = {
        login: '',
        password_hash: '',
        rol_id: '',
        ref_identidad_fk: '',
        estado_id: '',
        ultimo_acceso: ''
    }
    editandoLogin.value = null
}

onMounted(() => {
    cargarUsuarios()
    cargarRoles()
    cargarEstados()
})
</script>

<template>
    <h2>Gestión de Usuarios</h2>
    <div class="formulario">
        <input v-model="usuario.login" placeholder="Login"/>
        <input v-model="usuario.password_hash" placeholder="Contraseña"/>
        <input v-model="usuario.ref_identidad_fk" placeholder="DNI/NIE referencia"/>

        <select v-model="usuario.rol_id">
            <option value="">Seleccione rol</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.nombre }}
            </option>
        </select>

        <select v-model="usuario.estado_id">
            <option value="">Seleccione estado</option>

            <option v-for="e in estados" :key="e.id" :value="e.id">
                {{ e.nombre }}
            </option>
        </select>

        <button @click="guardar">
            {{ editandoLogin ? 'Actualizar' : 'Crear Usuario' }}
        </button>
    </div>

    <h3>Buscar usuario</h3>
    <input v-model="busqueda" @input="buscarUsuario" placeholder="Buscar login o DNI"/>

    <h3>Listado</h3>
    <table border="1">
        <thead>
            <tr>
                <th>Login</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Identidad</th>
                <th>Acciones</th>
            </tr>
        </thead>

      <tbody>
          <tr v-for="u in usuariosMostrados" :key="u.login">
              <td>{{ u.login }}</td>
              <td>{{ u.rol_id }}</td>
              <td>{{ u.estado_id }}</td>
              <td>{{ u.ref_identidad_fk }}</td>
              <td>
                  <button @click="editar(u)">Editar</button>
                  <button @click="eliminar(u.login)">Eliminar</button>
              </td>
          </tr>
      </tbody>
    </table>
</template>