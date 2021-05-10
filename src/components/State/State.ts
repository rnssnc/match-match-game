// import Control from '../Control/Control';

interface IState {
  data: Record<string, unknown>;
  setState(newState: Record<string, unknown>): void;
}

export default class State implements IState {
  data: Record<string, unknown>;

  callback!: (newState: Record<string, unknown>) => void;

  constructor(initialData?: Record<string, unknown>, onUpdate?: Record<string, unknown>) {
    this.data = { ...initialData };

    if (onUpdate instanceof Function) this.callback = () => onUpdate();
  }

  setState(newState: Record<string, unknown>): void {
    this.data = { ...this.data, ...newState };
    if (this.callback) this.callback(newState);
  }

  getState(key: string): any {
    return this.data[key];
  }
}
