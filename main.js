// ============================================
// WHATSAPP FLOTANTE
// ============================================
function crearWhatsAppFlotante() {
  const btn = document.createElement('a');
  btn.href      = 'https://wa.me/593990460142?text=Hola,%20deseo%20agendar%20una%20cita%20m%C3%A9dica';
  btn.target    = '_blank';
  btn.rel       = 'noopener noreferrer';
  btn.className = 'whatsapp-flotante';
  btn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  btn.setAttribute('aria-label', 'Contactar por WhatsApp');
  document.body.appendChild(btn);
}

// ============================================
// CERRAR MENÚ
// ============================================
function cerrarMenu() {
  const navMenu   = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove('abierto');
  navToggle.classList.remove('abierto');
  navToggle.setAttribute('aria-expanded', 'false');
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------
  // PRELOADER
  // ----------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('oculto');
      setTimeout(() => { preloader.style.display = 'none'; }, 500);
    });
    setTimeout(() => {
      if (!preloader.classList.contains('oculto')) {
        preloader.classList.add('oculto');
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
      }
    }, 9000);
  }

  // ----------------------------------------
  // WHATSAPP FLOTANTE
  // ----------------------------------------
  crearWhatsAppFlotante();

  // ----------------------------------------
  // MENÚ HAMBURGUESA
  // ----------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('abierto');
      navToggle.classList.toggle('abierto');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('abierto').toString());
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      const clickFuera = !navMenu.contains(e.target) && !navToggle.contains(e.target);
      if (clickFuera && navMenu.classList.contains('abierto')) cerrarMenu();
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('abierto')) {
        cerrarMenu();
        navToggle.focus();
      }
    });

    // Cerrar al hacer clic en un enlace del menú
    document.querySelectorAll('.nav-menu a').forEach(enlace => {
      enlace.addEventListener('click', cerrarMenu);
    });
  }

  // ----------------------------------------
  // EJES — Count-To con IntersectionObserver
  // ----------------------------------------
  const seccionEjes = document.getElementById('ejes-principales');

  if (seccionEjes) {
    function countTo(el) {
      const target = parseInt(el.dataset.target) || 0;
      const pre    = el.dataset.pre || '';
      const suf    = el.dataset.suf || '';
      const dur    = 1800;
      const start  = performance.now();

      function tick(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(ease * target).toLocaleString('es-EC') + suf;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const statItems   = document.querySelectorAll('.stat-item');
    const statNums    = document.querySelectorAll('.stat-num');
    let statsActivado = false;

    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting && !statsActivado) {
        statsActivado = true;
        statItems.forEach(i => i.classList.add('visible'));
        setTimeout(() => statNums.forEach(n => countTo(n)), 200);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    statsObserver.observe(seccionEjes);
  }

  // ----------------------------------------
  // NAVBAR — Efecto scroll + ocultar top bar
  // ----------------------------------------
  const navbar = document.getElementById('navbar');
  const topBar = document.getElementById('top-bar');

  if (navbar) {
    function getTopBarHeight() {
      return parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')
      ) || 0;
    }

    window.addEventListener('scroll', () => {
      const umbral = getTopBarHeight();
      if (window.scrollY > umbral) {
        navbar.classList.add('nav-scrolled');
        if (topBar) topBar.classList.add('top-bar-oculto');
      } else {
        navbar.classList.remove('nav-scrolled');
        if (topBar) topBar.classList.remove('top-bar-oculto');
      }
    }, { passive: true });
  }

  // ----------------------------------------
  // MENÚ ACTIVO POR SECCIÓN VISIBLE
  // ✅ FIX: usa intersectionRatio para elegir
  //    la sección más visible y evitar saltos
  // ----------------------------------------
  const secciones = document.querySelectorAll('section[id]');
  const enlaces   = document.querySelectorAll('.nav-menu a');

  if (secciones.length && enlaces.length) {
    const ratioMap = new Map();

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        ratioMap.set(entry.target.id, entry.intersectionRatio);
      });

      let maxRatio = 0;
      let idActivo = null;
      ratioMap.forEach((ratio, id) => {
        if (ratio > maxRatio) { maxRatio = ratio; idActivo = id; }
      });

      if (idActivo) {
        enlaces.forEach(a => a.classList.remove('activo'));
        const link = document.querySelector(`.nav-menu a[href="#${idActivo}"]`);
        if (link) link.classList.add('activo');
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.35, 0.5],
      rootMargin: '-80px 0px -40% 0px'
    });

    secciones.forEach(s => navObserver.observe(s));
  }

  // ----------------------------------------
  // VIDEOS — Play/Pause por visibilidad en pantalla
  // ----------------------------------------
  const videos = document.querySelectorAll('video');

  if (videos.length > 0) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          const p = video.play();
          if (p !== undefined) p.catch(() => {});
        } else {
          if (!video.paused) video.pause();
        }
      });
    }, { threshold: 0.1 });

    videos.forEach(video => videoObserver.observe(video));
  }

  // ----------------------------------------
  // BOTONES PLAY/PAUSE sobre cada video
  // ----------------------------------------
  document.querySelectorAll('.caso-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const video = btn.closest('.caso-video')?.querySelector('video');
      if (!video) return;

      if (video.paused) {
        const p = video.play();
        if (p !== undefined) p.catch(() => {});
        btn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  });

  // ----------------------------------------
  // FORMULARIO DE CITAS — Envío por WhatsApp
  // ----------------------------------------
  const formCita = document.getElementById('formCita');

  if (formCita) {
    formCita.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre       = formCita.nombre.value.trim();
      const telefono     = formCita.telefono.value.trim();
      const especialidad = formCita.especialidad.value;
      const fecha        = formCita.fecha.value;
      const mensaje      = formCita.mensaje.value.trim();

      if (!nombre || !telefono) {
        alert('Por favor completa tu nombre y teléfono.');
        return;
      }

      const especialidadTexto = especialidad
        ? especialidad.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : '';

      const fechaTexto = fecha
        ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-EC', {
            day: 'numeric', month: 'long', year: 'numeric'
          })
        : '';

      const lineas = [
        'Hola, deseo agendar una cita médica.',
        `*Nombre:* ${nombre}`,
        `*Teléfono:* ${telefono}`,
        especialidadTexto ? `*Especialidad:* ${especialidadTexto}` : '',
        fechaTexto        ? `*Fecha preferida:* ${fechaTexto}`    : '',
        mensaje           ? `*Mensaje:* ${mensaje}`                : ''
      ].filter(Boolean).join('\n');

      window.open(
        `https://wa.me/593990460142?text=${encodeURIComponent(lineas)}`,
        '_blank', 'noopener,noreferrer'
      );
    });
  }

});
