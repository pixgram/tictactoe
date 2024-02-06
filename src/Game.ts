import Board from "./Board";
import History, { HistoryData } from "./History";

export default class Game {
  private board?: Board; //board에 ? 이 붙으면서 board 필드에는 Board나 undefined를 담을 수 있다는 의미
  private bTurnX = false;
  private history?: History;
  private restoreHistoryIndex = -1;

  private cells = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  constructor(domApp: Element) {
    domApp.innerHTML =
      /*html*/
      `
    <div class="app-left">
        <div class="next-player"></div>
        <div class="board"></div>
    </div>
    <div class="app-right">
        <div class="history"></div>
    </div>
    `;

    const domBoard = document.querySelector(".board");
    if (domBoard) {
      this.board = new Board(domBoard, this);
      this.board.setCells(this.cells);
    }

    this.nextPlay();

    const domHistory = document.querySelector(".history");
    if (domHistory) {
      this.history = new History(domHistory, this);
      this.addCurrentStateIntoHistory("Go to game start");
    }
  }

  private addCurrentStateIntoHistory(title = "") {
    const cellsCopy = structuredClone(this.cells);

    if (this.restoreHistoryIndex !== -1) {
      this.history!.removeFromIndex(this.restoreHistoryIndex);
      this.restoreHistoryIndex = -1;
    }

    this.history!.add({
      title,
      bTurnX: this.bTurnX,
      cells: cellsCopy,
    });
  }

  private checkWinner(): String | null {
    const cells = this.cells.flat();
    const lines = [
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
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }

    return null;
  }

  public clickBoard(row: number, col: number) {
    if (this.cells[row][col] !== "") return;
    this.cells[row][col] = this.bTurnX ? "X" : "O";
    this.board?.setCells(this.cells);

    this.nextPlay();
    this.addCurrentStateIntoHistory();
  }

  private setNextPlayerMessage() {
    const domNextPlayer = document.querySelector(".next-player");
    if (domNextPlayer) {
      const winner = this.checkWinner();
      if (winner === null) {
        domNextPlayer.innerHTML = `Next player: ${this.bTurnX ? "X" : "O"}`;
      } else {
        domNextPlayer.innerHTML = `Winner: ${winner}`;
      }
    }
  }

  private nextPlay() {
    this.bTurnX = !this.bTurnX;

    this.setNextPlayerMessage();
  }

  public restore(data: HistoryData, historyIndex: number) {
    const cellsCopy = structuredClone(data.cells);
    this.cells = cellsCopy;
    this.bTurnX = data.bTurnX;
    this.board?.setCells(this.cells);
    this.restoreHistoryIndex = historyIndex;

    this.setNextPlayerMessage();
  }
}
