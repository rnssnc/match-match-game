import TimerView from './TimerView';
import State from '../State/State';

const TIMER_DELAY = 1000;

export default class Timer {
  view: TimerView;

  interval!: NodeJS.Timeout;

  state: State;

  seconds: number;

  private startDate!: number;

  accurate: number;

  delay = 1000;

  firstTickCallback!: () => void;

  constructor(parentNode: HTMLElement, className: string) {
    this.view = new TimerView(parentNode, className);

    this.state = new State();

    this.seconds = 0;
    this.accurate = 12;
  }

  start(countDown = 0, firstTickCallback?: () => void): void {
    this.seconds = countDown / 1000;

    if (firstTickCallback) this.firstTickCallback = firstTickCallback;

    this.delay = TIMER_DELAY;
    this.startDate = Date.now();

    this.displayValue();
    this.interval = setInterval(this.tick, TIMER_DELAY / 2);
  }

  tick = (): void => {
    const dateNow = Date.now();

    if (dateNow - this.startDate >= this.delay - this.accurate) {
      this.seconds += 1;

      this.displayValue();

      this.startDate = Date.now();
    }
  };

  pause(): void {
    if (this.interval) clearInterval(this.interval);
  }

  clear(): void {
    if (this.interval) {
      clearInterval(this.interval);

      this.seconds = 0;
      this.displayValue();
    }
  }

  displayValue(): void {
    if (this.seconds === 1 && this.firstTickCallback) this.firstTickCallback();

    const seconds = Math.abs(this.seconds) % 60;
    const minutes = Math.floor(Math.abs(this.seconds) / 60) % 60;
    const hours = Math.floor(minutes / 60) % 60;

    this.view.setValue(hours, minutes, seconds);
  }
}
