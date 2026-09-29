'use strict';

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const solutionsMenu = document.querySelector('.nav-solutions');
function closeMenu(restoreFocus = false) {
  if (!menuButton || !menu) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  if (solutionsMenu) solutionsMenu.open = false;
  if (restoreFocus) menuButton.focus();
}
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (menu.classList.contains('is-open')) closeMenu(true);
    else if (solutionsMenu?.open) {
      solutionsMenu.open = false;
      solutionsMenu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', () => closeMenu());
}

// A mesma integração pública usada pelo formulário de referencia.tech.
// Não coloque credenciais privadas neste arquivo entregue ao navegador.
const CONTACT_ENDPOINT = 'https://sheetdb.io/api/v1/qm2uuqbxs1mmy?sheet=Formul%C3%A1rio%20Site%20-%20Home';
const form = document.querySelector('[data-contact-form]');
if (form) {
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.textContent;
  const status = form.querySelector('[role="status"]');
  const fallback = form.querySelector('[data-form-fallback]');
  const phone = form.elements.telefone;
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(/^(?:55)?\d{10,11}$/.test(digits) ? '' : 'Informe o telefone com DDD.');
    if (!form.reportValidity()) return;
    const payload = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      celular: phone.value.trim(),
      regiao: form.elements.regiao.value.trim(),
      data_envio: new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date()).replace(',', '')
    };
    if (!payload.nome) { form.elements.nome.focus(); return; }
    submit.disabled = true;
    submit.textContent = 'Enviando solicitação…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = '';
    fallback.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [payload] }), signal: controller.signal
      });
      if (!response.ok) throw new Error('request_failed');
      const result = await response.json();
      if (!(Number(result.created) >= 1)) throw new Error('unconfirmed');
      status.dataset.state = 'success';
      status.textContent = 'Solicitação recebida! Nossa equipe entrará em contato com você.';
      form.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError'
        ? 'O envio está demorando e não foi possível confirmar o recebimento. Fale conosco pelo WhatsApp para conferir.'
        : 'Não foi possível confirmar o envio. Seus dados continuam preenchidos. Você também pode falar conosco pelo WhatsApp.';
      fallback.hidden = false;
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = submitLabel;
      form.removeAttribute('aria-busy');
    }
  });
}
