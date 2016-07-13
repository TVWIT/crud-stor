# crud stor

Minimal model with crud operations.


## install

    $ npm install crud-stor


## example

```js
var Store = require('crud-stor');

// api is an object with get, add, edit, delete functions
var api = require('./mock-api');

var store = Store({
    id: 'id'  // key by which to map the data. Default is 'id'.
}, api);

// store.state is an instance of `observ`
store.state(function onChange (state) {
    console.log('change', state);
});

store.state();  // => { isResolving: false, data: {} }

// call api.<method> and set the state with the response
function cb (err, resp) {}
store.actions.get({}, cb);
store.actions.add({}, cb);
store.actions.edit({}, cb);
store.actions.delete({ id: 2 }, cb);

// set one item to the given object, or add it if the id does not exist
// emits a change event
store.set({ id: '123', example: 'test' });

// set all items and emit a change event
store.reset([ { id: 123, example: '123' }, { id: 1234, example: '1234' } ]);
```

API functions are any asynchronous function that takes an options arg and
a node style callback.

```js
// mock-api.js
var nextTick = process.nextTick.bind(process);

module.exports = {
    get: function (opts, cb) {
        nextTick(cb.bind(null, null, { data: [{ id: 1, example: 'test' }] }));
    },

    add: function (opts, cb) {
        nextTick(cb.bind(null, null, { data: { id: 2, example: 'test2' } }));
    },

    edit: function (opts, cb) {
        nextTick(cb.bind(null, null, { data: { id: 2, example: 'edited' } }));
    },

    delete: function (opts, cb) {
        nextTick(cb.bind(null, null, true));
    }
};
```


Parse data:

```js
var Store = require('../');
var store = Store({}, require('./mock-api'));
var xtend = require('xtend');

// return a new observable with parsed data
var parsed = Store.Parse(store.state, parser);

function parser (state) {
    return xtend(state, {
        data: Object.keys(state.data).map(k => state.data[k])
    });
}

// listen to changes
parsed(console.log.bind(console, 'parsed data'));
```

## api

### var store = Store({ id: 'idProperty' }, api)
`Store` takes an object that tells what property to index by. `api`
is an object with get, add, edit, and delete functions. The returned `store` 
is an object like:

```js
{
    state: observ,
    actions: {
        get: fn,
        add: fn,
        edit: fn,
        delete: fn
    },
    set: fn,
    reset: fn
}
```

### store.set(object data)
Set one item.

### store.reset(array data)
Reset all the items.

### Store.Parse(observable, function parser)
Return a new `observ` that emits the return value from `parser`. Parser is a 
function that takes the state object emitted by `observable`:
```js
(state) => (/* ... */)
```

