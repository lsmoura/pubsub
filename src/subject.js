function subject() {
  const subscribers = new Set();

  function on(fn) {
    if (typeof fn !== 'function') throw new TypeError('parameter must be a function');
    subscribers.add(fn);

    return () => off(fn);
  }

  function off(fn) {
    subscribers.delete(fn);
  }

  function publish(data) {
    subscribers.forEach(fn => fn(data));
  }

  return Object.freeze({
    on,
    off,
    publish,
  });
}

module.exports = subject;
