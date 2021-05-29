import Control from '../Control/Control';

export default class TimerView extends Control {
  constructor(parentNode: HTMLElement, className: string) {
    super({ parentNode, className });
  }

  setValue = (hours = 0, minutes = 0, seconds = 0): void => {
    this.node.textContent = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
}
