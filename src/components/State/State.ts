// import Control from '../Control/Control';

interface IState {
  data: Record<string, unknown>;
  setState(key: string, value: unknown): void;
}

export default class State implements IState {
  data: Record<string, unknown>;

  callback!: (newState: Record<string, unknown>) => void;

  constructor(initialData?: Record<string, unknown>, onUpdate?: Record<string, unknown>) {
    this.data = { ...initialData };

    if (onUpdate instanceof Function) this.callback = () => onUpdate();
  }

  setState(key: string, value: unknown): void {
    this.data[key] = value;

    if (this.callback) this.callback(this.data);
  }

  addCallback(callback: (state: Record<string, unknown>) => void): void {
    this.callback = callback;
  }
  // getState(key: string): any {
  //   return this.data[key];
  // }
}
