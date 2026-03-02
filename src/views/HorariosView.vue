<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const horarios = ref([])
const editandoId = ref(null)

const horario = ref({
    nombre: '',
    hora_inicio: '',
    hora_fin: '',
    turno_id: ''
})

const ahora = () => new Date().toISOString()

//cargar
const cargar = async () => {
    const res = await api.get(`/horarios?zusuario=${ZUSUARIO}`)
    horarios.value = res.data
}

//guardar
const guardar = async () => {
    const datos = {
        ...horario.value,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }
    if(editandoId.value){
            await api.put(`/horarios/${editandoId.value}`, datos)
    }else{
            await api.post('/horarios', datos)
    }
    limpiar()
    cargar()
}

//editar
const editar = (h) => {
    editandoId.value = h.id
    horario.value = { ...h }
}

//eliminar
const eliminar = async (id) => {
    await api.delete(`/horarios/${id}?zusuario=${ZUSUARIO}`)
    cargar()
}

//limpiar
const limpiar = () => {
    horario.value = {
        nombre: '',
        hora_inicio: '',
        hora_fin: '',
        turno_id: ''
    }
    editandoId.value = null
}

onMounted(cargar)

</script>

<template>
    <h2>Gestión Horarios</h2>
    <div class="formulario">
        <input v-model="horario.nombre" placeholder="Nombre"/>
        <input type="time" v-model="horario.hora_inicio"/>
        <input type="time" v-model="horario.hora_fin"/>
        <input v-model="horario.turno_id" placeholder="Turno"/>
        <button @click="guardar">
            {{ editandoId ? 'Actualizar' : 'Crear Horario' }}
        </button>
    </div>

    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Turno</th>
                <th>Acciones</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="h in horarios" :key="h.id">
                <td>{{ h.id }}</td>
                <td>{{ h.nombre }}</td>
                <td>{{ h.hora_inicio }}</td>
                <td>{{ h.hora_fin }}</td>
                <td>{{ h.turno_id }}</td>
                <td>
                    <button @click="editar(h)">Editar</button>
                    <button @click="eliminar(h.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>