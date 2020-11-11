export interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
    which: T;
    targetTouches: T[];
    changedTouches: T[];
}
