const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const NAME = { X: 'krzyżyk', O: 'kółko' };
const cells = [...document.querySelectorAll('#board button')];
let board, turn, me, two, over;

cells.forEach((c, i) => c.onclick = () => play(i));

function start(sym) {
  two = document.getElementById('two').checked;
  me = sym;
  turn = two ? sym : 'X';           // z komputerem zawsze zaczyna krzyżyk
  board = Array(9).fill('');
  document.getElementById('menu').hidden = true;
  document.getElementById('game').hidden = false;
  update();
  if (!two && turn !== me) setTimeout(computer, 500);
}

function winner() {
  const l = LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  return l && board[l[0]];
}

function update() {
  const w = winner(), full = !board.includes('');
  over = !!w || full;
  cells.forEach((c, i) => {
    c.textContent = board[i];
    c.disabled = over || !!board[i] || (!two && turn !== me);
  });
  document.getElementById('status').textContent =
    w ? 'Koniec gry. Wygrywa ' + NAME[w] + '!' :
    full ? 'Koniec gry. Remis.' :
    'Ruch: ' + NAME[turn] + (two ? '' : turn === me ? ' (Ty)' : ' (komputer)');
}

function play(i) {
  board[i] = turn;
  turn = turn === 'X' ? 'O' : 'X';
  update();
  if (!two && !over && turn !== me) setTimeout(computer, 500);
}

function computer() {
  // pole, w którym dany znak kończy linię
  const find = s => {
    for (const l of LINES) {
      const empty = l.find(i => !board[i]);
      if (l.filter(i => board[i] === s).length === 2 && empty !== undefined) return empty;
    }
  };
  const free = board.map((v, i) => v ? -1 : i).filter(i => i >= 0);
  play(find(turn) ?? find(me) ?? (board[4] ? null : 4) ?? free[Math.floor(Math.random() * free.length)]);
}
