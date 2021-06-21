import './SelectInput.sass';

import Control from '../Control/Control';
import Input, { InputSettings } from '../Input/Input';

type Options = {
  parentNode: HTMLElement;
  className: string;
  inputOptions: InputSettings[];
  startValue: number;
  optionChangeCallback?: (newValue: string) => void;
};

export default class SelectInput extends Control {
  wrapper: Control;

  optionsWrapper: Control;

  inputOptions: InputSettings[];

  inputs: Input[];

  startValue: number;

  optionChangeCallback?: (newValue: string) => void;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      className: `select-input__value-display ${options.className}-value-display`,
    });

    this.wrapper = new Control({
      parentNode: options.parentNode,
      className: `select-input__wrapper ${options.className}-input__wrapper`,
    });

    this.wrapper.node.append(this.node);

    this.optionsWrapper = new Control({
      parentNode: this.wrapper.node,
      className: `${options.className}-options-wrapper select-input__options-wrapper`,
    });

    this.inputOptions = options.inputOptions;
    this.inputs = [];

    this.inputOptions.forEach((option: Record<string, unknown>, index) => {
      const input = new Input(
        this.optionsWrapper.node,
        `select-input__option ${options.className} options-${index}`,
        { name: options.className, type: 'radio', value: option.value },
        option.label as string,
        undefined,
      );

      input.node.addEventListener('click', () => this.handleOptionSelect(input.node.value));

      this.inputs.push(input);
    });

    if (options.optionChangeCallback) this.optionChangeCallback = options.optionChangeCallback;

    this.setupListeners();

    this.startValue = options.startValue;

    this.setDisplayValue(this.inputs[this.startValue].node.value);
  }

  handleOptionSelect = (displayValue: string): void => {
    this.setDisplayValue(displayValue);
    this.hideOptions();

    if (this.optionChangeCallback) this.optionChangeCallback(displayValue);
  };

  setupListeners(): void {
    this.node.addEventListener('click', this.showOptions);

    this.optionsWrapper.node.addEventListener('mouseleave', (e: MouseEvent) => {
      if (e.relatedTarget !== this.node) this.hideOptions();
    });

    this.node.addEventListener('mouseleave', (e) => {
      if (e.relatedTarget !== this.optionsWrapper.node) this.hideOptions();
    });
  }

  showOptions = (): void => {
    this.optionsWrapper.node.classList.add('options-wrapper--active');

    this.wrapper.node.classList.add('value-display--active');
    this.node.classList.add('value-display--active');
  };

  hideOptions = (): void => {
    this.optionsWrapper.node.classList.remove('options-wrapper--active');

    this.wrapper.node.classList.remove('value-display--active');
    this.node.classList.remove('value-display--active');
  };

  setDisplayValue(value: string): void {
    this.node.textContent = value;
  }
}
