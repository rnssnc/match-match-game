import Control from '../Control/Control';

export default class Section extends Control {
  constructor(parentNode: HTMLElement, tagName = 'section', className: string) {
    super({
      parentNode,
      tagName,
      className: 'section',
      wrapContent: true,
    });

    this.node.classList.add(className);
  }
}
