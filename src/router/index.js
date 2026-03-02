import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import IncidenciaView from '@/views/IncidenciaView.vue'
import DepartamentosView from '@/views/DepartamentosView.vue'
import EspaciosView from '@/views/EspaciosView.vue'
import EtapasView from '@/views/EtapasView.vue'
import ProfesoresView from '@/views/ProfesoresView.vue'
import CursosView from '@/views/CursosView.vue'
import AlumnosView from '@/views/AlumnosView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import ReservaEspaciosView from '@/views/ReservaEspaciosView.vue'
import IncidenciaProfAlumView from '@/views/IncidenciaProfAlumView.vue'
import IncidenciaTICView from '@/views/IncidenciaTICView.vue'
import HorariosView from '@/views/HorariosView.vue'
import ReservasView from '@/views/ReservasView.vue'

const routes = [
    // Login
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },

    //Dashboard
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true }},
    //roles
    { path: '/espacios', component: EspaciosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/departamentos', component: DepartamentosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/profesores', component: ProfesoresView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/etapas', component: EtapasView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/usuarios', component: UsuariosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/incidalumprof', component: IncidenciaProfAlumView, meta: { requiresAuth: true, roles: ['Profesor', 'Alumno'] } },
    { path: '/incidtic', component: IncidenciaTICView, meta: { requiresAuth: true, roles: ['Profesor', 'Responsable TIC'] } },
    { path: '/reservas', component: ReservaEspaciosView, meta: { requiresAuth: true, roles: ['Administrador', 'Profesor', 'Responsable TIC'] } },
    { path: '/cursos', component: CursosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/reservasedit', component: ReservasView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/alumnos', component: AlumnosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/horarios', component: HorariosView, meta: { requiresAuth: true, roles: ['Administrador'] } },
    { path: '/incidencias', component: IncidenciaView, meta: { requiresAuth: true, roles: ['Administrador'] } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//proteccion global
router.beforeEach((to, from, next) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    // Si requiere login y no hay usuario
    if (to.meta.requiresAuth && !usuario) {
        return next('/login')
    }

    // Si requiere rol específico
    if (to.meta.roles) {
        if (!to.meta.roles.includes(usuario?.rol)) {
          return next('/dashboard')
        }
    }

    next()
})

export default router
