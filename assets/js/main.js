/* TBS Advocacia — interações do site */
(function () {
  'use strict';
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Cabeçalho: fica sólido ao rolar; menu no celular */
  var topo = $('#topo');
  function cabecalho() { topo.classList.toggle('is-solido', window.scrollY > 40); }
  cabecalho();
  window.addEventListener('scroll', cabecalho, { passive: true });
  var menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', function () {
    var aberto = topo.classList.toggle('is-aberto');
    menuBtn.setAttribute('aria-expanded', String(aberto));
  });
  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () { topo.classList.remove('is-aberto'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  /* Hero: troca automática de imagens com barras de progresso */
  var hero = $('.hero');
  var slides = $$('.slide', hero);
  var barras = $$('.barra', hero);
  var TEMPO = 7000;
  var atual = 0, timer = null, pausado = false;
  hero.style.setProperty('--tempo', TEMPO + 'ms');
  function mostra(i) {
    atual = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-ativo', k === atual); });
    barras.forEach(function (b, k) {
      b.classList.remove('is-ativo');
      b.classList.toggle('is-feito', k < atual);
      b.setAttribute('aria-selected', String(k === atual));
    });
    void barras[atual].offsetWidth; // reinicia a animação da barra
    barras[atual].classList.add('is-ativo');
    agenda();
  }
  function agenda() {
    clearTimeout(timer);
    if (calmo || pausado) return;
    timer = setTimeout(function () { mostra(atual + 1); }, TEMPO);
  }
  barras.forEach(function (b, k) { b.addEventListener('click', function () { mostra(k); }); });
  function pausa(v) {
    pausado = v; hero.classList.toggle('is-pausado', v);
    if (v) clearTimeout(timer); else mostra(atual);
  }
  hero.addEventListener('mouseenter', function () { pausa(true); });
  hero.addEventListener('mouseleave', function () { pausa(false); });
  document.addEventListener('visibilitychange', function () { pausa(document.hidden); });
  agenda();

  /* Palavra que gira no título */
  var palavras = $$('.giro__palavra');
  var p = 0;
  if (!calmo) {
    setInterval(function () {
      var velha = palavras[p];
      velha.classList.remove('is-ativo'); velha.classList.add('is-saindo');
      setTimeout(function () { velha.classList.remove('is-saindo'); }, 800);
      p = (p + 1) % palavras.length;
      palavras[p].classList.add('is-ativo');
    }, 2600);
  }

  /* Duas frentes: diagrama + abas sincronizados */
  var venn = $('.venn');
  var abasVenn = $$('.venn__abas button');
  function zona(nome, foco) {
    venn.setAttribute('data-ativa', nome);
    abasVenn.forEach(function (b) {
      var on = b.getAttribute('data-zona') === nome;
      b.classList.toggle('is-ativo', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
      $('#' + b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  abasVenn.forEach(function (b, i) {
    b.addEventListener('click', function () { zona(b.getAttribute('data-zona')); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      zona(abasVenn[(i + d + abasVenn.length) % abasVenn.length].getAttribute('data-zona'), true);
    });
  });
  $$('[data-zona]', $('.venn__svg')).forEach(function (c) {
    c.addEventListener('mouseenter', function () { zona(c.getAttribute('data-zona')); });
    c.addEventListener('click', function () { zona(c.getAttribute('data-zona')); });
  });
  zona('civil');

  /* Brilho carmim que acompanha o cursor */
  var frentes = $('.frentes');
  frentes.addEventListener('pointermove', function (e) {
    var r = frentes.getBoundingClientRect();
    frentes.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    frentes.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* Cartões: toque/Enter abre e fecha */
  $$('.cartao').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('is-aberto'); });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('is-aberto'); }
    });
  });

  /* Jornada: a linha se preenche conforme a rolagem */
  var trilha = $('#trilha');
  var passos = $$('.trilha__passo', trilha);
  function jornada() {
    var r = trilha.getBoundingClientRect();
    var alvo = window.innerHeight * 0.6;
    var prog = Math.min(1, Math.max(0, (alvo - r.top) / r.height));
    trilha.style.setProperty('--progresso', prog.toFixed(3));
    passos.forEach(function (s) {
      s.classList.toggle('is-feito', s.getBoundingClientRect().top + 28 < alvo);
    });
  }
  jornada();
  window.addEventListener('scroll', jornada, { passive: true });
  window.addEventListener('resize', jornada);

  /* Para quem: abas */
  var abasPub = $$('.publico__abas button');
  function perfil(i, foco) {
    abasPub.forEach(function (b, k) {
      var on = k === i;
      b.classList.toggle('is-ativo', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
      $('#' + b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  abasPub.forEach(function (b, i) {
    b.addEventListener('click', function () { perfil(i); });
    b.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      perfil((i + d + abasPub.length) % abasPub.length, true);
    });
  });
  perfil(0);

  /* Revelação suave: só o que ainda está abaixo da dobra */
  if (!calmo && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); e.target.classList.remove('pre'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.revela').forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pre');
        el.style.transitionDelay = (i % 4) * 90 + 'ms';
        io.observe(el);
      }
    });
  }

  /* Formulário: validação (o envio depende do servidor de hospedagem) */
  var form = $('#form');
  var retorno = $('#formRetorno');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalido = $$('input, select, textarea', form).filter(function (el) { return !el.checkValidity(); })[0];
    if (invalido) {
      retorno.textContent = invalido.type === 'checkbox'
        ? 'Para continuar, marque a autorização de uso dos dados (LGPD).'
        : 'Preencha o campo "' + invalido.closest('label').firstChild.textContent.trim() + '" corretamente.';
      invalido.focus();
      return;
    }
    retorno.textContent = 'Dados conferidos. [O envio será ligado ao e-mail do escritório na publicação do site.]';
  });
})();
