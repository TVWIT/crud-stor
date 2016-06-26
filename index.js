var xtend = require('xtend');
var observ = require('observ');

function CrudStore (opts, api) {
    opts = xtend({
        id: 'id'
    }, opts);

    var state = observ({
        isResolving: false,
        data: {}
    });

    function handleErr (err, cb) {
        state.set(xtend(state, { isResolving: false }));
        return cb(err);
    }

    function handleArgs (args, cb) {
        if (typeof args === 'function') {
            cb = args;
            args = {};
        }
        cb = cb || function () {}
    }

    function set (data) {
        var d = {};
        d[data[opts.id]] = data;
        var s = state();
        state.set(xtend(s, {
            isResolving: false,
            data: xtend(s.data, d)
        }));
    }

    function reset (data) {
        state.set(xtend(state(), {
            isResolving: false,
            data: data.reduce(function (acc, d) {
                acc[d[opts.id]] = d;
                return acc;
            }, {})
        }));
    }

    function addEdit (fn, args, cb) {
        handleArgs(args, cb);
        state.set(xtend(state(), { isResolving: true }));

        fn(args, function (err, resp) {
            if (err) {
                return handleErr(err, cb);
            }
            set(resp.data);
            cb(null, resp);
        });
    }

    var actions = {
        get: function (args, cb) {
            handleArgs(args, cb);
            state.set(xtend(state(), { isResolving: true }));
            api.get(args, function (err, resp) {
                if (err) {
                    return handleErr(err, cb);
                }
                reset(resp.data);
                cb(null, resp);
            });
        },

        add: addEdit.bind(null, api.add),
        edit: addEdit.bind(null, api.edit),

        delete: function (args, cb) {
            handleArgs(args, cb);
            state.set(xtend(state(), { isResolving: true }));
            api.delete(args, function (err, resp) {
                if (err) {
                    return handleErr(err, cb);
                }

                var s = state();
                delete s.data[args[opts.id]];
                state.set(xtend(state(), {
                    isResolving: false,
                    data: s.data
                }));

                cb(null, resp);
            });
        }

    };

    return {
        state: state,
        actions: actions,
        set: set,
        reset: reset
    };
}

CrudStore.Parse = function (state, parser) {
    var obs = observ(parser(state()));
    state(function onChange (data) {
        obs.set(parser(data));
    });
    return obs;
};


module.exports = CrudStore;
