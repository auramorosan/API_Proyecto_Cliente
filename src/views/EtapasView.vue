<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const etapas = ref([])
const nombre = ref('')
const descripcion = ref('')
const editandoId = ref(null)

const ahora = () => new Date().toISOString()

//cargar etapas
const cargar = async () => {
    const res = await api.get(`/etapas?zusuario=${ZUSUARIO}`)
    etapas.value = res.data
}

//guardar
const guardar = async () => {
    const datos = {
        id: editandoId.value,
        nombre: nombre.value,
        descripcion: descripcion.value,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if (editandoId.value){
        await api.put(`/etapas/${editandoId.value}`, datos)
    }else{
        await api.post('/etapas', datos)
    }

    limpiar()
    cargar()
}

//editar
const editar = (e) => {
    editandoId.value = e.id
    nombre.value = e.nombre
    descripcion.value = e.descripcion
}

//eliminar
const eliminar = async (etapaId) => {
    // buscar cursos vinculados
    const resCursos = await api.get(`/cursos?etapa_id=${etapaId}&zusuario=${ZUSUARIO}`)
    if (resCursos.data.length > 0){
        alert('No se puede eliminar la etapa porque tiene cursos vinculados')
        return
    }
    // eliminar si no tiene cursos
    await api.delete(`/etapas/${etapaId}?zusuario=${ZUSUARIO}`)

    cargar()
}

//limpiar
const limpiar = () => {
    nombre.value = ''
    descripcion.value = ''
    editandoId.value = null
}

onMounted(cargar)
</script>

<template>
    <h2>Etapas</h2>
    <div>
        <input v-model="id" placeholder="ID (E1, E2...)" :disabled="editandoId"/>
        <input v-model="nombre" placeholder="Nombre"/>
        <input v-model="descripcion" placeholder="Descripción"/>

        <button @click="guardar">
            {{ editandoId ? 'Actualizar' : 'Crear' }}
        </button>

        <button v-if="editandoId" @click="limpiar">
            Cancelar
        </button>
    </div>
    <hr />
    <ul>
        <li v-for="e in etapas" :key="e.id">
            <b>{{ e.id }}</b> — {{ e.nombre }} ({{ e.descripcion }})

            <button @click="editar(e)">Editar</button>
            <button @click="eliminar(e.id)">Eliminar</button>
        </li>
    </ul>
</template>