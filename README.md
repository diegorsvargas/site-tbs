# site-tbs
Site institucional da Trajano, Bogado &amp; Slim Advocacia — Porto Alegre/RS

Site estático (HTML, CSS e JavaScript puros, sem build). Para ver, abra `index.html` no navegador.

## Estrutura
- `index.html` — página única com todas as seções
- `assets/css/style.css` — identidade visual (cores e tipografia como variáveis no `:root`)
- `assets/js/main.js` — interações (slideshow do topo, palavra que gira, diagrama Cível × Trabalhista, cartões, linha da cobrança, abas "Para quem", formulário)
- `assets/img/` — logotipos, fotos do topo e retratos dos sócios

## Para trocar ou acrescentar fotos no topo
Cada foto é um `<figure class="slide">` dentro de `.hero__slides`. Para incluir uma nova, copie um bloco, aponte o `src` para a imagem e acrescente um botão `.barra` correspondente em `.hero__progresso`.

## Pendências de conteúdo
Textos entre colchetes `[ ]`: nº OAB da sociedade e dos sócios, formação dos sócios, e-mail. O envio do formulário precisa ser ligado ao servidor de hospedagem (hoje ele só valida os campos).
