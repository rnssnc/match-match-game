import './RegisterPopup.sass';

import Control from '../../Control/Control';
import Popup from '../Popup';
import Headings from '../../Heading/Heading';
import Form from '../../Form/Form';
import Input, { InputSettings } from '../../Input/Input';
import Database, { DatabaseRecord, uniqueFieldName } from '../../Database/Database';

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
  const BLOCKED_CHARS_REGEXP = new RegExp(
    /~|!|@|#|\$|%|\*|\(|\)|_|—|\+|=|\||:|;|"|'|`|<|>|,|\.|\?|\/|\^/,
  );

  if (value.length > 0 && value.match(BLOCKED_CHARS_REGEXP)) return true;

  return false;
}
const INPUT_SETTINGS: InputSettings[] = [
  {
    className: 'name-input',
    id: 'name',
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
    id: 'surname',
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
    id: 'email',
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
        '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
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
    id: 'avatar',
    label: ' ',
    attributes: {
      type: 'file',
      placeholder: 'user avatar',
      accept: '.jpg, .jpeg, .png, .svg',
    },
    onValidate(input): boolean {
      let isValid = true;

      input.clearErrorMessage();

      const ACCEPTABLE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg'];

      const extension = input.node.value.slice(input.node.value.lastIndexOf('.'));
      if (extension && !ACCEPTABLE_EXTENSIONS.some((ext) => ext === extension)) {
        input.addErrorMessage('Supported extensions: .jpg, .jpeg, .png, .svg');

        isValid = false;
      }

      if (isValid && input.node.value !== '') input.node.classList.add('select-input--file-loaded');
      else input.node.classList.remove('select-input--file-loaded');

      return isValid;
    },
  },
];

export default class RegisterPopup extends Popup implements IRegisterPopup {
  heading!: Control;

  form: Form;

  constructor(database: Database, submitCallback: (record: DatabaseRecord) => void) {
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

        const record: Record<string, unknown> = {};

        this.form.inputs.forEach((input) => {
          if (input.state.data?.value) {
            record[input.id] = input.state.data?.value;
          }
        });

        database
          .add(record as DatabaseRecord)
          .then((resolve) => {
            this.form.node.reset();
            submitCallback(resolve as DatabaseRecord);
          })
          .catch((ev) => {
            if (ev.target.error.name === 'ConstraintError') {
              const uniqueField = this.form.inputs.find((input) => input.id === uniqueFieldName);
              uniqueField?.addErrorMessage(
                'This email address is already taken, please choose another one',
              );
              uniqueField?.state.setState('isValid', false);
            }
          });
      },
    });

    INPUT_SETTINGS.forEach((inputSetting) => {
      this.form.addInput({
        className: `${inputSetting.className} register-form__input`,
        attributes: inputSetting.attributes,
        label: inputSetting.label,
        id: inputSetting.id,
        onValidate: inputSetting.onValidate,
      });
    });
  }
}
