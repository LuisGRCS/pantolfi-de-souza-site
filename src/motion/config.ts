/**
 * Parâmetros de movimento do site, reunidos num único lugar para ajustes futuros.
 * (O sistema completo de animações entra na fase 2.)
 */
export const motionConfig = {
  header: {
    /** rolagem (px) a partir da qual o cabeçalho fica sólido sobre o hero */
    solidAfter: 80,
    /** rolagem (px) a partir da qual o cabeçalho pode se esconder */
    hideAfter: 160,
    /** movimento mínimo (px) para mudar de estado, evita tremulação */
    tolerance: 6,
  },
} as const;
