import './Input.sass';

import debounce from 'lodash/debounce';

import Control from '../Control/Control';

interface IInput {
  node: HTMLInputElement;
  label: Control;
  onValidate?: (input: Input) => boolean;
  addErrorMessage?: (text: string) => void;
}

export type InputSettings = {
  parentNode?: HTMLElement;
  id?: string;
  className?: string;
  label?: string;
  onValidate?: (input: Input) => boolean;
  attributes?: Record<string, unknown>;
};

const validationIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
      <circle cx="15.5" cy="9.5" r="1.5"/>
      <circle cx="8.5" cy="9.5" r="1.5"/>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 
        2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z"/>
    </svg>`;

export default class Input extends Control implements IInput {
  node!: HTMLInputElement;

  label!: Control;

  onValidate!: (input: Input) => boolean;

  wrapper: Control;

  validationIcon!: Control;

  validationMessage!: Control;

  id!: string;

  constructor(
    parentNode: HTMLElement,
    className: string,
    attributes?: Record<string, unknown>,
    label?: string,
    onValidate?: (input: Input) => boolean,
    id?: string,
  ) {
    super({ parentNode, tagName: 'input', className: `${className}-input input-element` });

    this.wrapper = new Control({
      parentNode,
      className: `${className}-input input-element__wrapper`,
    });
    this.wrapper.node.append(this.node);

    if (id) this.id = id;

    if (onValidate instanceof Function) {
      this.onValidate = onValidate;

      this.validationIcon = new Control({
        parentNode: this.wrapper.node,
        className: 'input-element__validation-icon',
      });

      this.validationIcon.node.innerHTML = validationIcon;

      this.validationMessage = new Control({
        parentNode: this.wrapper.node,
        className: 'input-element__validation-message',
      });
    }

    if (label) {
      this.node.id = className;

      this.label = new Control({
        parentNode: this.wrapper.node,
        tagName: 'label',
        className: `${className}-label input-element__label`,
      });

      this.label.node.setAttribute('for', className);
      this.label.node.textContent = label;
    }

    if (attributes) {
      Object.keys(attributes).forEach((attribute) => {
        if (onValidate && attribute === 'required') this.state.data.isValid = false;
        if (attribute === 'type') this.node.classList.add(`input-type-${attributes[attribute]}`);
        this.node.setAttribute(attribute, attributes[attribute] as string);
      });
    }

    this.node.addEventListener('input', debounce(this.handleInput, 100));
  }

  handleInput = (): void => {
    if (this.onValidate) {
      const isValid = this.onValidate(this);

      if (!isValid) {
        this.wrapper.node.classList.add('input-element--invalid');
      } else this.wrapper.node.classList.remove('input-element--invalid');

      this.state.setState('isValid', isValid);
    }

    this.state.setState('value', this.node.value);

    if (this.node.type === 'file') {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.state.setState('value', reader.result);
      };

      if (this.node.files && this.node.files[0]) reader.readAsDataURL(this.node.files[0]);
    }
  };

  addErrorMessage(text: string): void {
    const span = document.createElement('span');
    span.classList.add('error-message__message');
    span.textContent = text;

    this.validationMessage.node.append(span);
  }

  clearErrorMessage(): void {
    this.validationMessage.node.textContent = '';
  }
}
