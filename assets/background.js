'use strict';

// Rede visual da referência: pontos verde-lima, conexões brancas e repulsão
// suave quando o cursor passa pelo banner. O canvas é independente de plugins,
// então a animação inicia igual em diferentes navegadores.
(() => {
  const surfaces = document.querySelectorAll('[data-particles]');
  if (!surfaces.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  surfaces.forEach(surface => {
    const hero = surface.parentElement;
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    surface.appendChild(canvas);
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const state = {
      width: 0, height: 0, ratio: 1, particles: [],
      pointer: { active: false, x: 0, y: 0 }, visible: true,
      animationFrame: 0, resizeFrame: 0,
      speed: reducedMotion.matches ? 0.18 : 0.9
    };

    function makeParticle() {
      const angle = Math.random() * Math.PI * 2;
      const velocity = state.speed * (0.72 + Math.random() * 0.56);
      return { x: Math.random() * state.width, y: Math.random() * state.height,
        vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
        radius: 0.8 + Math.random() * 1.3, opacity: 0.35 + Math.random() * 0.3 };
    }

    function resize() {
      const bounds = surface.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      const oldWidth = state.width || bounds.width;
      const oldHeight = state.height || bounds.height;
      state.width = bounds.width;
      state.height = bounds.height;
      state.ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(state.width * state.ratio);
      canvas.height = Math.round(state.height * state.ratio);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
      const target = Math.min(178, Math.max(58, Math.round(state.width * state.height / 8000)));
      if (!state.particles.length) state.particles = Array.from({ length: target }, makeParticle);
      else {
        state.particles.forEach(point => { point.x *= state.width / oldWidth; point.y *= state.height / oldHeight; });
        while (state.particles.length < target) state.particles.push(makeParticle());
        state.particles.length = target;
      }
      draw();
    }

    function setPointer(event) {
      if (event.pointerType === 'touch') return;
      const bounds = surface.getBoundingClientRect();
      state.pointer.x = event.clientX - bounds.left;
      state.pointer.y = event.clientY - bounds.top;
      state.pointer.active = true;
    }

    function clearPointer() { state.pointer.active = false; }

    function updatePoint(point) {
      if (state.pointer.active && !reducedMotion.matches) {
        const dx = point.x - state.pointer.x;
        const dy = point.y - state.pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < 210) {
          const force = (1 - distance / 210) * 0.8;
          point.vx += dx / distance * force;
          point.vy += dy / distance * force;
        }
      }
      const maxVelocity = reducedMotion.matches ? 0.42 : 2.8;
      const velocity = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
      if (velocity > maxVelocity) { point.vx = point.vx / velocity * maxVelocity; point.vy = point.vy / velocity * maxVelocity; }
      point.x += point.vx; point.y += point.vy;
      point.vx *= 0.997; point.vy *= 0.997;
      if (point.x < -8) point.x = state.width + 8;
      if (point.x > state.width + 8) point.x = -8;
      if (point.y < -8) point.y = state.height + 8;
      if (point.y > state.height + 8) point.y = -8;
    }

    function draw() {
      if (!state.width || !state.height) return;
      context.clearRect(0, 0, state.width, state.height);
      state.particles.forEach(updatePoint);
      for (let i = 0; i < state.particles.length; i += 1) {
        const first = state.particles[i];
        for (let j = i + 1; j < state.particles.length; j += 1) {
          const second = state.particles[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 150) continue;
          context.strokeStyle = `rgba(255,255,255,${(1 - distance / 150) * 0.42})`;
          context.lineWidth = 1;
          context.beginPath(); context.moveTo(first.x, first.y); context.lineTo(second.x, second.y); context.stroke();
        }
      }
      state.particles.forEach(point => {
        context.fillStyle = `rgba(182,245,103,${point.opacity})`;
        context.beginPath(); context.arc(point.x, point.y, point.radius, 0, Math.PI * 2); context.fill();
      });
    }

    function animate() {
      if (!state.visible || document.hidden) { state.animationFrame = 0; return; }
      draw(); state.animationFrame = window.requestAnimationFrame(animate);
    }
    function start() { if (!state.animationFrame) state.animationFrame = window.requestAnimationFrame(animate); }
    function updateVisibility() {
      if (state.visible && !document.hidden) start();
      else if (state.animationFrame) { window.cancelAnimationFrame(state.animationFrame); state.animationFrame = 0; }
    }
    function queueResize() {
      window.cancelAnimationFrame(state.resizeFrame);
      state.resizeFrame = window.requestAnimationFrame(() => { state.resizeFrame = 0; resize(); });
    }

    hero.addEventListener('pointermove', setPointer, { passive: true });
    hero.addEventListener('pointerleave', clearPointer, { passive: true });
    document.addEventListener('visibilitychange', updateVisibility);
    reducedMotion.addEventListener('change', () => {
      state.speed = reducedMotion.matches ? 0.18 : 0.9;
      state.particles.forEach(point => { const angle = Math.atan2(point.vy, point.vx); point.vx = Math.cos(angle) * state.speed; point.vy = Math.sin(angle) * state.speed; });
    });
    if ('ResizeObserver' in window) new ResizeObserver(queueResize).observe(surface);
    else window.addEventListener('resize', queueResize, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { state.visible = entries[0].isIntersecting; updateVisibility(); }).observe(hero);
    queueResize(); start();
  });
})();
