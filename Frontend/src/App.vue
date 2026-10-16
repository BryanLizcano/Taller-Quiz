<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api/libros'

const libros = ref([])
const titulo = ref('')
const autor = ref('')
const error = ref('')
const cargaInicial = ref(true)

const cargarLibros = async () => {
  try {
    const res = await fetch(API_URL)
    if (res.ok) {
      libros.value = await res.json()
      setTimeout(() => {
        cargaInicial.value = false
      }, 800)
    }
  } catch (err) {
    error.value = 'Error al obtener la lista de libros'
  }
}

const crearLibro = async () => {
  error.value = ''

  if (!titulo.value.trim() || !autor.value.trim()) {
    error.value = 'El título y el autor son obligatorios'
    return
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: titulo.value.trim(),
        autor: autor.value.trim()
      })
    })

    if (res.status === 400) {
      const data = await res.json().catch(() => ({}))
      error.value = data.mensaje || data.error || 'Error 400: El título y el autor son obligatorios'
      return
    }

    if (!res.ok) {
      error.value = 'Error al crear el libro'
      return
    }

    titulo.value = ''
    autor.value = ''
    await cargarLibros()
  } catch (err) {
    error.value = 'Error al conectar con el servidor'
  }
}

const eliminarLibro = async (id) => {
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (res.ok || res.status === 204) {
      await cargarLibros()
    }
  } catch (err) {
    error.value = 'Error al eliminar el libro'
  }
}

onMounted(() => {
  cargarLibros()
})
</script>

<template>
  <div class="container py-5 biblioteca-container">
    <!-- Letrero antiguo de la biblioteca con entrada fade -->
    <Transition name="fade-header" appear>
      <header class="letrero-antiguo text-center mb-5">
        <div class="letrero-marco">
          <span class="ornamento-esquina tl">✦</span>
          <span class="ornamento-esquina tr">✦</span>
          <span class="ornamento-esquina bl">✦</span>
          <span class="ornamento-esquina br">✦</span>
          <p class="letrero-subtitulo mb-1">LITERATURA &amp; CATÁLOGO GENERAL</p>
          <h1 class="letrero-titulo mb-0">Biblioteca</h1>
          <div class="letrero-divisor">
            <span>― ❖ ―</span>
          </div>
        </div>
      </header>
    </Transition>

    <!-- Formulario tipo ficha de registro con entrada fade -->
    <Transition name="fade-form" appear>
      <div class="card ficha-registro mb-5">
        <div class="card-body p-4">
          <div class="ficha-encabezado d-flex justify-content-between align-items-center mb-3 pb-2">
            <h5 class="card-title ficha-titulo mb-0">
              ✒ Ficha de Registro Bibliográfico
            </h5>
            <span class="ficha-sello">CATÁLOGO OFICIAL</span>
          </div>

          <Transition name="fade-alerta">
            <div v-if="error" class="alert alerta-pergamino" role="alert">
              <strong>⚜ Aviso del Archivista:</strong> {{ error }}
            </div>
          </Transition>

          <form @submit.prevent="crearLibro" novalidate>
            <div class="row g-3 align-items-end">
              <div class="col-12 col-md-5">
                <label for="titulo" class="form-label ficha-label">Título de la Obra</label>
                <input
                  id="titulo"
                  v-model="titulo"
                  type="text"
                  class="form-control ficha-input"
                  placeholder="Ej. Cien años de soledad"
                />
              </div>
              <div class="col-12 col-md-5">
                <label for="autor" class="form-label ficha-label">Autor / Escriba</label>
                <input
                  id="autor"
                  v-model="autor"
                  type="text"
                  class="form-control ficha-input"
                  placeholder="Ej. Gabriel García Márquez"
                />
              </div>
              <div class="col-12 col-md-2">
                <button type="submit" class="btn btn-dorado w-100">
                  Registrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Estantería de libros con TransitionGroup -->
    <TransitionGroup
      name="libros"
      tag="div"
      class="row g-4 position-relative"
      appear
    >
      <div
        v-for="(libro, index) in libros"
        :key="libro.id"
        class="col-12 col-md-6 col-lg-4 libro-col"
        :style="{ '--stagger-delay': cargaInicial ? `${index * 110}ms` : '0ms' }"
      >
        <div class="card libro-card h-100">
          <div class="libro-lomo"></div>
          <div class="card-body libro-cuerpo d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge sello-id">Tomo #{{ libro.id }}</span>
                <span class="ornamento-card">❦</span>
              </div>
              <h5 class="card-title libro-titulo">{{ libro.titulo }}</h5>
              <p class="card-text libro-autor mb-4">
                <span class="autor-prefijo">Escrito por</span>
                {{ libro.autor }}
              </p>
            </div>
            <div class="libro-pie pt-3 d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-vino btn-sm"
                @click="eliminarLibro(libro.id)"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <Transition name="fade-alerta">
      <div v-if="libros.length === 0" class="row mt-3">
        <div class="col-12">
          <div class="estante-vacio text-center py-4 px-3">
            <p class="mb-0">
              🕯️ Los estantes aguardan nuevos volúmenes en el catálogo.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.biblioteca-container {
  max-width: 1140px;
}

/* Letrero antiguo */
.letrero-antiguo {
  background: linear-gradient(145deg, #2d1a0e 0%, #1a0f08 55%, #29180d 100%);
  border: 2px solid var(--gold-aged);
  border-radius: 6px;
  padding: 8px;
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.75),
    inset 0 0 25px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(197, 155, 39, 0.15);
}

.letrero-marco {
  position: relative;
  border: 1px solid rgba(229, 193, 88, 0.45);
  padding: 1.6rem 1.2rem;
  background: radial-gradient(circle, rgba(74, 42, 24, 0.35) 0%, rgba(20, 12, 7, 0.65) 100%);
}

.ornamento-esquina {
  position: absolute;
  color: var(--gold-aged);
  font-size: 1rem;
  line-height: 1;
  opacity: 0.85;
}
.ornamento-esquina.tl { top: 8px; left: 12px; }
.ornamento-esquina.tr { top: 8px; right: 12px; }
.ornamento-esquina.bl { bottom: 8px; left: 12px; }
.ornamento-esquina.br { bottom: 8px; right: 12px; }

.letrero-subtitulo {
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  letter-spacing: 0.25em;
  color: var(--parchment-deep);
}

.letrero-titulo {
  font-family: 'Cinzel', 'IM Fell English', serif;
  font-weight: 800;
  font-size: clamp(1.9rem, 4vw, 2.85rem);
  color: var(--gold-bright);
  letter-spacing: 0.08em;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.9),
    0 0 18px rgba(197, 155, 39, 0.35);
}

.letrero-divisor {
  color: var(--gold-aged);
  font-size: 1rem;
  margin-top: 0.35rem;
  letter-spacing: 0.2em;
}

/* Formulario tipo ficha de registro */
.ficha-registro {
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 29px,
      rgba(154, 120, 32, 0.12) 29px,
      rgba(154, 120, 32, 0.12) 30px
    ),
    linear-gradient(135deg, var(--parchment-light) 0%, var(--parchment-mid) 65%, var(--parchment-deep) 100%);
  color: var(--ink-dark);
  border: 2px solid var(--gold-aged);
  border-top: 6px solid var(--leather-rich);
  border-radius: 6px;
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.65),
    inset 0 0 32px rgba(139, 98, 42, 0.22);
}

.ficha-encabezado {
  border-bottom: 2px double rgba(110, 27, 35, 0.45);
}

.ficha-titulo {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  color: var(--leather-dark);
  letter-spacing: 0.04em;
}

.ficha-sello {
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--wine-red);
  border: 1px solid var(--wine-red);
  padding: 0.2rem 0.55rem;
  border-radius: 3px;
  background-color: rgba(110, 27, 35, 0.06);
}

.ficha-label {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--leather-dark);
  letter-spacing: 0.04em;
}

.ficha-input {
  background-color: rgba(255, 252, 244, 0.82);
  border: 1.5px solid #b5945b;
  color: var(--ink-dark);
  font-family: 'Lora', serif;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
}

.ficha-input::placeholder {
  color: #8c7258;
  font-style: italic;
}

.ficha-input:focus {
  background-color: #fffdf7;
  border-color: var(--gold-aged);
  box-shadow: 0 0 0 0.2rem rgba(197, 155, 39, 0.28);
  color: var(--ink-dark);
}

.alerta-pergamino {
  background-color: rgba(110, 27, 35, 0.12);
  border: 1px solid var(--wine-red);
  border-left: 5px solid var(--wine-red);
  color: var(--wine-red-dark);
  font-family: 'Lora', serif;
}

/* Botón Crear / Registrar (Cuero y Dorado) */
.btn-dorado {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: linear-gradient(145deg, #4a2a18 0%, #2d180c 100%);
  color: var(--gold-bright);
  border: 1.5px solid var(--gold-aged);
  padding: 0.52rem 1rem;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
}

.btn-dorado:hover,
.btn-dorado:focus-visible {
  background: linear-gradient(145deg, #5e361f 0%, #3b2010 100%);
  color: #fff3c4;
  border-color: var(--gold-bright);
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(45, 24, 12, 0.45), 0 0 10px rgba(229, 193, 88, 0.4);
}

.btn-dorado:active {
  transform: translateY(0);
}

/* Cards de libros como tomos / pergaminos con borde dorado */
.libro-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(255, 248, 231, 0.65), transparent 60%),
    linear-gradient(145deg, var(--parchment-light) 0%, var(--parchment-mid) 55%, #dfc9a0 100%);
  color: var(--ink-dark);
  border: 1.5px solid var(--gold-aged);
  border-radius: 6px 10px 10px 6px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.6),
    inset 0 0 22px rgba(139, 98, 42, 0.22);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.libro-card:hover {
  transform: translateY(-7px);
  border-color: var(--gold-bright);
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.78),
    0 0 20px rgba(229, 193, 88, 0.42),
    inset 0 0 18px rgba(197, 155, 39, 0.18);
}

.libro-lomo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 14px;
  background:
    repeating-linear-gradient(
      180deg,
      rgba(229, 193, 88, 0.5) 0px,
      rgba(229, 193, 88, 0.5) 2px,
      transparent 2px,
      transparent 28px
    ),
    linear-gradient(90deg, #2b160b 0%, #4e2b17 65%, #2b160b 100%);
  border-right: 1.5px solid var(--gold-aged);
}

.libro-cuerpo {
  padding: 1.35rem 1.35rem 1.25rem 2rem;
}

.sello-id {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, #3c2213 0%, #24130a 100%);
  color: var(--gold-bright);
  border: 1px solid var(--gold-aged);
  padding: 0.35em 0.75em;
}

.ornamento-card {
  color: var(--gold-muted);
  font-size: 1.2rem;
  line-height: 1;
}

.libro-titulo {
  font-family: 'Cinzel', 'IM Fell English', serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--ink-dark);
  line-height: 1.35;
  margin-bottom: 0.5rem;
}

.libro-autor {
  font-family: 'Lora', serif;
  font-style: italic;
  color: var(--ink-muted);
  font-size: 0.98rem;
}

.autor-prefijo {
  display: block;
  font-size: 0.75rem;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7c5c43;
  margin-bottom: 0.1rem;
}

.libro-pie {
  border-top: 1px dashed rgba(154, 120, 32, 0.45);
}

/* Botón Eliminar en rojo vino */
.btn-vino {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  background: linear-gradient(145deg, var(--wine-red) 0%, var(--wine-red-dark) 100%);
  color: var(--parchment-light);
  border: 1px solid var(--gold-aged);
  padding: 0.38rem 0.95rem;
  transition:
    background 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.btn-vino:hover,
.btn-vino:focus-visible {
  background: linear-gradient(145deg, var(--wine-red-hover) 0%, var(--wine-red) 100%);
  color: #fff;
  border-color: var(--gold-bright);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 27, 35, 0.55), 0 0 8px rgba(229, 193, 88, 0.3);
}

.btn-vino:active {
  transform: translateY(0);
}

.estante-vacio {
  background: rgba(31, 19, 11, 0.78);
  border: 1px dashed var(--gold-aged);
  border-radius: 6px;
  color: var(--parchment-deep);
  font-style: italic;
}

/* Transiciones de Vue: Entrada del título y del formulario con fade */
.fade-header-enter-active {
  transition: opacity 0.85s ease, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-header-enter-from {
  opacity: 0;
  transform: translateY(-22px);
}

.fade-form-enter-active {
  transition: opacity 0.9s ease 0.18s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.18s;
}
.fade-form-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}

.fade-alerta-enter-active,
.fade-alerta-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-alerta-enter-from,
.fade-alerta-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* TransitionGroup para libros: aparición escalonada, entrada deslizándose, salida desvaneciéndose y reacomodo */
.libros-enter-active {
  transition:
    opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--stagger-delay, 0ms);
}

.libros-enter-from {
  opacity: 0;
  transform: translateY(28px) translateX(-24px) scale(0.95);
}

.libros-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  position: absolute;
  z-index: 0;
}

.libros-leave-to {
  opacity: 0;
  transform: scale(0.88) translateY(12px);
}

.libros-move {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
