import './Logotype.sass';

import Control from '../Control/Control';
import Anchor from '../Button/Anchor';

interface ILogotype {
  node: HTMLAnchorElement;
  blockTop: Control;
  blockBottom: Control;
}

export default class Logotype extends Anchor implements ILogotype {
  node!: HTMLAnchorElement;

  blockTop: Control;

  blockBottom: Control;

  constructor(parentNode: HTMLElement, data?: { href?: string }) {
    super(parentNode, 'logotype', data);

    this.blockTop = new Control({
      parentNode: this.node,
      tagName: 'span',
      className: 'logotype__block-top',
      content: 'match',
    });

    this.blockBottom = new Control({
      parentNode: this.node,
      tagName: 'span',
      className: 'logotype__block-bottom',
      content: 'match',
    });
  }
}
