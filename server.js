'use strict';
// ごきぶりポーカー サーバー（手札はサーバーだけが持ち、本人にだけ送る）
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const TYPES = ['cockroach', 'rat', 'bat', 'fly', 'toad', 'spider', 'scorpion', 'stinkbug'];
const JP = { cockroach: 'ゴキブリ', rat: 'ネズミ', bat: 'コウモリ', fly: 'ハエ', toad: 'カエル', spider: 'クモ', scorpion: 'サソリ', stinkbug: 'カメムシ' };
const MAX_SAME = 4; // 同じ種類がこの枚数そろうと負け
const rooms = new Map();

const rnd = (n) => crypto.randomInt(n);
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeCode() {
  let c;
  do c = String(1000 + rnd(9000)); while (rooms.has(c));
  return c;
}

function newRoom() {
  return { code: makeCode(), players: [], phase: 'lobby', turn: 0, offer: null, last: null, loser: null, reason: '', log: [] };
}

function startGame(room) {
  const deck = [];
  TYPES.forEach((t) => { for (let i = 0; i < 8; i++) deck.push(t); });
  shuffle(deck);
  const n = room.players.length;
  const each = Math.floor(deck.length / n);
  room.players.forEach((p, i) => {
    p.hand = deck.slice(i * each, (i + 1) * each);
    p.pile = [];
  });
  room.removed = deck.length - each * n; // 割り切れない分は使わない
  room.phase = 'turn';
  room.turn = rnd(n);
  room.offer = null;
  room.last = null;
  room.loser = null;
  room.reason = '';
  room.log = [`ゲーム開始！ ${each}枚ずつ配りました。最初は ${room.players[room.turn].name} さん`];
}

function checkLoss(p) {
  const counts = {};
  p.pile.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  const four = Object.keys(counts).find((t) => counts[t] >= MAX_SAME);
  if (four) return { type: 'same', creature: four };
  if (Object.keys(counts).length >= TYPES.length) return { type: 'all' };
  return null;
}

function endGame(room, idx, reason) {
  room.phase = 'over';
  room.loser = idx;
  room.reason = reason;
  room.log.push(`ゲーム終了：${room.players[idx].name} さんの負け（${reason}）`);
}

function view(room, me) {
  const o = room.offer;
  const v = {
    t: 'state',
    room: room.code,
    phase: room.phase,
    me: me,
    host: room.players[0] && room.players[0].token === room.players[me].token,
    turn: room.turn,
    removed: room.removed || 0,
    log: room.log.slice(-6),
    last: room.last,
    loser: room.loser,
    reason: room.reason,
    players: room.players.map((p, i) => ({
      name: p.name,
      online: !!p.ws,
      handCount: p.hand ? p.hand.length : 0,
      pile: p.pile || [],
      seen: o ? o.seen.includes(i) : false,
    })),
    hand: room.players[me].hand || [],
  };
  if (o) {
    v.offer = { from: o.from, to: o.to, claim: o.claim, peeked: o.peeked, guess: o.guess };
    // 見られるのは、いま渡されて「のぞいた」本人だけ
    if (o.peeked && o.to === me) v.offer.card = o.card;
  }
  return v;
}

function send(ws, obj) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
}
function broadcast(room) {
  room.players.forEach((p, i) => send(p.ws, view(room, i)));
}

function resolveGuess(room, guess) {
  const o = room.offer;
  const guesser = room.players[o.to];
  const giver = room.players[o.from];
  const truth = o.card === o.claim;
  const correct = guess === truth;
  const taker = correct ? o.from : o.to;
  const takerP = room.players[taker];
  takerP.pile.push(o.card);
  room.last = {
    card: o.card, claim: o.claim, guess, truth, correct, giver: o.from, guesser: o.to, taker,
  };
  room.log.push(
    `${giver.name}「${JP[o.claim]}」→ ${guesser.name}「${guess ? 'ホント' : 'ウソ'}」… ` +
    `${truth ? '本当' : 'ウソ'}だった！ ${takerP.name} さんが引き取り`
  );
  room.offer = null;
  room.turn = taker;
  const loss = checkLoss(takerP);
  if (loss) {
    return endGame(room, taker, loss.type === 'same' ? `同じ種類が${MAX_SAME}枚` : '8種類そろった');
  }
  room.phase = 'turn';
  if (takerP.hand.length === 0) endGame(room, taker, '手札がなくなった');
}

function handle(room, idx, msg) {
  const p = room.players[idx];
  const n = room.players.length;
  const validTarget = (t, exclude) => Number.isInteger(t) && t >= 0 && t < n && !exclude.includes(t);
  const validType = (c) => TYPES.includes(c);

  switch (msg.t) {
    case 'start':
      if (idx !== 0 || room.phase !== 'lobby' || n < 2) return;
      return startGame(room);
    case 'rematch':
      if (idx !== 0 || room.phase !== 'over') return;
      return startGame(room);
    case 'offer': { // 手札から1枚選んで渡す
      if (room.phase !== 'turn' || room.turn !== idx) return;
      const ci = msg.card;
      if (!Number.isInteger(ci) || ci < 0 || ci >= p.hand.length) return;
      if (!validTarget(msg.to, [idx]) || !validType(msg.claim)) return;
      const [card] = p.hand.splice(ci, 1);
      room.offer = { from: idx, to: msg.to, claim: msg.claim, card, seen: [idx], peeked: false };
      room.phase = 'offered';
      room.log.push(`${p.name} → ${room.players[msg.to].name}：「これは${JP[msg.claim]}です」`);
      return;
    }
    case 'guess': { // ホント／ウソで答える
      const o = room.offer;
      if (room.phase !== 'offered' || !o || o.to !== idx || typeof msg.guess !== 'boolean') return;
      o.guess = msg.guess; // 答えは出したが、まだめくらない
      room.phase = 'reveal';
      room.log.push(`${p.name}：「${msg.guess ? 'ホント' : 'ウソ'}」と答えた… めくります`);
      return;
    }
    case 'reveal': { // 答えた人がめくる
      const o = room.offer;
      if (room.phase !== 'reveal' || !o || o.to !== idx) return;
      return resolveGuess(room, o.guess);
    }
    case 'peek': { // こっそり見る（まだ見ていない相手が残っているときだけ）
      const o = room.offer;
      if (room.phase !== 'offered' || !o || o.to !== idx || o.peeked) return;
      const rest = room.players.map((_, i) => i).filter((i) => i !== idx && !o.seen.includes(i));
      if (rest.length === 0) return;
      o.peeked = true;
      return;
    }
    case 'pass': { // 見たあと、別の人へ回す
      const o = room.offer;
      if (room.phase !== 'offered' || !o || o.to !== idx || !o.peeked) return;
      const seen = o.seen.concat(idx);
      if (!validTarget(msg.to, seen) || !validType(msg.claim)) return;
      o.seen = seen;
      o.from = idx;
      o.to = msg.to;
      o.claim = msg.claim;
      o.peeked = false;
      room.log.push(`${p.name} → ${room.players[msg.to].name}：「これは${JP[msg.claim]}です」（回し）`);
      return;
    }
  }
}

// ---------- HTTP（画面ファイルの配信） ----------
const PUBLIC = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const file = path.join(PUBLIC, url === '/' ? 'index.html' : url);
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

// ---------- WebSocket ----------
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  let room = null;
  let token = null;
  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.t === 'create' || msg.t === 'join') {
      const name = String(msg.name || '').trim().slice(0, 8) || 'ななし';
      if (msg.t === 'create') {
        room = newRoom();
        rooms.set(room.code, room);
      } else {
        room = rooms.get(String(msg.room));
        if (!room) return send(ws, { t: 'error', text: '部屋が見つかりません' });
        // 再接続（トークン一致）
        const back = room.players.find((p) => p.token === msg.token);
        if (back) {
          back.ws = ws; token = back.token;
          return broadcast(room), send(ws, { t: 'joined', token });
        }
        if (room.phase !== 'lobby') return send(ws, { t: 'error', text: 'ゲームはすでに始まっています' });
        if (room.players.length >= 6) return send(ws, { t: 'error', text: '満員です（最大6人）' });
      }
      token = crypto.randomUUID();
      room.players.push({ token, name, ws, hand: [], pile: [] });
      send(ws, { t: 'joined', token });
      return broadcast(room);
    }
    if (!room) return;
    const idx = room.players.findIndex((p) => p.token === token);
    if (idx < 0) return;
    handle(room, idx, msg);
    broadcast(room);
  });
  ws.on('close', () => {
    if (!room) return;
    const p = room.players.find((x) => x.token === token);
    if (p && p.ws === ws) p.ws = null;
    if (room.phase === 'lobby') {
      // ロビーでは抜けた人を外す
      room.players = room.players.filter((x) => x.ws);
      if (room.players.length === 0) return rooms.delete(room.code);
    } else if (room.players.every((x) => !x.ws)) {
      return rooms.delete(room.code);
    }
    broadcast(room);
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`ごきぶりポーカー http://localhost:${port}`));
}
module.exports = { server, rooms };
