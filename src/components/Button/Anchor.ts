import AnchorButton, { IAnchorButton, ButtonTypes, ButtonModifiers } from './AnchorButton';

export interface IAnchor extends IAnchorButton {
  node: HTMLAnchorElement;
}

export interface IAnchorSettings extends IAnchorButton {
  data: { value?: string; href?: string };
}

export default class Anchor extends AnchorButton implements IAnchor {
  node!: HTMLAnchorElement;

  constructor(
    parentNode: HTMLElement,
    className: string,
    data?: { value?: string; href?: string },
    options?: { type?: ButtonTypes; modifier?: ButtonModifiers },
    onClick?: () => void,
  ) {
    const defaultData = { href: '#', ...data };

    super(parentNode, 'a', `button ${className}`, defaultData, options);

    if (data && data.href) this.setHref(data.href);

    if (onClick) this.node.addEventListener('click', onClick);
  }

  setHref(newHref: string): void {
    this.node.href = newHref;
    this.state.setState('href', newHref);
  }
}
