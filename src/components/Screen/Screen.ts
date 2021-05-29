import './Screen.sass';

import Control from '../Control/Control';
import Database from '../Database/Database';
import FinalScorePopup from '../Popup/FinalScorePopup/FinalScorePopup';

export interface IScreen {
  readonly HIDE_CLASSNAME: string;

  showScreen(): void;
  hideScreen(): void;
}

type Options = {
  parentNode: HTMLElement;
  className?: string;
  id?: string;
  database?: Database;
  finalScorePopup?: FinalScorePopup;
};
export default class Screen extends Control implements IScreen {
  readonly HIDE_CLASSNAME = 'screen--hidden';

  id!: string;

  database!: Database;

  finalScorePopup!: FinalScorePopup;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      tagName: 'section',
      className: `${options.className} section screen`,
    });

    if (options.database) this.database = options.database;

    if (options.finalScorePopup) this.finalScorePopup = options.finalScorePopup;

    if (options.id) this.id = options.id;

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
