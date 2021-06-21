import Control from '../Control/Control';
import Input, { InputSettings } from '../Input/Input';
import Button from '../Button/Button';
import { ButtonModifiers, ButtonTypes } from '../Button/AnchorButton';

export interface IForm {
  node: HTMLFormElement;
  inputsWrapper: Control;
  buttonsWrapper: Control;
  inputs: Input[];
  onSubmit?: (e: Event) => void;
  onReset?: (e: Event) => void;
  disableSubmit?: () => void;
  enableSubmit?: () => void;
}

type Options = {
  parentNode: HTMLElement;
  className: string;
  inputs?: Record<string, unknown>[];
  onSubmit?: (e: Event) => void;
  onReset?: (e: Event) => void;
};

export default class Form extends Control implements IForm {
  node!: HTMLFormElement;

  inputsWrapper: Control;

  buttonsWrapper: Control;

  submitButton: Button;

  cancelButton: Button;

  inputs!: Input[];

  onSubmit!: (e: Event) => void;

  onReset!: (e: Event) => void;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, tagName: 'form', className: options.className });
    this.node.classList.add('form');
    this.node.id = options.className;

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
      type: 'submit',
    });

    this.submitButton.node.disabled = true;

    this.cancelButton = new Button({
      parentNode: this.buttonsWrapper.node,
      className: `${options.className}__reset-button`,
      data: { value: 'cancel' },
      options: { type: ButtonTypes.filled },
      type: 'reset',
    });

    this.node.addEventListener('reset', this.disableSubmit);

    if (options.onSubmit) {
      this.onSubmit = options.onSubmit;
      this.node.addEventListener('submit', (e: Event) => this.onSubmit(e));
    }

    if (options.onReset) {
      this.onReset = options.onReset;
      this.node.addEventListener('reset', (e: Event) => this.onReset(e));
    }
  }

  addInput(inputSettings: InputSettings): void {
    const input = new Input(
      this.inputsWrapper.node,
      `${inputSettings.className}`,
      inputSettings.attributes,
      inputSettings.label,
      inputSettings.validationType,
      inputSettings.id,
    );
    input.state.addCallback(this.handleInput);

    if (input.validator) input.validator.handleInput();

    this.inputs.push(input);
  }

  disableSubmit = (): void => {
    this.submitButton.node.classList.add(ButtonModifiers.disabled);
    this.submitButton.node.disabled = true;
  };

  enableSubmit = (): void => {
    this.submitButton.node.classList.remove(ButtonModifiers.disabled);
    this.submitButton.node.disabled = false;
  };

  handleInput = (): void => {
    const FormHaveInvalidInputs = this.inputs.find((input) => input.state.data.isValid === false);
    if (FormHaveInvalidInputs) this.disableSubmit();
    else this.enableSubmit();
  };
}
