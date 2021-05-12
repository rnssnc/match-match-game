import './Button.sass';

import Control from '../Control/Control';

export enum ButtonTypes {
  text = 'text',
  ghost = 'ghost',
  filled = 'filled',
}

export enum ButtonModifiers {
  disabled = 'disabled',
  icon = 'icon',
}

export interface IAnchorButton {
  options: {
    type?: ButtonTypes;
    modifier?: ButtonModifiers;
    icon?: string;
  };
}

export default class AnchorButton extends Control implements IAnchorButton {
  options: { type?: ButtonTypes; modifier?: ButtonModifiers; icon?: string };

  icon: Control | undefined;

  static buttonTypes = ButtonTypes;

  static buttonModifiers = ButtonModifiers;

  constructor(
    parentNode: HTMLElement,
    tagName: string,
    className: string,
    data?: { value?: string },
    options?: { type?: ButtonTypes; modifier?: ButtonModifiers; icon?: string },
  ) {
    let cName = className;
    if (options && options.type) cName += ` button-${options.type}`;
    if (options && options.modifier) cName += ` button--${options.modifier}`;

    super({
      parentNode,
      tagName,
      className: cName,
      content: data?.value,
    });

    if (options && options.icon) this.setIcon(options.icon);

    this.options = { ...options };
  }

  setValue(newValue: string): void {
    this.node.innerText = newValue;
    // if (this.icon) this.setIcon(this.state.getState('icon'));
    this.state.setState('value', newValue);
  }

  setIcon(icon: string): void {
    this.icon = new Control({
      parentNode: this.node,
      tagName: 'span',
      className: `button__icon icon-${icon}`,
    });
    this.state.setState('icon', icon);
  }
}
