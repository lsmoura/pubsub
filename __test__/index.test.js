const chai = require('chai');
const spies = require('chai-spies');

const pubsub = require('../src/index');

chai.use(spies);
const { assert, expect } = chai;

describe('pubsub', () => {
  afterEach(() => {
    pubsub.reset();
  });

  it('exports a "on" function', () => {
    expect(pubsub.on).to.be.a('function');
  });
  it('exports a "off" function', () => {
    expect(pubsub.off).to.be.a('function');
  });
  it('exports a "publish" function', () => {
    expect(pubsub.publish).to.be.a('function');
  });

  it('successfully calls one subscribed function with the correct data', () => {
    const fn = chai.spy();
    pubsub.on('topic1', fn);
    pubsub.publish('topic1', 55);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('should not interfere with different topics', () => {
    const fn = chai.spy();
    const fn0 = chai.spy();
    pubsub.on('topic0', fn0);
    pubsub.publish('topic1', 55);

    expect(fn0).to.not.have.been.called;
  });

  it('works with symbol type topics', () => {
    const fn = chai.spy();
    const topic = Symbol('foo');
    pubsub.on(topic, fn);
    pubsub.publish(topic, 55);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('the same function can independently subscribe to more than one topic', () => {
    const fn = chai.spy();
    pubsub.on('topic1', fn);
    pubsub.on('topic2', fn);
    pubsub.publish('topic1', 55);
    pubsub.publish('topic2', 101);

    expect(fn).to.have.first.called.with.exactly(55);
    expect(fn).to.have.second.called.with.exactly(101);
    expect(fn).to.have.been.called.twice;
  });

  it('is not called if unsubscribed using callback function', () => {
    const fn = chai.spy();
    const unsub = pubsub.on('topic', fn);
    unsub();
    pubsub.publish('topic', 55);

    expect(fn).to.not.have.been.called;
  });

  it('is not called if unsubscribed using "off" function', () => {
    const fn = chai.spy();
    pubsub.on('topic', fn);
    pubsub.off('topic', fn);
    pubsub.publish('topic', 55);

    expect(fn).to.not.have.been.called;
  });

  it('still works if unsubscribed from the wrong topic', () => {
    const fn = chai.spy();
    const topic = Symbol('foo');
    pubsub.on(topic, fn);
    pubsub.on('topic', fn);
    pubsub.publish(topic, 55);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('works with multiple subscribers', () => {
    const fn1 = chai.spy();
    const fn2 = chai.spy();
    const topic = Symbol('foo');
    pubsub.on(topic, fn1);
    pubsub.on(topic, fn2);
    pubsub.publish(topic, 55);

    expect(fn1).to.have.been.called.with.exactly(55);
    expect(fn2).to.have.been.called.with.exactly(55);
    expect(fn1).to.have.been.called.once;
    expect(fn2).to.have.been.called.once;
  });

  it('does not allow non-string, non-symbol topics', () => {
    expect(() => pubsub.on(55, () => {})).to.throw(TypeError);
    expect(() => pubsub.on(() => {}, () => {})).to.throw(TypeError);
    expect(() => pubsub.on({}, () => {})).to.throw(TypeError);
    expect(() => pubsub.on(null, () => {})).to.throw(TypeError);
  });

  it('does not allow empty string topics', () => {
    expect(() => pubsub.on('', () => {})).to.throw(Error);
  });

  it('does not allow subscription without functions', () => {
    expect(() => pubsub.on('foo')).to.throw(TypeError);
  });

  it('unsubscribing from a non-existing topic does nothing', () => {
    const fn = chai.spy();
    const topic = Symbol('foo');
    pubsub.off(topic, fn);

    expect(fn).to.not.have.been.called;
  });

  it('publishing from a non-existing topic does nothing', () => {
    const topic = Symbol('foo');
    pubsub.publish(topic, 'aaa');
  });
});
