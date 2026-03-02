<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'
const ahora = () => new Date().toISOString()
const incidencias = ref([])
const espacios = ref([])
const estados = ref([])
const responsables = ref([])

const editandoId = ref(null)

const incidencia = ref({
    espacio_id: '',
    usuario_login: '',
    descripcion_problema: '',
    estado_incidencia_id: '',
    responsable_resolucion_id: '',
    comentarios_resolucion: '',
    fecha_resolucion: ''
})

//cargas
const cargarIncidencias = async () => {
    const res = await api.get(`/incidencias?zusuario=${ZUSUARIO}`)
    incidencias.value = res.data
}

const cargarEspacios = async () => {
    const res = await api.get(`/espacios?zusuario=${ZUSUARIO}`)
    espacios.value = res.data
}

const cargarEstados = async () => {
    const res = await api.get(`/estados_incidencia?zusuario=${ZUSUARIO}`)
    estados.value = res.data
}

//solo TIC01
const cargarResponsables = async () => {
    const res = await api.get(`/usuarios?zusuario=${ZUSUARIO}`)

    responsables.value =
    res.data.filter(p => p.rol_id === 'TIC01'|| p.rol_id === 'ADMIN08')
}

//guardar
const guardar = async () => {
    const datos = {
        ...incidencia.value,
        fecha_resolucion: null,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if(editandoId.value){
        // SOLO permitir P o R
        if(datos.estado_incidencia_id === 'P' || datos.estado_incidencia_id === 'R'){
            await api.put(`/incidencias/${editandoId.value}`, datos)
        }else{
            alert("Solo puede pasar a Proceso o Resuelta")
        }
        
    }else{
        //crear siempre Abierta
        datos.estado_incidencia_id = 'A'
        await api.post('/incidencias', datos)
    }

    limpiar()
    cargarIncidencias()
}

//editar
const editar = (i) => {
    editandoId.value = i.id
    incidencia.value = {
        espacio_id: i.espacio_id,
        usuario_login: i.usuario_login,
        descripcion_problema: i.descripcion_problema,
        estado_incidencia_id: i.estado_incidencia_id,
        responsable_resolucion_id: i.responsable_resolucion_id,
        comentarios_resolucion: i.comentarios_resolucion,
        fecha_resolucion: i.fecha_resolucion
    }
}

//eliminar
const eliminar = async (i) => {
    if (!i.comentarios_resolucion) {
        alert("Solo se puede eliminar si tiene comentarios de resolución")
        return
    }

    if (!confirm("¿Eliminar incidencia?")) return

    await api.delete(`/incidencias/${i.id}?zusuario=${ZUSUARIO}`)
    cargarIncidencias()
}


//limpiar
const limpiar = () => {
    incidencia.value = {
        espacio_id: '',
        usuario_login: '',
        descripcion_problema: '',
        estado_incidencia_id: '',
        responsable_resolucion_id: '',
        comentarios_resolucion: '',
        fecha_resolucion: ''
    }
    editandoId.value = null
}

onMounted(() => {
    cargarIncidencias()
    cargarEspacios()
    cargarEstados()
    cargarResponsables()
})
</script>

<template>
  <h2>Gestión de Incidencias</h2>
  <div class="formulario">
    
    <select v-model="incidencia.espacio_id">
      <option value="">Seleccione espacio</option>
      <option v-for="e in espacios" :key="e.id" :value="e.id">
        {{ e.nombre }}
      </option>
    </select>

    <input v-model="incidencia.usuario_login" placeholder="Usuario"/>
    <textarea v-model="incidencia.descripcion_problema" placeholder="Descripción problema"/>

    <select v-model="incidencia.responsable_resolucion_id">
      <option value="">Responsable TIC</option>
      <option v-for="r in responsables" :key="r.login" :value="r.login">
        {{ r.login }}
      </option>
    </select>

    <select v-model="incidencia.estado_incidencia_id">
      <option value="">Estado</option>
      <option v-for="e in estados" :key="e.id" :value="e.id">
        {{ e.nombre }}
      </option>
    </select>

    <textarea v-model="incidencia.comentarios_resolucion" placeholder="Comentarios resolución"/>

    <button @click="guardar">
      {{ editandoId ? 'Actualizar' : 'Crear Incidencia' }}
    </button>
  </div>

  <h3>Listado</h3>
  <table border="1">
    <thead>
      <tr>
        <th>ID</th>
        <th>Espacio</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Responsable</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in incidencias" :key="i.id">
        <td>{{ i.id }}</td>
        <td>{{ i.espacio_id }}</td>
        <td>{{ i.usuario_login }}</td>
        <td>{{ i.estado_incidencia_id }}</td>
        <td>{{ i.responsable_resolucion_id }}</td>
        <td>
          <button @click="editar(i)">Editar</button>
          <button @click="eliminar(i)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>