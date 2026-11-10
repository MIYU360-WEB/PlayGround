const palette = {
  hair: [
    { name: 'Ébano', color: '#28212b' }, { name: 'Prata', color: '#c4c6cf' },
    { name: 'Auburn', color: '#9b5143' }, { name: 'Lunar', color: '#8098b8' },
    { name: 'Rosa', color: '#c582a6' }
  ],
  eyes: [
    { name: 'Safira', color: '#71a9df' }, { name: 'Esmeralda', color: '#77c5a5' },
    { name: 'Âmbar', color: '#e5b960' }, { name: 'Ametista', color: '#bb9ce8' }
  ],
  outfit: [
    { name: 'Noturno', color: '#34314b' }, { name: 'Vinho', color: '#70404f' },
    { name: 'Floresta', color: '#34584f' }, { name: 'Marfim', color: '#938a75' }
  ]
};
const defaults = { name: 'Aventureiro', hair: 0, eyes: 0, outfit: 0 };
let character = { ...defaults, ...(JSON.parse(localStorage.getItem('asteria-character') || '{}')) };
let game = JSON.parse(localStorage.getItem('asteria-game') || 'null') || {
  node: 'arrival', cycle: 1, health: 100, mana: 35, memories: [], flags: {}, finished: false
};
let toastTimer;
const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem('asteria-character', JSON.stringify(character));
  localStorage.setItem('asteria-game', JSON.stringify(game));
}
function showToast(message) {
  const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function renderAvatar() {
  const hair = palette.hair[character.hair] || palette.hair[0];
  const eye = palette.eyes[character.eyes] || palette.eyes[0];
  const outfit = palette.outfit[character.outfit] || palette.outfit[0];
  document.documentElement.style.setProperty('--outfit', outfit.color);
  $('avatar').innerHTML = `<svg viewBox="0 0 160 190" role="img" aria-label="Retrato de ${escapeHTML(character.name)}">
    <ellipse cx="80" cy="180" rx="41" ry="6" fill="#090b12" opacity=".55"/>
    <path d="M37 178 Q42 133 55 119 L105 119 Q119 137 124 178Z" fill="${outfit.color}" stroke="#b6a2d0" stroke-opacity=".32" stroke-width="2"/>
    <path d="M49 138 Q36 152 29 177 L48 179 66 147Z" fill="${shade(outfit.color,-18)}"/><path d="M111 138 Q126 151 132 177 L113 179 96 147Z" fill="${shade(outfit.color,-18)}"/>
    <path d="M58 120 L80 143 102 120 96 115 64 115Z" fill="#ded0c2" opacity=".9"/><path d="M78 141l-5 23 10 0-3-23" fill="#d5b66f"/>
    <path d="M54 68 Q48 34 80 31 Q113 32 107 75 L104 111 Q98 129 80 132 Q61 127 55 108Z" fill="${hair.color}"/>
    <path d="M54 73 Q47 49 59 34 Q71 21 91 28 Q116 32 111 65 Q100 52 96 43 Q81 57 61 54Z" fill="${hair.color}"/>
    <path d="M58 61 Q48 89 58 112 Q47 102 46 78Z" fill="${hair.color}"/><path d="M103 54 Q117 82 106 111 Q121 97 117 68Z" fill="${hair.color}"/>
    <ellipse cx="80" cy="78" rx="24" ry="30" fill="#edc9ad"/><path d="M57 69 Q62 48 78 46 Q96 46 103 63 Q90 58 82 52 Q72 66 57 69Z" fill="${hair.color}"/>
    <path d="M65 77 Q70 74 75 77" fill="none" stroke="#68514b" stroke-width="2" stroke-linecap="round"/><path d="M86 77 Q91 74 96 77" fill="none" stroke="#68514b" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="71" cy="82" rx="3" ry="2.3" fill="${eye.color}"/><ellipse cx="90" cy="82" rx="3" ry="2.3" fill="${eye.color}"/><circle cx="72" cy="82" r="1" fill="#1d1b25"/><circle cx="91" cy="82" r="1" fill="#1d1b25"/>
    <path d="M79 83 Q77 90 81 91" fill="none" stroke="#bd927f" stroke-width="1.2"/><path d="M75 99 Q80 102 85 99" fill="none" stroke="#a96870" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M60 113 Q80 124 100 113 L102 122 Q80 136 58 122Z" fill="${outfit.color}"/><circle cx="80" cy="144" r="3" fill="#e2c47e"/>
  </svg>`;
}
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  return `#${[n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, v + amount)).toString(16).padStart(2, '0')).join('')}`;
}
function escapeHTML(text) { return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function makeSwatches(type) {
  const container = $(`${type}-swatches`);
  container.innerHTML = palette[type].map((item, index) => `<button class="swatch ${index === character[type] ? 'selected' : ''}" type="button" title="${item.name}" aria-label="${item.name}" aria-pressed="${index === character[type]}" style="background:${item.color}" data-type="${type}" data-index="${index}"></button>`).join('');
  container.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    character[type] = Number(button.dataset.index); $(`${type === 'hair' ? 'hair' : type === 'eyes' ? 'eye' : 'outfit'}-name`).textContent = palette[type][character[type]].name;
    makeSwatches(type); renderAvatar(); save();
  }));
}

const story = {
  arrival: {
    chapter: '01 / 04', location: 'VILA DE LÚMEN', time: 'CREPÚSCULO', title: 'Uma noite<br>fora do tempo',
    description: 'O sino da vila toca treze vezes. No alto da colina, uma luz azul corta o céu — e algo dentro de você reconhece aquele presságio.',
    speaker: 'Uma voz no vento', caption: 'SUSSURRO', icon: '✧', dialogue: '“Quando a estrela cair, não siga a luz. Procure a pessoa que não projeta sombra.” A voz desaparece antes que você consiga responder.',
    choices: [
      { text: 'Seguir a luz azul até a colina', next: 'hill', effect: { health: -38, flag: 'followedLight' }, note: 'A luz azul não é um guia. Ela se alimenta de quem a segue.' },
      { text: 'Procurar quem não tem sombra', next: 'market', effect: { mana: 12, flag: 'noticedShadow' }, note: 'Uma figura sem sombra foi vista perto do mercado.' }
    ]
  },
  hill: {
    chapter: '01 / 04', location: 'COLINA DO SINO', time: 'NOITE', title: 'A luz que<br>devora',
    description: 'A estrela paira sobre a colina, pulsando como um coração. O ar fica pesado. Você sente a realidade se desfazendo nas bordas.',
    speaker: '???', caption: 'PRESENÇA', icon: '◉', dialogue: 'A luz se abre como um olho. No instante antes de tudo escurecer, você ouve seu próprio nome — dito por alguém que ainda não conhece.',
    choices: [
      { text: 'Tocar a estrela caída', next: 'market', effect: { health: -100, memory: 'A estrela azul apaga a vida de quem a toca.' }, note: 'O toque da estrela encerra o ciclo — mas agora você conhece o perigo.' },
      { text: 'Recuar e buscar abrigo', next: 'market', effect: { health: -8, flag: 'sawStar' }, note: 'A luz não pode ser enfrentada de perto.' }
    ]
  },
  market: {
    chapter: '02 / 04', location: 'MERCADO DE LÚMEN', time: 'NOITE PROFUNDA', title: 'A garota<br>das lanternas',
    description: 'Entre barracas fechadas, uma jovem de capa clara tenta reacender uma fileira de lanternas. Ela não projeta sombra alguma.',
    speaker: 'Mira', caption: 'VIAJANTE', icon: '❋', dialogue: '“Você também ouviu o sino?” Mira olha para você com um sorriso cansado. “A vila inteira esquece o que acontece depois da décima terceira badalada.”',
    choices: [
      { text: 'Contar a Mira sobre a estrela azul', next: 'forest', effect: { flag: 'trustedMira', mana: 10, memory: 'Mira acredita em você. A estrela aparece antes de cada desaparecimento.' }, note: 'Mira revela uma trilha segura até a floresta.' },
      { text: 'Perguntar por que ela não tem sombra', next: 'forest', effect: { flag: 'askedShadow', mana: 16, memory: 'Mira perdeu a sombra ao salvar alguém na floresta.' }, note: 'A sombra de Mira foi levada pelo guardião da floresta.' }
    ]
  },
  forest: {
    chapter: '03 / 04', location: 'FLORESTA DE VIDRO', time: 'ANTES DA ALVORADA', title: 'O guardião<br>dos ecos',
    description: 'Árvores translúcidas sussurram lembranças que não são suas. No centro da clareira, uma criatura feita de raízes bloqueia o caminho.',
    speaker: 'Guardião', caption: 'ESPÍRITO ANTIGO', icon: '♧', dialogue: '“Uma vida por uma sombra”, rosna a criatura. Mira aperta uma lanterna contra o peito. Há uma runa brilhando na raiz central.',
    choices: [
      { text: 'Usar a runa que você se lembra de ter visto', next: 'tower', effect: { mana: -12, flag: 'usedRune', memory: 'A runa antiga quebra o pacto sem ferir o guardião.' }, note: 'A criatura cede passagem. A sombra de Mira retorna.' },
      { text: 'Oferecer sua própria sombra em troca', next: 'tower', effect: { health: -18, flag: 'offeredShadow', mana: 14, memory: 'O guardião aceita seu sacrifício — por enquanto.' }, note: 'Mira jura que encontrará uma forma de devolver o que você perdeu.' }
    ]
  },
  tower: {
    chapter: '04 / 04', location: 'TORRE DO AMANHECER', time: 'PRIMEIRA LUZ', title: 'O último<br>badalar',
    description: 'No alto da torre, a estrela azul se revela: um cristal rachado preso ao sino. A décima terceira badalada está prestes a soar.',
    speaker: 'Mira', caption: 'AO SEU LADO', icon: '❋', dialogue: '“Não precisamos vencer a noite”, diz Mira. “Só precisamos escolher o que ela vai lembrar.” O sino começa a vibrar.',
    choices: [
      { text: 'Confiar na memória e quebrar o cristal', next: 'ending-good', effect: { mana: -10, memory: 'O cristal é a origem do ciclo. Sua memória é a chave.' }, note: 'Você reuniu fragmentos suficientes para mudar o destino.' },
      { text: 'Pedir a Mira que toque o sino', next: 'ending-bittersweet', effect: { health: -8, flag: 'miraRangBell', memory: 'Mira pode tocar o sino sem perder a própria sombra.' }, note: 'Uma escolha corajosa muda a canção da vila.' }
    ]
  },
  'ending-good': {
    chapter: 'FIM / 04', location: 'VILA DE LÚMEN', time: 'AMANHECER', title: 'Um amanhã<br>escolhido',
    description: 'O cristal se parte. Pela primeira vez em cem anos, o sino toca doze vezes. As lanternas se acendem — e cada pessoa se lembra.',
    speaker: 'Mira', caption: 'UM NOVO DIA', icon: '✦', dialogue: '“Você voltou por nós”, diz Mira, enquanto o sol nasce sobre Lúmen. A noite não foi apagada. Ela finalmente pôde terminar.',
    choices: [{ text: 'Celebrar o amanhecer com Mira', next: 'epilogue', effect: { flag: 'savedVillage' } }], ending: true
  },
  'ending-bittersweet': {
    chapter: 'FIM / 04', location: 'VILA DE LÚMEN', time: 'AMANHECER', title: 'A canção<br>que ficou',
    description: 'Mira toca o sino. O cristal se aquieta, e o ciclo termina. A vila desperta em paz — mas você percebe que algumas lembranças se foram junto com a noite.',
    speaker: 'Mira', caption: 'UM NOVO DIA', icon: '❋', dialogue: '“Talvez não precisemos lembrar de tudo”, ela diz. Pela primeira vez, a sombra de Mira acompanha seus passos.',
    choices: [{ text: 'Começar uma nova jornada', next: 'epilogue', effect: { flag: 'savedVillage' } }], ending: true
  },
  epilogue: {
    chapter: 'EPÍLOGO', location: 'ESTRADA DO NORTE', time: 'MANHÃ', title: 'O mundo<br>continua',
    description: 'A estrada para o norte se abre diante de vocês. Em algum lugar distante, um sino responde ao vento.',
    speaker: 'Mira', caption: 'COMPANHEIRA', icon: '❋', dialogue: '“Desta vez, vamos descobrir o que existe depois do horizonte.” Sua história em Astéria continua quando você estiver pronto.',
    choices: [{ text: 'Recomeçar do primeiro ciclo', next: 'arrival', effect: { reset: true } }], ending: true
  }
};

function remember(text) {
  if (!text || game.memories.includes(text)) return;
  game.memories.push(text);
  showToast('✦ Uma memória sobreviveu ao ciclo');
}
function takeChoice(choice) {
  const effect = choice.effect || {};
  if (effect.reset) { restartStory(false); return; }
  if (effect.health) game.health = Math.max(0, Math.min(100, game.health + effect.health));
  if (effect.mana) game.mana = Math.max(0, Math.min(100, game.mana + effect.mana));
  if (effect.flag) game.flags[effect.flag] = true;
  remember(effect.memory);
  if (game.health <= 0) {
    game.cycle += 1; game.health = 100; game.mana = Math.min(100, game.mana + 15);
    game.node = 'market'; game.flags.followedLight = false;
    remember('O ciclo recomeçou. O caminho da luz azul leva à morte; procure Mira no mercado.');
    showToast('↺ O ciclo recomeçou — sua memória permaneceu');
  } else {
    game.node = choice.next;
    if (choice.note && effect.memory) showToast('✦ Fragmento registrado no diário');
    if (story[game.node]?.ending) game.finished = true;
  }
  save(); render();
}
function restartStory(confirmFirst = true) {
  if (confirmFirst && !window.confirm('Recomeçar a história? Sua personagem e as memórias descobertas serão mantidas.')) return;
  game = { node: 'arrival', cycle: game.cycle + 1, health: 100, mana: 35, memories: game.memories, flags: {}, finished: false };
  save(); render(); showToast('↺ Um novo ciclo começa');
}
function renderJournal() {
  const entries = [
    ['01', 'A estrela azul', 'A luz que aparece antes do sino.', game.memories.some(x => x.toLowerCase().includes('estrela')) || game.flags.sawStar],
    ['02', 'A garota sem sombra', 'Mira guarda uma verdade da floresta.', game.flags.noticedShadow || game.flags.askedShadow || game.flags.trustedMira],
    ['03', 'A runa esquecida', 'O guardião pode ser vencido sem violência.', game.flags.usedRune || game.flags.offeredShadow],
    ['04', 'O fim do ciclo', 'O cristal e o sino estão conectados.', game.flags.savedVillage || game.node === 'tower' || game.node.startsWith('ending') || game.node === 'epilogue']
  ];
  $('journal-list').innerHTML = entries.map(([num,title,desc,unlocked]) => `<div class="journal-entry ${unlocked?'unlocked':''}"><span class="entry-mark">${unlocked?'✓':num}</span><div class="entry-copy"><b>${title}</b><small>${unlocked?desc:'Fragmento ainda desconhecido'}</small></div></div>`).join('');
  const count = entries.filter(entry => entry[3]).length;
  const percent = Math.round(count / entries.length * 100);
  $('progress-label').textContent = `${percent}%`; $('progress-bar').style.width = `${percent}%`;
}
function render() {
  const node = story[game.node] || story.arrival;
  $('scene-location').textContent = node.location; $('header-location').textContent = node.location.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  $('scene-time').textContent = node.time; $('chapter-number').innerHTML = node.chapter.split(' / ')[0] + ` <i>/ ${node.chapter.split(' / ')[1] || '04'}</i>`;
  $('scene-title').innerHTML = node.title; $('scene-description').textContent = node.description;
  $('speaker-name').textContent = node.speaker; $('speaker-caption').textContent = node.caption; $('speaker-icon').textContent = node.icon;
  $('dialogue').textContent = node.dialogue; $('cycle-count').textContent = String(game.cycle).padStart(2,'0');
  $('memory-count').textContent = game.memories.length;
  $('health-value').textContent = game.health; $('mana-value').textContent = game.mana;
  $('health-meter').style.width = `${game.health}%`; $('mana-meter').style.width = `${game.mana}%`;
  $('scene-status').textContent = game.finished ? 'Um destino foi transformado' : game.cycle > 1 ? 'As memórias atravessam o ciclo' : 'O destino aguarda sua escolha';
  $('status-hint').textContent = game.memories.length ? 'Você se lembra do que outros esqueceram.' : 'Toda escolha deixa um eco.';
  $('choice-list').innerHTML = node.choices.map((choice,index) => `<button class="choice-button" type="button" data-choice="${index}"><span class="choice-key">${String.fromCharCode(65+index)}</span><span class="choice-text">${choice.text}</span><span class="choice-arrow">›</span></button>`).join('');
  $('choice-list').querySelectorAll('button').forEach(button => button.addEventListener('click', () => takeChoice(node.choices[Number(button.dataset.choice)])));
  const latest = game.memories[game.memories.length - 1];
  const note = $('memory-note');
  if (latest) { note.hidden = false; note.querySelector('p').textContent = latest; } else note.hidden = true;
  $('hero-name').value = character.name;
  $('hair-name').textContent = palette.hair[character.hair]?.name || palette.hair[0].name;
  $('eye-name').textContent = palette.eyes[character.eyes]?.name || palette.eyes[0].name;
  $('outfit-name').textContent = palette.outfit[character.outfit]?.name || palette.outfit[0].name;
  renderAvatar(); renderJournal(); save();
}

$('hero-name').addEventListener('input', event => { character.name = event.target.value.trim() || 'Aventureiro'; renderAvatar(); save(); });
$('restart-button').addEventListener('click', () => restartStory(true));
$('sound-toggle').addEventListener('click', event => {
  event.currentTarget.classList.toggle('sound-off');
  showToast(event.currentTarget.classList.contains('sound-off') ? '♪ Som ambiente desativado' : '♫ Som ambiente ativado');
});
makeSwatches('hair'); makeSwatches('eyes'); makeSwatches('outfit'); render();
