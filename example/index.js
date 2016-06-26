var Store = require('../');
var api = require('./mock-api');
var store = Store({}, api);
var xtend = require('xtend');

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
store.set({ id: '123', example: 'test' });

// set all items
store.reset([ { id: 123, example: '123' }, { id: 1234, example: '1234' } ]);

module.exports = store;
