import { BehaviorSubject, Observable } from 'rxjs';

// https://stackoverflow.com/a/49752227/1145963
type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp? P : never }[keyof T];
type KeysNotOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp? never : P }[keyof T];

// https://stackoverflow.com/a/58210459/1145963
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

type InputPropertyName<T> = KeysNotOfType<T, Observable<any>> & NonFunctionPropertyNames<T>;


function internalValuePropName<T>(inputToObserve: InputPropertyName<T>): string {
  return `_${inputToObserve.toString()}`
}

function internalSubjectPropName<T>(inputToObserve: InputPropertyName<T>): string {
  return `_${inputToObserve.toString()}Subject`
}

function setupIfNeeded<T>(componentInstance: any, observablePropName: string|symbol, inputToObserve: InputPropertyName<T>): void {
  if (!componentInstance[ internalSubjectPropName(inputToObserve) ]) {
    const subject = new BehaviorSubject<any>(null);
    componentInstance[ internalSubjectPropName(inputToObserve) ] = subject;
    componentInstance[ observablePropName ] = subject.asObservable();
  }
}

export function ObserveInput<T = any>(inputPropName: InputPropertyName<T> ) {
  return function(target: Object, observablePropName: string | symbol) {
    Object.defineProperty(target, inputPropName as string, {
      get: function() {
        setupIfNeeded(this, observablePropName, inputPropName);
        return this[ internalValuePropName(inputPropName) ];
      },
      set: function(newValue) {
        setupIfNeeded(this, observablePropName, inputPropName);
        this[ internalValuePropName(inputPropName) ] = newValue;
        this[ internalSubjectPropName(inputPropName) ]?.next(newValue);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
