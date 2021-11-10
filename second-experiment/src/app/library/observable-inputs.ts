import { BehaviorSubject, Observable } from 'rxjs';

// https://stackoverflow.com/a/49752227/1145963
type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp? P : never }[keyof T];

function intervalValueName(key: string|symbol): string {
  return `_${key.toString()}`
}

function intervalSubjectName(key: string|symbol): string {
  return `_${key.toString()}Subject`
}

export function ObserveInput<T = any>(observableName: KeysOfType<T, Observable<any>> ) {
  return function(target: Object, key: string | symbol) {
    Object.defineProperty(target, key, {
      get: function() {
        return this[ intervalValueName(key) ];
      },
      set: function(newValue) {
        this[ intervalValueName(key) ] = newValue;

        const subjectName = intervalSubjectName(key);
        if (!this[ intervalSubjectName(key) ]) {
          const subject = new BehaviorSubject<any>(null);
          this[ subjectName ] = subject;
          this[ observableName ] = subject.asObservable();
        }
        this[subjectName]?.next(newValue);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
