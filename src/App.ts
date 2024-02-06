import Game from "./Game";

export default class App {
  constructor() {
    const domApp = document.querySelector("#app");

    if (domApp) {
      new Game(domApp);
    }
  }
}
