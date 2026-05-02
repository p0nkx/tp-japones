const storyContent = [

  // ===== PORTADA =====
  /*
  {
    id: 'welcome',
    isWelcome: true,
    background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' },
    elements: [
      { type: 'logo', file: 'logo.png' },
      { type: 'title', text: 'Trabajo Práctico' },
      { type: 'title', text: '- Role Play -' },
      { type: 'subtitle', text: 'Final Nivel 3 ' },
      { type: 'names', text: 'LUNA FABIAN' },
      { type: 'scroll-hint', text: 'SCROLL ↓' },
    ],
  },
*/


  // ===== ESCENA 1: pesadilla parte 1=====
  /*
{
    id: 'esc_1',
    background: { type: 'full', color: 'linear-gradient(180deg, #1a1a2e, #0f3460)' },
    sequence: [

      { type: 'bubble', target: '',position: 'center',text: { jp: 'donde estoy?', en: 'donde estoy?' } },
      { type: 'bubble', target: '',tremble: true,position: 'center',text: { jp: 'que es esto?', en: 'que es esto ?' } },
      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'center' ,silhouette: true},
      
      
    ],
  },

    // ===== ESCENA 2: pesadilla parte 2=====
{
    id: 'esc_2',
    background: { type: 'full', image: 'clase.jpg', nightmare: true },
    sequence: [
      
      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'center' ,silhouette: true},
      { type: 'bubble', target: 'komori',tremble: true,position: 'center',text: { jp: 'que es esto?', en: 'que es esto ?' } },
      { type: 'character', id: 'komori1', file: 'komori_asustada.png', position: 'center'},
      { type: 'bubble', target: 'komori1',tremble: true,position: 'center',text: { jp: 'quienes son estas personas?', en: 'que son estas personas ?' } },
      { type: 'character', id: 'mango', file: 'mango.png', position: 'left' ,silhouette: true},
      { type: 'character', id: 'camero', file: 'camero.png', position: 'right' ,silhouette: true},
      
    ],
  },
  

  // ===== ESCENA 3: dormitorio =====
  {
    id: 'esc_3',
    background: { type: 'full',image: 'dormitorio.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori_alerta.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'oh era un sueño', en: '¡Era solo un sueño!' } },
      { type: 'bubble', target: 'komori', text: { jp: 'no quiero ir a clases', en: '¡No quiero ir a clases!' } },
       { type: 'character', id: 'asahi', file: 'asahi_enojada_derecha.png', position: 'center' },
      { type: 'bubble', target: 'asahi',position: 'tl-l',text: { jp: 'そうですね！散歩しましょうか？', en: '¡Así es! ¿Vamos a caminar?' } },
      { type: 'character', id: 'komori', file: 'komori_timida.png', position: 'right' },
    ],
  },
*/
  // ===== ESCENA 4: caminando al colegio =====
  {
    id: 'esc_4',
    background: { type: 'full', image: 'caminata.png' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'oh era un sueño', en: '¡Era solo un sueño!' } },
      { type: 'bubble', target: 'komori', text: { jp: 'no quiero ir a clases', en: '¡No quiero ir a clases!' } },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'center' },
      { type: 'bubble', target: 'komori',hidden: true, text: { jp: '', en: '' } },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'そうですね！散歩しましょうか？', en: '¡Así es! ¿Vamos a caminar?' } },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'そうですね！散歩しましょうか？', en: '¡Así es! ¿Vamos a caminar?' } },
      
    ],
  },
/*
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

  // ===== ESCENA 7: Demo de efectos (pesadilla, temblor, silueta) =====
  {
    id: 'esc_nightmare',
    background: { type: 'full', image: 'clase.jpg', nightmare: true },
    sequence: [
      // Personaje como silueta negra
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left', silhouette: true },

      // Burbuja temblando (miedo/voz temblorosa)
      { type: 'bubble', target: 'komori', tremble: true, text: { jp: '誰...？', en: '¿Quién...?' } },

      // Segunda burbuja temblorosa
      { type: 'bubble', target: 'komori', tremble: true, text: { jp: '怖い...', en: 'Tengo miedo...' } },

      // Segundo personaje también como silueta
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'right', silhouette: true },

      // Burbuja temblorosa de asahi
      { type: 'bubble', target: 'asahi', tremble: true, text: { jp: '逃げよう...', en: 'Huyamos...' } },
    ],
  },

  // ===== ESCENA PERSONALIZADA: copiar y editar =====
  /*
  {
    id: 'mi_escena',
    background: { type: 'full', image: 'fondo.jpg' },
    // background: { type: 'full', image: 'fondo.jpg', nightmare: true },  ← efecto pesadilla

    sequence: [
      // Posiciones de personaje: left, right, center, top, bottom,
      //             top-right, top-left, bottom-right, bottom-left,
      //             tl, tr, bl, br

      // Personaje normal
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left' },

      // Personaje como silueta negra (efecto sombra)
      { type: 'character', id: 'komori', file: 'komori.png', position: 'left', silhouette: true },

      // Burbuja normal
      { type: 'bubble', target: 'komori', text: { jp: 'こんにちは！', en: '¡Hola!' } },

      // Burbuja temblando (miedo/voz temblorosa)
      { type: 'bubble', target: 'komori', tremble: true, text: { jp: '怖い...', en: 'Tengo miedo...' } },

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
      //{ type: 'closing-names', text: 'LUNA FABIAN' },
      
    ],
  },

];
