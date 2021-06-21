import './Field.sass';

import _ from 'lodash';

import Control from '../Control/Control';
import Card, { Options as CardOptions } from '../Card/Card';

type Options = {
  parentNode: HTMLElement;
  className: string;
  fieldSize: {
    columns: number;
    rows: number;
  };
};

export default class Field extends Control {
  cards: Card[];

  fieldCardsCount: number;

  requiredCardsCount: number;

  size: {
    columns: number;
    rows: number;
  };

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: options.className });

    this.cards = [];

    this.size = options.fieldSize;
    this.fieldCardsCount = this.size.columns * this.size.rows;
    this.requiredCardsCount = this.fieldCardsCount / 2;
  }

  loadCards(frontSrc: string, backPath: string): Promise<void> {
    return new Promise((resolve) => {
      fetch(backPath)
        .then((response) => response.json())
        .then((data) => {
          let parsedCardBacks = JSON.parse(data);

          if (parsedCardBacks.length < this.requiredCardsCount) {
            const repeatCards = parsedCardBacks.slice(
              0,
              this.requiredCardsCount - parsedCardBacks.length,
            );

            parsedCardBacks = _.concat(parsedCardBacks, repeatCards);
          }

          const uniqueCards = _.shuffle(parsedCardBacks).slice(0, this.requiredCardsCount);

          const cardBacks = [...uniqueCards, ...uniqueCards];

          this.addCards(cardBacks, frontSrc);

          resolve();
        });
    });
  }

  private addCards(cardBacks: string[], frontSrc: string): void {
    _.shuffle(cardBacks).forEach((backSrc) => {
      this.addCard({
        parentNode: this.node,
        backSrc,
        className: 'card',
        frontSrc,
      });
    });
  }

  private addCard(cardOptions: CardOptions): void {
    const options = { ...cardOptions, parentNode: this.node };

    const card = new Card(options);
    card.node.style.width = `calc(100% / ${this.size.columns})`;

    this.cards.push(card);
  }

  async flipAll(): Promise<void> {
    await this.cards.forEach((card) => card.showBack());
  }

  async unFlipAll(): Promise<void> {
    await this.cards.forEach((card) => card.showFront());
  }
}
