import State from '../State/State';

export interface IControl {
  node: HTMLElement;
  parentNode: HTMLElement;
  contentWrapper?: Control;
  state: State;

  render(): void;
}

type Options = {
  parentNode: HTMLElement;
  tagName?: string;
  className?: string;
  wrapContent?: boolean;
  content?: string;
  render?: boolean;
};

const DEFAULT_OPTIONS = {
  tagName: 'div',
  wrapContent: false,
  render: true,
};

export default class Control implements IControl {
  node: HTMLElement;

  parentNode: HTMLElement;

  contentWrapper!: Control;

  state: State;

  constructor(options: Options) {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    const element = document.createElement(mergedOptions.tagName);

    if (mergedOptions.className) element.className = mergedOptions.className;

    this.parentNode = mergedOptions.parentNode;

    this.node = element;
    this.state = new State();

    if (mergedOptions.content) this.setContent(mergedOptions.content);

    if (mergedOptions.wrapContent) {
      this.contentWrapper = new Control({
        parentNode: this.node,
        className: `${mergedOptions.className}__content-wrapper`,
      });

      this.node.insertAdjacentElement('afterbegin', this.contentWrapper.node);
    }

    this.hide();

    this.parentNode.appendChild(this.node);

    if (mergedOptions.render) this.render();
  }

  render(): void {
    this.node.style.display = '';
    this.state.setState('isRendered', true);
  }

  hide(): void {
    this.node.style.display = 'none';
  }

  setContent(content: string): void {
    this.node.textContent = content;
    this.state.setState('textContent', content);
  }
}
