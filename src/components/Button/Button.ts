import AnchorButton, { IAnchorButton, ButtonTypes, ButtonModifiers } from './AnchorButton';

interface IButton extends IAnchorButton {
  node: HTMLButtonElement;
  onClick: () => void;
}

type Options = {
  parentNode: HTMLElement;
  className: string;
  onClick?: () => void;
  data?: { value: string };
  options?: { type?: ButtonTypes; modifier?: ButtonModifiers };
};

export default class Button extends AnchorButton implements IButton {
  node!: HTMLButtonElement;

  onClick!: () => void;

  constructor(options: Options) {
    super(options.parentNode, 'button', `button ${options.className}`, options.data, options.options);

    if (options.onClick instanceof Function) {
      this.onClick = options.onClick;
      this.node.addEventListener('click', this.onClick);
    }
  }
}
