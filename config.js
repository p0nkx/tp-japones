const storyContent = [

  // ===== PORTADA =====
  {
    id: 'welcome',
    isWelcome: true,
    background: { type: 'full', color: 'linear-gradient(180deg, #1a1a2e, #16213e, #0f3460)' },
    elements: [
      { type: 'title', text: '会話 - Role Play' },
      { type: 'subtitle', text: 'Trabajo Práctico Final' },
      { type: 'names', text: 'Tu Nombre & Tu Compañero' },
      { type: 'scroll-hint', text: 'SCROLL ↓' },
    ],
  },

  // ===== ESCENA 1: Full image =====
  {
    id: 'esc_1',
    background: { type: 'full', image: 'fondo-entrada.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'tl' },
      { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！はじめまして！', en: '¡Hola! ¡Mucho gusto!' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'tr' },
      { type: 'bubble', target: 'asahi', text: { jp: 'やあ！元気？', en: '¡Hey! ¿Cómo estás?' } },
      { type: 'character', id: 'komori1', file: 'komori.png', position: 'bl' },
      { type: 'bubble', target: 'komori1', text: { jp: 'こんにちは！はじめまして！', en: '¡Hola! ¡Mucho gusto!' } },
      { type: 'character', id: 'asahi1', file: 'asahi.png', position: 'br' },
      { type: 'bubble', target: 'asahi1', text: { jp: 'やあ！元気？', en: '¡Hey! ¿Cómo estás?' } },
    ],
  },

  // ===== ESCENA 2: Split vertical =====
  {
    id: 'esc_2',
    background: { type: 'split-v', left: 'clase.jpg', right: 'clase.jpg' },
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
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'bottom-left' },
      { type: 'bubble', target: 'asahi', text: { jp: '...', en: '...' } },
    ],
  },

  // ===== ESCENA 4: Diagonal ↘ (0,0 → 100%,100%) =====
  // bg-top    = imagen del lado superior-derecho (triángulo de arriba)
  // bg-bottom = imagen del lado inferior-izquierdo (triángulo de abajo)
  {
    id: 'esc_4',
    background: {
      type: 'diagonal',
      direction: 'tl-br',
      top: 'fondo-entrada.jpg',
      bottom: 'clase.jpg',
    },
    sequence: [
      // bgBottom visible abajo-izquierda → personaje allí
      { type: 'character', id: 'komori', file: 'komori.png', position: 'tl' },
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
      // bgTop visible arriba-derecha → personaje allí
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'br' },
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
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'tr' },
      { type: 'bubble', target: 'asahi', text: { jp: '...', en: '...' } },
      { type: 'character', id: 'komori', file: 'komori.png', position: 'bl' },
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
    ],
  },

  // ===== ESCENA PERSONALIZADA: copiar y editar =====
  /*
  {
    id: 'mi_escena',
    background: { type: 'full', image: 'fondo.jpg' },
    // background: { type: 'split-v', left: 'izq.jpg', right: 'der.jpg' },
    // background: { type: 'split-h', top: 'arriba.jpg', bottom: 'abajo.jpg' },
    // background: { type: 'diagonal', direction: 'tl-br', top: 'arriba.jpg', bottom: 'abajo.jpg' },
    // background: { type: 'diagonal', direction: 'tr-bl', top: 'arriba.jpg', bottom: 'abajo.jpg' },
    sequence: [
      // Posiciones: left, right, center, top, bottom,
      //             top-right, top-left, bottom-right, bottom-left,
      //             tl, tr, bl, br
      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: '...', en: '...' } },
    ],
  },
  */

  // ===== CIERRE =====
  {
    id: 'closing',
    background: { type: 'full', color: 'linear-gradient(180deg, #FF6B6B, #4A0E4E, #1a1a2e)' },
    elements: [
      { type: 'closing-title', text: '終わり' },
      { type: 'closing-sub', text: 'Fin' },
      { type: 'closing-names', text: 'Tu Nombre & Tu Compañero' },
      { type: 'closing-class', text: 'Clase de Japonés - 2025' },
    ],
  },

];
