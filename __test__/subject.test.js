const chai = require('chai');
const spies = require('chai-spies');

const subject = require('../src/subject');

chai.use(spies);
const { assert, expect } = chai;

describe('subject', () => {
  let element = null;
  beforeEach(() => {
    element = subject();
  });

  it('exports a function', () => {
    assert.typeOf(subject, 'function');
  });
  it('resolves into an object with a "on" function', () => {
    expect(element.on).to.be.a('function');
  });
  it('resolves into an object with a "off" function', () => {
    expect(element.off).to.be.a('function');
  });
  it('resolves into an object with a "publish" function', () => {
    expect(element.publish).to.be.a('function');
  });

  it('successfully calls one subscribed function with the correct data', () => {
    const fn = chai.spy();
    element.on(fn);
    element.publish(55);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('successfully calls one subscribed function not to happen after unsubscribing using callback', () => {
    const fn = chai.spy();
    const unsubscribe = element.on(fn);
    element.publish(55);
    unsubscribe();
    element.publish(54);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('successfully calls one subscribed function not to happen after unsubscribing using "off"', () => {
    const fn = chai.spy();
    element.on(fn);
    element.publish(55);
    element.off(fn);
    element.publish(54);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('makes sure that subscribing twice does not matter', () => {
    const fn = chai.spy();
    element.on(fn);
    element.on(fn);
    element.publish(55);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('successfully calls two subscribed functions with the correct data', () => {
    const fn1 = chai.spy();
    const fn2 = chai.spy();
    element.on(fn1);
    element.on(fn2);
    element.publish(55);

    expect(fn1).to.have.been.called.with.exactly(55);
    expect(fn2).to.have.been.called.with.exactly(55);
    expect(fn1).to.have.been.called.once;
    expect(fn2).to.have.been.called.once;
  });

  it('does not call functions upon unsubscribing', () => {
    const fn = chai.spy();
    element.on(fn);
    element.publish(55);
    element.off(fn);
    element.publish(99);

    expect(fn).to.have.been.called.with.exactly(55);
    expect(fn).to.have.been.called.once;
  });

  it('does not accept subscription of non-functions', () => {
    expect(() => element.on('foo')).to.throw(TypeError);
  });
});
