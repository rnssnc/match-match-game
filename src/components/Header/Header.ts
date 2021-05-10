import './Header.sass';

import Control from '../Control/Control';
import Section from '../Section/Section';
import Logotype from '../Logotype/Logotype';
import Navigation from '../Navigation/Navigtaion';
import Anchor from '../Button/Anchor';
import Button from '../Button/Button';
import RegisterPopup from '../Popup/RegisterPopup/RegisterPopup';

interface IHeader {
  logotype: Logotype;
  navigation: Navigation;
}

export default class Header extends Section implements IHeader {
  readonly NAVIGATION_ITEMS_PROPS = [
    {
      data: { value: 'About', href: '#about' },
      options: { type: Anchor.buttonTypes.text, modifier: Anchor.buttonModifiers.icon, icon: 'person' },
    },
    {
      data: { value: 'Best scores', href: '#best-score' },
      options: { type: Anchor.buttonTypes.text, modifier: Anchor.buttonModifiers.icon, icon: 'cup' },
    },
    {
      data: { value: 'Settings', href: '#game' },
      options: { type: Anchor.buttonTypes.text, modifier: Anchor.buttonModifiers.icon, icon: 'settings' },
    },
  ];

  logotype: Logotype;

  navigation: Navigation;

  actionButtonsWrapper: Control;

  actionButons: Button[];

  registerPopup: RegisterPopup;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'header', 'header');

    this.logotype = new Logotype(this.contentWrapper.node);
    this.logotype.render();

    this.navigation = new Navigation(
      this.contentWrapper.node,
      'header-navigation',
      this.NAVIGATION_ITEMS_PROPS,
    );

    this.actionButtonsWrapper = new Control({
      parentNode: this.contentWrapper.node,
      className: 'header__action-buttons-wrapper',
    });

    this.registerPopup = new RegisterPopup();
    this.actionButons = [];

    this.actionButons.push(
      new Button({
        parentNode: this.actionButtonsWrapper.node,
        className: 'register-button',
        data: { value: 'Register' },
        options: { type: Button.buttonTypes.filled },
        onClick: () => this.registerPopup.showPopup(),
      }),
    );

    this.actionButons.push(
      new Button({
        parentNode: this.actionButtonsWrapper.node,
        className: 'start-game-button',
        data: { value: 'Start game' },
        options: { type: Button.buttonTypes.filled },
      }),
    );

    console.log(this);
    console.log(this.logotype);
  }
}
