import subject, {ISubject, ISubjectCallback} from './subject';

type ITopicType = string;
type ITopics = {
  [key: string]: ISubject | void,
};
const topics: ITopics = {};

function checkTopic(topic: ITopicType) {
  if (typeof topic !== 'string' && typeof topic !== 'symbol') throw new TypeError('topic must be a string or a symbol');
  if (typeof topic === 'string' && topic.length <= 0) throw new Error('topic length must be greater than zero');

  return true;
}

function on(topic: ITopicType, fn: ISubjectCallback) {
  checkTopic(topic);
  const topicSubject = topics[topic] || subject();
  if (!topics[topic]) {
    topics[topic] = topicSubject;
  }

  return topicSubject.on(fn);
}

function off(topic: ITopicType, fn: ISubjectCallback) {
  checkTopic(topic);
  const topicSubject = topics[topic];
  if (!topicSubject) return false;

  return topicSubject.off(fn);
}

function publish<T = any>(topic: ITopicType, data: T): boolean {
  checkTopic(topic);

  const topicSubject = topics[topic];
  if (!topicSubject) return false;
  return topicSubject.publish(data);
}

function reset() {
  Object.keys(topics).forEach((key) => {
    topics[key] = undefined;
  });
}

export default Object.freeze({
  on,
  off,
  publish,
  reset,
});
