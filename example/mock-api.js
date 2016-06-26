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
