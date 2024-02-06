import Game from "./Game";

export default class Board {
  private domBoard: Element;
  private game: Game;

  constructor(domBoard: Element, game: Game) {
    this.domBoard = domBoard;
    this.game = game;
  }

  public setCells(cells: string[][]) {
    this.domBoard.innerHTML =
      /*html*/
      `
    <table>
        <tr><td pos='0,0'></td><td pos='0,1'></td><td pos='0,2'></td></tr>
        <tr><td pos='1,0'></td><td pos='1,1'></td><td pos='1,2'></td></tr>
        <tr><td pos='2,0'></td><td pos='2,1'></td><td pos='2,2'></td></tr>
    </table>
    `;

    const domTds = this.domBoard.querySelectorAll("td");
    domTds.forEach((dom) => {
      const attr = dom.getAttribute("pos");
      const pos = attr!.split(",");
      const row = parseInt(pos![0]);
      const col = parseInt(pos![1]);
      dom.innerHTML = cells[row][col];
      dom.addEventListener("click", () => {
        this.game.clickBoard(row, col);
      });
    });
  }
}
