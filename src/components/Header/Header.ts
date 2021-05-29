import './Header.sass';

import Control from '../Control/Control';
import Section from '../Section/Section';
import Logotype from '../Logotype/Logotype';
import Navigation from '../Navigation/Navigtaion';
import Anchor from '../Button/Anchor';
import Button from '../Button/Button';
import RegisterPopup from '../Popup/RegisterPopup/RegisterPopup';
import Database from '../Database/Database';

interface IHeader {
  logotype: Logotype;
  navigation: Navigation;
}

export default class Header extends Section implements IHeader {
  readonly NAVIGATION_ITEMS_PROPS = [
    {
      data: { value: 'About', href: '#about' },
      options: {
        type: Anchor.buttonTypes.text,
        modifier: Anchor.buttonModifiers.icon,
        icon: 'person',
      },
    },
    {
      data: { value: 'Best scores', href: '#records' },
      options: {
        type: Anchor.buttonTypes.text,
        modifier: Anchor.buttonModifiers.icon,
        icon: 'cup',
      },
    },
    {
      data: { value: 'Settings', href: '#settings' },
      options: {
        type: Anchor.buttonTypes.text,
        modifier: Anchor.buttonModifiers.icon,
        icon: 'settings',
      },
    },
  ];

  database!: Database;

  logotype: Logotype;

  navigation: Navigation;

  actionButtonsWrapper: Control;

  registerButton: Button;

  startGameButton: Anchor;

  registerPopup: RegisterPopup;

  profileAvatar: Control;

  constructor(parentNode: HTMLElement, database: Database) {
    super(parentNode, 'header', 'header');

    this.logotype = new Logotype(this.contentWrapper.node, { href: '#about' });

    this.navigation = new Navigation(
      this.contentWrapper.node,
      'header-navigation',
      this.NAVIGATION_ITEMS_PROPS,
    );

    this.actionButtonsWrapper = new Control({
      parentNode: this.contentWrapper.node,
      className: 'header__action-buttons-wrapper',
    });

    this.registerPopup = new RegisterPopup(database, (user) => {
      this.registerButton.hide();
      this.startGameButton.render();
      if (user.avatar) {
        this.profileAvatar.node.style.backgroundImage = `url(${user.avatar as unknown as string})`;
      }
      this.profileAvatar.render();
    });

    this.registerButton = new Button({
      parentNode: this.actionButtonsWrapper.node,
      className: 'register-button',
      data: { value: 'Register' },
      options: { type: Button.buttonTypes.filled },
      onClick: () => this.registerPopup.showPopup(),
    });

    // this.startGameButton = new Button({
    //   parentNode: this.actionButtonsWrapper.node,
    //   className: 'start-game-button',
    //   data: { value: 'Start game' },
    //   options: { type: Button.buttonTypes.filled },
    // });

    this.startGameButton = new Anchor(
      this.actionButtonsWrapper.node,
      'start-game-button',
      { value: 'Start game', href: '#game' },
      { type: Button.buttonTypes.filled },
    );

    this.startGameButton.hide();

    this.profileAvatar = new Control({
      parentNode: this.actionButtonsWrapper.node,
      // tagName: 'img',
      className: 'profile-avatar',
    });

    this.profileAvatar.hide();

    console.log(this);
    console.log(this.logotype);
  }
}
