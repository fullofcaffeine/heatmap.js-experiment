(function() {
    "use strict";
    var t = this,
        n = t._ || require("./underscore-premixed"),
        i = (t.$ || require("./fake-jquery"), t._ws_ || require("./util-shared")),
        e = t.PolygonClipper || require("./polygon-clipper"),
        o = t.ListenerMixin || require("./listener-mixin"),
        s = i.boundsFromCommaSeparatedLatLng,
        r = i.boundsFromBoxKey,
        u = i.decodeGooglePolygonPaths,
        a = i.decodeGeoJSONPolygonPaths,
        h = function(t) {
            this._init(t)
        };
    ! function() {
        var t = h.prototype,
            l = ["snap", "noClip", "bounds", "poly", "forceSquare"],
            g = h.PARAMETERS = l.concat(["geometry", "geojson", "granularity", "resolution", "point", "box"]);
        i.ChainableSettersMixin(t, g, "_req"), o(t), t.getLatLngTuples = function() {
            return this._lls
        }, t.getCenterTuple = function() {
            return this._center
        }, t.getSouthWestTuple = function() {
            return this._sw
        }, t.getNorthEastTuple = function() {
            return this._ne
        }, t.getGranularity = function() {
            return this.granularity
        }, t.getLatCount = function() {
            return this._iLat
        }, t.getLngCount = function() {
            return this._iLng
        }, t.getIndirectionMap = function() {
            return this._iMap
        }, t.getResolution = function() {
            return this.resolution
        }, t.getBounds = function() {
            return this.bounds
        }, t.getPolygon = function() {
            return this.poly
        }, t.getIndexForLatLngTuple = function(t) {
            return this._getIFLLT(t)
        }, t.getClip = function(t, n) {
            return this._getClip(t, n)
        }, h.mixinGetterPassThroughs = function(t) {
            n(["getLatLngTuples", "getCenterTuple", "getSouthWestTuple", "getNorthEastTuple", "getGranularity", "getLatCount", "getLngCount", "getIndirectionMap", "getResolution", "getBounds", "getPolygon", "getIndexForLatLngTuple", "getClip"]).each(function(n) {
                t[n] = function() {
                    return this.grid[n].apply(this.grid, [].slice.call(arguments))
                }
            })
        }, h.makeSetGridMethod = function(t, i) {
            t._setGrid = function(t) {
                var e = t.getBounds();
                e || t.on("ready", n(this[i]).bind(this, {
                    gridReady: !0
                })), this[i]({
                    grid: t,
                    gridReady: e
                })
            }
        }, t.makeFlattener = function(t, n) {
            var e = (this.getBounds(), this),
                o = t,
                s = this.getLatCount(),
                r = this.getLngCount(),
                u = this.getSouthWestTuple(),
                a = s * r,
                h = i.makeBuffer(a, "float");
            return function(t) {
                for (var i = t.data, a = i.length, l = i[0].length, g = t.southwest.split(","), p = Math.round((g[0] - u[0]) / e.granularity), d = Math.round((g[1] - u[1]) / e.granularity), _ = 0; a > _; _++)
                    if (_ + p >= 0 && s > _ + p)
                        for (var f = 0; l > f; f++) f + d >= 0 && r > f + d && (h[(_ + p) * r + f + d] = i[_][f]);
                    --o || n(h)
            }
        }, t._init = function(e) {
            i.MapPolyfillMixins.LatLng(t), i.MapPolyfillMixins.LatLngBounds(t), i.MapPolyfillMixins.Polygon(t), this.setOptions(n({
                snap: !0,
                noClip: !1,
                forceSquare: !1
            }).extend(e))
        }, t._req = i.makeGatherReqs(["_rg"].concat(l), "_makeGrid"), t._getClip = function(t, n) {
            return new e({
                polygon: this.poly,
                point: this.point,
                toleranceInMiles: t,
                debug: n
            })
        }, t._setBounds = function(t) {
            this._up({
                bounds: t
            })
        }, t._setGeometry = function(t) {
            this._up({
                geometry: u(t)
            })
        }, t._setGeojson = function(t) {
            this._up({
                geometry: a(t)
            })
        }, t._setResolution = function(t) {
            this._up({
                resolution: t,
                _rg: 1
            })
        }, t._setGranularity = function(t) {
            this._up({
                granularity: t,
                _rg: 1
            })
        }, t._setPoint = function(t) {
            this._up({
                point: !0,
                noClip: !0,
                bounds: s(t)
            })
        }, t._setBox = function(t) {
            this._up({
                noClip: !0,
                snap: !0,
                bounds: r(t)
            })
        }, t._up = function(t) {
            this._req(t), this._ensurePolyAndBounds()
        }, t._ensureResolutionAndGranularity = function() {
            var t = this.bounds,
                n = t.getSouthWest(),
                i = t.getNorthEast();
            this.granularity || (this.granularity = Math.max(i.lat() - n.lat(), i.lng() - n.lng()) / this.resolution), this.resolution || (this.resolution = Math.max(i.lat() - n.lat(), i.lng() - n.lng()) / this.granularity)
        }, t._getLL = function(t) {
            var e = this.granularity;
            return this.snap ? n(t).map(function(t) {
                return i.snapToGrid(t, e)
            }) : t
        }, t._makeGrid = function() {
            if (!this._grid) {
                this._ensureResolutionAndGranularity();
                var t = this.bounds,
                    n = (this.resolution, this.granularity),
                    o = t.getSouthWest(),
                    s = t.getNorthEast(),
                    r = this._getLL([o.lat(), o.lng()]),
                    u = this._getLL([s.lat(), s.lng()]),
                    a = [(r[0] + u[0]) / 2, (r[1] + u[1]) / 2],
                    h = this.point,
                    l = h ? 1 : Math.floor((u[0] + 2 * n - r[0]) / n),
                    g = h ? 1 : Math.floor((u[1] + 2 * n - r[1]) / n),
                    p = l * g,
                    d = i.makeBuffer(p, "int32"),
                    _ = new e({
                        polygon: this.poly
                    }),
                    f = this.noClip,
                    c = [];
                this.forceSquare && (l = g = this.forceSquare);
                for (var y = 0, L = 0; l > L; L++)
                    for (var m = 0; g > m; m++) {
                        var M = [r[0] + L * n, r[1] + m * n];
                        f || _.containsTuple(M) ? (d[L * g + m] = y, c[y++] = M) : d[L * g + m] = -1
                    }
                this._grid = n, this._iMap = d, this._iLat = l, this._iLng = g, this._lls = c, this._center = a, this._sw = r, this._ne = u, this._alertListeners("ready")
            }
        }, t._getIFLLT = function(t) {
            var n = this._sw,
                i = this._ne,
                e = this._grid,
                o = this._iMap,
                s = this._iLng,
                r = Math.round((t[0] - n[0]) / e),
                u = Math.round((t[1] - n[1]) / e);
            if (t[0] < n[0] || t[0] > i[0]) return -1;
            if (t[1] < n[1] || t[1] > i[1]) return -1;
            var a = r * s + u;
            return a >= o.length || 0 > a ? -1 : o[a]
        }, t.makeFastGetIFLLT = function() {
            if (!this.noClip) throw "Not implemented";
            var t = this._sw,
                n = this._ne,
                i = this._grid,
                e = this._iLng;
            return function(o) {
                return o[0] < t[0] || o[0] > n[0] ? -1 : o[1] < t[1] || o[1] > n[1] ? -1 : Math.round((o[0] - t[0]) / i) * e + Math.round((o[1] - t[1]) / i)
            }
        }, t._ensurePolyAndBounds = function() {
            this.bounds && this.poly || (this.poly || this._ensurePoly(), this.bounds || this._ensureBounds())
        }, t._ensurePoly = function() {
            if (this.geometry) this._req({
                poly: new this.Polygon({
                    paths: this.geometry
                })
            });
            else if (this.bounds) {
                var t = this.bounds.getSouthWest(),
                    i = this.bounds.getNorthEast(),
                    e = this.LatLng;
                this._req({
                    poly: new this.Polygon({
                        paths: [n([
                            [t.lat(), t.lng()],
                            [t.lat(), i.lng()],
                            [i.lat(), i.lng()],
                            [i.lat(), t.lng()]
                        ]).map(function(t) {
                            return new e(t[0], t[1])
                        })]
                    })
                })
            }
        }, t._ensureBounds = function() {
            this.poly && !this.bounds && this._req({
                bounds: new e({
                    polygon: this.poly
                }).getBounds()
            })
        }
    }(), t.window ? window.BoundedGrid = h : module.exports = h
}).call(this);
