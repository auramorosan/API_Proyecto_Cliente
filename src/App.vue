<!--este es el contenedor principal-->
<script setup>
</script>
<!--Dependiendo de la URL, Vue carga aquí:
/ → DashboardView
/roles → RolesView
/profesores → ProfesoresView
Sin esto no se renderiza nada-->
<template>
  <router-view /> <!--es el “hueco dinámico”-->
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>

