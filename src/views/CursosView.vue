<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const ZUSUARIO = 'auram'

const cursos = ref([])
const etapas = ref([])
const profesores = ref([])
const espacios = ref([])
const turnos = ref([])

const editandoId = ref(null)

const curso = ref({
    id: '',
    nombre_curso: '',
    etapa_id: '',
    grupo: '',
    turno_id: '',
    anio_academico: '',
    tutor_id: '',
    aula_id: ''
})
const alumnosPorCurso = ref({}) 
const ahora = () => new Date().toISOString()

//cargas
const cargarCursos = async () => {
    const res = await api.get(`/cursos?zusuario=${ZUSUARIO}`)
    cursos.value = res.data
}

const cargarEtapas = async () => {
    const res = await api.get(`/etapas?zusuario=${ZUSUARIO}`)
    etapas.value = res.data
}

const cargarProfesores = async () => {
    const res = await api.get(`/profesores?zusuario=${ZUSUARIO}`)
    profesores.value = res.data
}

const cargarEspacios = async () => {
    const res = await api.get(`/espacios?zusuario=${ZUSUARIO}`)
    espacios.value = res.data
}

const cargarTurnos = async () => {
    const res = await api.get(`/turnos?zusuario=${ZUSUARIO}`)
    turnos.value = res.data
}

//mostrar alumnos
const mostrOcultAlumnos = async (cursoId) => {
  if (alumnosPorCurso.value[cursoId]) {
    // si ya cargado → ocultar
    delete alumnosPorCurso.value[cursoId]
    return
  }

  // si no → cargar
  const res = await api.get(`/alumnos?curso_id=${cursoId}&zusuario=${ZUSUARIO}`)
  alumnosPorCurso.value[cursoId] = res.data
}

//validar tutor
const tutorOcupado = () => {
    return cursos.value.some(c =>
        c.tutor_id === curso.value.tutor_id &&
        c.anio_academico === curso.value.anio_academico &&
        c.id !== editandoId.value
    )
}

//guardar
const guardar = async () => {

    // validar tutor por año académico
    if(tutorOcupado()){
        alert('Ese profesor ya es tutor en ese año académico')
        return
    }

    const datos = {
        ...curso.value,
        zfecha: ahora(),
        zusuario: ZUSUARIO
    }

    if(editandoId.value){
        await api.put(`/cursos/${editandoId.value}`, datos)
    }else{
        await api.post('/cursos', datos)
    }

    limpiar()
    cargarCursos()
}

//editar
const editar = (c) => {
    editandoId.value = c.id
    curso.value = { ...c }
}

//eliminar
const eliminar = async (cursoId) => {
    const res = await api.get(`/alumnos?zusuario=${ZUSUARIO}`)

    const alumnosCurso = res.data.filter(
        a => a.curso_id === cursoId
    )

    if (alumnosCurso.length > 0) {
        alert('No se puede eliminar el curso porque tiene alumnos')
        return
    }
    await api.delete(`/cursos/${cursoId}?zusuario=${ZUSUARIO}`)
    cargarCursos()
}

//limpiar
const limpiar = () => {
    curso.value = {
        id: '',
        nombre_curso: '',
        etapa_id: '',
        grupo: '',
        turno_id: '',
        anio_academico: '',
        tutor_id: '',
        aula_id: ''
    }

    editandoId.value = null
}

onMounted(() => {
    cargarCursos()
    cargarEtapas()
    cargarProfesores()
    cargarEspacios()
    cargarTurnos()
})
</script>

<template>
    <h2>Gestión de Cursos</h2>
    <div class="formulario">
      <input v-model="curso.id" placeholder="ID Curso" />
      <input v-model="curso.nombre_curso" placeholder="Nombre curso" />

      <select v-model="curso.etapa_id">
          <option value="">Seleccione etapa</option>
          <option v-for="e in etapas" :key="e.id" :value="e.id">
              {{ e.nombre }}
          </option>
      </select>

      <input v-model="curso.grupo" placeholder="Grupo" />

      <select v-model="curso.turno_id">
          <option value="">Seleccione turno</option>
          <option v-for="t in turnos" :key="t.id" :value="t.id">
              {{ t.nombre }}
          </option>
      </select>
      
      <input v-model="curso.anio_academico" placeholder="Año académico" />

      <select v-model="curso.tutor_id">
          <option value="">Seleccione tutor</option>
          <option v-for="p in profesores" :key="p.dni_nie" :value="p.dni_nie">
              {{ p.nombre }} {{ p.apellidos }}
          </option>
      </select>
      
      <select v-model="curso.aula_id">
          <option value="">Seleccione aula</option>
          <option v-for="e in espacios" :key="e.id" :value="e.id">
              {{ e.nombre }}
          </option>
      </select>

      <button @click="guardar">
          {{ editandoId ? 'Actualizar' : 'Crear Curso' }}
      </button>
    </div>

    <h3>Listado de Cursos</h3>
    <table border="1" >
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Grupo</th>
          <th>Año</th>
          <th>Tutor</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in cursos" :key="c?.id">
          <td>{{ c?.id }}</td>
          <td>{{ c?.nombre_curso }}</td>
          <td>{{ c?.grupo }}</td>
          <td>{{ c?.anio_academico }}</td>
          <td>{{ c?.tutor_id }}</td>

          <td>
            <button @click="editar(c)">Editar</button>
            <button @click="eliminar(c.id)">Eliminar</button>
            <button @click="mostrOcultAlumnos(c.id)">
                {{ alumnosPorCurso[c.id] ? 'Ocultar alumnos' : 'Ver alumnos' }}
            </button>
          </td>
          <tr v-if="c && alumnosPorCurso[c.id]" :key="c.id + '-alumnos'">
            <td colspan="6">
                <ul>
                    <li v-for="a in alumnosPorCurso[c.id]" :key="a.nia">
                        {{ a.nia }} - {{ a.nombre }} {{ a.apellidos }}
                    </li>
                </ul>
            </td>
          </tr>
        </tr>

        <!-- fila para alumnos -->
        

      </tbody>
    </table>
</template>