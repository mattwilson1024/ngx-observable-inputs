import { BehaviorSubject, Observable } from 'rxjs';

// https://stackoverflow.com/a/49752227/1145963
type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp? P : never }[keyof T];
type KeysNotOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp? never : P }[keyof T];

// https://stackoverflow.com/a/58210459/1145963
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export type PossibleInputKeys<T> = KeysNotOfType<T, Observable<any>> & NonFunctionPropertyNames<T>;


function internalValueName(key: string|symbol|any): string {
  return `_${key.toString()}`
}

function intervalSubjectName(key: string|symbol|any): string {
  return `_${key.toString()}Subject`
}

function setupIfNeeded<T>(componentInstance: any, key: string|symbol, inputToObserve: PossibleInputKeys<T>): void {
  const subjectName = intervalSubjectName(inputToObserve.toString());
  if (!componentInstance[ subjectName ]) {
    const subject = new BehaviorSubject<any>(null);
    componentInstance[ subjectName ] = subject;
    componentInstance[ key ] = subject.asObservable();
  }
}

export function ObserveInput<T = any>(inputToObserve: PossibleInputKeys<T> ) {
  return function(target: Object, key: string | symbol) {
    Object.defineProperty(target, inputToObserve as string, {
      get: function() {
        setupIfNeeded(this, key, inputToObserve);
        return this[ internalValueName(inputToObserve) ];
      },
      set: function(newValue) {
        setupIfNeeded(this, key, inputToObserve);
        this[ internalValueName(inputToObserve) ] = newValue;
        this[ intervalSubjectName(inputToObserve) ]?.next(newValue);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
