# pubsub

Subscribe and listen to topics. Useful to handle application-wide state changes

## functions

* `on(topic, callbackFn)` - Subscribe to a topic. Returns a function that you can call to unsubscribe from
* `off(topic, callbackFn)` - Unsubscribe to a topic
* `publish(topic, data)` - send a message to every subscriber on a topic
* `reset()` - Clear all subscriptions

# Author

[Sergio Moura](https://sergio.moura.ca)

