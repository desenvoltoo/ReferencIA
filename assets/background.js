'use strict';

// Partículas verde-lima e conexões brancas com os parâmetros da referência.
// Cada banner tem sua própria superfície; os textos e links ficam acima dela.
(() => {
  const surfaces = document.querySelectorAll('[data-particles]');
  if (!surfaces.length || typeof window.particlesJS !== 'function') return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = window.matchMedia('(max-width: 720px)');

  surfaces.forEach(surface => {
    const hero = surface.parentElement;
    let instance;
    let visible = true;
    let frame;

    function updateMotion() {
      if (!instance) return;
      const animate = visible && !document.hidden && !reducedMotion.matches;
      instance.interactivity.events.onhover.enable = animate && !smallScreen.matches;
      window.cancelAnimationFrame(instance.fn.drawAnimFrame);
      instance.particles.move.enable = animate;
      instance.fn.vendors.draw();
    }

    function sizeCanvas() {
      const { width, height } = surface.getBoundingClientRect();
      // Wait for layout instead of creating an empty, zero-height network.
      if (width < 1 || height < 1) return;
      if (!instance) {
        window.particlesJS(surface.id, {
          particles: {
            number: { value: smallScreen.matches ? 100 : 178,
              density: { enable: true, value_area: smallScreen.matches ? 800 : 1443.0708547789707 } },
            color: { value: '#b6f567' },
            shape: { type: 'circle', stroke: { width: 0 } },
            opacity: { value: 0.5, random: true, anim: { enable: false } },
            size: { value: 2, random: true, anim: { enable: false } },
            // particles.js may draw while sizing a static canvas, before its own
            // RGB conversion runs. Seed the same white to keep that draw valid.
            line_linked: { enable: true, distance: 150, color: '#ffffff',
              color_rgb_line: { r: 255, g: 255, b: 255 }, opacity: 0.4, width: 1 },
            move: { enable: false, speed: 6, direction: 'none', random: false,
              straight: false, out_mode: 'out', bounce: false,
              attract: { enable: false, rotateX: 600, rotateY: 1200 } }
          },
          interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: false, mode: 'repulse' },
              onclick: { enable: false }, resize: false },
            modes: { repulse: { distance: 200, duration: 0.4 } }
          },
          retina_detect: true
        });
        instance = window.pJSDom.find(item => item.pJS.canvas.el.parentElement === surface)?.pJS;
        if (!instance) return;
      } else {
        window.cancelAnimationFrame(instance.fn.drawAnimFrame);
        instance.fn.retinaInit();
        instance.fn.canvasSize();
        instance.fn.particlesEmpty();
        instance.fn.particlesCreate();
        instance.fn.vendors.densityAutoParticles();
      }
      updateMotion();
    }

    function queueResize() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sizeCanvas);
    }

    hero.addEventListener('pointermove', event => {
      if (!instance || !instance.interactivity.events.onhover.enable || event.pointerType === 'touch') return;
      const bounds = surface.getBoundingClientRect();
      instance.interactivity.mouse.pos_x = (event.clientX - bounds.left) * instance.canvas.pxratio;
      instance.interactivity.mouse.pos_y = (event.clientY - bounds.top) * instance.canvas.pxratio;
      instance.interactivity.status = 'mousemove';
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      if (instance) instance.interactivity.status = 'mouseleave';
    });
    reducedMotion.addEventListener('change', updateMotion);
    smallScreen.addEventListener('change', queueResize);
    document.addEventListener('visibilitychange', updateMotion);
    if ('ResizeObserver' in window) new ResizeObserver(queueResize).observe(surface);
    else window.addEventListener('resize', queueResize, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updateMotion();
      }).observe(hero);
    }
    document.fonts?.ready.then(queueResize);
    queueResize();
  });
})();
