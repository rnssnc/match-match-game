import Control from '../Control/Control';

type Options = {
  parentNode: HTMLElement;
  className: string;
  name: string;
  email: string;
  avatar?: ImageData;
  score?: number;
};

export default class PlayerScore extends Control {
  playerInfo: Control;

  playerAvatar: Control;

  playerDescription: Control;

  playerName: Control;

  playerEmail: Control;

  playerScore: Control;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: options.className });

    this.playerInfo = new Control({ parentNode: this.node, className: 'score__player-info' });

    this.playerAvatar = new Control({
      parentNode: this.playerInfo.node,
      className: 'player-info__avatar',
    });

    if (options.avatar) this.playerAvatar.node.style.backgroundImage = `url(${options.avatar})`;

    this.playerDescription = new Control({
      parentNode: this.playerInfo.node,
      className: 'player-info__description',
    });

    this.playerName = new Control({
      parentNode: this.playerDescription.node,
      className: 'player-info__name',
      content: options.name,
    });

    this.playerEmail = new Control({
      parentNode: this.playerDescription.node,
      className: 'player-info__email',
      content: options.email,
    });

    this.playerScore = new Control({
      parentNode: this.node,
      className: 'player-info__score',
      content: `Latest score: <span class="player-info__score--highlight">${
        options.score ? options.score : '0'
      }</span>`,
    });
  }
}
