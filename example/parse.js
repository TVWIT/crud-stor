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

