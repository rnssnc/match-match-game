import './GameScreen.sass';

import Control from '../../Control/Control';
import Screen from '../Screen';
import Database, { DatabaseRecord } from '../../Database/Database';
import Timer from '../../Timer/Timer';
import Game from '../../Game/Game';
import GameSettings from '../../GameSettings/GameSettings';
import FinalScorePopup from '../../Popup/FinalScorePopup/FinalScorePopup';
import Header from '../../Header/Header';

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
  finalScorePopup: FinalScorePopup;
  header: Header;
};

export default class GameScreen extends Screen {
  timer!: Timer;

  game!: Game;

  gameSettings!: GameSettings;

  currentUser!: DatabaseRecord;

  descriptionContent!: Control;

  timerMessage!: Control;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      id: 'game-screen',
      className: 'game-screen',
      database: options.database,
      finalScorePopup: options.finalScorePopup,
      header: options.header,
    });

    // if (!this.database.currentUser) {
    //   alert('You need to register first :) Sorry I didn`t have enought time for nice popup');
    //   return;
    // }

    this.header.startGameButton.hide();
    this.header.stopGameButton.show();

    this.descriptionContent = new Control({
      parentNode: this.node,
      className: 'game_-description-content',
    });

    this.timer = new Timer(this.descriptionContent.node, 'game-timer');

    this.timerMessage = new Control({
      parentNode: this.descriptionContent.node,
      className: 'timer__countdown-message',
      content:
        'You have 30 seconds to keep cards in mind. Click on field earlier if you are ready.',
    });

    this.gameSettings = new GameSettings();

    this.currentUser = this.database.currentUser;

    this.game = new Game({
      parentNode: this.node,
      className: 'game',
      gameSettings: this.gameSettings,
      timer: this.timer,
      winCallback: (stats) => {
        this.currentUser.score = stats.score;

        this.database.put(this.currentUser).then(() => this.finalScorePopup.display(stats));
      },
      startCallback: () => {
        this.timerMessage.node.classList.add('timer-message--hidden');
      },
    });
  }
}
