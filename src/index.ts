import { GameEngine } from './game/gameEngine';
import { CANVAS_DEFAULTS } from './game/systems/system_defaults';

const canvas = document.createElement('canvas');
const game = new GameEngine(canvas);

window.addEventListener("DOMContentLoaded", () => {
  canvas.width = CANVAS_DEFAULTS.width;
  canvas.height = CANVAS_DEFAULTS.height;

  document.querySelector('#app')!.appendChild(canvas);

  canvas.setAttribute('tabindex', "0");
  canvas.focus();
  
  game.init();
  game.run();
});