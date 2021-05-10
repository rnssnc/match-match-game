import './Input.sass';

import Control from '../Control/Control';

interface IInput {
  node: HTMLInputElement;
  label: Control;
  onValidate?: (input: Input) => boolean;
}

export type InputAttributes = {
  label?: string;
  type?: string;
  checked?: boolean;
  [key: string]: any;
};

export type InputSettings = {
  parentNode?: HTMLElement;
  className?: string;
  label?: string;
  onValidate?: (input: Input) => boolean;
  validationMessage?: string;
  attributes: InputAttributes;
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

  validationIcon: Control;

  constructor(
    parentNode: HTMLElement,
    className: string,
    attributes?: InputAttributes,
    label?: string,
    onValidate?: (input: Input) => boolean,
  ) {
    super({ parentNode, tagName: 'input', className: `${className}-input input-element` });

    this.wrapper = new Control({ parentNode, className: `${className}-input input-element__wrapper` });
    this.wrapper.node.append(this.node);

    this.validationIcon = new Control({
      parentNode: this.wrapper.node,
      className: 'input-element__validation-icon',
    });

    this.validationIcon.node.innerHTML = validationIcon;

    if (label) {
      this.label = new Control({
        parentNode: this.wrapper.node,
        tagName: 'label',
        className: `${className}-label input-element__label`,
      });
      this.label.node.textContent = label;
    }

    if (attributes) {
      Object.keys(attributes).forEach((attribute) => {
        this.node.setAttribute(attribute, attributes[attribute]);
      });
    }

    if (onValidate instanceof Function) {
      this.addValidation(onValidate);
    }
  }

  addValidation(onValidate: (input: Input) => boolean): void {
    this.onValidate = onValidate;

    // this.errorMessage = new Control({parentNode: this.wrapper.node, className})
    this.node.addEventListener('input', () => {
      const isValid = this.onValidate(this);

      if (!isValid) {
        this.node.classList.add('input-element--invalid');
      } else this.node.classList.remove('input-element--invalid');

      const InputInvalid = new CustomEvent('newInput', { detail: isValid });
      this.node.dispatchEvent(InputInvalid);
    });
  }
}
