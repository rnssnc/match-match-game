import './Popup.sass';

import Control from '../Control/Control';

interface IPopup {
  name: string;
  popup: Control;

  hidePopup(e: Event): void;
  showPopup(): void;
}

export default class Popup extends Control implements IPopup {
  popup: Control;

  name: string;

  constructor(name: string) {
    super({ parentNode: document.body, className: `${name}-popup__wrapper popup__wrapper` });
    this.render();

    this.name = name;
    this.popup = new Control({ parentNode: this.node, className: `${name}-popup popup` });

    this.state.setState('isOpen', false);
    this.node.addEventListener('mousedown', (e: Event) => {
      if (e.target === this.node) this.hidePopup();
    });
  }

  hidePopup = (): void => {
    this.node.classList.remove('active');
    this.state.setState('isOpen', false);
  };

  showPopup = (): void => {
    this.node.classList.add('active');
    this.state.setState('isOpen', true);
  };
}
