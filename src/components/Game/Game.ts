import Control from '../Control/Control';
import Field from '../Field/Field';
import GameSettings from '../GameSettings/GameSettings';
import { TGameSettings } from '../GameSettings/DefaultGameSettingsContants';
import Timer from '../Timer/Timer';
import Card from '../Card/Card';

const PREVIEW_DELAY_MS = 30000;

interface IGame {
  field: Field;
  gameSettings: GameSettings;
  start(): void;
}

type Options = {
  parentNode: HTMLElement;
  className: string;
  gameSettings: GameSettings;
  timer: Timer;
  winCallback: (GameStats: GameStats) => void;
  startCallback?: () => void;
};

export type GameStats = {
  seconds: number;
  comparisons: number;
  incorrectComparisons: number;
  score: number;
};

export default class Game extends Control implements IGame {
  field: Field;

  gameSettings: GameSettings;

  timer: Timer;

  activeCard!: Card | null;

  comparisons = 0;

  incorrectComparisons = 0;

  winCallback: (GameStats: GameStats) => void;

  startCallback?: () => void;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: options.className });

    this.gameSettings = options.gameSettings;

    this.winCallback = options.winCallback;

    if (options.startCallback) this.startCallback = options.startCallback;

    this.timer = options.timer;

    this.field = new Field({
      parentNode: this.node,
      className: 'game-field',
      fieldSize: (this.gameSettings.settings as TGameSettings).fieldSize.size,
    });

    this.field
      .loadCards(
        (this.gameSettings.settings as TGameSettings).cardPattern.srcPath,
        (this.gameSettings.settings as TGameSettings).cardTheme.jsonPath,
      )
      .then(() => {
        this.field.node.addEventListener('click', this.skipDelay, { once: true });

        this.field.cards.forEach((card) => {
          card.node.addEventListener('click', () => this.cardComparer(card));
        });

        this.displayPreview();
      });
  }

  private skipDelay = (): void => {
    this.timer.seconds = -1;
  };

  private win(): void {
    this.timer.pause();

    let score = (this.comparisons - this.incorrectComparisons) * 100 - this.timer.seconds * 10;
    if (score < 0) score = 0;

    this.winCallback({
      seconds: this.timer.seconds,
      comparisons: this.comparisons,
      incorrectComparisons: this.incorrectComparisons,
      score,
    });
  }

  displayPreview(): void {
    this.field.flipAll().then(() => {
      this.timer.start(-PREVIEW_DELAY_MS, () => {
        this.start();
      });
    });
  }

  start(): void {
    this.field.node.removeEventListener('click', this.skipDelay);

    this.field.unFlipAll();

    if (this.startCallback) this.startCallback();
  }

  private isWin(): boolean {
    return this.field.cards.every((fieldCard) => fieldCard.state.data?.isCorrect === true);
  }

  private async cardComparer(card: Card): Promise<void> {
    if (!this.activeCard) {
      card.showBack();
      this.activeCard = card;
    } else {
      this.field.node.style.pointerEvents = 'none';

      await card.showBack();

      this.comparisons += 1;

      if (this.activeCard.backSrc !== card.backSrc) {
        Promise.all([this.activeCard.setIncorrect(), card.setIncorrect()]).then(() => {
          this.activeCard?.showFront();

          card.showFront().then(() => {
            this.incorrectComparisons += 1;

            this.field.node.style.pointerEvents = '';
            this.activeCard = null;
          });
        });
      }
      if (this.activeCard.backSrc === card.backSrc) {
        this.activeCard.setCorrect();
        card.setCorrect();

        if (this.isWin()) this.win();

        this.field.node.style.pointerEvents = '';
        this.activeCard = null;
      }
    }
  }
}
