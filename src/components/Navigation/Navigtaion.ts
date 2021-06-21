import './Navigation.sass';

import Control from '../Control/Control';
import Anchor, { IAnchorSettings } from '../Button/Anchor';

interface INavigation {
  items: Anchor[];
}

export default class Navigation extends Control implements INavigation {
  items: Anchor[];

  constructor(parentNode: HTMLElement, className: string, inputsSettings: IAnchorSettings[]) {
    super({ parentNode, className: `navigation ${className}`, tagName: 'nav' });

    this.items = [];

    inputsSettings.forEach((inputSetting) => {
      this.items.push(
        new Anchor(this.node, `navigation__item ${className}__item`, inputSetting.data, inputSetting.options),
      );
    });
  }
}
