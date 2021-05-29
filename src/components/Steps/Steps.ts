import './Steps.sass';

import Control from '../Control/Control';

export type Step = {
  content: string;
  imagePath: string;
};

type Options = {
  parentNode: HTMLElement;
  className: string;
  steps: Step[];
};

export default class Steps extends Control {
  steps: Record<string, unknown>[];

  constructor(options: Options) {
    super({ parentNode: options.parentNode, className: `${options.className} steps-wrapper` });

    this.steps = [];

    options.steps.forEach((stepOptions, index) => {
      const stepWrapper = new Control({
        parentNode: this.node,
        className: `${options.className} step-wrapper`,
      });

      const step = new Control({
        parentNode: stepWrapper.node,
        className: `${options.className} step`,
      });

      const stepIndex = new Control({
        parentNode: step.node,
        className: 'step__index',
        content: `${index + 1}`,
      });

      const stepDescription = new Control({
        parentNode: step.node,
        className: 'step__description',
        content: stepOptions.content,
      });

      const stepImage = new Control({
        parentNode: stepWrapper.node,
        tagName: 'img',
        className: `${options.className} step__image`,
      });

      stepImage.node.setAttribute('src', stepOptions.imagePath);

      this.steps.push({
        wrapper: stepWrapper,
        step: {
          wrapper: step,
          stepIndex,
          stepDescription,
        },
        image: stepImage,
      });
    });
  }
}
