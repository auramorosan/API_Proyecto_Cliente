<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

//usuario logueado
const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
const ZUSUARIO = 'auram'
const loginUsuario = usuarioLogueado.usuario

const incidencias = ref([])
const espacios = ref([]) 

const nuevaIncidencia = ref({
    espacio_id: '',
    descripcion_problema: ''
})

const ahora = () => new Date().toISOString()

//cargar datos
const cargarIncidencias = async () => {
    const res = await api.get(`/incidencias?zusuario=${ZUSUARIO}`)
    // solo incidencias del usuario logueado
    incidencias.value = res.data.filter(
        i => i.usuario_login?.toLowerCase() === loginUsuario.toLowerCase()
    )
}

const cargarEspacios = async () => {
    const res = await api.get(`/espacios?zusuario=${ZUSUARIO}`)
    espacios.value = res.data
}

const crearIncidencia = async () => {
    if (!nuevaIncidencia.value.espacio_id || !nuevaIncidencia.value.descripcion_problema) {
        alert("Seleccione un espacio y escriba la descripción")
        return
    }

    const datos = {
        ...nuevaIncidencia.value,
        usuario_login: loginUsuario,
        estado_incidencia_id: 'A',  // siempre Abierta
        responsable_resolucion_id: null, // asigna luego el TIC
        comentarios_resolucion: '',
        fecha_resolucion: null,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    await api.post('/incidencias', datos)

    // limpiar formulario
    nuevaIncidencia.value = { espacio_id: '', descripcion_problema: '' }

    cargarIncidencias()
}

onMounted(() => {
    cargarIncidencias()
    cargarEspacios()
})
</script>

<template>
    <h2>Mis Incidencias</h2>

    <!-- form -->
    <div class="formulario">
        <h3>Crear nueva incidencia</h3>

        <select v-model="nuevaIncidencia.espacio_id">
            <option value="">Seleccione espacio</option>
            <option v-for="e in espacios" :key="e.id" :value="e.id">
                {{ e.nombre }}
            </option>
        </select>

        <textarea v-model="nuevaIncidencia.descripcion_problema"
                    placeholder="Descripción del problema">
        </textarea>

        <button @click="crearIncidencia">Crear Incidencia</button>
    </div>
<hr>

    <!-- listado incidencias -->
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Espacio</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Comentario Resolución</th>
                <th>Fecha Resolución</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="i in incidencias" :key="i.id">
                <td>{{ i.id }}</td>
                <td>{{ i.espacio_id}}</td>
                <td>{{ i.descripcion_problema }}</td>
                <td>{{ i.estado_incidencia_id }}</td>
                <td>{{ i.comentarios_resolucion || '-' }}</td>
                <td>{{ i.fecha_resolucion || '-' }}</td>
            </tr>
        </tbody>
    </table>
</template>