// カードの絵（オリジナル）。黒い荒れた縁、色つきの背景、悪そうな目つき。
(function () {
  const NAMES = { cockroach: 'ゴキブリ', rat: 'ネズミ', bat: 'コウモリ', fly: 'ハエ', toad: 'カエル', spider: 'クモ', scorpion: 'サソリ', stinkbug: 'カメムシ' };
  // 背景の色（上, 下）
  const BG = {
    cockroach: ['#f08a3c', '#a8431a'],
    rat: ['#c8b27a', '#6e5a35'],
    bat: ['#9a8fe0', '#2f2a6b'],
    fly: ['#7fd6d9', '#1f6f7a'],
    toad: ['#d8e04a', '#5f7a14'],
    spider: ['#b9bcc4', '#3d4150'],
    scorpion: ['#a9c2a0', '#3f5a45'],
    stinkbug: ['#d98fb0', '#6a2748'],
  };
  const INK = '#15110f';

  // 悪そうな目（光る・半目）
  const eye = (x, y, r, c) =>
    `<g><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}" fill="${c || '#ffe36b'}" stroke="${INK}" stroke-width="1.6"/>` +
    `<ellipse cx="${x}" cy="${y + r * 0.1}" rx="${r * 0.28}" ry="${r * 0.6}" fill="${INK}"/>` +
    `<path d="M${x - r - 1} ${y - r * 0.2} Q${x} ${y - r * 1.5} ${x + r + 1} ${y - r * 0.2} L${x + r + 1} ${y - r * 0.9} L${x - r - 1} ${y - r * 0.9}Z" fill="${INK}"/></g>`;

  const ART = {
    cockroach: () => `
      <path d="M50 38 C34 18 24 24 18 8" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M52 38 C68 16 78 22 86 6" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <g stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M34 66 L14 56 L8 74"/><path d="M33 80 L10 86 L6 104"/><path d="M36 94 L18 112 L22 124"/>
        <path d="M66 66 L86 56 L92 74"/><path d="M67 80 L90 86 L94 104"/><path d="M64 94 L82 112 L78 124"/></g>
      <ellipse cx="50" cy="86" rx="25" ry="38" fill="#6b2b12" stroke="${INK}" stroke-width="3"/>
      <path d="M50 52 L50 122" stroke="${INK}" stroke-width="2.4"/>
      <path d="M32 64 Q42 58 50 60 Q58 58 68 64" fill="#9a4a22" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="38" cy="86" rx="8" ry="26" fill="#ffffff22"/>
      <ellipse cx="50" cy="50" rx="15" ry="14" fill="#7d3517" stroke="${INK}" stroke-width="3"/>
      ${eye(44, 49, 4.2)}${eye(56, 49, 4.2)}
      <path d="M43 58 Q50 63 57 58" fill="none" stroke="${INK}" stroke-width="2"/>`,

    rat: () => `
      <path d="M78 118 C100 120 100 90 90 80" fill="none" stroke="#d9a0a0" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="46" cy="104" rx="30" ry="24" fill="#7a6339" stroke="${INK}" stroke-width="3"/>
      <circle cx="24" cy="44" r="13" fill="#7a6339" stroke="${INK}" stroke-width="3"/><circle cx="24" cy="44" r="7" fill="#d9a0a0"/>
      <circle cx="68" cy="44" r="13" fill="#7a6339" stroke="${INK}" stroke-width="3"/><circle cx="68" cy="44" r="7" fill="#d9a0a0"/>
      <path d="M26 56 C26 40 66 40 66 56 C70 74 58 92 46 98 C34 92 22 74 26 56Z" fill="#8b7344" stroke="${INK}" stroke-width="3"/>
      ${eye(37, 62, 5, '#ff6a5a')}${eye(55, 62, 5, '#ff6a5a')}
      <path d="M40 80 L46 90 L52 80 Q46 74 40 80Z" fill="#d9a0a0" stroke="${INK}" stroke-width="2"/>
      <path d="M45 90 L45 96 M47 90 L47 96" stroke="#fff" stroke-width="2.4"/>
      <g stroke="${INK}" stroke-width="1.6" stroke-linecap="round"><path d="M38 82 L12 76"/><path d="M38 85 L12 90"/><path d="M54 82 L80 76"/><path d="M54 85 L80 90"/></g>`,

    bat: () => `
      <path d="M50 70 C40 40 20 30 2 40 L14 52 L8 66 L24 66 L26 82 L38 76 L44 90Z" fill="#3b3478" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 70 C60 40 80 30 98 40 L86 52 L92 66 L76 66 L74 82 L62 76 L56 90Z" fill="#3b3478" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 48 L36 24 L48 38Z M60 48 L64 24 L52 38Z" fill="#2a2557" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="50" cy="66" rx="17" ry="26" fill="#4a418f" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="50" cy="52" rx="14" ry="13" fill="#5a50a8" stroke="${INK}" stroke-width="3"/>
      ${eye(44, 50, 3.6, '#ff8a8a')}${eye(56, 50, 3.6, '#ff8a8a')}
      <path d="M43 59 Q50 64 57 59" fill="#15110f" stroke="${INK}" stroke-width="1.6"/>
      <path d="M45 60 L46.5 66 L48 60Z M52 60 L53.5 66 L55 60Z" fill="#fff" stroke="${INK}" stroke-width="1"/>`,

    fly: () => `
      <ellipse cx="25" cy="64" rx="17" ry="30" transform="rotate(-28 25 64)" fill="#e6fbff" fill-opacity=".65" stroke="${INK}" stroke-width="2.6"/>
      <ellipse cx="75" cy="64" rx="17" ry="30" transform="rotate(28 75 64)" fill="#e6fbff" fill-opacity=".65" stroke="${INK}" stroke-width="2.6"/>
      <g stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M40 84 L24 96 L28 112"/><path d="M60 84 L76 96 L72 112"/><path d="M42 94 L30 118"/><path d="M58 94 L70 118"/></g>
      <ellipse cx="50" cy="94" rx="15" ry="26" fill="#2c3a3d" stroke="${INK}" stroke-width="3"/>
      <path d="M38 88 Q50 82 62 88 M37 102 Q50 96 63 102" stroke="#6fa3ad" stroke-width="2" fill="none"/>
      <ellipse cx="50" cy="60" rx="21" ry="19" fill="#3a4a4d" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="39" cy="55" rx="11" ry="13" fill="#c0392b" stroke="${INK}" stroke-width="2.6"/>
      <ellipse cx="61" cy="55" rx="11" ry="13" fill="#c0392b" stroke="${INK}" stroke-width="2.6"/>
      <g fill="#ff9a8a"><circle cx="36" cy="51" r="2.2"/><circle cx="42" cy="58" r="2.2"/><circle cx="58" cy="51" r="2.2"/><circle cx="64" cy="58" r="2.2"/></g>
      <path d="M44 72 L50 82 L56 72Z" fill="#15110f"/>`,

    toad: () => `
      <ellipse cx="50" cy="92" rx="43" ry="36" fill="#7e9a1a" stroke="${INK}" stroke-width="3.4"/>
      <ellipse cx="50" cy="104" rx="30" ry="22" fill="#b8cc47" fill-opacity=".7"/>
      <circle cx="27" cy="50" r="15" fill="#8aa91f" stroke="${INK}" stroke-width="3.2"/><circle cx="73" cy="50" r="15" fill="#8aa91f" stroke="${INK}" stroke-width="3.2"/>
      ${eye(27, 50, 8, '#fff06a')}${eye(73, 50, 8, '#fff06a')}
      <path d="M12 86 Q50 122 88 86" fill="#2a3308" stroke="${INK}" stroke-width="3.2"/>
      <path d="M20 92 L26 100 L32 94 L38 102 L44 95 L50 103 L56 95 L62 102 L68 94 L74 100 L80 92" fill="none" stroke="#f3f3c2" stroke-width="2.2"/>
      <g fill="#566d0f" stroke="${INK}" stroke-width="1.6"><circle cx="30" cy="76" r="3.4"/><circle cx="68" cy="74" r="3"/><circle cx="50" cy="68" r="2.6"/><circle cx="84" cy="96" r="2.8"/></g>
      <circle cx="46" cy="80" r="1.8" fill="${INK}"/><circle cx="54" cy="80" r="1.8" fill="${INK}"/>`,

    spider: () => `
      <g stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M42 68 L16 40 L4 56"/><path d="M40 78 L8 70 L2 90"/><path d="M40 90 L8 98 L6 122"/><path d="M44 100 L22 130 L26 138"/>
        <path d="M58 68 L84 40 L96 56"/><path d="M60 78 L92 70 L98 90"/><path d="M60 90 L92 98 L94 122"/><path d="M56 100 L78 130 L74 138"/></g>
      <ellipse cx="50" cy="104" rx="22" ry="27" fill="#2b2b36" stroke="${INK}" stroke-width="3"/>
      <path d="M50 88 L42 104 L50 120 L58 104Z" fill="#c0392b" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="50" cy="66" rx="16" ry="15" fill="#3a3a47" stroke="${INK}" stroke-width="3"/>
      ${eye(42, 62, 3.4, '#ff6a5a')}${eye(58, 62, 3.4, '#ff6a5a')}
      <circle cx="46" cy="70" r="2" fill="#ff6a5a"/><circle cx="54" cy="70" r="2" fill="#ff6a5a"/>
      <path d="M44 76 L46 82 M56 76 L54 82" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,

    scorpion: () => `
      <path d="M50 112 C54 136 90 128 87 102 C85 90 90 84 87 76" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
      <path d="M50 112 C54 136 90 128 87 102 C85 90 90 84 87 76" fill="none" stroke="#7f9c82" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M87 76 L82 62 L94 66Z" fill="#c0392b" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <g stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M38 84 L16 90"/><path d="M38 96 L18 108"/><path d="M42 106 L28 124"/><path d="M62 84 L80 90"/><path d="M62 96 L78 106"/></g>
      <path d="M40 70 L26 56" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M60 70 L74 56" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <path d="M26 56 C8 52 8 28 18 24 C20 34 26 36 32 34 C30 42 32 50 26 56Z" fill="#8aa38a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M74 56 C92 52 92 28 82 24 C80 34 74 36 68 34 C70 42 68 50 74 56Z" fill="#8aa38a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="50" cy="92" rx="17" ry="24" fill="#9db89d" stroke="${INK}" stroke-width="3"/>
      <path d="M36 84 Q50 80 64 84 M35 96 Q50 92 65 96 M37 108 Q50 104 63 108" fill="none" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="50" cy="64" rx="14" ry="12" fill="#adc8ad" stroke="${INK}" stroke-width="3"/>
      ${eye(44, 63, 3.4, '#ff6a5a')}${eye(56, 63, 3.4, '#ff6a5a')}
      <path d="M44 71 Q50 75 56 71" fill="none" stroke="${INK}" stroke-width="2"/>`,

    stinkbug: () => `
      <g stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M46 36 Q38 16 30 14"/><path d="M54 36 Q62 16 70 14"/>
        <path d="M26 72 L8 66 L4 82"/><path d="M26 90 L6 96 L8 112"/><path d="M30 106 L16 124"/>
        <path d="M74 72 L92 66 L96 82"/><path d="M74 90 L94 96 L92 112"/><path d="M70 106 L84 124"/></g>
      <path d="M50 44 C74 44 90 56 86 84 C82 112 66 128 50 130 C34 128 18 112 14 84 C10 56 26 44 50 44Z" fill="#6f8a2a" stroke="${INK}" stroke-width="3.4"/>
      <path d="M50 60 L50 128 M50 60 L26 74 M50 60 L74 74" fill="none" stroke="${INK}" stroke-width="2.4"/>
      <path d="M50 64 L34 84 L50 104 L66 84Z" fill="#a7c24a" fill-opacity=".6" stroke="${INK}" stroke-width="2"/>
      <path d="M30 50 L50 36 L70 50 Q50 62 30 50Z" fill="#4e6320" stroke="${INK}" stroke-width="3"/>
      ${eye(41, 48, 3.8, '#ffb347')}${eye(59, 48, 3.8, '#ffb347')}
      <g fill="#c8d96a" stroke="${INK}" stroke-width="1.4"><circle cx="38" cy="100" r="3"/><circle cx="62" cy="100" r="3"/><circle cx="50" cy="112" r="3"/></g>
      <path d="M44 22 q-6 -8 0 -14 M56 22 q6 -8 0 -14" fill="none" stroke="#9bd04a" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  };

  const DEFS = `<defs>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0"/></filter>
  </defs>`;

  function cardSVG(type) {
    const [c1, c2] = BG[type];
    return `<svg class="card-svg" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${NAMES[type]}">${DEFS}
      <linearGradient id="g-${type}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <rect x="1" y="1" width="98" height="138" rx="9" fill="${INK}" filter="url(#rough)"/>
      <rect x="6" y="6" width="88" height="128" rx="5" fill="url(#g-${type})" filter="url(#rough)"/>
      <rect x="6" y="6" width="88" height="128" rx="5" filter="url(#grain)"/>
      <g transform="translate(0,-4) scale(1)">${ART[type]()}</g>
      <path d="M10 126 L90 124 L88 134 L12 135Z" fill="${INK}" opacity=".86"/>
      <text x="50" y="132.2" text-anchor="middle" font-size="8.5" font-weight="800" fill="#f4ead2" font-family="'Hiragino Sans','Noto Sans JP',sans-serif" letter-spacing="1">${NAMES[type]}</text>
    </svg>`;
  }

  function cardBack() {
    return `<svg class="card-svg" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="裏向きのカード">${DEFS}
      <rect x="1" y="1" width="98" height="138" rx="9" fill="${INK}" filter="url(#rough)"/>
      <rect x="6" y="6" width="88" height="128" rx="5" fill="#2e6f6a" filter="url(#rough)"/>
      <rect x="6" y="6" width="88" height="128" rx="5" filter="url(#grain)"/>
      <g stroke="#e0a45c" stroke-width="1.6" fill="none" opacity=".85"><rect x="14" y="14" width="72" height="112" rx="4"/>
        <path d="M14 70 L50 14 L86 70 L50 126Z"/></g>
      <g transform="translate(50 70)"><circle r="14" fill="${INK}"/><text y="7" text-anchor="middle" font-size="19">🪳</text></g>
    </svg>`;
  }

  window.CARDS = { NAMES, cardSVG, cardBack };
})();
