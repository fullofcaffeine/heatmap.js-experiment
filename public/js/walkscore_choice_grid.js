(function() {
    "use strict";
    var t = this,
        e = t._ || require("./underscore-premixed"),
        n = t.$ || require("./fake-jquery"),
        i = t.BoxCacheMixin || require("./box-cache-mixin"),
        r = t.ListenerMixin || require("./listener-mixin"),
        a = t.BoundedGrid || require("./bounded-grid"),
        o = t.PopulationGrid || require("./population-grid"),
        s = t._ws_ || require("./util-shared"),
        u = function(t) {
            this._init(t)
        };
    ! function() {
        var h = u.prototype;
        h.getSlice = function(t, e, n, i, r) {
            return this._getSlice(t, e, n, i, r)
        }, h.getPopulationData = function(t) {
            return this._getPopulationData(t)
        }, h.getRoutabilityData = function() {
            return this._routed
        }, h.getTimeRange = function() {
            return this.timeRange
        }, h.setAfterPlaces = function(t) {
            this._getPlacesContinuation(!0, t)
        }, h.setAfterPopulation = function(t) {
            this._setAfterPopulation(t)
        }, h.setTimeFilter = function(t, e) {
            this._setTimeFilter(t, e)
        }, h.isReady = function() {
            return this._isReady
        };
        var g = u.BEFORE = "before",
            d = u.AFTER = "after",
            p = u.CHOICE = "choice",
            m = u.ACCESS = "access",
            _ = u.ROUTED = "routed",
            y = u.UNROUTED = "unrouted",
            v = u.TIMES = e.range(5, 21),
            R = u.REQUIRED_PARAMETERS = ["wsid", "grid", "fullUnrouted", "noUnrouted", "timeResolution", "timeRange", "ttapi", "categoryIds", "wantArrays"],
            b = a.PARAMETERS,
            w = ["gridReady"].concat(R),
            P = ["population", "times"],
            x = 0,
            A = 1,
            T = 3,
            M = 4,
            L = 5,
            I = 3,
            k = 3,
            B = function(t) {
                return e(t).map(function(t) {
                    return t - 0
                })
            };
        i(h, {
            size: 0
        }), r(h), s.ProfilingMixin(h), s.ChainableSettersMixin(h, R.concat(b), "_gFR"), s.PassThroughSettersMixin(h, "grid", b), a.mixinGetterPassThroughs(h), a.makeSetGridMethod(h, "_gFR"), h._init = function(t) {
            s.MapPolyfillMixins.LatLng(h), s.MapPolyfillMixins.LatLngBounds(h), s.MapPolyfillMixins.Polygon(h), this.setOptions(e({
                timeRange: v,
                timeResolution: null,
                fullUnrouted: !1,
                noUnrouted: !1,
                ttapi: !1,
                wantArrays: !1,
                grid: new a
            }).extend(t))
        }, h._gFR = s.makeGatherReqs(w, "_fetch"), h._gRR = s.makeGatherReqs(P, "_alertReady"), h._setCategoryIds = function(t) {
            this._gFR({
                categoryIds: B(t)
            })
        }, h._alertReady = function() {
            this._isReady = !0, this._alertListeners("ready")
        }, h._getSlice = function(t, n, i, r, a) {
            t || (t = this.timeRange[0]), n || (n = p), i || (i = g), r || (r = this.categoryIds), a || (a = _);
            var o = this.times,
                u = e(this.timeRange).oreduce(function(t, e, n) {
                    t[e] = n - 0
                }),
                l = t,
                c = o[g][a][u[l]],
                f = o[d][a][u[l]],
                h = this.population,
                y = this.afterPopulation,
                v = this.getLatLngTuples(),
                R = i == d,
                b = R ? f : c,
                w = n == m,
                P = 0,
                x = 0,
                A = s.makeBuffer(v.length, "int16", !0);
            r = e(r).map(function(t) {
                return t - 0
            }), r = e(e(e(this.categoryIds).oreduce(function(t, n, i) {
                e(r).include(n) && (t[i] = !0)
            })).keys()).map(function(t) {
                return t - 0
            });
            for (var T = 0; T < v.length; T++) {
                var M = 0,
                    L = h[T];
                R && (L += y[T]);
                for (var I = 0; I < r.length; I++) M += b[r[I]][T];
                A[T] = M ? w ? 1 : M : 0, P += A[T] * L, x += L
            }
            return {
                data: this.wantArrays ? [].slice.call(A) : A,
                count: P / x
            }
        }, h._fetch = function() {
            this._getCategoryMap(), this._getPopulation()
        }, h._getTtapi = function() {
            return this.ttapi || t.window && getUrlParam("ttapi") ? "/ttapi" : "/rentals"
        }, h._getCategoryMap = function() {
            var t = e(function(t) {
                var n = this.categoryIds;
                this._catMap = e(t).oreduce(function(t, i, r) {
                    e(i).each(function(i) {
                        (e(n).include(i) || e(n).include(parseInt(r))) && (t[i] || (t[i] = [])).push(r)
                    })
                }), this._getRoutability()
            }).bind(this);
            s.retryAjax({
                url: "/auth/places/v1/get-place-categories-map",
                dataType: "json",
                success: t
            })
        }, h._getRoutability = function() {
            if (this.noUnrouted || this.fullUnrouted) return this._getPlaces();
            for (var t = [].slice.call(this.getLatLngTuples()), n = this._routed = s.makeBuffer(t.length, "int8", !0), i = 0, r = t.length, a = Math.max(Math.min(Math.ceil(r / 16), 64), 4), o = 0, u = Math.ceil(r / a), l = this._getTtapi(), h = e(this._getPlaces).bind(this), g = e(this._alertListeners).bind(this, "routability"), d = function(t, i) {
                    e(i).isString() && (i = i.split("\n"));
                    for (var r = t * a, s = i.length, l = 0; s > l; l++) n[r + l] = i[l];
                    g({
                        ready: ++o,
                        total: u
                    }), o == u && h()
                }, p = function(t, n) {
                    c({
                        url: s.domainRoundRobinAJAXUrl(l),
                        type: "POST",
                        dataType: "text",
                        success: e(d).bind(this, n),
                        traditional: !0,
                        data: {
                            routable: !0,
                            _int: !0,
                            destinations: f(t),
                            mode: "walk"
                        }
                    }, {
                        single: !0
                    })
                }; t.length;) p(t.splice(0, a), i++)
        }, h._getPlaces = function(t, n) {
            for (var i = k * (this.timeRange[this.timeRange.length - 1] / 60), r = this.getClip(i), a = this._boxSetForBounds(r.getBounds()), o = a.length, s = e(this._getPlacesContinuation).bind(this, t), u = [], l = e(function(t) {
                    for (var e = 0; e < t.length; e++) r.containsTuple(t[e]) && (!n || n(t[e])) && u.push(t[e]);
                    --o || s(u)
                }).bind(this); a.length;) this._withBox(a.shift(), l)
        }, h._setTimeFilter = function(t, e) {
            this._getPlaces(t == d, function(t) {
                return t[M] <= e && (!t[L] || t[L] > e)
            })
        }, h._getPlacesContinuation = function(t, n) {
            var i = this.getLatLngTuples(),
                r = 0,
                a = this.timeRange,
                o = e(a).map(function(t) {
                    return 60 * t | 0
                }),
                u = o.length,
                h = this.getLatLngTuples().length,
                p = this._makeTimes(t),
                m = this.categoryIds,
                v = this.timeResolution || "",
                R = e(m).oreduce(function(t, e, n) {
                    t[e] = n - 0
                }),
                b = this._getTtapi(),
                w = e(this._gRR).bind(this, {
                    times: p
                }),
                P = e(this._alertListeners).bind(this);
            n = e(n).reject(function(t) {
                return void 0 === R[t[T]]
            });
            var M = e(n).oreduce(function(t, e) {
                    var n = [s.snapToGrid(e[x]), s.snapToGrid(e[A])].join(",");
                    t[n] || (t[n] = {}), t[n][R[e[T]]] || (t[n][R[e[T]]] = 0), t[n][R[e[T]]]++
                }),
                L = function(n, i, a) {
                    var s = t ? d : g,
                        l = p[s][n];
                    e(a).isString() && (a = e(a.split("\n")).map(function(t) {
                        return e(t.split(",") || []).map(function(t) {
                            return t - 0 | 0
                        })
                    }));
                    for (var c = 0; c < a.length; c++)
                        for (var f = a[c], _ = M[i[c]] || [], y = 0; y < m.length; y++) {
                            var v = _[y] || 0;
                            if (v)
                                for (var R = 0; h > R; R++)
                                    if (-1 != f[R])
                                        for (var b = u - 1; b >= 0 && f[R] <= o[b]; b--) l[b][y][R] += v
                        }
                    P(n, {
                        ready: r += i.length,
                        total: k
                    }), r == k && e(G).defer(), U()
                },
                I = e(M).keys(),
                k = I.length,
                B = Math.max(Math.min(Math.ceil(I.length / 16), 32), 4);
            I.length || w();
            var U, E = f(i),
                C = 60 * this.timeRange[this.timeRange.length - 1],
                F = l(i, L, C),
                S = function(t, n) {
                    return n || (n = 0), n > 4 ? L(_, t, null) : void c({
                        url: s.domainRoundRobinAJAXUrl(b),
                        type: "POST",
                        dataType: "text",
                        success: e(L).bind(this, _, t),
                        error: e(S).bind(this, t, n + 1),
                        traditional: !0,
                        data: {
                            commute: !0,
                            grid: v,
                            _int: !0,
                            destinations: f(t),
                            origins: E,
                            time: a[a.length - 1],
                            mode: "walk"
                        }
                    })
                },
                j = function(t) {
                    var e = I.slice();
                    U = function() {
                        e.length && t(e.splice(0, B))
                    };
                    for (var n = 0; 32 > n; n++) U()
                },
                G = w;
            if (this.noUnrouted ? j(S, _) : this.fullUnrouted ? j(F, y) : (G = function() {
                    G = w, r = 0, j(F, y)
                }, j(S, _)), !t) {
                var q = this.counts = {
                    totalPlaces: (n || []).length,
                    trimmedPlaces: (e(M).keys() || []).length,
                    points: (i || []).length
                };
                q.times = q.trimmedPlaces * q.points
            }
        }, h._getPopulation = function() {
            var t = this.populationGrid = new o({
                wsid: this.wsid,
                grid: this.grid
            });
            t.on("ready", e(this._getPopulationContinuation).bind(this))
        }, h._setAfterPopulation = function(t) {
            this.afterPopulation = s.makeBuffer(this.getLatLngTuples().length), e(t || []).each(e(function(t) {
                this.afterPopulation[this.getIndexForLatLngTuple(t)] += t[I] - 0
            }).bind(this))
        }, h._getPopulationContinuation = function() {
            this._setAfterPopulation(), this._gRR({
                population: this.populationGrid.getData()
            })
        }, h._getPopulationData = function(t) {
            t || (t = g);
            for (var e = this.population, n = this.afterPopulation, i = this.getLatLngTuples().length, r = t == d, a = s.makeBuffer(i, "float", !0), o = 0; i > o; o++) a[o] = e[o], r && (a[o] += n[o]);
            return a
        }, h._fetchBox = function(t, e) {
            var i = {
                    box: t.join(","),
                    category_id: this.categoryIds.join("|"),
                    wsid: this.wsid
                },
                r = u.enableTimeFilters ? "/api/v1/place_box_time_stubs/json" : "/api/v1/place_box_index_stubs/json",
                a = 0,
                o = function() {
                    if (a++ > 3) throw "Failed to fetch a place box";
                    n.ajax({
                        url: s.domainRoundRobinAJAXUrl(r),
                        data: i,
                        dataType: "json",
                        success: e,
                        error: o
                    })
                };
            o()
        }, h._processBoxData = function(t) {
            var n = this._catMap;
            return e(e(e(t).spelunk(["response", "places"]) || []).map(function(t) {
                return e(n[t[T]]).map(function(e) {
                    var n = t.slice();
                    return n[T] = e, n
                })
            })).flattenOneLevel()
        }, h._makeBuffers = function() {
            var t = this.categoryIds,
                n = this.getLatLngTuples().length,
                i = this.timeRange,
                r = [_, y],
                a = 2,
                o = 0,
                s = new ArrayBuffer(t.length * i.length * r.length * n * a);
            return e(r).oreduce(function(r, u) {
                r[u] = e(i).map(function() {
                    return e(t).map(function() {
                        var t = new Int16Array(s, o, n);
                        return o += n * a, t
                    })
                })
            })
        }, h._makeTimes = function(t) {
            var n = this.times || {};
            return n[t ? "after" : "before"] = this._makeBuffers(), u.afterIsAbsolute ? (!n.after || t) && (n.after = this._makeBuffers()) : t ? e(n.after).each(function(t, i) {
                n.after[i] = e(n.before[i]).map(function(t) {
                    return e(t).map(function(t, e) {
                        for (var n = [], i = t.length, e = 0; i > e; e++) n[e] = t[e];
                        return n
                    })
                })
            }) : n.after = n.before, n
        }
    }();
    var l = function(n, i, r) {
            var a = [],
                o = n.length,
                l = 1200 / 1609.34,
                c = function() {
                    a.length && a.shift()()
                },
                f = null,
                h = null,
                g = null,
                d = 0,
                p = new Float64Array(new ArrayBuffer(2 * o * 8), 0, 2 * o);
            t.window && (c = function() {
                a.length && e(a.shift()).defer()
            });
            for (var m = 0; o > m; m++) p[2 * m] = n[m][0], p[2 * m + 1] = n[m][1];
            var _ = function(t) {
                var e = t.length;
                if (!h) {
                    h = new ArrayBuffer(o * e * 2), d = o * e / 2, g = new Int32Array(h, 0, d), f = new Array(e);
                    for (var n = 0; e > n; n++) f[n] = new Int16Array(h, n * o * 2, o)
                }
                for (var n = 0; d > n; n++) g[n] = -1;
                for (var n = 0; e > n; n++)
                    for (var a = parseFloat(t[n]), m = parseFloat(t[n].substr(t[n].indexOf(",") + 1)), _ = s.scaleInMeters(a, m), y = _[0] * l, v = _[1] * l, R = r / y, b = r / v, w = y * y, P = v * v, x = 0, A = 0, T = 0, M = f[n], L = 0; o > L; L++)(x = a - p[L << 1]) <= R && (A = m - p[L << 1 | 1]) <= b && (T = Math.sqrt(x * x * w + A * A * P)) <= r && (M[L] = 0 | T);
                i(u.UNROUTED, t, f), c()
            };
            return function(t) {
                a.length || e(c).defer(), a.push(e(_).bind({}, t))
            }
        },
        c = function(i, r) {
            r || (r = {});
            var a = i.success,
                o = new Error("Unknown"),
                u = i.error || function() {
                    throw o
                },
                l = 0,
                c = function(t) {
                    try {
                        var n = 4,
                            i = 4,
                            s = n * i,
                            u = new Int32Array(t, 0, i),
                            c = u[0],
                            h = u[1],
                            g = u[2],
                            d = u[3],
                            p = 3 & h;
                        if (1196575044 != c) throw new Error("Grid buffer corruption (wrong magic number)");
                        var m = [function() {
                                throw new Error("Zero byte values?")
                            }, Int8Array, Int16Array, Int32Array][p],
                            _ = r.single ? new m(t, s, g) : new Array(g);
                        if (!r.single)
                            for (var y = 0; g > y; y++) _[y] = new m(t, s + y * d * p, d);
                        a(_)
                    } catch (v) {
                        o = v, e(f).delay(1 << l)
                    }
                },
                f = function() {
                    return ++l > 16 ? u() : void(t.window ? s.retryAjax(i, 10) : n.ajax(e(i).extend({
                        dataType: "arraybuffer",
                        success: c,
                        error: f,
                        data: e(i.data).extend({
                            arraybuffer: 1
                        })
                    })))
                };
            f()
        },
        f = function(t) {
            return t[0] instanceof Array ? e(t).map(function(t) {
                return t[0] + "," + t[1]
            }).join("|") : t.join("|")
        };
    t.window ? t.ChoiceGrid = u : module.exports = u
}).call(this);
