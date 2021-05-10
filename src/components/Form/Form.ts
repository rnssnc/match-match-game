import Control from '../Control/Control';
import Input, { InputSettings } from '../Input/Input';
import Button from '../Button/Button';
import { ButtonTypes } from '../Button/AnchorButton';

export interface IForm {
  node: HTMLFormElement;
  inputsWrapper: Control;
  buttonsWrapper: Control;
  inputs: Input[];
  onSubmit?: () => void;
  disableSubmit?: () => void;
}

type Options = {
  parentNode: HTMLElement;
  className: string;
  inputs?: Record<string, unknown>[];
  onSubmit?: () => void;
};

export default class Form extends Control implements IForm {
  node!: HTMLFormElement;

  inputsWrapper: Control;

  buttonsWrapper: Control;

  submitButton: Button;

  cancelButton: Button;

  inputs!: Input[];

  onSubmit!: () => void;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, tagName: 'form', className: options.className });
    this.node.classList.add('form');

    this.inputsWrapper = new Control({
      parentNode: this.node,
      className: `${options.className}__inputs-wrapper`,
    });

    this.inputs = [];
    if (options.inputs) {
      options.inputs.forEach((inputSettings) => {
        this.addInput(inputSettings as InputSettings);
      });
    }

    this.buttonsWrapper = new Control({
      parentNode: this.node,
      className: `${options.className}__buttons-wrapper`,
    });

    this.submitButton = new Button({
      parentNode: this.buttonsWrapper.node,
      className: `${options.className}__submit-button`,
      data: { value: 'Submit' },
      options: { type: ButtonTypes.filled },
    });

    this.cancelButton = new Button({
      parentNode: this.buttonsWrapper.node,
      className: `${options.className}__submit-button`,
      data: { value: 'cancel' },
      options: { type: ButtonTypes.filled },
    });

    if (options.onSubmit) {
      this.onSubmit = options.onSubmit;
      this.node.addEventListener('submit', this.onSubmit);
    }
  }

  addInput(inputSettings: InputSettings): void {
    const input = new Input(
      this.inputsWrapper.node,
      `${inputSettings.className}`,
      inputSettings.attributes,
      inputSettings.label,
      inputSettings.onValidate,
    );

    input.node.addEventListener('newInput', (e: Event) => {
      const isValid = (<CustomEvent>e).detail;
      if (!isValid) this.disableSubmit();
    });

    this.inputs.push(input);
  }

  disableSubmit(): void {
    console.log(this);
    console.log('sheeesh');
  }
}
