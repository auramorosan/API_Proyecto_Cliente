<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))
const ZUSUARIO='auram'
const usuarioLog = usuarioLogueado.usuario

const reservas = ref([])
const espacios = ref([])
const horarios = ref([])

const editandoId = ref(null)

const reserva = ref({
    espacio_id: '',
    horario_id: '',
    usuario_login: usuarioLog,
    fecha_reserva: '',
    motivo_reserva: ''
})

const ahora = () => new Date().toISOString()

//cargar
const cargarReservas = async () => {
    const res = await api.get(`/reservas?zusuario=${ZUSUARIO}`)
    reservas.value = res.data
}

const cargarEspacios = async () => {
    const res = await api.get(`/espacios`)
    espacios.value = res.data
}

const cargarHorarios = async () => {
    const res = await api.get(`/horarios`)
    horarios.value = res.data
}

//guardar
const guardar = async () => {
    if (reserva.value.motivo_reserva.length < 10) {
        alert("Motivo mínimo 10 caracteres")
        return
    }

    const datos = {
        ...reserva.value,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    try {
        if (editandoId.value){
            await api.put(`/reservas/${editandoId.value}`, datos)
        }else{
            await api.post('/reservas', datos)
        }
        limpiar()
        cargarReservas()
    } catch (e) {
        if (e.response?.status === 409){
            alert("Conflicto de horarios")
        }else{
            alert("Error guardando reserva")
        }
    }
}

//editar
const editar = (r) => {
    editandoId.value = r.id
    reserva.value = { ...r }
}

//eliminar
const eliminar = async (id) => {
    await api.delete(`/reservas/${id}?zusuario=${ZUSUARIO}`)
    cargarReservas()
}

//limpiar
const limpiar = () => {
    reserva.value = {
        espacio_id: '',
        horario_id: '',
        usuario_login: ZUSUARIO,
        fecha_reserva: '',
        motivo_reserva: ''
    }
    editandoId.value = null
}

onMounted(() => {
    cargarReservas()
    cargarEspacios()
    cargarHorarios()
})
</script>

<template>
    <h2>Gestión Reservas</h2>
    <div class="formulario">
        <select v-model="reserva.espacio_id">
            <option value="">Espacio</option>
            <option v-for="e in espacios" :key="e.id" :value="e.id">
                {{ e.nombre }}
            </option>
        </select>
        <select v-model="reserva.horario_id">
            <option value="">Horario</option>
            <option v-for="h in horarios" :key="h.id" :value="h.id">
                {{ h.nombre }}
            </option>
        </select>
        <input type="date" v-model="reserva.fecha_reserva"/>
        <textarea v-model="reserva.motivo_reserva" placeholder="Motivo (mín 10)"></textarea>
        <button @click="guardar">
            {{ editandoId ? 'Actualizar' : 'Crear Reserva' }}
        </button>
    </div>
    <br>
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Espacio</th>
                <th>Horario</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Motivo</th>
                <th>Acciones</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="r in reservas" :key="r.id">
                <td>{{ r.id }}</td>
                <td>{{ r.espacio_id }}</td>
                <td>{{ r.horario_id }}</td>
                <td>{{ r.fecha_reserva }}</td>
                <td>{{ r.usuario_login }}</td>
                <td>{{ r.motivo_reserva }}</td>
                <td>
                    <button @click="editar(r)">Editar</button>
                    <button @click="eliminar(r.id)">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>