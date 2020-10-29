export type ISubjectCallback<T = any> = (data: T) => void;
export interface ISubject {
  on(callback: ISubjectCallback): () => void;
  off(callback: ISubjectCallback): void;
  publish(data: any): boolean;
}

function subject(): ISubject {
  const subscribers: Set<ISubjectCallback> = new Set();

  function on<T = any>(fn: ISubjectCallback<T>) {
    if (typeof fn !== 'function') throw new TypeError('parameter must be a function');
    subscribers.add(fn);

    return () => off(fn);
  }

  function off<T = any>(fn: ISubjectCallback) {
    subscribers.delete(fn);
  }

  function publish<T = any>(data: T) {
    subscribers.forEach((fn) => fn(data));

    return true;
  }

  return Object.freeze({
    on,
    off,
    publish,
  });
}

export default subject;
