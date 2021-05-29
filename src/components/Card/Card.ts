import './Card.sass';

import Control from '../Control/Control';

export type Options = {
  parentNode: HTMLElement;
  className: string;
  frontSrc: string;
  backSrc: string;
};

const INCORRECT_DELAY = 400;

enum CLASSES {
  flipped = 'card--flipped',
  correct = 'card--correct',
  incorrect = 'card--incorrect',
}

export default class Card extends Control {
  card: Control;

  cardFront: Control;

  cardBack: Control;

  backSrc: string;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: 'card-wrapper' });

    this.card = new Control({ parentNode: this.node, className: 'card' });

    this.cardFront = new Control({ parentNode: this.card.node, className: 'card__front' });
    this.cardFront.node.style.backgroundImage = `url(${options.frontSrc})`;

    this.backSrc = options.backSrc;

    this.cardBack = new Control({ parentNode: this.card.node, className: 'card__back' });
    this.cardBack.node.style.backgroundImage = `url(${this.backSrc})`;

    this.state.setState('isFlipped', false);
    this.state.setState('isCorrect', false);
  }

  setIncorrect(): Promise<void> {
    return new Promise((resolve) => {
      this.node.classList.add(CLASSES.incorrect);

      setTimeout(() => {
        this.node.classList.remove(CLASSES.incorrect);
        resolve();
      }, INCORRECT_DELAY);
    });
  }

  setCorrect(): void {
    this.node.classList.add(CLASSES.correct);
    this.state.setState('isCorrect', true);
  }

  showFront = (): Promise<void> => this.flip(true);

  showBack = (): Promise<void> => this.flip(false);

  private flip(isFront = false): Promise<void> {
    return new Promise((resolve) => {
      this.node.classList.toggle(CLASSES.flipped, !isFront);

      this.state.setState('isFlipped', isFront);

      this.node.addEventListener('transitionend', () => resolve(), { once: true });
    });
  }
}
