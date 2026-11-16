/**
 * Parâmetros de movimento do site, reunidos num único lugar para ajustes futuros.
 * Durações em segundos. Curvas permitidas: expo.out e power3.out (sem elástico ou bounce).
 * A transição entre páginas fica em src/styles/transitions.css (é feita em CSS).
 */
export const motionConfig = {
  ease: 'expo.out',
  easeSoft: 'power3.out',

  /** Largura mínima (px) para efeitos de desktop: parallax e seções fixadas */
  desktopQuery: '(min-width: 1024px)',

  header: {
    /** rolagem (px) a partir da qual o cabeçalho fica sólido sobre o hero */
    solidAfter: 80,
    /** rolagem (px) a partir da qual o cabeçalho pode se esconder */
    hideAfter: 160,
    /** movimento mínimo (px) para mudar de estado, evita tremulação */
    tolerance: 6,
  },

  /** Rolagem suave (Lenis): quanto menor o lerp, mais "amanteigada" */
  lenis: {
    lerp: 0.1,
    wheelMultiplier: 1,
  },

  /** Abertura na primeira visita (não repete na mesma sessão) */
  intro: {
    /* a chave de sessão e a cortina ficam em BaseLayout.astro e motion.css */
    /** tempo até o conteúdo começar a aparecer por trás da cortina */
    contentDelay: 0.75,
  },

  /** Títulos H1/H2: cada linha sobe de 100% a 0% dentro de uma máscara */
  headings: {
    duration: 1.1,
    stagger: 0.08,
    start: 'top 88%',
  },

  /** Parágrafos, imagens e cards: surgem e sobem 32px ao entrar 15% na tela */
  blocks: {
    duration: 0.9,
    distance: 32,
    stagger: 0.08,
    start: 'top 85%',
  },

  /** Imagem do hero: zoom lento na entrada e parallax leve na rolagem */
  hero: {
    zoomFrom: 1.08,
    zoomDuration: 1.2,
    parallax: 8,
  },

  /** Números da Trajetória: contagem progressiva */
  counters: {
    duration: 1.2,
  },

  /** Imagens editoriais: deslocamento máximo em % */
  parallax: {
    amount: 8,
  },
} as const;
