import './RegisterPopup.sass';

import Control from '../../Control/Control';
import Popup from '../Popup';
import Headings from '../../Heading/Heading';
import Form from '../../Form/Form';
import { InputSettings } from '../../Input/Input';
import Database, { DatabaseRecord, uniqueFieldName } from '../../Database/Database';

import { ValidationTypes } from '../../Input/InputValidator';

interface IRegisterPopup {
  heading: Control;
  form: Form;
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
    validationType: ValidationTypes.name,
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
    validationType: ValidationTypes.name,
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
    validationType: ValidationTypes.email,
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
    validationType: ValidationTypes.file,
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

        this.addDatabaseRecord(record as DatabaseRecord, database, submitCallback);
      },
    });

    this.addInputs(INPUT_SETTINGS);
  }

  addDatabaseRecord(
    record: DatabaseRecord,
    database: Database,
    submitCallback: (record: DatabaseRecord) => void,
  ): void {
    database
      .add(record as DatabaseRecord)
      .then((resolve) => {
        this.form.node.reset();
        submitCallback(resolve as DatabaseRecord);
      })
      .catch((ev) => {
        if (ev.target.error.name === 'ConstraintError') {
          const uniqueField = this.form.inputs.find((input) => input.id === uniqueFieldName);
          uniqueField?.validator.addErrorMessage(
            'This email address is already taken, please choose another one',
          );
          uniqueField?.state.setState('isValid', false);
        }
      });
  }

  addInputs(settings: InputSettings[]): void {
    settings.forEach((inputSetting) => {
      this.form.addInput({
        className: `${inputSetting.className} register-form__input`,
        attributes: inputSetting.attributes,
        label: inputSetting.label,
        id: inputSetting.id,
        validationType: inputSetting.validationType,
      });
    });
  }
}
