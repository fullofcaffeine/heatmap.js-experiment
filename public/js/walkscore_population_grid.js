(function(t) {
    "use strict";
    var t = this,
        e = t._ || require("./underscore-premixed"),
        i = (t.$ || require("./fake-jquery"), t.BoxCacheMixin || require("./box-cache-mixin")),
        r = t.ListenerMixin || require("./listener-mixin"),
        n = t.BoundedGrid || require("./bounded-grid"),
        o = t._ws_ || require("./util-shared"),
        a = .0015,
        s = function(t) {
            this._init(t)
        };
    ! function() {
        var t = s.prototype,
            u = s.REQUIRED_PARAMETERS = ["wsid", "grid"],
            h = n.PARAMETERS,
            d = ["gridReady"].concat(u);
        i(t), r(t), o.ChainableSettersMixin(t, u.concat(h)), o.PassThroughSettersMixin(t, "grid", h), n.mixinGetterPassThroughs(t), n.makeSetGridMethod(t, "_req"), t.getData = function() {
            return this.data
        }, t.getTotalPopulation = function() {
            return this.total
        }, t._init = function(t) {
            this.setOptions(e({
                grid: new n
            }).extend(t))
        }, t._req = o.makeGatherReqs(d, "_fetch"), t._setWsid = function(t) {
            this._req({
                wsid: t
            })
        }, t._fetchBox = function(t, e) {
            var i = {
                box: t.join(","),
                wsid: this.wsid,
                granularity: a
            };
            o.retryAjax({
                url: o.domainRoundRobinAJAXUrl("/api/v1/population/json"),
                data: i,
                dataType: "json",
                timeout: 1e4,
                success: e,
                error: function() {
                    throw "Could not get population data for " + t
                }
            })
        }, t._processBoxData = function(t) {
            return (t || {}).response || {}
        }, t._reGrid = function(t) {
            var e = (this.getResolution(), this.getBounds(), this._getReqGrid()),
                i = e.getLatCount(),
                r = e.getLngCount(),
                n = this.getLatCount(),
                a = this.getLngCount(),
                s = this.getIndirectionMap(),
                u = o.makeBuffer(this.getLatLngTuples().length, "float", !0),
                h = Math.max(i, r),
                d = Math.max(n, a),
                g = h / d,
                f = Math.pow(h, 2) / Math.pow(d, 2);
            if (g > 1)
                for (var l = 0; i > l; l++)
                    for (var c = 0; r > c; c++) u[s[(l / g | 0) * a + (c / g | 0)]] += t[l * r + c];
            else
                for (var l = 0; n > l; l++)
                    for (var c = 0; a > c; c++) {
                        var _ = t[(l * g | 0) * r + (c * g | 0)];
                        _ && (u[s[l * a + c]] += _ * f)
                    }
            for (var p = 0, l = 0; l < u.length; l++) p += u[l];
            this.total = p, this.data = u, this._alertListeners("ready")
        }, t._getReqGrid = function() {
            return this.reqGrid || (this.reqGrid = new n({
                bounds: this.getBounds(),
                granularity: a
            })), this.reqGrid
        }, t._fetch = function() {
            for (var t = (this.getResolution(), this.getBounds()), i = this._boxSetForBounds(t), r = this._getReqGrid(), n = i.length, s = r.getLatCount(), u = r.getLngCount(), h = r.getSouthWestTuple(), d = o.makeBuffer(s * u, "int16", !0), g = e(this._reGrid).bind(this), f = function(t) {
                    if (t.data)
                        for (var e = t.data, i = e.length, r = e[0].length, o = t.southwest.split(","), f = Math.round((o[0] - h[0]) / a), l = Math.round((o[1] - h[1]) / a), c = 0; i > c; c++)
                            if (c + f >= 0 && s > c + f)
                                for (var _ = 0; r > _; _++) _ + l >= 0 && u > _ + l && (d[(c + f) * u + _ + l] = e[c][_]);
                            --n || g(d)
                }; i.length;) this._withBox(i.shift(), f)
        }
    }(), t.window ? window.PopulationGrid = s : module.exports = s
}).call(this);
