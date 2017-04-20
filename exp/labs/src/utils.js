Utils = {
    isString: function (v) {
        return typeof v === 'string';
    },
    isObject: function (v) {
        return (typeof v === 'object') && v !== null;
    },
    build: function(map, values, defaults) {
        return Object.keys(map || []).reduce(function(result, key) {
            if (Utils.isObject(map[key]) && !Array.isArray(map[key])) {
                result[key] = map[key];
                result[key].key = key;
                return result;
            }
            result[key] = {};
            values.forEach(function(current, i) {
                result[key][current] = map[key][i] || (defaults ? defaults[i] : undefined);
            });
            result[key].key = key;
            return result;
        }, {});
    },

    remove: function(arr) {
        var what, a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },

    flatten: function(arr) {
        return arr.reduce(function(flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? Utils.flatten(toFlatten) : toFlatten);
        }, []);
    },

    transpose: function(array) {
        return array[0].map(function(col, i) {
            return array.map(function(row) {
                return row[i];
            })
        });
    }
};

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}

if (!Array.prototype.uniq) {
    Array.prototype.uniq = function() {
        var u = {},
            a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }
}

Object.values = function(obj) {
    return Object.keys(obj).map(function(k) {
        return obj[k];
    });
};
