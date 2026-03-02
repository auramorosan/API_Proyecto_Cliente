<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = JSON.parse(localStorage.getItem('usuario'))

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <h1>Escarlatti-Gest</h1>
  <h2>
    Bienvenido {{ usuario.nombre }} {{ usuario.apellidos }}
  </h2>
  <h3>Rol: {{ usuario.rol }}</h3>
  <button @click="cerrarSesion">Cerrar sesión</button>

  <ul>
    <li v-if="usuario.rol === 'Administrador'">
      <router-link to="/alumnos">Gestion de alumnos</router-link><br>
      <router-link to="/cursos">Gestion de cursos</router-link><br>
      <router-link to="/departamentos">Gestion de departamentos</router-link><br>
      <router-link to="/espacios">Gestion de espacios</router-link><br>
      <router-link to="/etapas">Gestion de etapas</router-link><br>
      <router-link to="/horarios">Gestion de horarios</router-link><br>
      <router-link to="/profesores">Gestion de profesores</router-link><br>
      <router-link to="/usuarios">Gestion de usuarios</router-link><br>
      <router-link to="/incidencias">Gestion de incidencia</router-link><br>
      <router-link to="/reservasedit">Gestion de reservas</router-link><br>
      <router-link to="/reservas">Reservar un espacio</router-link>
    </li>

    <li v-if="usuario.rol === 'Responsable TIC'">
      <router-link to="/incidtic">Crear/Resolver Incidencia</router-link><br>
      <router-link to="/reservas">Reservar un espacio</router-link>
    </li>
    
    <li v-if="usuario.rol === 'Profesor'">
      <router-link to="/incidalumprof">Crear Incidencia</router-link><br>
      <router-link to="/reservas">Reservar un espacio</router-link>
    </li>
    
    <li v-if="usuario.rol === 'Alumno'">
      <router-link to="/incidalumprof">Crear Incidencias</router-link>
    </li>
  </ul>
</template>

