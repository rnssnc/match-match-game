import './Screen.sass';

import Control from '../Control/Control';

export interface IScreen {
  readonly HIDE_CLASSNAME: string;

  showScreen(): void;
  hideScreen(): void;
}

export default class Screen extends Control implements IScreen {
  readonly HIDE_CLASSNAME = 'screen--hidden';

  id!: string;

  constructor(parentNode: HTMLElement, className?: string, id?: string) {
    super({ parentNode, tagName: 'section', className: `${className} screen` });

    if (id) this.id = id;

    this.hideScreen();
  }

  showScreen(): void {
    this.node.classList.remove(this.HIDE_CLASSNAME);
  }

  hideScreen(): void {
    this.node.classList.add(this.HIDE_CLASSNAME);
  }

  removeScreen(): void {
    this.hideScreen();
    this.node.addEventListener('transitionend', this.handleTransitionEnd);
  }

  handleTransitionEnd = (e: TransitionEvent): void => {
    if (e.propertyName === 'opacity') this.node.remove();
    this.node.removeEventListener('transitionend', this.handleTransitionEnd);
  };
}
