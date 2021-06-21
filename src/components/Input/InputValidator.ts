import debounce from 'lodash/debounce';

import Control from '../Control/Control';

import Input from './Input';

import { EMAIL_REGEXP, BLOCKED_CHARS_REGEXP, NUMBERS_REGEXP } from './ValidationConsts';

export enum ValidationTypes {
  name = 'name',
  email = 'email',
  file = 'file',
}

const validationIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
      <circle cx="15.5" cy="9.5" r="1.5"/>
      <circle cx="8.5" cy="9.5" r="1.5"/>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 
        2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z"/>
    </svg>`;

enum CLASSES {
  file_loaded = 'select-input--file-loaded',
  invalid = 'input-element--invalid',
}

const ERROR_MESSAGES = {
  empty: 'String cannot be empty.',
  only_numbers: 'String cannot contain only numbers.',
  service_symbols: 'String cannot contain service symbols.',
  RFC: 'Email does not apply RFC standart.',
  extensions: 'Supported extensions:',
};

export default class InputValidator {
  static readonly validationTypes: ValidationTypes;

  input: Input;

  validationIcon: Control;

  validationMessage: Control;

  onValidate!: (input: Input) => boolean;

  constructor(input: Input, validationType: ValidationTypes) {
    this.input = input;

    this.validationIcon = new Control({
      parentNode: this.input.wrapper.node,
      className: 'input-element__validation-icon',
    });

    this.validationIcon.node.innerHTML = validationIcon;

    this.validationMessage = new Control({
      parentNode: this.input.wrapper.node,
      className: 'input-element__validation-message',
    });

    if (validationType === ValidationTypes.name) this.onValidate = this.validateName;
    if (validationType === ValidationTypes.email) this.onValidate = this.validateEmail;
    if (validationType === ValidationTypes.file) this.onValidate = this.validateFile;

    this.input.node.addEventListener('input', debounce(this.handleInput, 100));
  }

  handleInput = (): void => {
    if (this.onValidate) {
      const isValid = this.onValidate(this.input);

      if (!isValid) {
        this.input.wrapper.node.classList.add(CLASSES.invalid);
      } else this.input.wrapper.node.classList.remove(CLASSES.invalid);

      this.input.state.setState('isValid', isValid);
    }

    this.input.state.setState('value', this.input.node.value);

    if (this.input.node.type === 'file') {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.input.state.setState('value', reader.result);
      };

      if (this.input.node.files && this.input.node.files[0]) {
        reader.readAsDataURL(this.input.node.files[0]);
      }
    }
  };

  validateName(): boolean {
    let isValid = true;

    const nodeValue = this.input.node.value.trim();

    this.clearErrorMessage();

    if (InputValidator.isStringEmpty(nodeValue)) {
      this.addErrorMessage(ERROR_MESSAGES.empty);

      isValid = false;
    }
    if (InputValidator.isStringOfNumber(nodeValue)) {
      this.addErrorMessage(ERROR_MESSAGES.only_numbers);

      isValid = false;
    }
    if (InputValidator.isStringHaveInvalidChars(nodeValue)) {
      this.addErrorMessage(ERROR_MESSAGES.service_symbols);

      isValid = false;
    }

    return isValid;
  }

  validateEmail(): boolean {
    let isValid = true;

    const nodeValue = this.input.node.value.trim();

    this.clearErrorMessage();

    if (InputValidator.isStringEmpty(nodeValue)) {
      this.addErrorMessage(ERROR_MESSAGES.empty);

      isValid = false;
    }

    if (nodeValue.length > 0 && !nodeValue.match(EMAIL_REGEXP)) {
      this.addErrorMessage(ERROR_MESSAGES.RFC);

      isValid = false;
    }

    return isValid;
  }

  validateFile(): boolean {
    let isValid = true;

    this.clearErrorMessage();

    const ACCEPTABLE_EXTENSIONS = this.input.node.accept;

    const extension = this.input.node.value.slice(this.input.node.value.lastIndexOf('.'));
    if (extension && !ACCEPTABLE_EXTENSIONS.split(', ').some((ext) => ext === extension)) {
      this.addErrorMessage(`${ERROR_MESSAGES.extensions} ${ACCEPTABLE_EXTENSIONS}`);

      isValid = false;
    }

    if (isValid && this.input.node.value !== '') {
      this.input.node.classList.add(CLASSES.file_loaded);
    } else this.input.node.classList.remove(CLASSES.file_loaded);

    return isValid;
  }

  static isStringEmpty(value: string): boolean {
    if (value.length === 0 || value === '-') return true;

    return false;
  }

  static isStringOfNumber(value: string): boolean {
    if (value.length > 0 && value.match(NUMBERS_REGEXP)) return true;

    return false;
  }

  static isStringHaveInvalidChars(value: string): boolean {
    if (value.length > 0 && value.match(BLOCKED_CHARS_REGEXP)) return true;

    return false;
  }

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
