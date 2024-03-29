(function() {
    function n(t, r, e) {
        if (t === r) return 0 !== t || 1 / t == 1 / r;
        if (null == t || null == r) return t === r;
        if (t._chain && (t = t._wrapped), r._chain && (r = r._wrapped), t.isEqual && A.isFunction(t.isEqual)) return t.isEqual(r);
        if (r.isEqual && A.isFunction(r.isEqual)) return r.isEqual(t);
        var u = l.call(t);
        if (u != l.call(r)) return !1;
        switch (u) {
            case "[object String]":
                return t == String(r);
            case "[object Number]":
                return t != +t ? r != +r : 0 == t ? 1 / t == 1 / r : t == +r;
            case "[object Date]":
            case "[object Boolean]":
                return +t == +r;
            case "[object RegExp]":
                return t.source == r.source && t.global == r.global && t.multiline == r.multiline && t.ignoreCase == r.ignoreCase
        }
        if ("object" != typeof t || "object" != typeof r) return !1;
        for (var i = e.length; i--;)
            if (e[i] == t) return !0;
        e.push(t);
        var a = 0,
            c = !0;
        if ("[object Array]" == u) {
            if (a = t.length, c = a == r.length)
                for (; a-- && (c = a in t == a in r && n(t[a], r[a], e)););
        } else {
            if ("constructor" in t != "constructor" in r || t.constructor != r.constructor) return !1;
            for (var o in t)
                if (A.has(t, o) && (a++, !(c = A.has(r, o) && n(t[o], r[o], e)))) break;
            if (c) {
                for (o in r)
                    if (A.has(r, o) && !a--) break;
                c = !a
            }
        }
        return e.pop(), c
    }
    var t = this,
        r = t._,
        e = {},
        u = Array.prototype,
        i = Object.prototype,
        a = Function.prototype,
        c = u.slice,
        o = u.unshift,
        l = i.toString,
        f = i.hasOwnProperty,
        s = u.forEach,
        p = u.map,
        h = u.reduce,
        v = u.reduceRight,
        g = u.filter,
        d = u.every,
        m = u.some,
        y = u.indexOf,
        b = u.lastIndexOf,
        x = Array.isArray,
        j = Object.keys,
        _ = a.bind,
        A = function(n) {
            return new N(n)
        };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = A), exports._ = A) : t._ = A, A.VERSION = "1.3.3";
    var w = A.each = A.forEach = function(n, t, r) {
        if (null != n)
            if (s && n.forEach === s) n.forEach(t, r);
            else if (n.length === +n.length) {
            for (var u = 0, i = n.length; i > u; u++)
                if (u in n && t.call(r, n[u], u, n) === e) return
        } else
            for (var a in n)
                if (A.has(n, a) && t.call(r, n[a], a, n) === e) return
    };
    A.map = A.collect = function(n, t, r) {
        var e = [];
        return null == n ? e : p && n.map === p ? n.map(t, r) : (w(n, function(n, u, i) {
            e[e.length] = t.call(r, n, u, i)
        }), n.length === +n.length && (e.length = n.length), e)
    }, A.reduce = A.foldl = A.inject = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), h && n.reduce === h) return e && (t = A.bind(t, e)), u ? n.reduce(t, r) : n.reduce(t);
        if (w(n, function(n, i, a) {
                u ? r = t.call(e, r, n, i, a) : (r = n, u = !0)
            }), !u) throw new TypeError("Reduce of empty array with no initial value");
        return r
    }, A.reduceRight = A.foldr = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), v && n.reduceRight === v) return e && (t = A.bind(t, e)), u ? n.reduceRight(t, r) : n.reduceRight(t);
        var i = A.toArray(n).reverse();
        return e && !u && (t = A.bind(t, e)), u ? A.reduce(i, t, r, e) : A.reduce(i, t)
    }, A.find = A.detect = function(n, t, r) {
        var e;
        return E(n, function(n, u, i) {
            return t.call(r, n, u, i) ? (e = n, !0) : void 0
        }), e
    }, A.filter = A.select = function(n, t, r) {
        var e = [];
        return null == n ? e : g && n.filter === g ? n.filter(t, r) : (w(n, function(n, u, i) {
            t.call(r, n, u, i) && (e[e.length] = n)
        }), e)
    }, A.reject = function(n, t, r) {
        var e = [];
        return null == n ? e : (w(n, function(n, u, i) {
            t.call(r, n, u, i) || (e[e.length] = n)
        }), e)
    }, A.every = A.all = function(n, t, r) {
        var u = !0;
        return null == n ? u : d && n.every === d ? n.every(t, r) : (w(n, function(n, i, a) {
            return (u = u && t.call(r, n, i, a)) ? void 0 : e
        }), !!u)
    };
    var E = A.some = A.any = function(n, t, r) {
        t || (t = A.identity);
        var u = !1;
        return null == n ? u : m && n.some === m ? n.some(t, r) : (w(n, function(n, i, a) {
            return u || (u = t.call(r, n, i, a)) ? e : void 0
        }), !!u)
    };
    A.include = A.contains = function(n, t) {
        var r = !1;
        return null == n ? r : y && n.indexOf === y ? -1 != n.indexOf(t) : r = E(n, function(n) {
            return n === t
        })
    }, A.invoke = function(n, t) {
        var r = c.call(arguments, 2);
        return A.map(n, function(n) {
            return (A.isFunction(t) ? t || n : n[t]).apply(n, r)
        })
    }, A.pluck = function(n, t) {
        return A.map(n, function(n) {
            return n[t]
        })
    }, A.max = function(n, t, r) {
        if (!t && A.isArray(n) && n[0] === +n[0]) return Math.max.apply(Math, n);
        if (!t && A.isEmpty(n)) return -1 / 0;
        var e = {
            computed: -1 / 0
        };
        return w(n, function(n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            a >= e.computed && (e = {
                value: n,
                computed: a
            })
        }), e.value
    }, A.min = function(n, t, r) {
        if (!t && A.isArray(n) && n[0] === +n[0]) return Math.min.apply(Math, n);
        if (!t && A.isEmpty(n)) return 1 / 0;
        var e = {
            computed: 1 / 0
        };
        return w(n, function(n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            a < e.computed && (e = {
                value: n,
                computed: a
            })
        }), e.value
    }, A.shuffle = function(n) {
        var t, r = [];
        return w(n, function(n, e) {
            t = Math.floor(Math.random() * (e + 1)), r[e] = r[t], r[t] = n
        }), r
    }, A.sortBy = function(n, t, r) {
        var e = A.isFunction(t) ? t : function(n) {
            return n[t]
        };
        return A.pluck(A.map(n, function(n, t, u) {
            return {
                value: n,
                criteria: e.call(r, n, t, u)
            }
        }).sort(function(n, t) {
            var r = n.criteria,
                e = t.criteria;
            return void 0 === r ? 1 : void 0 === e ? -1 : e > r ? -1 : r > e ? 1 : 0
        }), "value")
    }, A.groupBy = function(n, t) {
        var r = {},
            e = A.isFunction(t) ? t : function(n) {
                return n[t]
            };
        return w(n, function(n, t) {
            var u = e(n, t);
            (r[u] || (r[u] = [])).push(n)
        }), r
    }, A.sortedIndex = function(n, t, r) {
        r || (r = A.identity);
        for (var e = 0, u = n.length; u > e;) {
            var i = e + u >> 1;
            r(n[i]) < r(t) ? e = i + 1 : u = i
        }
        return e
    }, A.toArray = function(n) {
        return n ? A.isArray(n) ? c.call(n) : A.isArguments(n) ? c.call(n) : n.toArray && A.isFunction(n.toArray) ? n.toArray() : A.values(n) : []
    }, A.size = function(n) {
        return A.isArray(n) ? n.length : A.keys(n).length
    }, A.first = A.head = A.take = function(n, t, r) {
        return null == t || r ? n[0] : c.call(n, 0, t)
    }, A.initial = function(n, t, r) {
        return c.call(n, 0, n.length - (null == t || r ? 1 : t))
    }, A.last = function(n, t, r) {
        return null == t || r ? n[n.length - 1] : c.call(n, Math.max(n.length - t, 0))
    }, A.rest = A.tail = function(n, t, r) {
        return c.call(n, null == t || r ? 1 : t)
    }, A.compact = function(n) {
        return A.filter(n, function(n) {
            return !!n
        })
    }, A.flatten = function(n, t) {
        return A.reduce(n, function(n, r) {
            return A.isArray(r) ? n.concat(t ? r : A.flatten(r)) : (n[n.length] = r, n)
        }, [])
    }, A.without = function(n) {
        return A.difference(n, c.call(arguments, 1))
    }, A.uniq = A.unique = function(n, t, r) {
        var e = r ? A.map(n, r) : n,
            u = [];
        return n.length < 3 && (t = !0), A.reduce(e, function(r, e, i) {
            return (t ? A.last(r) === e && r.length : A.include(r, e)) || (r.push(e), u.push(n[i])), r
        }, []), u
    }, A.union = function() {
        return A.uniq(A.flatten(arguments, !0))
    }, A.intersection = A.intersect = function(n) {
        var t = c.call(arguments, 1);
        return A.filter(A.uniq(n), function(n) {
            return A.every(t, function(t) {
                return A.indexOf(t, n) >= 0
            })
        })
    }, A.difference = function(n) {
        var t = A.flatten(c.call(arguments, 1), !0);
        return A.filter(n, function(n) {
            return !A.include(t, n)
        })
    }, A.zip = function() {
        for (var n = c.call(arguments), t = A.max(A.pluck(n, "length")), r = new Array(t), e = 0; t > e; e++) r[e] = A.pluck(n, "" + e);
        return r
    }, A.indexOf = function(n, t, r) {
        if (null == n) return -1;
        var e, u;
        if (r) return e = A.sortedIndex(n, t), n[e] === t ? e : -1;
        if (y && n.indexOf === y) return n.indexOf(t);
        for (e = 0, u = n.length; u > e; e++)
            if (e in n && n[e] === t) return e;
        return -1
    }, A.lastIndexOf = function(n, t) {
        if (null == n) return -1;
        if (b && n.lastIndexOf === b) return n.lastIndexOf(t);
        for (var r = n.length; r--;)
            if (r in n && n[r] === t) return r;
        return -1
    }, A.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0, n = 0), r = arguments[2] || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = 0, i = new Array(e); e > u;) i[u++] = n, n += r;
        return i
    };
    var O = function() {};
    A.bind = function(n, t) {
        var r, e;
        if (n.bind === _ && _) return _.apply(n, c.call(arguments, 1));
        if (!A.isFunction(n)) throw new TypeError;
        return e = c.call(arguments, 2), r = function() {
            if (!(this instanceof r)) return n.apply(t, e.concat(c.call(arguments)));
            O.prototype = n.prototype;
            var u = new O,
                i = n.apply(u, e.concat(c.call(arguments)));
            return Object(i) === i ? i : u
        }
    }, A.bindAll = function(n) {
        var t = c.call(arguments, 1);
        return 0 == t.length && (t = A.functions(n)), w(t, function(t) {
            n[t] = A.bind(n[t], n)
        }), n
    }, A.memoize = function(n, t) {
        var r = {};
        return t || (t = A.identity),
            function() {
                var e = t.apply(this, arguments);
                return A.has(r, e) ? r[e] : r[e] = n.apply(this, arguments)
            }
    }, A.delay = function(n, t) {
        var r = c.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r)
        }, t)
    }, A.defer = function(n) {
        return A.delay.apply(A, [n, 1].concat(c.call(arguments, 1)))
    }, A.throttle = function(n, t) {
        var r, e, u, i, a, c, o = A.debounce(function() {
            a = i = !1
        }, t);
        return function() {
            r = this, e = arguments;
            var l = function() {
                u = null, a && n.apply(r, e), o()
            };
            return u || (u = setTimeout(l, t)), i ? a = !0 : c = n.apply(r, e), o(), i = !0, c
        }
    }, A.debounce = function(n, t, r) {
        var e;
        return function() {
            var u = this,
                i = arguments,
                a = function() {
                    e = null, r || n.apply(u, i)
                };
            r && !e && n.apply(u, i), clearTimeout(e), e = setTimeout(a, t)
        }
    }, A.once = function(n) {
        var t, r = !1;
        return function() {
            return r ? t : (r = !0, t = n.apply(this, arguments))
        }
    }, A.wrap = function(n, t) {
        return function() {
            var r = [n].concat(c.call(arguments, 0));
            return t.apply(this, r)
        }
    }, A.compose = function() {
        var n = arguments;
        return function() {
            for (var t = arguments, r = n.length - 1; r >= 0; r--) t = [n[r].apply(this, t)];
            return t[0]
        }
    }, A.after = function(n, t) {
        return 0 >= n ? t() : function() {
            return --n < 1 ? t.apply(this, arguments) : void 0
        }
    }, A.keys = j || function(n) {
        if (n !== Object(n)) throw new TypeError("Invalid object");
        var t = [];
        for (var r in n) A.has(n, r) && (t[t.length] = r);
        return t
    }, A.values = function(n) {
        return A.map(n, A.identity)
    }, A.functions = A.methods = function(n) {
        var t = [];
        for (var r in n) A.isFunction(n[r]) && t.push(r);
        return t.sort()
    }, A.extend = function(n) {
        return w(c.call(arguments, 1), function(t) {
            for (var r in t) n[r] = t[r]
        }), n
    }, A.pick = function(n) {
        var t = {};
        return w(A.flatten(c.call(arguments, 1)), function(r) {
            r in n && (t[r] = n[r])
        }), t
    }, A.defaults = function(n) {
        return w(c.call(arguments, 1), function(t) {
            for (var r in t) null == n[r] && (n[r] = t[r])
        }), n
    }, A.clone = function(n) {
        return A.isObject(n) ? A.isArray(n) ? n.slice() : A.extend({}, n) : n
    }, A.tap = function(n, t) {
        return t(n), n
    }, A.isEqual = function(t, r) {
        return n(t, r, [])
    }, A.isEmpty = function(n) {
        if (null == n) return !0;
        if (A.isArray(n) || A.isString(n)) return 0 === n.length;
        for (var t in n)
            if (A.has(n, t)) return !1;
        return !0
    }, A.isElement = function(n) {
        return !(!n || 1 != n.nodeType)
    }, A.isArray = x || function(n) {
        return "[object Array]" == l.call(n)
    }, A.isObject = function(n) {
        return n === Object(n)
    }, A.isArguments = function(n) {
        return "[object Arguments]" == l.call(n)
    }, A.isArguments(arguments) || (A.isArguments = function(n) {
        return !(!n || !A.has(n, "callee"))
    }), A.isFunction = function(n) {
        return "[object Function]" == l.call(n)
    }, A.isString = function(n) {
        return "[object String]" == l.call(n)
    }, A.isNumber = function(n) {
        return "[object Number]" == l.call(n)
    }, A.isFinite = function(n) {
        return A.isNumber(n) && isFinite(n)
    }, A.isNaN = function(n) {
        return n !== n
    }, A.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" == l.call(n)
    }, A.isDate = function(n) {
        return "[object Date]" == l.call(n)
    }, A.isRegExp = function(n) {
        return "[object RegExp]" == l.call(n)
    }, A.isNull = function(n) {
        return null === n
    }, A.isUndefined = function(n) {
        return void 0 === n
    }, A.has = function(n, t) {
        return f.call(n, t)
    }, A.noConflict = function() {
        return t._ = r, this
    }, A.identity = function(n) {
        return n
    }, A.times = function(n, t, r) {
        for (var e = 0; n > e; e++) t.call(r, e)
    }, A.escape = function(n) {
        return ("" + n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
    }, A.result = function(n, t) {
        if (null == n) return null;
        var r = n[t];
        return A.isFunction(r) ? r.call(n) : r
    }, A.mixin = function(n) {
        w(A.functions(n), function(t) {
            B(t, A[t] = n[t])
        })
    };
    var F = 0;
    A.uniqueId = function(n) {
        var t = F++;
        return n ? n + t : t
    }, A.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var q = /.^/,
        k = {
            "\\": "\\",
            "'": "'",
            r: "\r",
            n: "\n",
            t: "  ",
            u2028: "\u2028",
            u2029: "\u2029"
        };
    for (var S in k) k[k[S]] = S;
    var R = /\\|'|\r|\n|\t|\u2028|\u2029/g,
        I = /\\(\\|'|r|n|t|u2028|u2029)/g,
        M = function(n) {
            return n.replace(I, function(n, t) {
                return k[t]
            })
        };
    A.template = function(n, t, r) {
        r = A.defaults(r || {}, A.templateSettings);
        var e = "__p+='" + n.replace(R, function(n) {
            return "\\" + k[n]
        }).replace(r.escape || q, function(n, t) {
            return "'+\n_.escape(" + M(t) + ")+\n'"
        }).replace(r.interpolate || q, function(n, t) {
            return "'+\n(" + M(t) + ")+\n'"
        }).replace(r.evaluate || q, function(n, t) {
            return "';\n" + M(t) + "\n;__p+='"
        }) + "';\n";
        r.variable || (e = "with(obj||{}){\n" + e + "}\n"), e = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + e + "return __p;\n";
        var u = new Function(r.variable || "obj", "_", e);
        if (t) return u(t, A);
        var i = function(n) {
            return u.call(this, n, A)
        };
        return i.source = "function(" + (r.variable || "obj") + "){\n" + e + "}", i
    }, A.chain = function(n) {
        return A(n).chain()
    };
    var N = function(n) {
        this._wrapped = n
    };
    A.prototype = N.prototype;
    var T = function(n, t) {
            return t ? A(n).chain() : n
        },
        B = function(n, t) {
            N.prototype[n] = function() {
                var n = c.call(arguments);
                return o.call(n, this._wrapped), T(t.apply(A, n), this._chain)
            }
        };
    A.mixin(A), w(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(n) {
        var t = u[n];
        N.prototype[n] = function() {
            var r = this._wrapped;
            t.apply(r, arguments);
            var e = r.length;
            return "shift" != n && "splice" != n || 0 !== e || delete r[0], T(r, this._chain)
        }
    }), w(["concat", "join", "slice"], function(n) {
        var t = u[n];
        N.prototype[n] = function() {
            return T(t.apply(this._wrapped, arguments), this._chain)
        }
    }), N.prototype.chain = function() {
        return this._chain = !0, this
    }, N.prototype.value = function() {
        return this._wrapped
    }
}).call(this);
