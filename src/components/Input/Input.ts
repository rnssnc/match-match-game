import './Input.sass';

import Control from '../Control/Control';

import InputValidator, { ValidationTypes } from './InputValidator';

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
  attributes?: Record<string, unknown>;
  validationType?: ValidationTypes;
};

enum CLASSES {
  default = 'input-element',
}

export default class Input extends Control implements IInput {
  node!: HTMLInputElement;

  label!: Control;

  wrapper: Control;

  validationIcon!: Control;

  validationMessage!: Control;

  id!: string;

  validator!: InputValidator;

  constructor(
    parentNode: HTMLElement,
    className: string,
    attributes?: Record<string, unknown>,
    label?: string,
    validationType?: ValidationTypes,
    id?: string,
  ) {
    super({ parentNode, tagName: 'input', className: `${className}-input ${CLASSES.default}` });

    this.wrapper = new Control({
      parentNode,
      className: `${className}-input ${CLASSES.default}__wrapper`,
    });
    this.wrapper.node.append(this.node);

    if (id) this.id = id;

    if (validationType) this.validator = new InputValidator(this, validationType);

    if (label) {
      this.node.id = className;

      this.label = new Control({
        parentNode: this.wrapper.node,
        tagName: 'label',
        className: `${className}-label ${CLASSES.default}__label`,
      });

      this.label.node.setAttribute('for', className);
      this.label.node.textContent = label;
    }

    if (attributes) {
      Object.keys(attributes).forEach((attribute) => {
        if (this.validator && attribute === 'required') this.state.data.isValid = false;

        if (attribute === 'type') this.node.classList.add(`input-type-${attributes[attribute]}`);

        this.node.setAttribute(attribute, attributes[attribute] as string);
      });
    }
  }
}
