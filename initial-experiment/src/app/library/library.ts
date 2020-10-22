import { SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type SubjectsFor<T> = {
  [P in keyof T]?: BehaviorSubject<T[P]>;
};

type ObservablesFor<T> = {
  [P in keyof T]?: Observable<T[P]>;
};


// https://www.typescriptlang.org/docs/handbook/advanced-types.html
type NonFunctionPropertyNames<T> = {
  // tslint:disable-next-line:ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;


export class ObservableInputs<ComponentType, InputsType = NonFunctionProperties<ComponentType>> {
  private _subjects: SubjectsFor<InputsType> = {};

  public observables: ObservablesFor<InputsType> = {};

  constructor(private component: ComponentType, propertiesToTrack: Array<keyof ComponentType>) {
    for (const propertyToTrack of propertiesToTrack) {
      const propName = propertyToTrack as string;
      this.trackValue(propName, this.component[propName]);
    }
  }

  public trackChanges(changes: SimpleChanges): void {
    for (const changedPropName of Object.keys(changes)) {
      this.trackValue(changedPropName, changes[changedPropName].currentValue);
    }
  }

  private trackValue(propName: string, value: any): void {
    if (!this._subjects[propName]) {
      this._subjects[propName] = new BehaviorSubject(value);
      this.observables[propName] = this._subjects[propName].asObservable();
    } else {
      this._subjects[propName].next(value);
    }
  }
}
