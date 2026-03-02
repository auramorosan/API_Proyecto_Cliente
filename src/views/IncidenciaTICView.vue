<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
//console.log(usuarioLogueado)
const ZUSUARIO = 'auram'
const loginTIC = usuarioLogueado.usuario

const incidencias = ref([])
const estados = ref([])

const ahora = () => new Date().toISOString()

//carga incidencias TIC
const cargarIncidencias = async () => {
    const res = await api.get(`/incidencias?zusuario=${ZUSUARIO}`)

    incidencias.value = 
    res.data.filter(i => i.responsable_resolucion_id === loginTIC)
}

const cargarEstados = async () => {
  const res = await api.get(
    `/estados_incidencia?zusuario=${ZUSUARIO}`
  )
  estados.value = res.data
}

const actualizarIncidencia = async (i) => {
    if (i.estado_incidencia_id !== 'P' && i.estado_incidencia_id !== 'R') {
        alert("Solo puede pasar a Proceso o Resuelta")
        return
    }

    const datos = {
        ...i,
        fecha_resolucion: ahora(),
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    await api.put(`/incidencias/${i.id}`, datos)

    cargarIncidencias()
}

onMounted(() => {
  cargarIncidencias()
  cargarEstados()
})
</script>

<template>
    <h2>Mis Incidencias TIC </h2>
    
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Espacio</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Comentario Resolución</th>
                <th>Fecha Resolución</th>
                <th>Accion</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="i in incidencias" :key="i.id">
                <td>{{ i.id }}</td>
                <td>{{ i.espacio_id }}</td>
                <td>{{ i.descripcion_problema }}</td>
                <td>
                    <select v-model="i.estado_incidencia_id">
                        <option v-for="e in estados" :key="e.id" :value="e.id">
                            {{ e.nombre }}
                        </option>
                    </select>
                </td>
                <td>
                    <textarea v-model="i.comentarios_resolucion" placeholder="Comentario resolución"></textarea>
                </td>                
                <td> {{ i.fecha_resolucion }} </td>
                <td>
                    <button @click="actualizarIncidencia(i)">Guardar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>