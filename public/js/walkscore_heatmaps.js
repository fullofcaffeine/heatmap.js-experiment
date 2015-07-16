window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) {
        window.setTimeout(t, 1e3 / 60)
    }
}(), window.BoundedHeatmap = function() {
    "use strict";
    var t = function(t) {
            this._init(t)
        },
        a = t.prototype,
        i = ["maxIntensity", "data", "locations", "locationTuples", "weights", "getColor", "pane", "radius", "drawWithBuffer", "exposure", "blur", "square", "canvasScale"],
        s = BoundedGrid.PARAMETERS,
        n = ["gridReady", "style"];
    ChainableSettersMixin(a, ["grid"].concat(s).concat(i).concat(n), "_req"), _ws_.PassThroughSettersMixin(a, "grid", s), BoundedGrid.mixinGetterPassThroughs(a), BoundedGrid.makeSetGridMethod(a, "_req");
    var e = {
            beat: {
                n: 256
            },
            mimic: {
                n: 256,
                cap: 48
            },
            shadow: {
                n: 1,
                shadow: !0
            },
            topo: {
                n: 4,
                topo: !0
            },
            contour: {
                n: 4,
                flat: !0
            },
            hollow: {
                n: 4,
                topo: !0,
                hollow: !0
            }
        },
        r = "beat";
    ProfilingMixin(a), a._init = function(t) {
        _(a).extend(new google.maps.OverlayView), this.setOptions(_({
            blur: 22,
            canvasScale: 16,
            drawWithBuffer: !0,
            exposure: .7,
            getColor: getScoreColor,
            grid: new BoundedGrid,
            pane: "mapPane",
            radius: 2.5,
            resolution: 100,
            square: !1,
            style: r
        }).extend(t)), this.setMap(t.map)
    }, a._req = makeGatherReqs(n, "_setup"), a._setMaxIntensity = function(t) {
        this.maxIntensity = t
    }, a._setLocations = function(t) {
        this.setLocationTuples(_(t).map(function(t) {
            return [t.lat(), t.lng()]
        }))
    }, a._setLocationTuples = function(t) {
        this.locationTuples = t
    }, a._setWeights = function(t) {
        this.locationTuples || this.setLocationTuples(this.getLatLngTuples()), this.weights = t, this.draw()
    }, a._setData = function(t) {
        t[0] instanceof google.maps.LatLng ? (this.setLocations(t), this.setWeights(_(t).map(function() {
            return 1
        }))) : (this.setLocations(_(t).pluck("location")), this.setWeights(_(t).pluck("weight")))
    }, a._setup = function() {
        var t = (this.getBounds(), this.getResolution(), this.style);
        this.canvasBuf = this.drawWithBuffer ? this.canvasScale * this.radius : 0, o.call(this, e[t] || e[r], this.getColor), this._setCanvasHeights()
    }, a._makeCanvases = function() {
        this._ctx || (this._aCanvas = $("<canvas />")[0], this._canvas = $("<canvas />")[0], this._ctx = this._canvas.getContext("2d"), this._actx = this._aCanvas.getContext("2d"))
    }, a._setCanvasHeights = function() {
        this._makeCanvases();
        var t = this.getLngCount() * this.canvasScale + 2 * this.canvasBuf,
            a = this.getLatCount() * this.canvasScale + 2 * this.canvasBuf;
        this._aCanvas.height = this._canvas.height = a, this._aCanvas.width = this._canvas.width = t
    }, a.onAdd = function() {
        this._putCanvasOnMap()
    }, a.onRemove = function() {
        $(this._canvas).remove(), this._ctx = this._canvas = null
    }, a._putCanvasOnMap = function() {
        $(this._canvas).appendTo($(this.getPanes()[this.pane]))
    }, a._position = function() {
        var t = this.getProjection();
        if (t) {
            var a = this.getBounds(),
                i = a.getSouthWest(),
                s = a.getNorthEast(),
                n = t.fromLatLngToDivPixel(i),
                e = t.fromLatLngToDivPixel(s),
                r = Math.floor(e.x - n.x),
                o = Math.floor(n.y - e.y);
            this._w = r, this._h = o;
            var h = this.canvasBuf / (this._canvas.width - 2 * this.canvasBuf) * r,
                u = this.canvasBuf / (this._canvas.height - 2 * this.canvasBuf) * o;
            return $(this._canvas).width(r + 2 * h).height(o + 2 * u), $(this._canvas).css("position", "absolute").css("top", n.y - o - u + "px").css("left", n.x - h + "px"), !0
        }
    };
    var o = function(t, a) {
            t || (t = {});
            var i = t.n,
                s = t.flat,
                n = t.shadow,
                e = t.cap,
                r = t.topo,
                o = t.hollow,
                u = null,
                c = null;
            r && (s = !0), this._getACTX = function() {
                if (this._actx) return this._actx;
                var t = this._aCanvas;
                return this._actx = t.getContext("2d")
            }, this._getStamp = function() {
                if (this._stamp) return this._stamp;
                var t = this.canvasScale * this.radius * 2,
                    a = t / 2,
                    i = $("<canvas />")[0];
                i.width = t, i.height = t;
                var s = i.getContext("2d");
                return this.square ? (s.fillRect(0, 0, t, t), this._stamp = i) : (s.shadowColor = "rgba(0,0,0,1.0)", s.shadowOffsetX = 1e3, s.shadowOffsetY = 1e3, s.shadowBlur = this.blur, s.beginPath(), s.arc(a - 1e3, a - 1e3, a - this.blur, 0, 2 * Math.PI, !0), s.closePath(), s.fill(), this._stamp = i)
            };
            var l = function() {
                    return function() {
                        var t, a = 256,
                            i = 0;
                        return haveArrayBuffer ? (t || (t = new ArrayBuffer(4 * a)), new Uint8ClampedArray(t, a * i++)) : new Array(256)
                    }
                }(),
                f = l(),
                v = l(),
                g = l(),
                d = l();
            if (haveArrayBuffer) var p = new Uint32Array(new ArrayBuffer(1024));
            var w = Math.floor(204),
                m = 48,
                e = 256 - (e || 0);
            _(_(256).range()).each(function(t) {
                if (m > n) var n = a(0);
                else if (n > e) var n = a(100);
                else var n = a(Math.round((t - m) / (e - m) * i) / i * 100, !0);
                f[t] = n[0], v[t] = n[1], g[t] = n[2], d[t] = s ? w : m > t ? w * (t / m) : w, haveArrayBuffer && (p[t] = f[t] | v[t] << 8 | g[t] << 16 | d[t] << 24)
            });
            var x = function() {
                var t = +new Date;
                if (this.locationTuples && this.weights && this._position()) {
                    var a = this._ctx,
                        i = (this.getIndirectionMap(), this.maxIntensity),
                        s = this.locationTuples,
                        e = this.weights,
                        l = (this.getGranularity(), this.getLatCount(), this.getLngCount(), this.getBounds()),
                        w = l.getSouthWest().lat(),
                        m = l.getSouthWest().lng(),
                        x = l.getNorthEast().lat(),
                        y = l.getNorthEast().lng(),
                        B = this.canvasScale,
                        C = this.canvasBuf,
                        A = this._getACTX(),
                        L = this._getStamp(),
                        S = B * this.radius / 2;
                    i || (i = _(e).reduce(function(t, a) {
                        return Math.max(t, a)
                    }, 0)), A.globalCompositeOperation = "destination-out", A.globalAlpha = 1, A.fillStyle = "rgb(255,255,255)", A.fillRect(0, 0, this._canvas.width, this._canvas.height), A.globalCompositeOperation = "source-over";
                    for (var T = 0; T < s.length; T++)
                        if (e[T]) {
                            A.globalAlpha = Math.min(e[T] / i, 1) * this.exposure;
                            var b = this._canvas.width - 2 * this.canvasBuf,
                                M = this._canvas.height - 2 * this.canvasBuf;
                            A.drawImage(L, C + b * ((s[T][1] - m) / (y - m)) - 2 * S, this._canvas.height - (C + M * ((s[T][0] - w) / (x - w)) + 2 * S))
                        }
                    var q = A.getImageData(0, 0, this._canvas.width, this._canvas.height),
                        P = q.data,
                        I = P.length,
                        R = haveArrayBuffer && !n && !r;
                    if (!n)
                        if (R) {
                            u || (u = q), c || (c = new Uint32Array(P.buffer));
                            for (var T = 3; I > T; T += 4) c[T >> 2] = p[P[T]]
                        } else
                            for (var T = 3; I > T; T += 4) {
                                var W = P[T];
                                W && (P[T - 3] = f[W], P[T - 2] = v[W], P[T - 1] = g[W], P[T] = d[W])
                            }
                        if (r) {
                            for (var G = h(I), O = 4 * this._canvas.width, $ = I - O - 4, T = O + 4; $ > T; T += 4)(P[T] != P[T + 4] || P[T] != P[T - 4] || P[T] != P[T + O] || P[T] != P[T - O]) && (G[T >> 5] |= 1 << (T >> 2 & 7), G[T + 4 >> 5] |= 1 << (T + 4 >> 2 & 7), G[T - 4 >> 5] |= 1 << (T - 4 >> 2 & 7), G[T + O >> 5] |= 1 << (T >> 2 & 7), G[T - O >> 5] |= 1 << (T >> 2 & 7));
                            for (var T = 4; I > T; T += 4) G[T >> 5] & 1 << (T >> 2 & 7) ? (P[T] = 0, P[T + 1] = 0, P[T + 2] = 0, P[T + 3] = 255) : o && (P[T + 3] = 0)
                        }
                    R ? a.putImageData(u, 0, 0) : a.putImageData(q, 0, 0), this._profile("draw", t)
                }
            };
            this.draw = function() {
                var t = null;
                return function() {
                    var a = this;
                    t || (t = requestAnimFrame(function() {
                        t = null, x.call(a)
                    }))
                }
            }()
        },
        h = function() {
            var t = null,
                a = null,
                i = null,
                s = function() {
                    if (haveArrayBuffer) {
                        i || (i = new Uint32Array(a));
                        for (var s = i.length, n = 0; s > n; n++) i[n] = 0
                    } else
                        for (var s = t.length, n = 0; s > n; n++) t[n] = 0
                },
                n = function(t) {
                    return a = new ArrayBuffer((t >> 5) + 4)
                };
            return function(a) {
                return t || (t = haveArrayBuffer ? new Uint8Array(n(a)) : new Array(a >> 5)), s(), t
            }
        }();
    return t
}();
