const subject = require('./subject');

const topics = {};

function checkTopic(topic) {
  if (typeof topic !== 'string' && typeof topic !== 'symbol') throw new TypeError('topic must be a string or a symbol');
  if (typeof topic === 'string' && topic.length <= 0) throw new Error('topic length must be greater than zero');

  return true;
}

function on(topic, fn) {
  checkTopic(topic);
  if (!topics[topic]) topics[topic] = subject();
  const group = topics[topic];

  return group.on(fn);
}

function off(topic, fn) {
  checkTopic(topic);
  if (!topics[topic]) return false;

  return topics[topic].off(fn);
}

function publish(topic, data) {
  checkTopic(topic);
  if (!topics[topic]) return false;
  return topics[topic].publish(data);
}

function reset() {
  Object.keys(topics).forEach(key => {
    topics[key] = undefined;
  });
}

module.exports = Object.freeze({
  on,
  off,
  publish,
  reset,
});
