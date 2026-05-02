const storyContent = [

  // ===== PORTADA =====
  {
    id: 'welcome',
    isWelcome: true,
    background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' },
    elements: [
      { type: 'logo', file: 'logo.png' },
      { type: 'title', text: '会話 - Role Play' },
      { type: 'subtitle', text: 'Trabajo Práctico Final' },
      { type: 'names', text: 'LUNA FABIAN' },
      { type: 'scroll-hint', text: 'SCROLL ↓' },
    ],
  },

  // ===== ESCENA 1: Full image =====
  {
    id: 'esc_1',
    background: { type: 'full', image: 'fondo-entrada.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'character', id: 'sombrero', file: 'sombrero.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！はじめまして！', en: '¡Hola! ¡Mucho gusto!' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'left' },
      { type: 'bubble', target: 'asahi', text: { jp: 'やあ！元気？', en: '¡Hey! ¿Cómo estás?' } },
      { type: 'bubble', target: 'komori', position: 'center',text: { jp: 'nuevo dialogo', en: 'traduccion' } },
    ],
  },

  // ===== ESCENA 2: Split vertical =====
  {
    id: 'esc_2',
    background: { type: 'split-v', left: 'clase.jpg', right: 'clase-vertical.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left' },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: '今日はいい天気ですね！', en: '¡Hoy hace buen clima!' } },
      { type: 'bubble', target: 'asahi', text: { jp: 'そうですね！散歩しましょうか？', en: '¡Así es! ¿Vamos a caminar?' } },
    ],
  },

  // ===== ESCENA 3: Split horizontal =====
  {
    id: 'esc_3',
    background: { type: 'split-h', top: 'clase.jpg', bottom: 'clase.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'top-right' },
      { type: 'bubble', target: 'komori', position: 'tr', text: { jp: '...', en: '...' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'bottom-left' },
      { type: 'bubble', target: 'asahi', position: 'bl', text: { jp: '...', en: '...' } },
    ],
  },

  // ===== ESCENA 4: Diagonal ↘ (0,0 → 100%,100%) =====
  {
    id: 'esc_4',
    background: {
      type: 'diagonal',
      direction: 'tl-br',
      top: 'fondo-entrada.jpg',
      bottom: 'clase.jpg',
    },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'bl' },
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'tr' },
      { type: 'bubble', target: 'asahi', text: { jp: '...', en: '...' } },
    ],
  },

  // ===== ESCENA 5: Diagonal ↙ (100%,0 → 0,100%) =====
  {
    id: 'esc_5',
    background: {
      type: 'diagonal',
      direction: 'tr-bl',
      top: 'clase.jpg',
      bottom: 'fondo-entrada.jpg',
    },
    sequence: [
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'br' },
      { type: 'bubble', target: 'asahi', text: { jp: '...', en: '...' } },
      { type: 'character', id: 'komori', file: 'komori.png', position: 'tl' },
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
    ],
  },

  // ===== ESCENA 6: Demo de posición independiente + reemplazo de burbujas =====
  {
    id: 'esc_demo',
    background: { type: 'full', image: 'fondo-entrada.jpg' },
    sequence: [
      // Personaje a la izquierda
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left' },

      // Burbuja hereda posición de komori (left) automáticamente
      { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } },

      // Scroll → desaparece la burbuja anterior de komori y aparece esta nueva
      { type: 'bubble', target: 'komori', text: { jp: 'はじめまして！', en: '¡Mucho gusto!' } },

      // Scroll → desaparece la burbuja anterior de komori y aparece esta con posición distinta
      { type: 'bubble', target: 'komori', position: 'top-left', text: { jp: 'よろしくお願いします！', en: '¡Encantado!' } },

      // Segundo personaje a la derecha
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'right' },

      // Burbuja con posición OBLIGATORIA: asahi está en 'right' pero la burbuja aparece centrada
      { type: 'bubble', target: 'asahi', position: 'center', text: { jp: 'やあ！', en: '¡Hey!' } },

      // Scroll → desaparece la burbuja anterior de asahi y aparece esta
      { type: 'bubble', target: 'asahi', text: { jp: '元気ですか？', en: '¿Cómo estás?' } },
    ],
  },

  // ===== ESCENA PERSONALIZADA: copiar y editar =====
  /*
  {
    id: 'mi_escena',
    background: { type: 'full', image: 'fondo.jpg' },
    sequence: [
      // Posiciones de personaje: left, right, center, top, bottom,
      //             top-right, top-left, bottom-right, bottom-left,
      //             tl, tr, bl, br

      // La burbuja hereda la posición del personaje por defecto
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left' },
      { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } },

      // ...o puedes forzar una posición diferente en la burbuja
      { type: 'bubble', target: 'komori', position: 'center', text: { jp: 'こんにちは！', en: '¡Hola!' } },

      // Al definir una nueva burbuja para el mismo target, la anterior desaparece
      { type: 'bubble', target: 'komori', text: { jp: 'はじめまして！', en: '¡Mucho gusto!' } },
    ],
  },
  */

  // ===== CIERRE =====
  {
    id: 'closing',
    background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' },
    elements: [
      { type: 'closing-logo', file: 'logo.png' },
      { type: 'closing-title', text: '終わり' },
      { type: 'closing-sub', text: 'Fin' },
      { type: 'closing-names', text: 'LUNA FABIAN' },
      { type: 'closing-footer', text: 'TP Nivel 3 de', logo: 'logo.png' },
    ],
  },

];
