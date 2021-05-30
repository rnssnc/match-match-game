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

  cardsLength: number;

  size: {
    columns: number;
    rows: number;
  };

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: options.className });

    this.cards = [];

    this.size = options.fieldSize;
    this.cardsLength = this.size.columns * this.size.rows;
  }

  loadCards(frontSrc: string, backPath: string): Promise<void> {
    return new Promise((resolve) => {
      fetch(backPath)
        .then((response) => response.json())
        .then((data) => {
          let cardBacks = JSON.parse(data);

          if (cardBacks.length < this.cardsLength / 2) {
            const repeatCards = cardBacks.slice(0, this.cardsLength / 2 - cardBacks.length);

            cardBacks = _.concat(cardBacks, repeatCards);
          }

          const uniqueCards = _.shuffle(cardBacks).slice(0, this.cardsLength / 2);

          const cards = [...uniqueCards, ...uniqueCards];
          _.shuffle(cards).forEach((backSrc) => {
            this.addCard({
              parentNode: this.node,
              backSrc,
              className: 'card',
              frontSrc,
            });
          });

          resolve();
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
