(function() {
    "use strict";
    var t = this,
        e = t._ || _,
        n = t._ws_ || require("./util-shared"),
        i = null,
        s = function(t) {
            return this._init(t)
        };
    ! function() {
        var o = s.prototype;
        o.containsTuple = function(t) {
            return this._containsTuple(t)
        }, o.containsLatLng = function(t) {
            return this._containsLatLng(t)
        }, o.getBounds = function() {
            return this._getBounds()
        }, n.ChainableSettersMixin(o, ["polygon", "tolerance", "toleranceInMeters", "toleranceInMiles", "point", "resolution", "debug"]), o._init = function(t) {
            n.MapPolyfillMixins.LatLng(o), n.MapPolyfillMixins.LatLngBounds(o), this.setOptions(e({
                resolution: 512,
                tolerance: 0
            }).extend(t))
        }, o._setResolution = function(t) {
            this._resolution = t
        }, o._setDebug = function(t) {
            this._debug = t
        }, o._setPolygon = function(t) {
            this._poly = t
        }, o._setToleranceInMiles = function(t) {
            this._setToleranceInMeters(1609.34 * t)
        }, o._setToleranceInMeters = function(t) {
            var e = this._getBounds(),
                i = e.getSouthWest(),
                s = e.getNorthEast(),
                o = (i.lat() + s.lat()) / 2,
                l = (i.lng() + s.lng()) / 2,
                r = n.scaleInMeters(o, l),
                a = t / r[1];
            this._setTolerance(a)
        }, o._setTolerance = function(t) {
            this._tolerance = t, this._getBounds(!0)
        }, o._getPaths = function() {
            if (this._paths) return this._paths;
            for (var t = this._poly.getPaths(), e = t.getArray(), n = [], i = 0; i < e.length; i++) n.push(e[i].getArray());
            return this._paths = n
        }, o._getBounds = function(t) {
            if (this._bounds && !t) return this._bounds;
            for (var e = [361, 361], n = [-361, -361], i = this._getPaths(), s = this._tolerance || 0, o = this._tolerance || 0, l = 0; l < i.length; l++)
                for (var r = 0; r < i[l].length; r++) i[l][r].lat() < e[0] && (e[0] = i[l][r].lat()), i[l][r].lng() < e[1] && (e[1] = i[l][r].lng()), i[l][r].lat() > n[0] && (n[0] = i[l][r].lat()), i[l][r].lng() > n[1] && (n[1] = i[l][r].lng());
            var a = new this.LatLngBounds(new this.LatLng(e[0] - s, e[1] - o));
            return a.extend(new this.LatLng(n[0] + s, n[1] + o)), this._ensureBoundsAspectRatioOK(a), this._bounds = a
        }, o._ensureBoundsAspectRatioOK = function(t) {
            var e = t.getSouthWest(),
                n = t.getNorthEast(),
                i = n.lat() - e.lat(),
                s = n.lng() - e.lng(),
                o = (i - s) / 2;
            o > 0 && (t.extend(new this.LatLng(n.lat(), n.lng() + o)), t.extend(new this.LatLng(e.lat(), e.lng() - o)))
        }, o._getCanvas = function() {
            var e = this._resolution;
            if (t.window) {
                var n = $("<canvas />")[0];
                n.width = e, n.height = e
            } else {
                i || (i = require("canvas"));
                var n = new i(e, e)
            }
            return this._debug && $(n).css("position", "absolute").css("top", "0px").css("right", "0px").appendTo("body"), n
        }, o._makeGetPixel = function() {
            if (this._getPixel) return this._getPixel;
            var t = this._getBounds(),
                e = t.getSouthWest().lat(),
                n = t.getSouthWest().lng(),
                i = t.getNorthEast().lat(),
                s = t.getNorthEast().lng(),
                o = this._resolution,
                l = this._tolerance || 0,
                r = (i - e) / o,
                a = (s - n) / o;
            return this._getPixel = {
                lat: function(t) {
                    return o - (t - e) / r | 0
                },
                lng: function(t) {
                    return (t - n) / a | 0
                },
                tol: l / a * 2
            }
        }, o._getBuffer = function() {
            if (this._buffer) return this._buffer;
            var t = this._getCanvas(),
                e = t.getContext("2d"),
                n = this._getPaths(),
                i = this._resolution,
                s = this._makeGetPixel().lat,
                o = this._makeGetPixel().lng,
                l = this._makeGetPixel().tol;
            if (this._debug ? (e.fillStyle = "rgba(255,255,255,0.5)", e.strokeStyle = "rgba(255,255,255,0.5)") : (e.fillStyle = "rgb(255,255,255)", e.strokeStyle = "rgb(255,255,255)"), e.lineWidth = l, e.lineJoin = "round", this.point) e.beginPath(), e.arc(s(n[0][0]), o(n[0][0]), l, 0, 2 * Math.PI, !0), e.closePath(), e.fill();
            else
                for (var r = 0; r < n.length; r++) {
                    e.beginPath();
                    for (var a = 0; a < n[r].length; a++) e[a ? "lineTo" : "moveTo"](o(n[r][a].lng()), s(n[r][a].lat()));
                    e.closePath(), e.fill(), l && e.stroke()
                }
            return this._buffer = e.getImageData(0, 0, i, i).data
        }, o._containsTuple = function(t) {
            var e = this._getBuffer(),
                n = this._getBounds(),
                i = n.getSouthWest(),
                s = n.getNorthEast(),
                o = this._resolution,
                l = this._makeGetPixel().lat,
                r = this._makeGetPixel().lng;
            if (!(t[0] < i.lat() || t[1] < i.lng() || t[0] > s.lat() || t[1] > s.lng())) return e[4 * (r(t[1]) + l(t[0]) * o) - 1]
        }, o._containsLatLng = function(t) {
            return this._containsTuple([t.lat(), t.lng()])
        }
    }(), t.window ? window.PolygonClipper = s : module.exports = s
}).call(this);
