import { useState } from 'react';

/*コンポーネント: Square、、Boardおよびは、Game三目並べゲームのさまざまな側面を管理します。
１．Squareコンポーネント：個々の四角形ボタン
２．Boardコンポーネント：マス目のレンダリングやゲームステータスなどボード管理
３．Gameコンポーネント：ボードの履歴や現在の状態など、ゲームの状態を調整
状態管理:useStateフックはゲームの状態と履歴を管理します。
ゲームロジック:calculateWinnerボードの状態に基づいて勝者が存在するかどうかを決定。
各コンポーネントと関数は、ゲームの状態を維持し、UI を更新し、ゲームの結果を確認する上で重要な役割を果たし、React を使用した機能的でインタラクティブな三目並べゲームを実現します。*/




//個々の四角形ボタンを表している
//シンプルなボタンをレンダリングし、クリック時に親コンポーネントで指定された onSquareClick 関数を実行します。ボタンの中には value で指定された内容が表示
//レンダリング（Rendering）とは、コンピュータのプログラムにおいて、特定のデータや状態をもとに、最終的にユーザーが見ることができる形式（通常は画面上の表示）に変換
function Square({ value, onSquareClick }) {　//X,Oまたはnullを表示　onSquareClick: マスがクリックされたときに実行される関数
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

//マス目のレンダリングやゲームステータスなどゲームボード全体を管理
//各マス目を Square コンポーネントで描画し、クリック時の挙動を handleClick で管理します。また、現在のゲームの状態を status として表示
function Board({ xIsNext, squares, onPlay }) {　
  //xIsNext: 現在次に打つプレイヤーが 'X' かどうかを示すブール値、squares: ボードの現在の状態を表す配列、onPlay: プレイヤーがマスをクリックしてゲームが進行するときに実行されるコールバック関数
  function handleClick(i) {　//handleClick(i): ユーザーがボード上の任意のマスをクリックしたときに実行されます。マスがすでに埋まっている場合やゲームが既に勝者が決まっている場合は何もしません。そうでない場合、onPlay を通じて次の状態を更新
    //四角形のクリックを処理するロジック
   
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
//ボードとステータスをレンダリングするためのその他のコード
  const winner = calculateWinner(squares); // //calculateWinner(squares): 現在のボード状態から勝者がいるかどうかを判断
  let status; //status: 勝者がいる場合はそのプレイヤーを表示し、そうでない場合は次のプレイヤーを表示
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//ボードの履歴や現在の状態など、ゲームの状態を調整
//Board コンポーネントをレンダリングし、ゲームの全体的な状態管理を行います。プレイヤーがクリックするたびに handlePlay が呼ばれ、新しいゲームの状態が更新されます。また、過去の手番にジャンプする機能を・・・・
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //history: 移動の履歴を表すボード状態の配列.初期値は全てのマスが null の配列
  const [currentMove, setCurrentMove] = useState(0); //currentMove: 現在表示されているボードのインデックス
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  //ゲーム履歴と現在の手を更新するロジック
  function handlePlay(nextSquares) { //handlePlay(nextSquares): プレイヤーがマスをクリックしたときに呼ばれ、ゲームの履歴と現在の手番を更新
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  //歴史の特定の動きにジャンプするロジック
  function jumpTo(nextMove) { //jumpTo(nextMove): 履歴内の特定の動きへジャンプ
    setCurrentMove(nextMove);
  }

  //動きのリストをレンダリングする
  const moves = history.map((squares, move) => { //moves: 配列をマップして、過去の各手番にジャンプするボタンのリストを生成
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // ゲーム全体をレンダリングするために JSX を返します
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//三目並べボードに勝者がいるかどうかを確認
function calculateWinner(squares) { //squares- 現在のボードの状態を表す配列
  const lines = [　// 各行・列・対角線が同じ記号で埋まっている場合、その記号を返して勝者を判定
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
