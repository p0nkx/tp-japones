const storyContent = [

  // ===== PORTADA =====
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

  // ===== ESCENA 1: pesadilla parte 1 =====
  {
    id: 'esc_1',
    background: { type: 'full', color: 'linear-gradient(180deg, #1a1a2e, #0f3460)' },
    sequence: [
      { type: 'narration', text: { jp: 'あした、がっこう　は　はじまります。', en: 'Ashita, gakkou wa hajimarimasu.', es: 'Mañana, la escuela comienza.' } },
      { type: 'narration', text: { jp: 'あたらしい　がっこう　は　こわい　です。', en: 'Atarashii gakkou wa kowai desu.', es: 'La nueva escuela me da miedo.' } },
      { type: 'narration', text: { jp: 'ねぼう　したくない　です。', en: 'Nebou shitakunai desu.', es: 'No quiero despertarme tarde.' } },
    ],
  },

  // ===== ESCENA 2: pesadilla parte 2 =====
  {
    id: 'esc_2',
    background: { type: 'full', image: 'clase.jpg', nightmare: true },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'center', silhouette: true },
      { type: 'bubble', target: 'komori', tremble: true, text: { jp: 'ここ　は　どこ　です　か。', en: 'Koko wa doko desu ka.', es: '¿Dónde estoy?' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'center' },
      { type: 'bubble', target: 'komori', tremble: true, position: 'center', text: { jp: 'だれ　です　か。', en: 'Dare desu ka.', es: '¿Quién anda ahí?' } },

      { type: 'character', id: 'mango', file: 'mango.png', position: 'left', silhouette: true },
      { type: 'character', id: 'camero', file: 'camero.png', position: 'right', silhouette: true },

      { type: 'bubble', target: 'komori', position: 'center', text: { jp: 'わたし　は　だれ　も　わかりません。', en: 'Watashi wa dare mo wakarimasen.', es: 'No conozco a nadie.' } },
      { type: 'bubble', target: 'komori', position: 'center', text: { jp: 'わたし　は　とても　こわい　です。', en: 'Watashi wa totemo kowai desu.', es: 'Tengo mucho miedo.' } },
    ],
  },

  // ===== ESCENA 3: dormitorio =====
  {
    id: 'esc_3',
    background: { type: 'full', image: 'dormitorio.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori_alerta.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'あ、ゆめ　でした！　よかったです。', en: 'A, yume deshita! Yokatta desu.', es: '¡Ah, era un sueño! Qué bueno.' } },
      { type: 'bubble', target: 'komori', text: { jp: 'だいがく　へ　いきたくない　です。', en: 'Daigaku e ikitakunai desu.', es: 'No quiero ir a la universidad.' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'character', id: 'asahi', file: 'asahi_enojada_derecha.png', position: 'center' },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'コモリ、おそい　です　よ！　じゅんび　して　ください。', en: 'Komori, osoi desu yo! Junbi shite kudasai.', es: '¡Komori, es tarde! Prepárate, por favor.' } },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'あるいて　いきましょう。', en: 'Aruite ikimashou.', es: 'Vamos caminando.' } },

      { type: 'character', id: 'komori', file: 'komori_timida.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'え？　くるま　で　いきません　か。', en: 'E? Kuruma de ikimasen ka.', es: '¿Eh? ¿No vamos en auto?' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'はい、くるま　で　いきません。　あさごはん　を　たべて　ください。', en: 'Hai, kuruma de ikimasen. Asagohan wo tabete kudasai.', es: 'Así es, no vamos en auto. Desayuna, por favor.' } },
    ],
  },

  // ===== ESCENA 4: caminando al colegio =====
  {
    id: 'esc_4',
    background: { type: 'full', image: 'caminata.png' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'center' },
      { type: 'bubble', target: 'komori', text: { jp: 'はじめまして。わたし　は　コモリ　です。　さんじゅうさい　です。', en: 'Hajimemashite. Watashi wa Komori desu. Sanjuussai desu.', es: 'Mucho gusto. Yo soy Komori. Tengo 30 años.' } },
      { type: 'bubble', target: 'komori', text: { jp: 'わたし　は　だいがくせい　です。　アルゼンチン　から　きました。', en: 'Watashi wa daigakusei desu. Aruzenchin kara kimashita.', es: 'Soy estudiante universitaria. Vine de Argentina.' } },
      { type: 'bubble', target: 'komori', text: { jp: 'こちら　は　いもうと　の　アサヒ　です。', en: 'Kochira wa imouto no Asahi desu.', es: 'Esta es mi hermana menor, Asahi.' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'はじめまして、アサヒ　です。　じゅうはっさい　です。', en: 'Hajimemashite, Asahi desu. Juuhassai desu.', es: 'Mucho gusto, soy Asahi. Tengo 18 años.' } },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'わたし　は　あさひかわラーメン　が　だいすき　です。', en: 'Watashi wa Asahikawa raamen ga daisuki desu.', es: 'Me encanta el ramen de Asahikawa.' } },
      { type: 'bubble', target: 'asahi', hidden: true },

      { type: 'bubble', target: 'komori', text: { jp: 'わたし　の　しゅみ　は　え　です。　よろしく　おねがいします。', en: 'Watashi no shumi wa e desu. Yoroshiku onegaishimasu.', es: 'Mi pasatiempo es el dibujo. Encantada de conocerlos.' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'じゃあ、わたし　は　ほんや　へ　ほん　を　かい　に　いきます。', en: 'Jaa, watashi wa honya e hon wo kai ni ikimasu.', es: 'Entonces, voy a la librería a comprar un libro.' } },
      { type: 'bubble', target: 'asahi', position: 'tl-l', text: { jp: 'コモリ、がんばって　ください！　さようなら。', en: 'Komori, ganbatte kudasai! Sayounara.', es: '¡Komori, buena suerte! ¡Adiós!' } },
      { type: 'bubble', target: 'asahi', hidden: true },
      { type: 'character', id: 'asahi', hidden: true },

      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'ええっ！　ちょっと　まって　ください！　ひとり　は　とても　しんぱい　です。', en: 'Eeh! Chotto matte kudasai! Hitori wa totemo shinpai desu.', es: '¡Eh! ¡Espera un momento! Estoy muy preocupada por estar sola.' } },
      { type: 'bubble', target: 'komori', text: { jp: 'ああ、どうしましょう。　だれ　も　いません。', en: 'Aa, doushimashou. Dare mo imasen.', es: 'Ah, ¿qué hago? No hay nadie.' } },
    ],
  },

  // ===== ESCENA 5: llegando al colegio =====
  {
    id: 'esc_5',
    background: { type: 'split-v', left: 'fondo-sakura.jpg', right: 'fondo-sakura.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'br' },
      { type: 'bubble', target: 'komori', position: 'right', text: { jp: 'あれ　は　だいがく　です　か。　とても　おおきい　です！', en: 'Are wa daigaku desu ka. Totemo ookii desu!', es: '¿Aquello es la universidad? ¡Es muy grande!' } },
      { type: 'bubble', target: 'komori', text: { jp: 'あそこ　に　だれ　か　います。', en: 'Asoko ni dare ka imasu.', es: 'Allá hay alguien.' } },

      { type: 'character', id: 'mango', file: 'mango-chulo.png', position: 'bl' },

      { type: 'bubble', target: 'komori', text: { jp: 'わたし　は　かれ　に　はなし　に　いきます。', en: 'Watashi wa kare ni hanashi ni ikimasu.', es: 'Me acercaré a él para hablarle.' } },
      { type: 'bubble', target: 'komori', text: { jp: 'よし！　いきましょう！', en: 'Yoshi! Ikimashou!', es: '¡Bien! ¡Vamos!' } },
    ],
  },

  // ===== ESCENA 6: entrada colegio komori y mango =====
  {
    id: 'esc_6',
    background: { type: 'full', image: 'fondo-sakura.jpg' },
    sequence: [
      { type: 'character', id: 'rina', file: 'rina.png', position: 'camuflada' },

      { type: 'character', id: 'mango', file: 'mango-chulo.png', position: 'bl' },

      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'おはようございます！　はじめまして、わたし　は　コモリ　です。', en: 'Ohayou gozaimasu! Hajimemashite, watashi wa Komori desu.', es: '¡Buenos días! Mucho gusto, yo soy Komori.' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'character', id: 'mango', file: 'mango_derecha.png', position: 'center' },
      { type: 'bubble', target: 'mango', position: 'tl-l', text: { jp: 'はじめまして、マンゴ　です。　わたし　は　きゅうけつき　です。', en: 'Hajimemashite, Mango desu. Watashi wa kyuuketsuki desu.', es: 'Mucho gusto, soy Mango. Soy un vampiro.' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'bubble', target: 'komori', text: { jp: 'そう　です　か！　マンゴさん　は　なんさい　です　か。', en: 'Sou desu ka! Mango-san wa nansai desu ka.', es: '¡Ah, ya veo! Mango, ¿cuántos años tienes?' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'mango', position: 'tl-l', text: { jp: 'はたち　です。　ブラジル　から　きました。', en: 'Hatachi desu. Burajiru kara kimashita.', es: 'Tengo 20 años. Vine de Brasil.' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'bubble', target: 'komori', text: { jp: 'すきな　りょうり　は　なん　です　か。', en: 'Sukina ryouri wa nan desu ka.', es: '¿Cuál es tu comida favorita?' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'mango', position: 'tl-l', text: { jp: 'フルーツサラダ　が　だいすき　です。　しゅみ　は　ビーガンりょうり　です。', en: 'Furuutsu sarada ga daisuki desu. Shumi wa biigan ryouri desu.', es: 'Me encanta la ensalada de frutas. Mi pasatiempo es la comida vegana.' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'character', id: 'camero', file: 'camero.png', position: 'bl-l' },
      { type: 'bubble', target: 'camero', position: 'bl-l', text: { jp: 'あ！　いま　はちじはん　です。　いそぎましょう！　おくれます　よ。', en: 'A! Ima hachiji-han desu. Isogimashou! Okuremasu yo.', es: '¡Ah! Ahora son las 8:30. ¡Apurémonos! Llegaremos tarde.' } },
      { type: 'bubble', target: 'camero', hidden: true },

      { type: 'bubble', target: 'komori', text: { jp: 'いそいで！　おくれます　よ！', en: 'Isoide! Okuremasu yo!', es: '¡Rápido! ¡Llegaremos tarde!' } },
    ],
  },

  // ===== ESCENA 7: clases =====
  {
    id: 'esc_7',
    background: { type: 'full', image: 'clase.jpg' },
    sequence: [
      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'character', id: 'mango', file: 'mango_derecha.png', position: 'center' },

      { type: 'bubble', target: 'komori', text: { jp: 'きょう　は　はちじはん　から　よじ　まで　べんきょう　しました　ね。', en: 'Kyou wa hachiji-han kara yoji made benkyou shimashita ne.', es: 'Hoy estudiamos desde las 8:30 hasta las 4:00, ¿no?' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'mango', text: { jp: 'どこか　へ　あそび　に　いきましょう。　カラオケ　は　どう　です　か。', en: 'Dokoka e asobi ni ikimashou. Karaoke wa dou desu ka.', es: 'Vamos a algún lugar a divertirnos. ¿Qué tal el karaoke?' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'bubble', target: 'komori', text: { jp: 'いい　です　ね！　「ワンピース」　の　うた　を　うたいましょう。', en: 'Ii desu ne! "Wan Piisu" no uta wo utaimashou.', es: '¡Qué bien! Cantemos canciones de "One Piece".' } },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'character', id: 'nicorasu', file: 'nicorasu_mugiwara.png', position: 'left' },
      { type: 'bubble', target: 'nicorasu', text: { jp: 'だれ　か　「ワンピース」　を　いいました　か。', en: 'Dare ka "Wan Piisu" wo iimashita ka.', es: '¿Alguien dijo "One Piece"?' } },

      { type: 'character', id: 'komori', file: 'komori_asustada.png', position: 'right' },
      { type: 'character', id: 'mango', file: 'mango-chulo.png', position: 'center' },
      { type: 'bubble', target: 'komori', text: { jp: 'きゃあ！　びっくり　しました！', en: 'Kyaa! Bikkuri shimashita!', es: '¡Kyaa! ¡Qué susto me diste!' } },

      { type: 'bubble', target: 'nicorasu', hidden: true },
      { type: 'bubble', target: 'komori', hidden: true },

      { type: 'bubble', target: 'mango', text: { jp: 'ニコラス！　しずかに　して　ください！', en: 'Nikorasu! Shizuka ni shite kudasai!', es: '¡Nicolas! ¡Cállate, por favor!' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'bubble', target: 'nicorasu', text: { jp: 'カメロさん　と　リナさん　を　よびましょう。', en: 'Kamero-san to Rina-san wo yobimashou.', es: 'Invitemos a Camero y a Rina.' } },

      { type: 'character', id: 'komori', file: 'komori.png', position: 'right' },
      { type: 'bubble', target: 'komori', text: { jp: 'じゃあ、わたし　は　いもうと　を　よびます。', en: 'Jaa, watashi wa imouto wo yobimasu.', es: 'Entonces, yo invitaré a mi hermana.' } },
    ],
  },

  // ===== ESCENA 8: karaoke =====
  {
    id: 'esc_8',
    background: { type: 'full', image: 'karaoke.png' },
    sequence: [
      { type: 'narration', text: { jp: 'みんな　で　うた　を　うたい　ながら、たべて　います。　とても　たのしい　です！', en: 'Minna de uta wo utai nagara, tabete imasu. Totemo tanoshii desu!', es: 'Todos están comiendo mientras cantan. ¡Es muy divertido!' } },
      { type: 'narration', hidden: true },

      { type: 'character', id: 'rina', file: 'rina_derecha.png', position: 'center-left' },

      { type: 'character', id: 'nicorasu', file: 'nicorasu_contento_derecha.png', position: 'center-left-left' },
      { type: 'bubble', target: 'nicorasu', position: 'tl-n', text: { jp: 'この　うた　は　すごい　です　ね！', en: 'Kono uta wa sugoi desu ne!', es: '¡Esta canción es increíble!' } },
      { type: 'bubble', target: 'nicorasu', hidden: true },

      { type: 'character', id: 'mango', file: 'mango-chulo.png', position: 'left' },
      { type: 'bubble', target: 'mango', text: { jp: 'はい！　うた　は　いい　です　ね。　フルーツサラダ　も　おいしい　です！', en: 'Hai! Uta wa ii desu ne. Furuutsu sarada mo oishii desu!', es: '¡Sí! Las canciones están bien. ¡La ensalada de frutas también está rica!' } },
      { type: 'bubble', target: 'mango', hidden: true },

      { type: 'character', id: 'asahi', file: 'asahi.png', position: 'center-right' },
      { type: 'bubble', target: 'asahi', position: 'center-right', text: { jp: 'この　ところ　は　おもしろい　です　ね！　わたし　は　とても　たのしい　です！', en: 'Kono tokoro wa omoshiroi desu ne! Watashi wa totemo tanoshii desu!', es: '¡Este lugar es interesante! ¡Me estoy divirtiendo mucho!' } },
      { type: 'bubble', target: 'asahi', hidden: true },

      { type: 'character', id: 'camero', file: 'camero.png', position: 'center-right-right' },
      { type: 'bubble', target: 'camero', position: 'right', text: { jp: 'すみません！　おそく　なりました！', en: 'Sumimasen! Osoku narimashita!', es: '¡Lo siento! ¡Se me hizo tarde!' } },
      { type: 'bubble', target: 'camero', hidden: true },

      { type: 'bubble', target: 'rina', tremble: true, position: 'rina', text: { jp: 'あのう...　わたし　も　うたって　いい　です　か。', en: 'Anou... watashi mo utatte ii desu ka.', es: 'Esto... ¿yo también puedo cantar?' } },
      { type: 'bubble', target: 'rina', hidden: true },

      { type: 'character', id: 'komori', file: 'komori.png', position: 'center' },
      { type: 'bubble', target: 'komori', text: { jp: 'わたし　の　ストーリー　は　おわりました。　ありがとうございました。　また　ね！', en: 'Watashi no sutoorii wa owarimashita. Arigatou gozaimashita. Mata ne!', es: 'Mi historia terminó. Muchas gracias. ¡Nos vemos!' } },
    ],
  },

  // ===== CIERRE =====
  {
    id: 'closing',
    background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' },
    elements: [
      { type: 'closing-logo', file: 'logo.png' },
      { type: 'closing-title', text: '終わり' },
      { type: 'closing-sub', text: 'Fin' },
    ],
  },

];
