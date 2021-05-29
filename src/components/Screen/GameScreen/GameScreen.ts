import './GameScreen.sass';

import Control from '../../Control/Control';
import Screen from '../Screen';
import Database, { DatabaseRecord } from '../../Database/Database';
import Timer from '../../Timer/Timer';
import Game from '../../Game/Game';
import GameSettings from '../../GameSettings/GameSettings';
import FinalScorePopup from '../../Popup/FinalScorePopup/FinalScorePopup';

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
  finalScorePopup: FinalScorePopup;
};

export default class GameScreen extends Screen {
  timer!: Timer;

  game!: Game;

  gameSettings!: GameSettings;

  currentUser!: DatabaseRecord;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      id: 'game-screen',
      className: 'game-screen',
      database: options.database,
      finalScorePopup: options.finalScorePopup,
    });

    if (!this.database.currentUser) {
      alert('You need to register first :) Sorry I didn`t have enought time for nice popup');
      return;
    }
    this.timer = new Timer(this.node, 'game-timer');

    this.gameSettings = new GameSettings();

    this.currentUser = this.database.currentUser;

    this.game = new Game({
      parentNode: this.node,
      className: 'game',
      gameSettings: this.gameSettings,
      timer: this.timer,
      winCallback: (stats) => {
        this.currentUser.score = stats.score;

        this.database.put(this.currentUser).then(() => this.finalScorePopup.show(stats));
      },
    });
  }
}
