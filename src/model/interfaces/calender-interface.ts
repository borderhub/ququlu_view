export interface CalenderEventInterface {
  name: string;
  start: string;
  end: string;
  color: string;
  details?: string;
}

export interface CalenderTermObjectInterface {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
}

export interface CalenderTermInterface extends Window {
  start?: CalenderTermObjectInterface;
  end?: CalenderTermObjectInterface;
}

export interface CalenderNativeEventInterface {
  isTrusted: boolean;
}

export interface CalenderFormatInterface {
  timeZone: string;
  month: string;
}

export interface CalenderInstanceInterface {
  prev: () => void;
  next: () => void;
  checkChange: () => void;
  getFormatter: (format: CalenderFormatInterface) => any;
}
