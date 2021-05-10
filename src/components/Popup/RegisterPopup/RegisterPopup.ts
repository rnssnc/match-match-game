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

const INPUT_SETTINGS: InputSettings[] = [
  {
    className: 'name-input',
    label: 'Name',
    attributes: {
      type: 'text',
      maxlength: '8',
      placeholder: 'Name',
    },
    onValidate(input: Input): boolean {
      console.log(input);
      if (input.node.value !== 'aa') return false;
      return true;
    },
  },
  {
    className: 'surname-input',
    label: 'Last name',
    attributes: {
      type: 'text',
      maxlength: '8',
      placeholder: 'Last name',
    },
  },
  {
    className: 'name-input',
    label: 'email',
    attributes: {
      type: 'email',
      placeholder: 'email',
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

    this.form = new Form({ parentNode: this.popup.node, className: 'register-popup__form' });

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
