window.Desert = function() {
    "use strict";
    ensureWSUnderscoreMixins();
    var t = function(t) {
            this._init(t)
        },
        e = t.prototype;
    BoxCacheMixin(e), ListenerMixin(e), ProfilingMixin(e);
    var s = ChoiceGrid.TIMES;
    e._init = function(t) {
        ws_simple_init.call(this, t), this.minutes = s[0], this.resolution || (this.resolution = 100), this.activeCategory = 0, this.choiceGrid = new ChoiceGrid({
            bounds: this.bounds,
            geometry: this.geometry,
            resolution: this.resolution,
            categoryIds: this.categoryIds,
            noUnrouted: !0,
            wsid: this.wsid
        }), this.choiceGrid.on("ready", _(this._heat).bind(this)), this.choiceGrid.on("routed", _(this._pipeProgress).bind(this)), this._addControls(), google.maps.event.addListener(this.map, "zoom_changed", _(this._heat).bind(this))
    }, e._pipeProgress = function(t) {
        this._alertListeners("progress", t)
    };
    var i = {
        ".infotext": {
            choice: _.template('People can walk to:<br /><span class="num-places highlight"><%= count.toFixed(2) %></span> <%= category %> in<br /><span class="num-minutes highlight"> <%- time %></span> minutes'),
            access: _.template('<span class="num-places highlight"><%- Math.round(count*100) %>%</span> of people in <%= location %><br />can walk to <%- category %> in<br /><span class="num-minutes highlight"> <%- time %></span> minutes'),
            pop: _.template('<span class="num-places highlight">Population distribution')
        },
        ".legendtext": {
            choice: _.template('<div class="legend-block" /> = <%- max %>+ choices'),
            access: _.template('<div class="legend-block" /> = has access'),
            pop: _.template('<div class="legend-block" />')
        },
        ".countstext": {
            choice: _.template('<hr /><table class="medsmallfont"><tr><% if (categories.length == 1) { %><td><%= category.substr(0,1).toUpperCase()+category.substr(1) %>:</td><% } else { %><td>Places:</td><% } %><td align=right><%= formatNumber(counts.totalPlaces) %></td></tr><tr><td>Population:</td><td align=right><%= formatNumber(population) %></td></tr><tr><td>Routes Analyzed:</td><td align=right><%= formatNumber(counts.times) %></td></tr></table>'),
            access: _.template('<div class="legend-block" /> = has access'),
            pop: _.template('<div class="legend-block" /> = densest population')
        }
    };
    return i[".countstext"].access = i[".countstext"].choice, e._updateControls = function(t) {
        var e = $(".desert-map-controls");
        t = _({
            counts: this.choiceGrid.counts,
            population: this.choiceGrid.populationGrid.getTotalPopulation(),
            category: this.categoryNames[this.activeCategory],
            categories: this.categoryNames,
            time: this.time,
            location: this.locationName
        }).extend(t), _(i).each(function(s, i) {
            e.find(i).html(s[t.type](t))
        })
    }, e._addControls = function() {
        var t = _(this._heat).bind(this),
            e = '<p class="infotext med-tight-bot relative"></p>',
            i = $("<div />").append($("<select />", {
                id: "before-after-toggle",
                "class": "hide"
            }).append($("<option />", {
                value: "before"
            }).html("Before")).append($("<option />", {
                value: "after"
            }).html("After"))).change(t),
            a = $("<div />", {
                "class": "medsmallfont pad-top"
            }).append($("<span />", {
                "class": ""
            }).html("Map type: ")).append($("<select />", {
                id: "choice-access-toggle"
            }).append($("<option />", {
                value: "access"
            }).html("Access")).append($("<option />", {
                value: "choice"
            }).html("Choice"))).change(t),
            o = $("#category-select"),
            n = o[0],
            l = $("<div />", {
                "class": "medsmallfont pad-top"
            }).append($("<span />", {
                "class": ""
            }).html("Category: ")).append(o);
        o.change(1 == this.categoryIds.length ? _(function() {
            var t = o.find("option:selected").val();
            window.location = this.urlPrefix + t + this.urlLocation
        }).bind(this) : _(function() {
            this.activeCategory = o.prop("selectedIndex"), this._heat()
        }).bind(this)), a.find("select").val(this.choiceDefault ? "choice" : "access"), this.showPop && a.find("select").append($("<option />", {
            value: "pop"
        }).html("Pop Map")).val("pop");
        var c = _(function(e) {
                this.time = e, $(".num-minutes").html(e), t()
            }).bind(this),
            p = $("<div />", {
                "class": "relative slider-wrap"
            }).append($("<div />", {
                "class": "slider"
            }).slider({
                range: "min",
                min: s[0],
                value: this.minutes,
                max: s[s.length - 1],
                slide: function(t, e) {
                    c(e.value)
                }
            })).append($("<div />", {
                "class": "time-slider-label"
            }).html("minutes")).append($("<div />", {
                "class": "time-slider-label-left"
            }).html(s[0])).append($("<div />", {
                "class": "time-slider-label-right"
            }).html(s[s.length - 1])),
            h = $("<div />", {
                "class": "legendtext"
            }),
            r = $("<div />", {
                "class": "countstext"
            }),
            d = $("<div />", {
                "class": "map-control-panel desert-map-controls"
            }).append($("<div />", {
                "class": "content"
            }).append($("<h1 />").html("Walk Score<sup>&reg;</sup> ChoiceMaps<sup>&trade;</sup></span>")).append($("<p />").addClass("nowrap").html('<a href="/professional/research.php" target="_blank">Learn more about Walk Score data</a>')).append($("<div />", {
                "class": "control-block"
            }).append(e).append(p)).append(i).append(a));
        n && d.append(l), d.append(h).append(r).append("<p class='medsmallfont'><a href='" + this.urlLocation + "' target='_blank'>More " + this.locationName + " information</a></p>").append("<p class='medsmallfont'>&copy; 2014 Walk Score</p>"), this.noBeforeAfter && d.addClass("no-before-after"), this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(d[0])
    }, e._getClampValue = function(t) {
        return this._clamps || (this._clamps = []), this._clamps[t] || (this._clamps[t] = _(this.choiceGrid.getSlice(null, null, null, [t]).data).reduce(function(t, e) {
            return Math.max(t, e)
        }, 0)), this._clamps[t]
    }, e._getHeatMap = function() {
        return this._heatmap || (this._heatmap = new BoundedHeatmap({
            map: this.map,
            resolution: this.resolution,
            bounds: this.choiceGrid.getBounds(),
            locationTuples: this.choiceGrid.getLatLngTuples(),
            style: this.style
        }))
    }, e._heat = function() {
        var t = (new Date).getTime(),
            e = $("#choice-access-toggle").val(),
            i = $("#before-after-toggle").val(),
            a = this.time || (this.time = s[0]),
            o = this.categoryIds[this.activeCategory],
            n = "choice" == e && this._getClampValue(o),
            l = this._getHeatMap(),
            c = 0;
        if (l.setMaxIntensity(n), "pop" == e) l.setWeights(this.choiceGrid.population);
        else {
            var p = this.choiceGrid.getSlice(a, e, i, [o]);
            l.setWeights(p.data), c = p.count
        }
        this._updateControls({
            type: e,
            max: n,
            count: c
        }), this._profile("draw", t)
    }, t
}();
