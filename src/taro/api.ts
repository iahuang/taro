import { observe, TaroStateObservable } from "./core";
import { NumericStateVar, TaroReactiveState } from "./reactive";

export class Taro {
    static render(el: HTMLElement, to: HTMLElement) {
        to.appendChild(el);
    }

    static state = {
        number: function (initial: number) {
            return new NumericStateVar(initial);
        },
    };
    static add(a: TaroStateObservable<number>, b: TaroStateObservable<number>) {
        return new TaroReactiveState([a, b], () => observe(a) + observe(b));
    }
}
