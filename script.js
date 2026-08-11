// Menú móvil
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Año del footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Sello en vivo: abierto/cerrado según horario real
// EDITAR: mantener sincronizado con la tabla de horarios de la sección #horarios
const HORARIOS = {
  0: null, // domingo: cerrado
  1: [8 * 60, 20 * 60 + 30],
  2: [8 * 60, 20 * 60 + 30],
  3: [8 * 60, 20 * 60 + 30],
  4: [8 * 60, 20 * 60 + 30],
  5: [8 * 60, 20 * 60 + 30],
  6: [9 * 60, 14 * 60],
};

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function formatoHora(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0');
  const m = String(minutos % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function proximaApertura(diaActual, minutoActual) {
  for (let i = 0; i <= 7; i++) {
    const dia = (diaActual + i) % 7;
    const rango = HORARIOS[dia];
    if (!rango) continue;
    if (i === 0 && minutoActual >= rango[1]) continue;
    if (i === 0) return `abre hoy ${formatoHora(rango[0])}`;
    return `abre ${DIAS[dia]} ${formatoHora(rango[0])}`;
  }
  return '';
}

function actualizarSello() {
  const stamp = document.getElementById('stamp');
  const statusEl = document.getElementById('stampStatus');
  const detailEl = document.getElementById('stampDetail');
  if (!stamp || !statusEl || !detailEl) return;

  const ahora = new Date();
  const dia = ahora.getDay();
  const minutoActual = ahora.getHours() * 60 + ahora.getMinutes();
  const rangoHoy = HORARIOS[dia];
  const abierto = !!rangoHoy && minutoActual >= rangoHoy[0] && minutoActual < rangoHoy[1];

  stamp.classList.toggle('is-closed', !abierto);
  statusEl.textContent = abierto ? 'Abierto' : 'Cerrado';
  detailEl.textContent = abierto
    ? `cierra ${formatoHora(rangoHoy[1])}`
    : proximaApertura(dia, minutoActual);
}

actualizarSello();
setInterval(actualizarSello, 60000);
