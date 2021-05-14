import './RegisterPopup.sass';

import Control from '../../Control/Control';
import Popup from '../Popup';
import Headings from '../../Heading/Heading';
import Form from '../../Form/Form';
import Input, { InputSettings } from '../../Input/Input';

interface IRegisterPopup {
  heading: Control;
  form: Form;
}

function isStringEmpty(value: string): boolean {
  if (value.length === 0 || value === '-') return true;

  return false;
}

function isStringOfNumber(value: string): boolean {
  const NUMBERS_REGEXP = new RegExp('^[\\d ]*$');
  if (value.length > 0 && value.match(NUMBERS_REGEXP)) return true;

  return false;
}

function isStringHaveInvalidChars(value: string): boolean {
  const BLOCKED_CHARS_REGEXP = new RegExp(/~|!|@|#|\$|%|\*|\(|\)|_|—|\+|=|\||:|;|"|'|`|<|>|,|\.|\?|\/|\^/);

  if (value.length > 0 && value.match(BLOCKED_CHARS_REGEXP)) return true;

  return false;
}
const INPUT_SETTINGS: InputSettings[] = [
  {
    className: 'name-input',
    label: 'Name',
    attributes: {
      type: 'text',
      placeholder: 'Name',
      required: true,
      maxlength: '30',
    },
    onValidate(input: Input): boolean {
      let isValid = true;

      const nodeValue = input.node.value.trim();

      input.clearErrorMessage();

      if (isStringEmpty(nodeValue)) {
        input.addErrorMessage('String cannot be empty.');

        isValid = false;
      }
      if (isStringOfNumber(nodeValue)) {
        input.addErrorMessage('String cannot contain only numbers.');

        isValid = false;
      }
      if (isStringHaveInvalidChars(nodeValue)) {
        input.addErrorMessage('String cannot contain service symbols.');

        isValid = false;
      }

      return isValid;
    },
  },
  {
    className: 'surname-input',
    label: 'Last name',
    attributes: {
      type: 'text',
      placeholder: 'Last name',
      required: true,
      maxlength: '30',
    },
    onValidate(input: Input): boolean {
      let isValid = true;

      const nodeValue = input.node.value.trim();

      input.clearErrorMessage();

      if (isStringEmpty(nodeValue)) {
        input.addErrorMessage('String cannot be empty.');

        isValid = false;
      }
      if (isStringOfNumber(nodeValue)) {
        input.addErrorMessage('String cannot contain only numbers.');

        isValid = false;
      }
      if (isStringHaveInvalidChars(nodeValue)) {
        input.addErrorMessage('String cannot contain service symbols.');

        isValid = false;
      }

      return isValid;
    },
  },
  {
    className: 'email-input',
    label: 'email',
    attributes: {
      type: 'email',
      placeholder: 'email',
      required: true,
      maxlength: '30',
    },
    onValidate(input: Input): boolean {
      let isValid = true;

      const nodeValue = input.node.value.trim();

      input.clearErrorMessage();

      if (isStringEmpty(nodeValue)) {
        input.addErrorMessage('String cannot be empty.');

        isValid = false;
      }

      const EMAIL_REGEXP = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
      );
      if (nodeValue.length > 0 && !nodeValue.match(EMAIL_REGEXP)) {
        input.addErrorMessage('Email does not apply RFC standart.');

        isValid = false;
      }

      return isValid;
    },
  },
  {
    className: 'avatar-input',
    label: ' ',
    attributes: {
      type: 'file',
      placeholder: 'user avatar',
    },
  },
];

export default class RegisterPopup extends Popup implements IRegisterPopup {
  heading!: Control;

  form: Form;

  constructor() {
    super('register');

    this.heading = new Control({
      parentNode: this.popup.node,
      tagName: 'h2',
      className: `register-popup__heading ${Headings.h2}`,
      content: 'Register new player',
    });

    this.form = new Form({
      parentNode: this.popup.node,
      className: 'register-popup__form',
      onReset: () => this.hidePopup(),
      onSubmit: (e: Event) => {
        e.preventDefault();
        console.log('submit');
      },
    });

    INPUT_SETTINGS.forEach((inputSetting) => {
      this.form.addInput({
        className: `${inputSetting.className} register-form__input`,
        attributes: inputSetting.attributes,
        label: inputSetting.label,
        onValidate: inputSetting.onValidate,
      });
    });
  }
}
