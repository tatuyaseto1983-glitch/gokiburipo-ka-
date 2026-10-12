// 3人で最後まで通す動作確認: node test.js
const assert = require('assert');
const WebSocket = require('ws');
const { server } = require('./server');

function client(port) {
  const ws = new WebSocket(`ws://localhost:${port}`);
  const c = { ws, state: null, waiters: [] };
  ws.on('message', (d) => {
    const m = JSON.parse(d);
    if (m.t === 'state') { c.state = m; c.waiters.splice(0).forEach((f) => f()); }
  });
  c.send = (o) => ws.send(JSON.stringify(o));
  c.wait = (pred) => new Promise((res) => {
    const chk = () => (c.state && pred(c.state)) ? res(c.state) : c.waiters.push(chk);
    chk();
  });
  c.open = new Promise((r) => ws.on('open', r));
  return c;
}

server.listen(0, async () => {
  const port = server.address().port;
  const [a, b, d] = [client(port), client(port), client(port)];
  await Promise.all([a.open, b.open, d.open]);
  a.send({ t: 'create', name: 'A' });
  const room = (await a.wait((s) => s.room)).room;
  b.send({ t: 'join', room, name: 'B' });
  d.send({ t: 'join', room, name: 'C' });
  await d.wait((s) => s.players.length === 3);
  a.send({ t: 'start' });
  const all = [a, b, d];
  await Promise.all(all.map((x) => x.wait((s) => s.phase === 'turn')));
  assert.strictEqual(a.state.hand.length, 21);
  assert(!JSON.stringify(a.state).includes(JSON.stringify(b.state.hand)), '他人の手札が漏れている');

  for (let round = 0; round < 200; round++) {
    const s = a.state;
    if (s.phase === 'over') break;
    const cur = all[s.turn];
    cur.send({ t: 'offer', card: 0, to: (s.turn + 1) % 3, claim: 'rat' });
    const tgt = all[(s.turn + 1) % 3];
    await tgt.wait((x) => x.phase === 'offered');
    if (round % 2) { // 見て回す
      tgt.send({ t: 'peek' });
      const seen = await tgt.wait((x) => x.offer && x.offer.peeked);
      assert(seen.offer.card, '見た本人にはカードが見えるはず');
      const third = all.find((_, i) => i !== s.turn && i !== (s.turn + 1) % 3);
      const other = all.indexOf(third);
      assert(!third.state.offer.card, '関係ない人にカードが見えている');
      tgt.send({ t: 'pass', to: other, claim: 'bat' });
      await third.wait((x) => x.offer && x.offer.to === other && !x.offer.peeked && x.offer.claim === 'bat');
      third.send({ t: 'guess', guess: true });
    } else tgt.send({ t: 'guess', guess: false });
    await Promise.all(all.map((x) => x.wait((st) => st.phase !== 'offered')));
    await new Promise((r) => setTimeout(r, 5));
  }
  assert.strictEqual(a.state.phase, 'over');
  console.log('OK: ゲーム終了', a.state.players[a.state.loser].name, a.state.reason);
  process.exit(0);
});
