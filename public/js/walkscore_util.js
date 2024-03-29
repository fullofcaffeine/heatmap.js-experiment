function showFormError(t, n) {
    var e = $(".form-error-message");
    n ? e.html(t).fadeTo(0, 1) : e.html(t).fadeTo(0, 0).fadeTo(500, 1).fadeTo(2200, 1).fadeTo(1e3, 0)
}

function clearFormError() {
    showFormError("", !0)
}

function addressSubmit(t, n, e) {
    var i = t.street.value;
    return "Type an Address" == i ? !1 : (goToAddress(i, null, null, null, e), trackEvent("address submit", n), !1)
}

function goToHoodTab(t, n) {
    trackEvent(ACTIVE_COMPONENT, "tab click", "neighborhood tab");
    var e = getHoodTabUrl(t, n);
    document.location = e
}

function showCommuteTo(t) {
    trackEvent(ACTIVE_COMPONENT, "work address submitted");
    var n = urlifyAddress(t.query.value);
    return goToTab("commute", {
        to: n
    }), !1
}

function getHoodUrl(t, n, e) {
    var i = t.getAdminArea(),
        o = fixNYBoroughs(t.getCity(), i);
    i = encodeURIComponent(i), o = encodeURIComponent(replaceAll(o, " ", "_")), "DC" == i && (o = "Washington_D.C."), o = replaceAll(o, "Ste ", "Ste. "), o = replaceAll(o, "St ", "St. ");
    var r = encodeURIComponent(n.replace(/ /g, "_").replace(/\//g, ".slash."));
    return url = "/" + [i, o, r].join("/"), e && (url += "/" + geturlStubFromCurrent()), url
}

function getHoodTabUrl(t, n) {
    return getHoodUrl(t, n, !0)
}

function tabClick(t, n, e) {
    var i = "nearby" == t ? "custom map" : "score" == t ? "overview" : t;
    trackEvent(ACTIVE_COMPONENT, "tab click", i), goToTab(t, n, e)
}

function goToTab(t, n, e) {
    var i = geturlStubFromCurrent();
    navigateInternal(t, i, n, e)
}

function goToAddress(t, n, e, i, o) {
    var r = o ? o : "score",
        a = urlifyLocation(t, n, e);
    a += getExtraParamsFromCurrent(), navigateInternal(r, a, i)
}

function getGoToAddressFunc(t) {
    if (t.getQuery()) {
        var n = t.getQuery();
        return function() {
            goToAddress(n)
        }
    }
    if (t.getLat() && t.getLng()) {
        var e = t.getLat(),
            i = t.getLng();
        return function() {
            goToAddress("loc", e, i)
        }
    }
}

function getCurrentTabName() {
    var t = String(document.location.pathname);
    t = t.substr(1);
    var n = t.indexOf("/");
    return t = t.substr(0, n)
}

function navigateInternal(t, n, e, i) {
    var o = "";
    if (e)
        for (key in e) o += "/" + encodeURIComponent(key) + "=" + encodeURIComponent(e[key]);
    if (i) {
        var r = n.indexOf("/");
        n = -1 == r ? i : i + n.substr(r)
    }
    document.location = "score" == t || "commute" == t || "nearby" == t || "report" == t ? "/" + t + "/" + n + o : "/score/" + n + o
}

function geturlStubFromCurrent(t) {
    t = defaultIfNotSet(t, !1);
    var n = getUrlParam("street");
    isEmptyString(n) && (n = "loc");
    var e = getUrlParam("lat"),
        i = getUrlParam("lng"),
        o = urlifyLocation(n, e, i);
    return t || (o += getExtraParamsFromCurrent()), o
}

function getExtraParamsFromCurrent() {
    var t = getUrlParam("country"),
        n = getUrlParam("units"),
        e = "";
    return t && (e += "/country=" + t), n && (e += "/units=" + n), e
}

function goToCelebLocation(t, n) {
    var e = t.split("?");
    if (5 == e.length) {
        trackEvent(n, "celebrity location", e[0]);
        var i = e[0] + " " + e[1],
            o = {
                lat: e[4],
                lng: e[3]
            };
        goToTab("score", o, urlifyAddress(i))
    }
}

function arrayContains(t, n) {
    for (var e = 0, i = t.length; i > e; e++)
        if (t[e] === n) return !0;
    return !1
}

function getCityGoRoundUrl(t) {
    var n = "" != t.getCity() ? t.getCity() : t.userLatLng.lat() + "," + t.userLatLng.lng();
    return "http://www.citygoround.org/apps/walk-score/location/?q=" + encodeURI(n)
}

function getCityGoRoundNearbyAppsUrl(t) {
    return "http://www.citygoround.org/apps/nearby/?q=" + encodeURI(t.getQuery())
}

function getProxiedCityGoRoundApplicationSearchApiUrl(t) {
    return "/data/get-city-go-round-api-apps-search.php?lat=" + t.getLat() + "&lon=" + t.getLng() + "&country=" + encodeURI(t.getCountryCode())
}

function stripTags(t, n) {
    n = (((n || "<b><i><u><strong><em>") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
    var e = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        i = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return t.replace(i, "").replace(e, function(t, e) {
        return n.indexOf("<" + e.toLowerCase() + ">") > -1 ? t : ""
    })
}

function stripJS(t) {
    var n = t;
    return n = replaceAll(n, "(", ""), n = replaceAll(n, ")", "")
}

function isUserAddedAmenity(t) {
    return t.length - 3 == t.lastIndexOf("_ws") || "ws_" == t.substr(0, 3)
}

function trimTitle(t, n) {
    return n || (n = 78), t.length > n && (t = t.substring(0, n - 3) + "..."), t
}

function forEach(t, n, e) {
    e = e || this;
    for (var i = t.length, o = 0; i > o; o++) {
        var r = n.call(e, t[o], o);
        if (void 0 !== r) return r
    }
}

function boolify(t) {
    return "false" == t ? !1 : !!t
}

function var_exists(t) {
    return "undefined" != typeof window[t]
}

function isSet(t) {
    return "undefined" != typeof t
}

function defaultIfNotSet(t, n) {
    return "undefined" != typeof t ? t : n
}

function linkTracker(t, n, e, i) {
    return function() {
        trackEvent(t, n, e, i)
    }
}

function initLinkTracking(t) {
    for (var n in t)
        if (t.hasOwnProperty(n)) {
            var e = t[n],
                i = e[0],
                o = e[1],
                r = e[2],
                a = e[3];
            $("#" + n).click(linkTracker(i, o, r, a))
        }
}

function trackVirtualPageview(t) {
    !ENV_PRODUCTION && DEBUG_OUTPUT_ACTIVE && console && console.log && console.log("Virtual Pageview:", t), window.ga && t && ga("send", "pageview", t)
}

function unformatNumber(t) {
    return t = replaceAll(String(t), ",", ""), Number(t)
}

function isNumeric(t) {
    var n = /^[0-9]+$/;
    return t.match(n) ? !0 : !1
}

function extractNum(t) {
    return parseInt(String(t).replace(/^.*?(\d+).*$/, "$1"))
}

function getPctDiffString(t, n) {
    return n > t ? roundNumber(100 * (1 - t / n), 2) + "% lower" : roundNumber(100 * (t / n - 1), 2) + "% higher"
}

function trackOrientation(t) {
    function n() {
        90 == window.orientation ? ($("body").removeClass("portrait").addClass("landscape"), t && window.scrollTo(0, 1)) : ($("body").removeClass("landscape").addClass("portrait"), t && window.scrollTo(0, 1))
    }
    var t = t || !0;
    t && window.scrollTo(0, 1), n(), window.onorientationchange = function() {
        n()
    }
}

function Checklist(t, n) {
    this.callback = n, this.items = t, this.checked = [];
    for (var e in t) this.checked[e] = !1;
    this.check = function(t) {
        for (var n in this.items) this.items[n] == t && this.checked[n] === !1 && (this.checked[n] = !0, this.callback && !arrayContains(this.checked, !1) && (this.callback(), this.callback = null))
    }, this.isChecked = function(t) {
        for (var n in this.items)
            if (this.items[n] == t) return this.checked[n]
    }
}

function linkifyName(t) {
    return t.replace(/ /g, "_").replace(/\//g, ".slash.")
}

function unlinkifyName(t) {
    return t.replace(/.slash./g, "/").replace(/_/g, " ")
}

function getRankingsURL(t) {
    return "http://www.walkscore.com/" + t.getAdminArea() + "/" + linkifyName(t.getCity()) + "/"
}

function getRankingsHoodURL(t, n) {
    return getRankingsURL(t) + linkifyName(n)
}

function suppressErrors() {
    window.onerror = function() {
        return !0
    }
}

function restoreErrors() {
    window.onerror = function() {
        return !1
    }
}

function withAllWalkScoreInfo(t) {
    $.ajax({
        url: "/auth/score/info",
        data: {
            all: !0
        },
        success: t,
        error: _(t).bind({}, [])
    })
}

function withWalkScoreInfo(t, n) {
    var e = {
        score: t
    };
    $.ajax({
        url: "/auth/score/info",
        data: e,
        success: n,
        error: _(n).bind({}, e)
    })
}

function estimatedWalkingTime(t) {
    var n = convertMeters(t, "mi"),
        e = Math.ceil(20 * n);
    return e + " minute walk"
}

function getCraigslistHTML(t, n) {
    var e = "<p><b>Walk Score " + n + "</b> &mdash; " + getScoreDescription(n) + "<br>" + t + "</p>";
    return e
}

function reportError(t) {
    showMessage(t)
}

function alertThese() {
    DEBUG_OUTPUT_ACTIVE && alert(Array.prototype.join.call(arguments, " :: "))
}

function dbugThese() {
    DEBUG_OUTPUT_ACTIVE && dbug(Array.prototype.join.call(arguments, " :: "))
}

function dbug(t) {
    DEBUG_OUTPUT_ACTIVE && console.log(t)
}

function dbug2(t) {
    DEBUG_OUTPUT_ACTIVE && $("#dbug").append(t)
}

function dumpGLL(t) {
    return t && t.lat && t.lng ? "(" + t.lat() + ", " + t.lng() + ")" : "(null or not recognized: " + t + ")"
}

function convertToTime(t) {
    var n = Math.floor(t),
        e = String(extractMinutes(t));
    1 == e.length && (e = "0" + e);
    var i = n >= 12 ? "pm" : "am";
    return 24 == n ? (n = 12, i = "am") : 0 == n ? n = 12 : n > 12 && (n -= 12), n + ":" + e + i
}

function extractMinutes(t) {
    var n = Math.floor(t),
        e = Math.round(60 * (t - n));
    return e
}

function extractHours(t) {
    return Math.floor(t) % 24
}

function trimLeadZero(t) {
    return String(t).replace(/^[0]+/g, "")
}

function get_image_size(t, n) {
    var e = new Image;
    $(e).load(function() {
        n(e.width, e.height)
    }).error(function() {
        n()
    }).attr({
        src: t
    })
}

function lazy_ad_positioner(t) {
    ensureWSUnderscoreMixins();
    var n = {};
    return window.position_ads = function() {
        _(t).each(function(t) {
            var e = $("#" + t + "-placeholder").offset(),
                i = !1;
            for (key in e) Math.abs(e[key] - ((n[t] || {})[key] || 0)) >= 1 && (i = !0);
            n[t] = e, i && $("#" + t).css("position", "absolute").offset(e)
        })
    }, _(position_ads).thump(500, 20), $(window).resize(position_ads), position_ads
}

function oldversionCookie(t) {
    set_cookie("oldversion", t ? "true" : "", 7, "/", "walkscore.com")
}

function haveLocalStorage() {
    if (DEBUG_BLOCK_LOCALSTORAGE) return !1;
    try {
        return "localStorage" in window && null !== window.localStorage
    } catch (t) {
        return !1
    }
}

function countCityLikeVote(t, n) {
    var e = t;
    e.lastIndexOf("/") == e.length - 1 && (e = e.substr(0, e.length - 1)), e = e.substr(e.lastIndexOf("/") + 1), $.ajax({
        type: "POST",
        url: "/data/count-user-vote.php",
        data: {
            city: e,
            vote: n ? "up" : "down"
        },
        success: function() {},
        error: function() {}
    })
}

function postParams(t, n) {
    var e = $("<form>").attr("method", "post").attr("action", t);
    $.each(n, function(t, n) {
        $("<input type='hidden'>").attr("name", t).attr("value", n).appendTo(e)
    }), e.appendTo("body"), e.submit()
}

function newAmenityPoster(t, n) {
    return function(e) {
        var i = {};
        if (_([n.amenityService.localCache, n.amenityService.curationCache, n.dataFetcher.responseCache]).each(function(t) {
                t.isPersistent() || LocalCache.noPost || (i[t.key] = t.fetch_raw())
            }), !_(i).isEmpty()) {
            e.preventDefault();
            var o = {
                caches: JSON.stringify(simplifyDataStructure(i))
            };
            postParams($(t).attr("href"), o)
        }
    }
}

function initAmenityPost(t, n) {
    for (var e = 0; e < n.length; e++) {
        var i = $("#" + n[e]);
        i.click(newAmenityPoster(i, t))
    }
}

function reversespecialchars(t) {
    return "string" == typeof t && (t = t.replace(/&amp;/g, "&"), t = t.replace(/&quot;/g, '"'), t = t.replace(/&#039;/g, "'"), t = t.replace(/&lt;/g, "<"), t = t.replace(/&gt;/g, ">")), t
}

function CardStack(t) {
    this._div = _(t).isString() ? $(t) : t, this._cards = {}, this._backFuncs = {};
    var n = this.registerExistingCard = _(function(t) {
        var n = getIdFromPrefixedClass(t, "depth-") || this._cards.length;
        this._cards[n] = t
    }).bind(this);
    this._div.children.each(function(t) {
        n($(t))
    }), this.goForward = function(t, n, e, i, o) {
        o && (this._backFuncs[this._index] = o), showCard(this._index + 1, t, n, e, i)
    }, this.goBack = function(t, n, e, i) {
        showCard(this._index - 1, t, n, e, i);
        var o = this._backFuncs[this._index - 1];
        o && (o(), delete this._backFuncs[this.getIndex() - 1])
    }, this.showCard = function(t, n, e, i, o) {
        this.busy || (this.busy = !0, this._cards[t] && this._cards[t].attr("id") != n && (this._cards[t].remove(), delete this._cards[t]), this._cards[t] || (this._cards[t] = $(e).attr("id", n).appendTo(this._div), null == getIdFromPrefixedClass(cardDiv, "depth-") && this._cards[t].addClass("depth-" + t)), i && i(), this._cards[this.lastIndex].removeClass("active"), this._cards[t].addClass("active"), o && o(), this._lastIndex = this._index, this._index = t, this.busy = !1)
    }, this.getIndex = function() {
        return this._index
    }
}

function withTransitLineInfoById(t, n) {
    var e = (new Sheds.Transit.lines).onReady(function() {
        t(_(e.getInfo(!0)).oreduce(function(t, n) {
            _(t).extend(_(n.routes).oreduce(function(t, n) {
                t[n.id] = n
            }))
        }))
    }).setLocation(n)
}

function waitFor(t, n, e, i) {
    e = e || 50, i = i || 50;
    var o = _(function() {
        var e = $(t);
        return e.length ? n(e) : void _(o).delay(i)
    }).max_attempts(e);
    o()
}(function() {
    var t = {};
    window.ListenerMixin = t.exports = function(t) {
        t._addListener = function(t, n) {
            return this.listeners || (this.listeners = {}), this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(n), this
        }, t.on = t._addListener, t._alertListeners = function(t, n) {
            for (var e = ((this.listeners || {})[t] || []).slice(), i = 0; i < e.length; i++) e[i](n)
        }, t.emit = t._alertListeners, t._clearListeners = function(t) {
            delete this.listeners[t]
        }
    }, window.BoxCacheMixin = t.exports = function(t, n) {
        n || (n = {});
        var e = this,
            i = {},
            o = {},
            r = n.ttl || 3e5,
            a = n.size,
            s = n.trim || a / 4 || 1,
            c = 0,
            u = n.buffer || 0,
            l = n.limit || 128,
            d = n.granularity || 4;
        void 0 === a && (a = e.window ? 64 : 1024);
        var h = function(t) {
                return Math.floor(t * d)
            },
            f = 1 / 69.04,
            g = 1 / 45.4;
        t.boxesInCache = function() {
            return this._boxesInCache()
        }, t.boxesFetched = function() {
            return this._boxesFetched
        }, t.boxesHandled = function() {
            return this._boxesHandled
        }, t.boxCacheSize = function() {
            return c
        }, t._withBox = function(t, n) {
            this._boxesHandled++;
            var e = this._namespacedBoxKey(t),
                a = i[e];
            if (a && this._boxIsSufficient(a.data)) {
                if ((new Date).getTime() - a.ctime < r) return a.atime = (new Date).getTime(), _(_(n).bind({}, a.data)).defer();
                delete i[a.key], c--
            }
            o[e] ? o[e].push(n) : (o[e] = [n], this._boxesFetched++, this._fetchBox(t, _(this._receiveBox).bind(this, t)))
        }, t._boxIsSufficient = function() {
            return !0
        }, t._namespacedBoxKey = function(t) {
            var n = t.slice();
            return this._boxCacheNamespace && n.unshift(this._boxCacheNamespace), n.join("_")
        }, t._receiveBox = function(t, n) {
            var e = this._namespacedBoxKey(t);
            if (n = this._processBoxData(n, _(i).spelunk([e, "data"])), a && !i[e] && !_(n).isUndefined() && (i[e] = {
                    key: e,
                    data: n,
                    ctime: (new Date).getTime(),
                    atime: (new Date).getTime()
                }, ++c > a)) {
                for (var r = _(i).sortBy(function(t) {
                        return t.atime
                    }), u = 0; s > u; u++) delete i[r[u].key];
                c -= s, this._boxesEvicted += s
            }
            var l = o[e];
            delete o[e], _(l).each(function(t) {
                t(n)
            })
        }, t._boxSetForBounds = function(t) {
            if (!t) return null;
            for (var n = t.getNorthEast(), e = t.getSouthWest(), i = u * f, o = u * g, r = [], a = h(e.lat() - i); a <= h(n.lat() + i); a += 1)
                for (var s = h(e.lng() - o); s <= h(n.lng() + o); s += 1)
                    if (r.push([a / d, s / d]), r.length > l) return console.log("Cache box limit exceeded", e.lat(), e.lng(), n.lat(), n.lng()), [];
            return r
        }, t._boxSetFingerprint = function(t) {
            return _(t).flatten().join("_")
        }, t._resetCounts = function() {
            this._boxesHandled = 0, this._boxesFetched = 0, this._boxesEvicted = 0
        }, t._boxesInCache = function() {
            return _(i).keys()
        }
    }, window.ws_simple_init = t.exports = function() {
        return function(t, n) {
            t || (t = {}), n || (n = []);
            for (var e = 0; e < n.length; e++)
                if (void 0 === t[n[e]]) throw "Missing " + n[e] + " in init.";
            for (var i in t) this[i] = t[i]
        }
    }(), window.RentalsAddThis = t.exports = function() {
        var t = function(t) {
                this._init(t)
            },
            n = t.prototype;
        return n.start = function() {
            return this._start(), this
        }, n.whenReady = function(t) {
            return this._queue.push(t), this._flush(), this
        }, n._init = function(t) {
            this.app = t, this._queue = [], window.addthis && this._goodToGo()
        }, n._start = function() {}, n._loadAddThisJS = function() {
            this._didLoad = !0, $.getScript("//s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4ea87059456ece80", _(function() {
                this._goodToGo()
            }).bind(this))
        }, n._goodToGo = function() {
            this._didLoad = this._ok = !0, this._flush()
        }, n._flush = function() {
            if (!this._didLoad) return this._loadAddThisJS();
            if (this._ok) {
                var t = this._queue;
                this._queue = [], _(t).each(function(t) {
                    t()
                })
            }
        }, t
    }();
    var n = t.exports = function() {
            var t = {
                    maps: {}
                },
                n = function(t, n, e) {
                    t.ws_with = function(t, n) {
                        var i = this.coerced || (this.coerced = {});
                        e.call(this, t, function(e) {
                            n(i[t] || (i[t] = e))
                        })
                    }, n && (t.ws_coerce = function(t) {
                        var n;
                        return this.ws_with(t, function(t) {
                            n = t
                        }), n
                    })
                },
                e = function(t, n, e) {
                    return t._ws_ = {
                        app: n.app,
                        amenity: n.amenity,
                        idol: n,
                        id: e || n.id
                    }, t
                };
            return t.maps.LatLng = function(t, n) {
                    this.lat_ = t, this.lng_ = n
                },
                function() {
                    var e = t.maps.LatLng.prototype;
                    e.lat = function(t) {
                        return this._acc("lat_", t)
                    }, e.lng = function(t) {
                        return this._acc("lng_", t)
                    }, e.toUrlValue = function() {
                        return "" + this.lat_ + "," + this.lng_
                    }, e._acc = function(t, n) {
                        return _(n).isUndefined() || (this[t] = n - 0), this[t]
                    }, n(e, !0, function(t, n) {
                        n({
                            google: function(t, n) {
                                return new google.maps.LatLng(t, n)
                            }
                        }[t](this.lat_, this.lng_))
                    });
                    var i = function() {
                        var t = function(t) {
                            return t * Math.PI / 180
                        };
                        return function(n, e) {
                            var i = 6371,
                                o = t(e.lat() - n.lat()),
                                r = t(e.lng() - n.lng()),
                                a = Math.sin(o / 2) * Math.sin(o / 2) + Math.cos(t(n.lat())) * Math.cos(t(e.lat())) * Math.sin(r / 2) * Math.sin(r / 2),
                                s = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
                                c = i * s;
                            return c.toFixed(3)
                        }
                    }();
                    e.distanceFrom = function(t) {
                        return 1e3 * i(this, t)
                    }
                }(), t.maps.Marker = function(t) {
                    this._init(t)
                },
                function() {
                    var i = t.maps.Marker.prototype;
                    i._init = function(t) {
                        ws_simple_init.call(this, t), _(t.visible).isUndefined() && (this.visible = !0)
                    }, i.setPosition = function(t) {
                        this.position = t, _(this.coerced).each(function(n, e) {
                            n.setPosition(t.ws_coerce(e))
                        })
                    };
                    var o = function(t) {
                        var n = e(new google.maps.Marker({
                            position: this.position.ws_coerce("google"),
                            icon: _(this).spelunk(["amenity", "badgeIcon"]) || this.icon
                        }), this);
                        this.zIndexGroup && n.setZIndexGroup(this.zIndexGroup), this.clickHandler && google.maps.event.addListener(n, "click", this.clickHandler), t(n)
                    };
                    n(i, !0, function(t, n) {
                        ({
                            google: o
                        })[t].call(this, n)
                    })
                }(), t.maps.InfoWindow = function(t) {
                    this._init(t)
                },
                function() {
                    var i = t.maps.InfoWindow.prototype,
                        o = function() {
                            var t = 0;
                            return function() {
                                t++ || ($("head").append("<link />"), $("head").children(":last").attr({
                                    rel: "stylesheet",
                                    type: "text/css",
                                    href: "//cdn2.walk.sc/2/css/miniwindow_vcm4qy00.css"
                                }))
                            }
                        }();
                    i._init = function(t) {
                        o(), ws_simple_init.call(this, t), this.classes || (this.classes = [])
                    }, i.setContent = function(t) {
                        this.content = t
                    }, i.setOptions = function(t) {
                        t.content && (this.content = t.content), t.classes && (this.classes = t.classes), $.browser.msie && ($.browser.version >= 8 && this.addClass("IE8"), $.browser.version < 8 && this.addClass("IE7"), $.browser.version < 7 && this.addClass("nonub"))
                    }, i.setPosition = function(t) {
                        this.position = t
                    }, i.setOffset = function(t, n) {
                        this.offset_x = t, this.offset_y = n
                    }, i.addClass = function(t) {
                        return this.removeClass(t), this.classes.push(t), this
                    }, i.removeClass = function(t) {
                        return this.classes = _(this.classes).reject(function(n) {
                            return n == t
                        }), this
                    }, i.makeDiv = function() {
                        var t = "ws_miniwindow_body " + (this.isSmall ? "small" : "large"),
                            n = $("<div />", {
                                "class": "ws_miniwindow"
                            }),
                            e = $("<div />", {
                                "class": t
                            }),
                            i = $("<div />", {
                                "class": "ws_miniwindow_nub"
                            });
                        _(this.classes).each(_(n.addClass).bind(n)), this.div = n.append(e.append(this.content)).append(i);
                        var o = _(_(function() {
                            var t = $(".ws_miniwindow");
                            t[0] ? t.unbind().click(_(function(t) {
                                t.stopPropagation()
                            }).bind(this)) : _(o).delay(50)
                        }).bind(this)).max_attempts(100);
                        return _(o).defer(), this.div
                    };
                    var r = function(t) {
                        var n = new MiniWindow({
                            idol: this
                        });
                        this.noOffset || n.setOffset(1, -25), t(e(n, this))
                    };
                    n(i, !0, function(t, n) {
                        ({
                            google: r
                        })[t].call(this, n)
                    })
                }(), t.maps.Polyline = function(t) {
                    this._init(t)
                },
                function() {
                    var i = t.maps.Polyline.prototype;
                    i._init = function(t) {
                        ws_simple_init.call(this, t), _(t.visible).isUndefined() && (this.visible = !0)
                    };
                    var o = function(t) {
                        t(e(new google.maps.Polyline({
                            strokeColor: this.strokeColor,
                            path: _(this.path).map(function(t) {
                                return t.ws_coerce("google")
                            })
                        }), this))
                    };
                    n(i, !0, function(t, n) {
                        ({
                            google: o
                        })[t].call(this, n)
                    })
                }(), t.maps.Polygon = function(t) {
                    this._init(t)
                },
                function() {
                    var i = t.maps.Polygon.prototype;
                    i._init = function(t) {
                        ws_simple_init.call(this, t), _(t.visible).isUndefined() && (this.visible = !0)
                    };
                    var o = function(t) {
                        var n = new google.maps.Polygon(this);
                        this.clickHandler && google.maps.event.addListener(n, "click", this.clickHandler), t(e(n, this))
                    };
                    n(i, !0, function(t, n) {
                        ({
                            google: o
                        })[t].call(this, n)
                    })
                }(), t.maps.LatLngBounds = function(t) {
                    this._init(t)
                },
                function() {
                    var i = t.maps.LatLngBounds.prototype;
                    i._init = function(t) {
                        this.extend(t)
                    }, i._toOLArray = function() {
                        return [this._sw.lng(), this._sw.lat(), this._ne.lng(), this._ne.lat()]
                    }, i.getNorthEast = function() {
                        return this._ne
                    }, i.getSouthWest = function() {
                        return this._sw
                    }, i.contains = function(t) {
                        return t.lat() > this._sw.lat() && t.lng() > this._sw.lng() && t.lat() < this._ne.lat() && t.lng() < this._ne.lng()
                    }, i.extend = function(n) {
                        if (n) {
                            this._sw && this._ne || (this._sw = new t.maps.LatLng(n.lat(), n.lng()), this._ne = new t.maps.LatLng(n.lat(), n.lng()));
                            var e = this;
                            return _([
                                ["_sw", -1],
                                ["_ne", 1]
                            ]).each(function(t) {
                                _(["lat", "lng"]).each(function(i) {
                                    n[i]() * t[1] > e[t[0]][i]() * t[1] && e[t[0]][i](n[i]())
                                })
                            }), this
                        }
                    };
                    var o = function(t) {
                        var n = this._toOLArray();
                        t(e(new google.maps.LatLngBounds(new google.maps.LatLng(n[1], n[0]), new google.maps.LatLng(n[3], n[2])), this))
                    };
                    n(i, !0, function(t, n) {
                        ({
                            google: o
                        })[t].call(this, n)
                    })
                }(), t
        }(),
        e = t.exports = function() {
            function t(t) {
                var n = "0123456789ABCDEF";
                return String(n.substr(t >> 4 & 15, 1)) + n.substr(15 & t, 1)
            }

            function n(n, e, i) {
                return "#" + t(n) + t(e) + t(i)
            }
            var e = this,
                i = e.$ || require("./fake-jquery");
            _ = e._ || require("./underscore-1.3.3");
            var o = 110900,
                r = 6378137,
                a = Math.PI / 180,
                s = .0015,
                c = function(t) {
                    return [o, Math.cos(t * a) * a * r]
                },
                u = function() {
                    try {
                        return !(!ArrayBuffer || !Uint8ClampedArray)
                    } catch (t) {
                        return !1
                    }
                }(),
                l = function(t, n, e, i) {
                    n || (n = []);
                    var o = _(n).map(function(t) {
                        return "set" + t.substr(0, 1).toUpperCase() + t.substr(1)
                    });
                    i && console.log("ChainableSettersMixin", t, n, e), t.setOptions = function(t) {
                        return t || (t = {}), i && console.log("setOptions", t), _(_(n).zip(o)).each(function(n) {
                            i && console.log("this[" + n[1] + "](" + n[0] + ")", this), void 0 !== t[n[0]] && this[n[1]](t[n[0]])
                        }, this), this
                    }, _.each(_(n).zip(o), function(n) {
                        t[n[1]] = function() {
                            var t = this["_" + n[1]] || (this["_" + n[1]] = function(t) {
                                e ? this[e].call(this, n[0], t) : this[n[0]] = t
                            });
                            return t.apply(this, [].slice.call(arguments)), this
                        }
                    })
                },
                d = {
                    LatLng: function() {
                        var t = function(t, n) {
                                this.lat(t), this.lng(n)
                            },
                            n = t.prototype;
                        return n.lat = function(t) {
                            return this._v("_lat", t)
                        }, n.lng = function(t) {
                            return this._v("_lng", t)
                        }, n._v = function(t, n) {
                            return void 0 !== n && (this[t] = n), this[t] || 0
                        }, t
                    }(),
                    LatLngBounds: function() {
                        var t = function(t) {
                                this._init(t)
                            },
                            n = t.prototype;
                        return n._init = function(t) {
                            h.LatLng(n), this.extend(t)
                        }, n.getNorthEast = function() {
                            return this._ne
                        }, n.getSouthWest = function() {
                            return this._sw
                        }, n.contains = function(t) {
                            return t.lat() > this._sw.lat() && t.lng() > this._sw.lng() && t.lat() < this._ne.lat() && t.lng() < this._ne.lng()
                        }, n.extend = function(t) {
                            if (t) {
                                this._sw && this._ne || (this._sw = new this.LatLng(t.lat(), t.lng()), this._ne = new this.LatLng(t.lat(), t.lng()));
                                var n = this;
                                return _([
                                    ["_sw", -1],
                                    ["_ne", 1]
                                ]).each(function(e) {
                                    _(["lat", "lng"]).each(function(i) {
                                        t[i]() * e[1] > n[e[0]][i]() * e[1] && n[e[0]][i](t[i]())
                                    })
                                }), this
                            }
                        }, t
                    }(),
                    Polygon: function() {
                        var t = function(t) {
                                this._init(t)
                            },
                            n = t.prototype;
                        return l(n, ["paths"]), n._init = function(t) {
                            h.MVCArray(n), this.setOptions(t)
                        }, n.getPaths = function() {
                            return this._paths
                        }, n._setPaths = function(t) {
                            var n = this.MVCArray;
                            this._paths = new n(_(t).map(function(t) {
                                return new n(t)
                            }))
                        }, t
                    }(),
                    MVCArray: function() {
                        var t = function(t) {
                                this._init(t)
                            },
                            n = t.prototype;
                        return n._init = function(t) {
                            this._array = t
                        }, n.getArray = function() {
                            return this._array
                        }, t
                    }()
                },
                h = _(d).reduce(function(t, n, i) {
                    return t[i] = function(t, n) {
                        return t || (t = {}), t[i] || (t[i] = e.google && !n ? google.maps[i] : d[i]), t[i]
                    }, t
                }, {}),
                f = function(t) {
                    var n = function(n) {
                            return n ? (_({
                                PNAMES: "name",
                                PWEIGHTS: "weighting",
                                PFOLLOWON: "followon"
                            }).each(function(t, i) {
                                e[i] || (e[i] = _(n).oreduce(function(n, e) {
                                    n[e.id] = e[t]
                                }))
                            }), t(e._partnerInfo = n)) : t(n)
                        },
                        o = e._partnerInfo;
                    return o ? n(o) : void i.ajax({
                        url: "/auth/rentals/partners",
                        dataType: "json",
                        success: n,
                        failure: _(n).bind({}, null)
                    })
                },
                g = function(t) {
                    return t.push(t[t.length - 1]), t.unshift(t[0]),
                        function(e, i, o) {
                            for (var r = 1; r < t.length - 1 && t[r][0] < e; r++);
                            var a = _([0, 1, 2, 3]).map(function(n) {
                                var i = e - t[r - 1][0],
                                    a = t[r][0] - t[r - 1][0],
                                    s = o ? 0 : Math.min(i / (a || 1), 1),
                                    c = 1 - s;
                                return t[r - 1][1][n] * c + t[r][1][n] * s
                            });
                            return i ? a : n.apply({}, a)
                        }
                },
                p = {
                    makeGatherReqs: function(t, n, e) {
                        return function(i, o) {
                            var r = this;
                            if (void 0 !== o && !_(i).isObject()) {
                                var a = i;
                                i = {}, i[a] = o
                            }
                            _(r).extend(i);
                            var s = _(t).select(function(t) {
                                return void 0 !== r[t]
                            });
                            e && console.log(t, s, _(i).keys()), t.length == s.length && r[n].call(r)
                        }
                    },
                    CountDownHash: function(t, n) {
                        var e = {};
                        return _(t).each(function(t) {
                                e[t] = !0
                            }),
                            function(t) {
                                e[t] && (delete e[t], _(e).isEmpty() && n())
                            }
                    },
                    byte2Hex: t,
                    makeGetScoreColor: g,
                    getScoreColor: g([
                        [0, [223, 68, 51]],
                        [55, [235, 237, 129]],
                        [75, [173, 228, 108]],
                        [95, [78, 173, 66]]
                    ]),
                    getHeatmapColor: g([
                        [0, [110, 25, 41, 50]],
                        [20, [241, 157, 31, 100]],
                        [40, [255, 213, 37, 200]],
                        [45, [255, 226, 44, 200]],
                        [50, [255, 252, 48, 200]],
                        [60, [220, 252, 47, 240]],
                        [70, [165, 250, 43, 250]],
                        [75, [137, 243, 42, 245]],
                        [80, [109, 234, 43, 245]],
                        [85, [78, 221, 44, 245]],
                        [90, [45, 205, 46, 255]],
                        [95, [19, 193, 46, 255]],
                        [98, [9, 185, 48, 255]],
                        [100, [4, 175, 48, 255]]
                    ]),
                    prepTemplateTree: function() {
                        var t = function(n, e, i) {
                            n[i] = e instanceof Object ? _(e).oreduce(t) : _(e).template()
                        };
                        return function(n) {
                            return _(n).oreduce(t)
                        }
                    }(),
                    scaleInMeters: c,
                    snapToGrid: function(t, n) {
                        return scale = 1e6, n || (n = s), n *= scale, t *= scale, t += n / 2, t /= n, t = Math.floor(t), t *= n, t /= scale
                    },
                    makeGetDistWithScale: function(t, n) {
                        var e = c(t, n),
                            i = e[0],
                            o = e[1];
                        return function(e) {
                            var r = (t - e[0]) * i,
                                a = (n - e[1]) * o;
                            return Math.sqrt(r * r + a * a) / 1609.34
                        }
                    },
                    domainRoundRobinAJAXUrl: function() {
                        var t = 0,
                            n = e.window ? ["ajax1.walkscore.com", "ajax2.walkscore.com", "ajax3.walkscore.com", "ajax4.walkscore.com"] : ["calc.walkscore.com"];
                        return function(e) {
                            return "https://" + n[t++ % n.length] + e
                        }
                    }(),
                    haveArrayBuffer: u,
                    retryAjax: function() {
                        var t = function(n, e, o) {
                            n.error = --e ? _(t).bind(this, n, e, o) : o, i.ajax(n)
                        };
                        return function(n, e) {
                            var i = n.error || function() {
                                throw "Could not fetch: " + n.url
                            };
                            t(n, e || 3, i)
                        }
                    }(),
                    makeBuffer: function() {
                        var t = null,
                            n = 0,
                            e = 1 << 20,
                            i = {
                                "double": 8,
                                "float": 4,
                                int32: 4,
                                uint32: 4,
                                uint16: 2,
                                int16: 2,
                                uint8: 1,
                                int8: 1
                            };
                        try {
                            var o = {
                                "double": Float64Array,
                                "float": Float32Array,
                                uint32: Uint32Array,
                                int32: Int32Array,
                                uint16: Uint16Array,
                                int16: Int16Array,
                                uint8: Uint8Array,
                                int8: Int8Array
                            }
                        } catch (r) {
                            var o = {}
                        }
                        return function(r, a, s) {
                            var c = a || "uint32",
                                l = i[c],
                                d = r * l,
                                h = e - n;
                            if (u && s) {
                                if (d > e) return new o[c](new ArrayBuffer(d));
                                (d > h || !t) && (t = new ArrayBuffer(e), n = 0);
                                for (var f = 0; !p && 4 > f;) try {
                                    p = new o[c](t, n + f, r)
                                } catch (g) {
                                    f++
                                }
                                return n += d + f, p
                            }
                            for (var p = new Array(r), w = 0; r > w; w++) p[w] = 0;
                            return p
                        }
                    }(),
                    tzDateFromUTCDate: function(t) {
                        return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()))
                    },
                    urlifyAddress: function(t) {
                        return t = t.replace(/^\s*/, "").replace(/\s*$/, "").replace(/-/g, ".dash.").replace(/#/g, ".num.").replace(/\//g, ".slash.").replace(/&/g, " and ").replace(/,/g, " ").replace(/\s+/g, "-"), encodeURIComponent(t).replace(/'/g, "%27")
                    },
                    encodeLocalityName: function(t) {
                        return encodeURIComponent(t.replace(/ /g, "_").replace(/\//g, ".slash."))
                    },
                    getUrlParamFromString: function(t, n) {
                        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                        var e = "[\\?&]" + t + "=([^&#]*)",
                            i = new RegExp(e),
                            o = i.exec(n);
                        if (null == o) return "";
                        var r = o[1];
                        return r = decodeURIComponent(r).replace(/\+/g, " ")
                    },
                    formatNumber: function(t, n, e, i) {
                        var o = isFinite(+t) ? +t : 0,
                            r = isFinite(+n) ? Math.abs(n) : 0,
                            a = "undefined" == typeof i ? "," : i,
                            s = "undefined" == typeof e ? "." : e,
                            c = "",
                            u = function(t, n) {
                                var e = Math.pow(10, n);
                                return "" + Math.round(t * e) / e
                            };
                        return c = (r ? u(o, r) : "" + Math.round(o)).split("."), c[0].length > 3 && (c[0] = c[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, a)), (c[1] || "").length < r && (c[1] = c[1] || "", c[1] += new Array(r - c[1].length + 1).join("0")), c.join(s)
                    },
                    priceRangeString: function(t, n, e) {
                        "0" == n && (n = t);
                        var i = formatNumber(t ? t : n),
                            o = (formatNumber(n), 1 / 0 === t || n === -1 / 0),
                            e = e || "Call for price";
                        return price_range_str = t == n || o ? !t || o ? e : "<span>$" + i + "</span>" : "from <span>$" + i + "</span>"
                    },
                    capitalize: function(t) {
                        return t.charAt(0).toUpperCase() + t.slice(1)
                    },
                    boprof: function() {
                        var t = (new Date).getTime();
                        return function(n) {
                            var e = (new Date).getTime();
                            console.log(n, e - t), t = e
                        }
                    },
                    logExceptions: function(t, n) {
                        return function() {
                            try {
                                return n.apply({}, [].slice.call(arguments))
                            } catch (o) {
                                throw e.window && _(function() {
                                    trackEventNonInteractive(ACTIVE_COMPONENT, "JSError " + t, o.name + ": " + o.message), i.ajax({
                                        url: "/auth/p/error",
                                        data: {
                                            c: ACTIVE_COMPONENT,
                                            l: t,
                                            n: o.name,
                                            m: o.message
                                        }
                                    })
                                }).defer(), o
                            }
                        }
                    },
                    withPartnerInfo: f,
                    NeedsPartnerInfoMixin: function(t) {
                        var n = t._init;
                        t._init = function() {
                            var t = arguments,
                                i = this;
                            f(function() {
                                _(["PWEIGHTS", "PNAMES", "_partnerInfo", "PFOLLOWON"]).each(function(t) {
                                    i[t] = e[t]
                                }), n.apply(i, t)
                            })
                        }
                    },
                    ChainableSettersMixin: l,
                    LoggerMixin: function(t, n) {
                        var e = [n];
                        try {
                            e.unshift(process.pid)
                        } catch (i) {}
                        t.log = function() {
                            this.verbose && console.log.apply(console, [(new Date).toISOString()].concat(e.concat([].slice.call(arguments))))
                        }
                    },
                    PassThroughSettersMixin: function(t, n, e, i) {
                        i && console.log("PassThroughSettersMixin", t, n, e), _(e).each(function(e) {
                            var o = "_set" + e.substr(0, 1).toUpperCase() + e.substr(1);
                            t[o] = function() {
                                i && console.log("this[" + n + "][" + o + "]", this), this[n][o].apply(this[n], [].slice.call(arguments))
                            }
                        })
                    },
                    ProfilingMixin: function(t) {
                        t._profile = function() {
                            var t = {};
                            return function(n, e) {
                                if (this.profile) {
                                    t[n] || (t[n] = [0, 0]);
                                    var i = (new Date).getTime() - e;
                                    t[n][0]++, t[n][1] += i, console.log(n, i, t[n][1] / t[n][0])
                                }
                            }
                        }()
                    },
                    CountsMixin: function(t, n) {
                        t.getCounts = function() {
                            return this.counts || this.resetCounts()
                        }, t.setCounts = function(t) {
                            this.counts = t
                        }, t.resetCounts = function() {
                            return this.counts = _(n).oreduce(function(t, n) {
                                t[n] = 0
                            })
                        }, t.strCounts = function(t) {
                            return t || (t = this.counts), _(n).chain().filter(function(n) {
                                return void 0 !== t[n]
                            }).map(function(n) {
                                return [t[n], n]
                            }).flatten().value().join(" ")
                        }
                    },
                    ConstituentsMixin: function(t) {
                        t._initConstituents = function(t, n) {
                            var n = n || {};
                            if (PWEIGHTS = this.PWEIGHTS, PNAMES = this.PNAMES, e.simpleLoginApp && this !== e.simpleLoginApp) {
                                var i = {
                                    topMenus: RentalsTopMenus,
                                    facebook: RentalsFacebookConnector,
                                    facebookView: RentalsFacebookView,
                                    curator: PlaceDataCuratorConstituent
                                };
                                _(i).each(_(function(i, o) {
                                    t[o] && e.simpleLoginApp[o] && (delete t[o], e.simpleLoginApp[o].setApp && e.simpleLoginApp[o].setApp(this), n[o] = e.simpleLoginApp[o])
                                }).bind(this))
                            }
                            _(this._composition = t).each(_(function(t, n) {
                                this[n] = new t(this)
                            }).bind(this)), _(this).extend(n || {}), this._did_init_all_the_things = !0, (this.watch_slow || this.watch_all || this.watch_some) && _(t).each(_(function(t, n) {
                                (this.watch_slow || this.watch_all || _(this.watch_some.split(",")).contains(n)) && _(this[n]).watch(n, this.watch_slow)
                            }).bind(this)), this._sprayMethod("start", n), this._did_start_all_the_things = !0
                        }, t._sprayMethod = function(t, n) {
                            return _(this._composition).oreduce(_(function(e, i, o) {
                                this[o][t] && !(n || {})[o] && (e[o] = this[o][t]())
                            }).bind(this))
                        }
                    },
                    MapPolyfillMixins: h,
                    decodeGooglePolygonPaths: function(t) {
                        return _(t.split(" ")).map(function(t) {
                            return (e.google ? google.maps.geometry.encoding.decodePath : require("./poly-decoder"))(t)
                        })
                    },
                    decodeGeoJSONPolygonPaths: function(t) {
                        var n = h.LatLng();
                        return _(_(t.coordinates).flattenOneLevel()).map(function(t) {
                            return _(t).map(function(t) {
                                return new n(t[1], t[0])
                            })
                        })
                    },
                    decodeWKTPolygonPaths: function(t) {
                        var n = h.LatLng();
                        return _(t).chain().select(function(t) {
                            return t
                        }).map(function(t) {
                            return _(t.substr(0, t.length - 1).substr(11).split(",")).map(function(t) {
                                var e = t.split(" ");
                                return new n(e[1], e[0])
                            })
                        }).value()
                    },
                    boundsFromCommaSeparatedLatLng: function(t) {
                        var n = t.split(","),
                            e = h.LatLngBounds(),
                            i = h.LatLng();
                        return new e(new i(n[0] - 0, n[1] - 0))
                    },
                    boundsFromBoxKey: function(t) {
                        var n = _(t.split("_")).map(function(t) {
                                return t - 0
                            }),
                            e = [n[0] + .25, n[1] + .25],
                            i = h.LatLngBounds(),
                            o = h.LatLng();
                        return new i(new o(n[0], n[1])).extend(new o(e[0], e[1]))
                    },
                    boundsFromHood: function(t) {
                        var n = t._bounds;
                        return new google.maps.LatLngBounds(new google.maps.LatLng(n._sw.lat_, n._sw.lng_)).extend(new google.maps.LatLng(n._ne.lat_, n._ne.lng_))
                    },
                    makeIndices: function(t) {
                        _(t).each(function(t, n) {
                            this[t] = n
                        })
                    },
                    makeFlags: function(t) {
                        _(t).each(function(t, n) {
                            this[t] = 1 << n
                        })
                    },
                    getPerformanceLevel: function() {
                        var t = -1;
                        return function() {
                            if (t >= 0) return t;
                            t = 0;
                            for (var n = 0; 3 > n; n++)(function() {
                                for (var n = (new Date).getTime(), e = {}, i = 0, o = 0; 1 << 30 > o && 4 > i; o++) {
                                    var r = o % 1e3,
                                        a = "_" + r;
                                    o % 1e4 == 0 && (i = (new Date).getTime() - n), e[a] || (e[a] = []), e[a].push({
                                        val: o
                                    }), e[a].push(e[a][1 & o ? "shift" : "pop"]())
                                }
                                t += (o - 1) / 1e3
                            })();
                            return t = Math.min(Math.floor(t / 4), 4)
                        }
                    }(),
                    PERF_ABYSMAL: 0,
                    PERF_POOR: 1,
                    PERF_OK: 2,
                    PERF_GOOD: 3,
                    PERF_GREAT: 4
                };
            return p
        }.call(this);
    window.walkscore || (window.walkscore = {});
    for (var i in n) n.hasOwnProperty(i) && (walkscore[i] = n[i]);
    window.ensureWSUnderscoreMixins = t.exports = function() {
        var t = !1,
            n = this;
        return function(e) {
            return t ? e : (e || (e = n._), e.mixin({
                sum: function(t) {
                    return e(t).reduce(function(t, n) {
                        return t + n
                    }, 0)
                },
                bindsplat: function(t, n, e) {
                    return function() {
                        var i = Array.prototype.slice.call(arguments);
                        return t.apply(n || {}, e.concat(i))
                    }
                },
                slice: function(t, n) {
                    var i = {};
                    return e(n).each(function(n) {
                        t.hasOwnProperty(n) && (i[n] = t[n])
                    }), i
                },
                dict_slice: function(t, n, i) {
                    return i ? e(t).oreduce(function(t, i, o) {
                        e(n).include(o) || (t[o] = i)
                    }) : e(n).oreduce(function(n, e) {
                        n[e] = t[e]
                    })
                },
                flattenOneLevel: function(t) {
                    return e.reduce(t, function(t, n) {
                        return e.isArray(n) ? t.concat(n) : (t[t.length] = n, t)
                    }, [])
                },
                trim: function(t) {
                    return e(t).oreduce(function(t, n, e) {
                        n && (t[e] = n)
                    })
                },
                flattenObject: function(t, n, i) {
                    var i = defaultIfNotSet(i, 0),
                        o = [];
                    for (var r in t) {
                        var a = getObjectType(t);
                        n > i && "Object" == a || "Array" == a ? o = o.concat(e(t[r]).flattenObject(n, i + 1)) : o.push(t[r])
                    }
                    return o
                },
                recharge: function(t, n) {
                    var e = 0;
                    return function() {
                        var i = this,
                            o = arguments,
                            r = (new Date).getTime();
                        r - e > n && (e = r, t.apply(i, o))
                    }
                },
                thump: function(t, n, i) {
                    var o = 0,
                        r = function() {
                            var a = this,
                                s = arguments;
                            t.apply(a, s), (!i || ++o < i) && e(r).delay(n)
                        };
                    r()
                },
                dumpMethod: function(t, n) {
                    t[n] = e(t[n]).wrap(function(e) {
                        var i = Array.prototype.slice.call(arguments, 1);
                        console.log(n, "in", i);
                        var o = e.apply(t, i);
                        return console.log(n, "out", o), o
                    })
                },
                spelunk: function(t, n) {
                    for (var n = e(n).clone(); t && n.length;) t = t[n.shift()];
                    return t
                },
                spefunc: function(t, n, i) {
                    for (var n = e(n).clone(), o = t; t && n.length;) o = t, t = t[n.shift()];
                    return e(t || i || function() {}).bind(o)
                },
                oreduce: function(t, n, i, o) {
                    return e(t).reduce(function(t, e, i) {
                        return n(t, e, i), t
                    }, i || {}, o)
                },
                max_attempts: function(t, n) {
                    return e(t).wrap(function(t) {
                        var e = Array.prototype.slice.call(arguments, 1);
                        return n-- > 0 ? t.apply(this, e) : void 0
                    })
                },
                lump: function(t, n) {
                    return t.slice(0, Math.floor(t.length / n) * n)
                },
                indexOf: function(t, n) {
                    "use strict";
                    if (void 0 === t || null === t) throw new TypeError;
                    var e = Object(t),
                        i = e.length >>> 0;
                    if (0 === i) return -1;
                    var o = 0;
                    if (arguments.length > 1 && (o = Number(arguments[2]), o !== o ? o = 0 : 0 !== o && o !== 1 / 0 && o !== -(1 / 0) && (o = (o > 0 || -1) * Math.floor(Math.abs(o)))), o >= i) return -1;
                    for (var r = o >= 0 ? o : Math.max(i - Math.abs(o), 0); i > r; r++)
                        if (r in e && e[r] === n) return r;
                    return -1
                },
                watch: function(t, n, i) {
                    i || (i = -1);
                    for (method in t) e(t[method]).isFunction() && function(o) {
                        t[o] = e(t[o]).wrap(function(r) {
                            for (var a = [arguments.callee.caller.caller], s = 0; 9 > s && a[0].caller; s++) a.unshift(a[0].caller);
                            var c = Array.prototype.slice.call(arguments, 1),
                                u = (new Date).getTime(),
                                l = r.apply(t, c),
                                d = (new Date).getTime() - u,
                                h = {
                                    args: c,
                                    retval: l,
                                    time: d,
                                    stack: a.reverse()
                                };
                            return d > i && console.log.apply(console, e([(new Date).getTime(), n ? n : [], o, h]).flatten()), l
                        })
                    }(method)
                },
                onInstantiation: function(t, n) {
                    var e = function() {},
                        i = function() {
                            n(t.apply(this, arguments))
                        };
                    return e.prototype = t.prototype, i.prototype = new e, i.prototype.constructor = i, i
                },
                sort: function(t, n) {
                    return t.sort(n)
                }
            }), t = !0, e)
        }
    }.call(this), window._ && ensureWSUnderscoreMixins(), window._ws_ = e;
    for (var i in e) e.hasOwnProperty(i) && (window[i] = e[i])
}).call(window),
    function() {
        "use strict";

        function haveLocalStorage() {
            try {
                return localStorage.setItem("test", "test"), localStorage.removeItem("test"), !0
            } catch (t) {
                return !1
            }
        }
        window.app_loader = function() {
            var t = [];
            return function(n) {
                if (t.push(n), !(t.length > 1)) {
                    var e = function() {
                            ensureWSUnderscoreMixins(), window.have_google = _(window.google).spelunk(["maps", "Map"]), have_google && ensure_ws_v3_extensions(), _(t).each(function(t) {
                                _(t).defer()
                            })
                        },
                        i = new CountDownHash(["google", "page"], e);
                    return window.google_ready = function() {
                            i("google")
                        },
                        function() {
                            i("page")
                        }
                }
            }
        }(), window.ensure_ws = function() {
            return window.ws || (window.ws = _({
                LARGE_DISTANCE: 999999999999,
                zIndexGroups: {
                    AMENITY_MARKERS: 0,
                    TRANSIT_MARKERS: 1,
                    HOUSE_MARKER: 2,
                    SELECTED_MARKERS: 3
                }
            }).extend(walkscore.maps))
        }, window.console || (window.console = {
            log: function() {}
        }), haveLocalStorage() || (window.localStorage = {
            getItem: function() {},
            setItem: function() {},
            removeItem: function() {},
            clear: function() {},
            key: function() {}
        }), window.logPageView = function(t, n) {
            logUserLocationEvent.call(this, {
                slug: t,
                rid: n
            })
        }, window.logUserLocationEvent = function(t) {
            var n = (this || window).ACTIVE_COMPONENT.replace(/ /g, "_"),
                e = t.slug || "";
            t.data || (t.data = {}), t.data.d || (t.data.d = "current"), _({
                rid: "rid",
                evt: "e",
                id: "i"
            }).each(function(n, e) {
                _(t[e]).isUndefined() || (t.data[n] = t[e], delete t[e])
            }), e && "/" != e[0] && (e = "/" + e), $.ajax(_({
                url: "/auth/_pv/" + n + e,
                dataType: "json"
            }).extend(t))
        }, window.getUserLocationState = function(t) {
            t.data = _(t.data || {}).extend({
                q: 1
            }), logUserLocationEvent(t)
        }, window.safeString = function(t, n, e) {
            return "string" != typeof t ? "" : (n && (t = " " + t), e && (t += " "), t)
        }, window.isEmptyString = function(t) {
            return "string" == typeof t && 0 == t.length
        }, window.urlifyLocation = function(t, n, e) {
            return urlifyAddress(t) + safeUrlLatLng(n, e)
        }, window.safeUrlLatLng = function(t, n) {
            return t && n ? "/lat=" + t + "/lng=" + n : ""
        }, window.encodeAddress = function(t) {
            return encodeURIComponent((t || "").replace(/\-/g, ".dash.").replace(/\#/g, ".num.").replace(/\//g, ".slash.").replace(/,/g, " ").replace(/\s/g, "-").replace(/--/g, "-"))
        }, window.unencodeAddress = function(t) {
            return decodeURIComponent(t || "").replace(/-/g, " ").replace(/\.dash\./g, "-").replace(/\.num\./g, "#").replace(/\.slash\./g, "/")
        }, window.urlifyLatLng = function(t) {
            return "loc/lat=" + t.lat() + "/lng=" + t.lng()
        }, window.urlifyParam = function(t, n) {
            return null == n ? "" : t + "=" + encodeURIComponent(n)
        }, window.getUrlParam = function(t) {
            return _(window["url_" + t]).isUndefined() ? getUrlParamFromString(t, window.location.href) : window["url_" + t]
        }, window.pathFromUrl = function(t) {
            return /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/.exec(t)[1]
        }, window.activateShareButton = function(t) {
            if (t = t || {}, 0 != $("#share-button, .share-button").length || t.nodes) {
                var n = function(n) {
                    return window.ws_addThis || (window.ws_addThis = new window.RentalsAddThis(t.app), window.ws_addThis.start()), t.clickHandler ? t.clickHandler(n) : showShareDialog(n, t.url, t.title), !1
                };
                $("#address-bar-links").css("display", "block");
                var e = t.nodes || $("#share-button, .share-button");
                e.css("display", "block").unbind().click(n), $("#address-bar #share-button").click(function() {
                    trackEvent(ACTIVE_COMPONENT, "share link clicked", "address bar")
                })
            }
        }, window.clearSelection = function() {
            if (document.selection && document.selection.empty) document.selection.empty();
            else if (window.getSelection) {
                var t = window.getSelection();
                t && t.removeAllRanges && t.removeAllRanges()
            }
        }, window.loadTileAsync = function() {
            var t = document.createElement("script");
            t.type = "text/javascript", t.src = "/tile/show-walkscore-tile.php", document.getElementsByTagName("head")[0].appendChild(t)
        }, window.loadCSS = function(t) {
            var n = document.createElement("link");
            n.rel = "stylesheet", n.href = t, document.head.appendChild(n)
        }, window.rand = function(t) {
            return Math.floor(Math.random() * t + 1)
        }, window.parseJson = function(jsonStr) {
            if (!jsonStr || "string" != typeof jsonStr || 0 == jsonStr.length) return null;
            if (window.JSON && window.JSON.parse) return JSON.parse(jsonStr);
            try {
                return eval("(" + jsonStr + ")")
            } catch (err) {
                return null
            }
        }, window.ENV_PRODUCTION = !0, window.DEBUG_BLOCK_COOKIE = !1, window.DEBUG_BLOCK_API = !1, window.DEBUG_BLOCK_LOCALSTORAGE = !1, window.DEBUG_OUTPUT_ACTIVE = !1, window.DEBUG_AUDIT_GEOCODE = !1, window.DEBUG_ADS = !1, window.DEBUG_CURATION = !1, window.WS_M_NOT_FOUND = "<p>The address you entered could not be found. Please check your address and try again.</p>", window.SIDEBAR_THRESHOLD = 850, window.BROWSER_PREFIXES = ["webkit", "ms", "o", "moz", "khtml"]
    }(),
    function() {
        "use strict";
        window.DataCuratorAuthMixin = function(t) {
                t.loginHtmlGoog = '<a id="dialog-goog-login" class="oid-login login"></a>', t.loginHtmlFB = '<a id="dialog-fb-login" class="fb-login login"></a>', t.signOutLink = '<a class="dull-link" id="dialog-logout">Sign out</a>', t.formErrorMsg = '<div class="form-error-message">Sign in required to edit a place.</div>', t.updateLoginInfo = function(t, n, e) {
                    this.oidConnector.withInfo(_(this.OnReceiveOIDInfo).bind(this, t, e), n)
                }, t.OnReceiveOIDInfo = function(t, n, e) {
                    if (e) DEBUG_CURATION && console.log("UI got OID info: Signed IN"), $("#user-login").html('<div class="' + ((this.oidConnector.isFBUser(e) ? "facebook" : "google") + "-icon") + '"><p class="hint-text tight-top">Signed in as ' + e.name + ". " + this.signOutLink + "</p></div>"), $("#curate-confirm").attr("disabled", !1), this.oidConnector.registerSignOutLink("dialog-logout", _(this.OnReceiveOIDInfo).bind(this, t, n));
                    else {
                        var i = this.loginHtmlFB + this.loginHtmlGoog;
                        n || (i += this.formErrorMsg), $("#user-login").html(i), n || $("#curate-confirm").attr("disabled", !0), this.oidConnector.registerSignInLink("dialog-fb-login", "facebook", _(this.OnReceiveOIDInfo).bind(this, t, n)), this.oidConnector && this.oidConnector.registerSignInLink("dialog-goog-login", "google", _(this.OnReceiveOIDInfo).bind(this, t, n))
                    }
                    t && t(e)
                }, t.withUser = function(t) {
                    this.oidConnector.withInfo(t)
                }
            }, window.OpenIdConnector = function() {
                this._init()
            },
            function() {
                var t = OpenIdConnector.prototype;
                ListenerMixin(t);
                var n = null;
                t._init = function() {
                    this.facebookConnector = new FacebookConnector
                }, t.withInfo = function(t, e, i, o) {
                    var r = function(o) {
                        var r = !_(n).isNull();
                        _((o || {}).name).isUndefined() && (o = null), n = o, (!r || e) && this._alertListeners("info", o), n && !r && e && i && trackEvent(ACTIVE_COMPONENT, i + " permission granted"), t(o)
                    };
                    return n && !e ? r(n) : (o && o(), void $.ajax({
                        url: "/auth/openid/user_info",
                        type: "GET",
                        cache: !1,
                        dataType: "json",
                        success: _(r).bind(this),
                        error: _(r).bind(this, null)
                    }))
                };
                var e = {
                    google: "https://www.google.com/accounts/o8/id"
                };
                t.loginFB = function(t, n) {
                    this.facebookConnector.login(_(this.withInfo).bind(this, t, !0, "facebook", n))
                }, t.login = function(t, n, i) {
                    if ("facebook" == t) return this.loginFB(n, i);
                    var o = "_login_complete_" + (new Date).getTime();
                    window[o] = _(function() {
                        window[o] = null, this.withInfo(n, !0, "google", i)
                    }).bind(this);
                    var r = ["/auth/openid/login", $.param({
                        openid: e[t],
                        next: "/auth/openid/login_finish?callback=" + o
                    })].join("?");
                    trackEvent(ACTIVE_COMPONENT, "google permission requested");
                    var a = window.open(r, "login", "height=490,width=870");
                    window.focus && a.focus()
                }, t.registerSignInLink = function(t, n, e, i) {
                    $("#" + t).click(_(this.login).bind(this, n, e, i))
                }, t.registerSignInNode = function(t, n, e, i) {
                    t.click(_(this.login).bind(this, n, e, i))
                }, t.logout = function(t) {
                    var n = _(_(this.withInfo).bind(this, t, !0, null, null)).max_attempts(1);
                    $.ajax({
                        url: "/auth/openid/logout_ajax",
                        type: "GET",
                        cache: !1,
                        dataType: "json",
                        success: n,
                        error: n
                    })
                }, t.registerSignOutLink = function(t, n) {
                    $("#" + t).click(_(this.logout).bind(this, n))
                }, t.isFBUser = function(t) {
                    return ((t || {}).id || "").match(/^\d+$/)
                }
            }(), window.FacebookConnector = function() {
                this._init()
            },
            function() {
                var t = FacebookConnector.prototype,
                    n = "133264856724753";
                t._init = function() {
                    this.user = null, this.userCallback = null, this.initialized = !1, this.loginInProgress = !1, this.fbScriptLoadingStarted = !1, $.browser.msie && $.browser.version < 8 || (window.usingFacebookConnector = !0, window.fbAsyncInit = _(function() {
                        var t = "http://" + window.location.host + "/channel.html";
                        FB.init({
                            appId: n,
                            version: "v2.0",
                            status: !0,
                            cookie: !0,
                            xfbml: !0,
                            oath: !0,
                            channelUrl: t
                        }), window.appEvents && appEvents.fireEvent(null, "facebookScriptLoaded"), FB.getLoginStatus(_(this.handleSessionResponse).bind(this, !1, null))
                    }).bind(this), this.loadFacebook())
                }, t.login = function(t) {
                    FB && (this.loginInProgress = !0, FB.login(_(this.handleSessionResponse).bind(this, !0, t), {
                        scope: "email"
                    }), trackEvent(ACTIVE_COMPONENT, "facebook permission requested"))
                }, t.logout = function() {
                    FB && this.user && (trackEvent(ACTIVE_COMPONENT, "facebook logout"), FB.logout(_(this.handleSessionResponse).bind(this, !1, null)))
                }, t.registerSignInLink = function(t, n) {
                    $("#" + t).unbind("click").bind("click", _(this.login).bind(this, n))
                }, t.registerSignInNode = function(t, n) {
                    t.unbind("click").bind("click", _(this.login).bind(this, n))
                }, t.handleSessionResponse = function(t, n, e) {
                    return "connected" !== e.status ? (this.user = null, this.initialized = !0, this.loginInProgress = !1, void(n && n())) : (this.loginInProgress && _(function() {
                        window.focus()
                    }).delay(50), void FB.api("/me", _(function(e) {
                        e && e.name && (this.user = e, this.initialized = !0, this.loginInProgress && (this.loginInProgress = !1));
                        var i = function(t) {
                            (t || {}).ok || (this.user = null), n && n(this.user), this.userCallback && this.userCallback(this.user), this.userCallback = null
                        };
                        t ? $.ajax({
                            url: "/auth/score/facebook_login_ok",
                            type: "GET",
                            cache: !1,
                            dataType: "json",
                            success: _(i).bind(this),
                            error: _(i).bind(this, null)
                        }) : i.call(this)
                    }).bind(this)))
                }, t.loadFacebook = function() {
                    if ($.browser.msie && $.browser.version < 8) return !1;
                    if (!this.fbScriptLoadingStarted) {
                        var t = document.createElement("script");
                        return t.async = !0, t.src = document.location.protocol + "//connect.facebook.net/en_US/sdk.js", $("#fb-root").append(t), this.fbScriptLoadingStarted = !0, !0
                    }
                    return !1
                }
            }()
    }(),
    function() {
        "use strict";
        window.SimpleCache = function() {
            this.data = {}, this.put = function(t, n) {
                this.data[t] = n
            }, this.get = function(t) {
                return _.isUndefined(this.data[t]) ? null : this.data[t]
            }, this.hasKey = function(t) {
                return _.isUndefined(this.data[t]) ? !1 : !0
            }, this.clear = function(t) {
                this.data[t] = null, delete this.data[t]
            }, this.clearAll = function() {
                for (var t in this.data) delete this.data[t]
            }
        }
    }(),
    function() {
        "use strict";
        window.LocalCache = function() {
            function t(t) {
                this.key = t, this.size = 10, this.expiration = n, this._default = null
            }
            var n = 864e5,
                e = t.prototype;
            e.setKey = function(t) {
                return this.key = t, this
            }, e.setLocation = function(t) {
                return this.geoData = t, this
            }, e.setSize = function(t) {
                return this.size = t, this
            }, e.setExpiration = function(t) {
                return this.expiration = t, this
            }, e.setDefault = function(t) {
                return this._default = t, this
            }, e.isPersistent = function() {
                return this.storedSuccessfully
            }, e.fetch = null, e.store = null, e.clear = null;
            var i, o;
            o = function() {
                return !0
            }, i = function() {
                this._data = this._data || []
            }, t.clearLike = function() {
                t.noPost = !0
            };
            var r = function(t, n) {
                    return t.lat == n.lat && t.lng == n.lng
                },
                a = function(t, n) {
                    return t.time - n.time > this.expiration
                },
                s = function() {
                    if (!(this.geoData && this.geoData.getLatLng && this.geoData.getLatLng())) throw "Missing GeoData in LocalCache, with cache key " + this.key
                },
                c = function() {
                    if (!this.key) throw "Missing key in LocalCache"
                };
            return e.clear = function() {
                this.store()
            }, e.store = function(t) {
                _(s).bind(this)(), _(c).bind(this)(), _(i).bind(this)();
                var n = {
                        lat: this.geoData.getLat(),
                        lng: this.geoData.getLng(),
                        time: (new Date).getTime()
                    },
                    e = _(this._data).detect(_(r).bind(this, n));
                for (e && (n.time = e.time, this._data = _(this._data).reject(_(r).bind(this, n))), t && (n.data = simplifyDataStructure(t), this._data.push(n)); this._data.length > this.size;) this._data.shift();
                for (; !_(o).bind(this)() && this._data.length >= 1;) this._data.shift()
            }, e.fetch_raw = function() {
                return this.fetch(!0)
            }, e.fetch = function(t) {
                _(s).bind(this)(), _(c).bind(this)(), _(i).bind(this)();
                var n = {
                    lat: this.geoData.getLat(),
                    lng: this.geoData.getLng(),
                    time: (new Date).getTime()
                };
                window._ws_init_local_cache_posts && _ws_init_local_cache_posts[this.key] && (this._data.push(_ws_init_local_cache_posts[this.key]), delete _ws_init_local_cache_posts[this.key]), this._data = _(this._data).reject(_(a).bind(this, n));
                var e = _(this._data).detect(_(r).bind(this, n));
                return e ? t ? e : e.data : simplifyDataStructure(this._default)
            }, e.empty = function() {
                _(s).bind(this)(), _(c).bind(this)(), _(i).bind(this)(), this._data = [], _(o).bind(this)()
            }, t
        }()
    }(),
    function() {
        "use strict";
        window.roundNumber = function(t, n) {
            n = defaultIfNotSet(n, 0);
            var e = Math.round(t * Math.pow(10, n)) / Math.pow(10, n);
            return e
        }, window.convertMeters = function(t, n) {
            return "mi" == n ? t / 1609.34 : t / 1e3
        }, window.convertMetersForDisplay = function(t, n, e, i, o, r) {
            var a = convertMeters(t, n);
            i && (a = roundNumber(a, i)), 0 >= a && 1 == i ? a = "0.0" : 0 >= a && 2 == i && (a = "0.01");
            var s = String(a);
            return r && (s += " "), e && (s += n), o && (s = "0" == s.substr(0, 1) ? s.substr(1) : s), s
        }, window.convertTimeForDisplay = function(t, n, e) {
            var i = Math.floor(t / 3600);
            t %= 3600;
            var o = Math.floor(t / 60),
                r = "";
            return i && (r += i + (n ? "" : " hr ")), !o || e && "hours" == e || (r += o + (n ? "" : " minutes")), r
        }
    }(),
    function() {
        "use strict";
        var t = "cookie_data_version_1";
        window.BasicCookie = function(n, e) {
            return n && "string" == typeof n && 0 != n.length ? (this.name = n, this.clear(), this.setExtraId(e), this.data = parseJson(get_cookie(this.name)), void(this.hasData() && this.data.version != t ? this.deleteCookie() : this.hasData() || this.clear())) : void dbug("bad cookie name: " + n)
        }, BasicCookie.prototype.clear = function() {
            this.data = null
        }, BasicCookie.prototype.hasData = function() {
            return this.data && (!this.extraId || this.extraId == this.data.extraId)
        }, BasicCookie.prototype.hasDataFor = function(t) {
            return this.data && t == this.data.extraId
        }, BasicCookie.prototype.setExtraId = function(t) {
            this.extraId = t || null
        }, BasicCookie.prototype.getData = function(t) {
            return _.isUndefined(t) ? this.data : null !== this.data && null !== this.data[t] ? this.data[t] : null
        }, BasicCookie.prototype.addData = function(t, n) {
            this.data || (this.data = new Object), this.data[t] = n
        }, BasicCookie.prototype.getGeoData = function(t) {
            var n = this.getData(t);
            if (!n) return null;
            var e = new GeoData;
            return e.loadJSON(n), e
        }, BasicCookie.prototype.addGeoData = function(t, n) {
            this.addData(t, n.toJSON())
        }, BasicCookie.prototype.save = function(n) {
            if (!this.data) return !1;
            this.extraId && (this.data.extraId = this.extraId), this.data.version = t;
            var e = JSON.stringify(this.data);
            return set_cookie(this.name, e, n || 90, "/", "walkscore.com"), !0
        }, BasicCookie.prototype.deleteCookie = function() {
            delete_cookie(this.name), this.clear()
        }, window.set_cookie = function(t, n, e, i, o, r) {
            var a = t + "=" + escape(n);
            if (e) {
                var s = new Date;
                s.setTime(s.getTime() + 24 * e * 60 * 60 * 1e3), a += "; expires=" + s.toGMTString()
            }
            i && (a += "; path=" + escape(i)), o && (a += "; domain=" + escape(o)), r && (a += "; secure"), document.cookie = a
        }, window.get_cookie = function(t) {
            var n = document.cookie.match("(^|;) ?" + t + "=([^;]*)(;|$)");
            return n ? unescape(n[2]) : null
        }, window.delete_cookie = function(t) {
            var n = "/",
                e = "walkscore.com",
                i = t + "=";
            i += n ? ";path=" + n : "", i += e ? ";domain=" + e : "", i += ";expires=Thu, 01-Jan-1970 00:00:01 GMT", document.cookie = i
        }
    }(),
    function() {
        window.isIE = function() {
            return navigator.userAgent.toLowerCase().indexOf("msie") >= 0
        }, window.isIE6 = function() {
            return $.browser.msie && $.browser.version < 7
        }, window.isChrome = function() {
            return -1 != navigator.userAgent.toLowerCase().indexOf("chrome")
        }, window.isIpad = function() {
            return null != navigator.userAgent.match(/iPad/i)
        }, window.isIOS = function() {
            return function(t) {
                return _([/ipad/i, /ipod/i, /iphone/i]).detect(function(n) {
                    return t.match(n)
                })
            }(navigator.userAgent)
        }, window.isAndroid = function() {
            return null != navigator.userAgent.match(/Android/i)
        }, window.isWinPhone = function() {
            return null != navigator.userAgent.match(/Windows Phone/i)
        }, window.getResModifier = function() {
            return isHighRes() ? "@2x" : ""
        }, window.isHighRes = function() {
            return (window.devicePixelRatio || 1) > 1
        }, window.hasHistory = function() {
            return !(!window.history || !history.pushState)
        }
    }(),
    function() {
        "use strict";
        window.bootstrapIsPhone = function() {
            return "phone" == findBootstrapEnvironment()
        }, window.bootstrapIsTablet = function() {
            return "tablet" == findBootstrapEnvironment()
        }, window.bootstrapIsDesktop = function() {
            return "desktop" == findBootstrapEnvironment()
        }, window.findBootstrapEnvironment = function() {
            if ("undefined" == typeof window.bootstrapEnvironment && ($(window).resize(function() {
                    window.bootstrapEnvironment = null
                }), window.bootstrapEnvironment = null), window.bootstrapEnvironment) return window.bootstrapEnvironment;
            var t = ["phone", "tablet", "desktop"],
                n = $("<div>");
            n.appendTo($("body"));
            for (var e = t.length - 1; e >= 0; e--) {
                var i = t[e];
                if (n.addClass("hidden-" + i), n.is(":hidden")) return n.remove(), window.bootstrapEnvironment = i
            }
        }
    }(),
    function() {
        window.showMessage = function(t, n, e, i) {
            var e = defaultIfNotSet(e, "center"),
                i = defaultIfNotSet(i, 100),
                o = "";
            "alert" == n && (o += '<img class="dialog-icon" src="//cdn2.walk.sc/2/images/alert.gif" alt="" />'), o += t, "alert" == n && (o += '<input id="dialog-button" type="button" value="OK" onclick="hideDialog()" />'), showDialog(o, n, "alert" != n, e, i), $("#dialog-button").focus()
        }, window.showDialog = function(t, n, e, i, o, r) {
            hideDialog(), initDialog();
            var a = $("#ws-dialog");
            if (r = r || {}, r.onClose && (window.dialogCloseCallback = r.onClose), r.blockModal || startModal(r), n && a.addClass(n), $.browser.msie && $.browser.version < 9 || a.addClass("enhanced"), "full" == i && a.addClass("fullscreen"), e ? a.children(".btn-close").removeClass("hidden") : e || a.children(".btn-close").addClass("hidden"), a.children(".content").empty().append(t), r.onResize) {
                var s = function() {
                    r.onResize(a)
                };
                $(window).resize(s), $(window).scroll(s), s()
            } else if ("full" == i);
            else if (i) {
                o || (o = 0);
                var c = $(window).scrollLeft(),
                    u = $(window).scrollTop(),
                    l = $(window).width(),
                    d = $(window).height(),
                    h = $(window).width() < 600 ? 3 : 20;
                "center" == i && (i = c + (l - a.width()) / 2), i + a.width() > c + l - 60 && (i = c + l - 60 - a.width()), o + a.height() > u + d - 150 && (o = u + d - 150 - a.height()), c + h > i && (i = c + h), u + h > o && (o = u + h), a.css("top", o + "px").css("left", i + "px")
            }
            a.css("display", "block"), $("body").unbind("click touchstart", dialogCloseHandler), setTimeout(function() {
                $("body").bind("click touchstart", dialogCloseHandler)
            }, 200)
        }, window.updateDialog = function(t) {
            getDialogContentDiv().html(t)
        }, window.getDialogContentDiv = function() {
            return $("#ws-dialog .content")
        }, window.dialogCloseHandler = function(t) {
            var n = $(t.target);
            if (!(n.is("select") || n.closest("#ws-dialog").length > 0 || 0 == n.closest("html").length)) return hideDialog(!0), !1
        }, window.hideDialog = function(t) {
            window.dialogCloseCallback && window.dialogCloseCallback(t), window.dialogCloseCallback = null, $("#ws-dialog").unbind().removeClass().css("left", "auto").css("top", "auto").css("width", "").css("height", "").remove(), $("body").unbind("click touchstart", dialogCloseHandler), endModal()
        }, window.initDialog = function() {
            0 == $("#ws-dialog").length && $("body").append($("<div />", {
                id: "ws-dialog"
            }).append($("<div />", {
                "class": "content"
            })).append($("<div />", {
                "class": "btn-close"
            }).click(function() {
                hideDialog(!0)
            })))
        }, window.startModal = function(t) {
            initModal();
            var n = $("#popupMask");
            n.removeClass(), (t || {}).whiteModal && n.addClass("white"), n.length > 0 && "none" == n.css("display") && (n.css("display", "block"), setMaskSize(), hideSelectBoxes())
        }, window.endModal = function() {
            $("#popupMask").css("display", "none"), displaySelectBoxes()
        }, window.initModal = function() {
            if (0 == $("#popupMask").length) {
                var t = document.createElement("div");
                t.id = "popupMask", $("body").append(t), $(t).css("display", "none"), window.onresize = setMaskSize, window.onscroll = setMaskSize
            }
        }, window.setMaskSize = function() {
            var t = $("body").get(0),
                n = $("#popupMask");
            n.css("top", Math.max(document.body.scrollTop, document.documentElement.scrollTop) + "px"), n.css("left", Math.max(document.body.scrollLeft, document.documentElement.scrollLeft) + "px"), n.css("height", Math.max(getViewportHeight(), t.scrollHeight) + "px"), n.css("width", Math.max(getViewportWidth(), t.scrollWidth) + "px")
        }, window.getViewportHeight = function() {
            return window.innerHeight != window.undefined ? window.innerHeight : "CSS1Compat" == document.compatMode ? document.documentElement.clientHeight : document.body ? document.body.clientHeight : window.undefined
        }, window.getViewportWidth = function() {
            return window.innerWidth != window.undefined ? window.innerWidth : "CSS1Compat" == document.compatMode ? document.documentElement.clientWidth : document.body ? document.body.clientWidth : void 0
        }, window.hideSelectBoxes = function() {
            if ("Microsoft Internet Explorer" == navigator.appName && parseFloat(navigator.appVersion.split("MSIE")[1]) < 7)
                for (var t = document.getElementsByTagName("SELECT"), n = 0; n < t.length; n++) t[n].style.visibility = "hidden"
        }, window.displaySelectBoxes = function() {
            if ("Microsoft Internet Explorer" == navigator.appName && parseFloat(navigator.appVersion.split("MSIE")[1]) < 7)
                for (var t = document.getElementsByTagName("SELECT"), n = 0; n < t.length; n++) t[n].style.visibility = "visible"
        }
    }(),
    function() {
        "use strict";
        window.GeoData = function(t, n, e, i, o, r, a, s, c, u) {
            ensure_ws(), this.setData = function(t, n, e, i, o, r, a, s, c, u) {
                this.query = safeString(t), this.preSnapLatLng = u, this.setLatLng(n), this.countryCode = safeString(e).toUpperCase(), this.countryName = safeString(i), this.formattedAddress = safeString(o), this.adminArea = safeString(r), this.thoroughfare = safeString(a), this.locality = safeString(s), this.postalCode = safeString(c), this.overrideUnits = null
            }, this.setLatLng = function(t) {
                this.latLng = t || null, this.preSnapLatLng || (this.preSnapLatLng = this.latLng), this.latLng && this.snap()
            }, this.setLocBase = function(t) {
                this.locBase = t
            }, this.snap = function() {
                this.preSnapLatLng || (this.preSnapLatLng = this.latLng), this.latLng = new ws.LatLng(snapToGrid(this.getLat()), snapToGrid(this.getLng()))
            }, this.fillDataFromGeoData = function(t) {
                isEmptyString(this.query) && (this.query = t.query), this.preSnapLatLng || (this.preSnapLatLng = t.preSnapLatLng), null == this.latLng && this.setLatLng(t.latLng), isEmptyString(this.countryCode) && (this.countryCode = t.countryCode), isEmptyString(this.countryName) && (this.countryName = t.countryName), isEmptyString(this.formattedAddress) && (this.formattedAddress = t.formattedAddress), isEmptyString(this.adminArea) && (this.adminArea = t.adminArea), isEmptyString(this.thoroughfare) && (this.thoroughfare = t.thoroughfare), isEmptyString(this.postalCode) && (this.postalCode = t.postalCode), isEmptyString(t.locality) || (this.locality = t.locality), isEmptyString(t.formattedAddress) || (this.formattedAddress = t.formattedAddress), t.locBase && (this.locBase = t.locBase)
            }, this.loadJSON = function(t) {
                var n = t.y && t.x ? new ws.LatLng(t.y, t.x) : null,
                    e = t.py && t.px ? new ws.LatLng(t.py, t.px) : null;
                return this.setData(decodeURIComponent(t.q), n, decodeURIComponent(t.cc), decodeURIComponent(t.cn), decodeURIComponent(t.fa), decodeURIComponent(t.aa), decodeURIComponent(t.tf), decodeURIComponent(t.l), decodeURIComponent(t.pc), e), this.locBase = decodeURIComponent(t.lb), this
            }, this.toJSON = function() {
                var t = {
                    lb: encodeURIComponent(this.locBase),
                    q: encodeURIComponent(this.query),
                    cc: encodeURIComponent(this.countryCode),
                    cn: encodeURIComponent(this.countryName),
                    fa: encodeURIComponent(this.formattedAddress),
                    aa: encodeURIComponent(this.adminArea),
                    tf: encodeURIComponent(this.thoroughfare),
                    l: encodeURIComponent(this.locality),
                    pc: encodeURIComponent(this.postalCode)
                };
                return this.latLng && (t.y = this.latLng.lat(), t.x = this.latLng.lng()), this.preSnapLatLng && (t.py = this.preSnapLatLng.lat(), t.px = this.preSnapLatLng.lng()), t
            }, this.overrideDefaultUnits = function(t) {
                ("mi" == t || "km" == t) && (this.overrideUnits = t)
            }, this.getUnits = function() {
                return this.overrideUnits ? this.overrideUnits : !this.countryCode || "US" != this.countryCode && "GB" != this.countryCode ? "km" : "mi"
            }, this.getQuery = function() {
                return this.query
            }, this.getLatLng = function() {
                return this.latLng
            }, this.getLat = function() {
                return this.latLng ? this.latLng.lat() : null
            }, this.getLng = function() {
                return this.latLng ? this.latLng.lng() : null
            }, this.getPreSnapLat = function() {
                return this.preSnapLatLng ? this.preSnapLatLng.lat() : null
            }, this.getPreSnapLng = function() {
                return this.preSnapLatLng ? this.preSnapLatLng.lng() : null
            }, this.getLocBase = function() {
                return this.locBase
            }, this.getCountryCode = function() {
                return this.countryCode
            }, this.getCountryName = function() {
                return this.countryName
            }, this.getAdminArea = function() {
                return this.adminArea
            }, this.getThoroughfare = function() {
                return this.locBase == GeoData.prototype.LOCBASE_REVERSE_GEOCODE_WITH_ADDRESS_OVERRIDE ? this.query : this.thoroughfare
            }, this.getCity = function() {
                return this.locality
            }, this.getTransitScoreCity = function() {
                var t = this.locality;
                return "NZ" == this.countryCode && (t = this.adminArea), t
            }, this.getPostalCode = function() {
                return this.postalCode
            }, this.getPreSnapLatLng = function() {
                return this.preSnapLatLng
            }, this.correctCityNameForDisplay = function() {
                return "DC" == this.adminArea ? "Washington D.C." : this.locality
            }, this.getUrlifiedLocation = function() {
                var t = _(["LOCBASE_GEOCODE", "LOCBASE_GEOCODE_PLUS_REVERSE", "LOCBASE_GEOCODE_FROM_SERVER"]).detect(_(function(t) {
                    return this.locBase == this[t]
                }).bind(this));
                return t ? urlifyAddress(this.query) : this.locBase == GeoData.prototype.LOCBASE_REVERSE_GEOCODE ? urlifyLatLng(this.latLng) : urlifyLocation(this.query, this.latLng.lat(), this.latLng.lng())
            }, this.getFormattedAddress = function() {
                return this.formattedAddress
            }, this.getShortFormattedAddress = function() {
                var t = [];
                return this.thoroughfare && t.push(this.thoroughfare), this.locality && t.push(this.correctCityNameForDisplay()), t.length > 0 ? t.join(" ") : this.query
            }, this.getBestFormattedAddress = function() {
                return this.locBase == GeoData.prototype.LOCBASE_REVERSE_GEOCODE_WITH_ADDRESS_OVERRIDE ? this.query : this.thoroughfare ? this.getShortFormattedAddress() : this.formattedAddress ? this.formattedAddress : this.query
            }, this.hasData = function() {
                return null != this.latLng && "" != this.countryCode
            }, this.hasCity = function() {
                return "" != this.locality
            }, this.hasAdminArea = function() {
                return "" != this.adminArea
            }, this.hasCountry = function() {
                return "" != this.countryCode
            }, this.getCityStateZip = function() {
                return "" != this.adminArea || "" != this.postalCode ? this.locality + ", " + this.adminArea + " " + this.postalCode : this.locality
            }, this.getUrl = function(t) {
                return t || (t = ""), isEmptyString(this.query) ? this.latLng ? "/score/" + urlifyLatLng(this.latLng) + "?" + t : void 0 : "/score/" + urlifyAddress(this.query) + "?" + t
            }, this.getRentalsUrl = function(t) {
                return t || (t = ""), isEmptyString(this.query) ? this.latLng ? "/apartments/search/loc?lat=" + this.latLng.lat() + "&lng=" + this.latLng.lng() + "&" + t : void 0 : "/apartments/search/" + urlifyAddress(this.query) + "?" + t
            }, this.setData(t, n, e, i, o, r, a, s, c, u)
        }, GeoData.prototype.LOCBASE_GEOCODE = 20, GeoData.prototype.LOCBASE_REVERSE_GEOCODE = 21, GeoData.prototype.LOCBASE_REVERSE_GEOCODE_WITH_ADDRESS_OVERRIDE = 22, GeoData.prototype.LOCBASE_GEOCODE_PLUS_REVERSE = 23, GeoData.prototype.LOCBASE_GEOCODE_FROM_SERVER = 24, GeoData.prototype.hasStreetNumber = function() {
            return !!this.streetNumber
        }, window.initGeoDataFromURL = function() {
            ensure_ws();
            var n = getUrlParam("lat"),
                e = getUrlParam("lng"),
                i = n.length > 0 && e.length > 0 ? new ws.LatLng(n, e) : null,
                o = getUrlParam("country"),
                r = getUrlParam("street", !0, !0);
            if ("loc" == r) r = "";
            else if (!n && !e && /^\[[0-9\-\.]+\s[0-9\-\.]+\]$/.test(r)) var a = r.substr(1, r.length - 2).split(" "),
                i = new ws.LatLng(a[0], a[1]);
            var s = getUrlParam("polygon");
            s && !(n || e || r) && (i = _(google.maps.geometry.encoding.decodePath(s)).reduce(function(t, n) {
                return t.extend(n), t
            }, new google.maps.LatLngBounds).getCenter());
            var c = new GeoData(t(r), i, o),
                u = getUrlParam("units");
            return u && c.overrideDefaultUnits(u), c
        }, window.replaceAll = function(t, n, e) {
            for (var i = t.indexOf(n); - 1 != i;) t = t.replace(n, e), i = t.indexOf(n);
            return t
        };
        var t = function(t) {
            return t = replaceAll(t, "&", " and ")
        };
        window.getLocationKey = function(t) {
            var n = t.getQuery(),
                e = t.getLat(),
                i = t.getLng(),
                o = e && i ? "_" + String(e) + "_" + String(i) : "";
            return n + o
        }
    }(),
    function() {
        "use strict";
        window.latLngFromGoogleResponse = function(t, n) {
            if (t && t.length > n && t[n].geometry) {
                var e = t[n].geometry.location;
                return new google.maps.LatLng(e.lat(), e.lng())
            }
            return null
        }, window.googleResponseHasCountry = function(t, n) {
            if (t && t.length > n && t[n].address_components) {
                var e = _(t[n].address_components).detect(function(t) {
                    return _(t.types).detect(function(t) {
                        return "country" == t
                    })
                });
                return e.short_name
            }
            return !1
        }, window.geoDataFromGoogleWithinRange = function(t, n, e, i, o) {
            if (!n) return null;
            o || (o = Math.min(3, n.length));
            var r = _(_.range(o)).detect(_(function(i) {
                var o = googleResponseHasCountry(n, i),
                    r = google.maps.geometry.spherical.computeDistanceBetween(latLngFromGoogleResponse(n, i), t);
                return o && e > r
            }).bind(this));
            return _.isUndefined(r) ? null : geoDataFromGoogleResponse(n, i, Number(r))
        }, window.geoDataFromGoogleResponse = function(t, n, e) {
            if (ensure_ws(), 0 == (t || []).length) return new GeoData;
            n || (n = "");
            var i = null,
                o = null,
                r = null,
                a = null,
                s = null,
                c = null,
                u = null,
                l = null,
                d = null,
                h = "",
                f = _.isUndefined(e) ? t : [t[e]];
            if (_(f).detect(function(t) {
                    var n = t.geometry.location;
                    o = new ws.LatLng(n.lat(), n.lng()), s = t.formatted_address;
                    var e = [];
                    return _(t.address_components).each(function(t) {
                        _(t.types).each(function(n) {
                            switch (n) {
                                case "street_number":
                                    e.unshift(t.long_name), h = t.long_name;
                                    break;
                                case "route":
                                    e.push(t.long_name);
                                    break;
                                case "locality":
                                    l = t.long_name;
                                    break;
                                case "country":
                                    a = t.long_name, r = t.short_name;
                                    break;
                                case "administrative_area_level_1":
                                    c = t.short_name;
                                    break;
                                case "postal_code":
                                    d = t.long_name
                            }
                        }), u = e.join(" ")
                    }), r
                }), r) {
                DEBUG_AUDIT_GEOCODE && (dbug("---NEW GEOCODE---"), dbug("query: " + n), dbug("latlng: " + dumpGLL(o)), dbug("countryCode: " + r), dbug("countryName: " + a), dbug("formattedAddress: " + s), dbug("administrativeAreaName: " + c), dbug("thoroughfare: " + u), dbug("localityName: " + l), dbug("postalCode: " + d), dbug("---------------"));
                var i = new GeoData(n, o, r, a, s, c, u, l, d, o);
                i.streetNumber = h
            } else if (t.Placemark) {
                for (var g = 1; g < t.Placemark.length; g++)
                    if (t.Placemark[g].AddressDetails.Country) {
                        r = String(t.Placemark[g].AddressDetails.Country.CountryNameCode);
                        break
                    }
                var i = new GeoData(n, o, r)
            }
            return i
        }
    }(),
    function() {
        "use strict";
        window.CustomGetTileUrl = function(t, n) {
            if (window.BASE_TILE_URL) {
                var e = 1 << n,
                    i = e - t.y - 1;
                return BASE_TILE_URL + n + "/" + t.x + "/" + i + ".png"
            }
            return "//pp.walk.sc/map_tiles/walkscore/v3/17/" + t.x + "/" + t.y + "/" + n + ".png"
        }, window.CustomGetBikeTileUrl = function(t, n, e) {
            return "//pp.walk.sc/map_tiles/bikescore/%s/17/".replace(/%s/, t) + n.x + "/" + n.y + "/" + e + ".png"
        }, window.CustomGetTileFuncFromBaseUrl = function(t) {
            return function(n, e) {
                var i = 1 << e,
                    o = i - n.y - 1;
                return t + e + "/" + n.x + "/" + o + ".png"
            }
        }
    }(),
    function() {
        "use strict";
        window.setInputExampleText = function(t, n) {
            var e = _(t).isString() ? $(t) : t;
            return e.addClass("example-text"), Modernizr.input.placeholder ? e.attr("placeholder", n) : (e.unbind("focus").unbind("blur").bind("focus", function() {
                this.value == n && $(this).val("").removeClass("placeholder")
            }).bind("blur", function() {
                "" == this.value && $(this).addClass("placeholder").val(n)
            }), void("" == getActiveText(e) && e.addClass("placeholder").val(n)))
        }, window.setActiveText = function(t, n) {
            var e = _(t).isString() ? $(t) : t;
            e.val(n), e.trigger("blur"), n ? e.removeClass("placeholder") : Modernizr.input.placeholder || e.addClass("placeholder")
        }, window.getActiveText = function(t) {
            var n = _(t).isString() ? $(t) : t;
            return !n.hasClass("placeholder") || Modernizr.input.placeholder ? n.val() : ""
        }, window.limitText = function(t, n, e) {
            var i = e - t.val().length;
            0 > i && (t.val(t.val().substring(0, e)), i = 0), 20 > i ? n.addClass("form-error-message") : n.removeClass("form-error-message"), n.html(50 > i ? i + " characters remaining" : "")
        }
    }(),
    function() {
        "use strict";
        window.fixNYBoroughs = function(t, n) {
            var e = _(["Brooklyn", "Queens", "Bronx", "Staten Island", "Manhattan"]);
            return "NY" == n && e.include(t) ? "New York" : t
        }, window.sluggify = function(t) {
            return t = replaceAll(t, " ", "-"), t = replaceAll(t, "'", ""), t = replaceAll(t, '"', ""), t = replaceAll(t, ".", ""), t = replaceAll(t, "&", "and"), t = replaceAll(t, ":", ""), t = replaceAll(t, ",", ""), t.toLowerCase()
        }
    }(),
    function() {
        "use strict";
        window.fitBoundsSnugly = function(t, n, e) {
            e = _({
                factor: 8
            }).extend(e || {});
            var i = n.getSouthWest(),
                o = n.getNorthEast(),
                r = i.lat(),
                a = i.lng(),
                s = o.lat(),
                c = o.lng(),
                u = e.factor,
                l = (s - r) / u,
                d = (c - a) / u;
            t.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(r + l, a + d)).extend(new google.maps.LatLng(s - l, c - d)))
        }, window.customLatLngToPixel = function(t, n) {
            var e = Math.pow(2, t.getZoom()),
                i = new google.maps.LatLng(t.getBounds().getNorthEast().lat(), t.getBounds().getSouthWest().lng()),
                o = t.getProjection().fromLatLngToPoint(i),
                r = t.getProjection().fromLatLngToPoint(n),
                a = new google.maps.Point(Math.floor((r.x - o.x) * e), Math.floor((r.y - o.y) * e));
            return a
        }, window.customPixelToLatLng = function(t, n) {
            var e = Math.pow(2, t.getZoom()),
                i = new google.maps.LatLng(t.getBounds().getNorthEast().lat(), t.getBounds().getSouthWest().lng()),
                o = t.getProjection().fromLatLngToPoint(i),
                r = new google.maps.Point(n.x / e + o.x, n.y / e + o.y),
                a = t.getProjection().fromPointToLatLng(r);
            return a
        }
    }(),
    function() {
        "use strict";
        Function.prototype.inheritsFrom = function(t) {
            return t.constructor == Function ? (this.prototype = new t, this.prototype.constructor = this, this.prototype.parent = t.prototype) : (this.prototype = t, this.prototype.constructor = this, this.prototype.parent = t), this
        }, window.defaultIfNotSet = function(t, n) {
            return "undefined" != typeof t ? t : n
        }, window.paramIsSet = function(t) {
            return "undefined" != typeof t
        }, window.bindCallback = function(t, n) {
            return function() {
                return n.apply(t, arguments)
            }
        }, window.simplifyDataStructure = function(t) {
            var n, e = getObjectType(t);
            switch (e) {
                case "Array":
                    n = [];
                    for (var i = 0; i < t.length; i++) n.push(simplifyDataStructure(t[i]));
                    break;
                case "Object":
                    n = {};
                    for (var o in t) t.hasOwnProperty && t.hasOwnProperty(o) && (n[o] = simplifyDataStructure(t[o]));
                    break;
                case "String":
                case "Number":
                case "Boolean":
                    return t;
                default:
                    _(t).isNull() && (n = null)
            }
            return n
        }, window.getObjectType = function(t) {
            var n = Object.prototype.toString.call(t).match(/^\[object ([^\]]+)\]$/);
            return n ? n[1] : "Unknown"
        }, window.getScoreDescription = function(t) {
            return t >= 90 ? "Walker&rsquo;s Paradise" : t >= 70 ? "Very Walkable" : t >= 50 ? "Somewhat Walkable" : "Car-Dependent"
        }, window.generateAmenityKey = function(n, e, i, o) {
            var r = String(e.lat()),
                a = String(e.lng());
            o || (-1 != r.indexOf(".") && (r = r.substr(0, r.indexOf(".") + 4), r = r.replace(/\.?0+$/, "")), -1 != a.indexOf(".") && (a = a.substr(0, a.indexOf(".") + 4), a = a.replace(/\.?0+$/, "")));
            var s = n.toLowerCase();
            s = replaceAll(s, " ", ""), s = replaceAll(s, "'", ""), s = replaceAll(s, '"', ""), s = replaceAll(s, "%", ""), s = replaceAll(s, "&", ""), s = replaceAll(s, "<", ""), s = replaceAll(s, ">", ""), s = t.convert(s);
            var c = s.substr(0, Math.min(5, s.length)),
                u = s.substr(Math.max(0, s.length - 5), 5),
                l = c + u + "_" + r + "_" + a;
            return "Curated" == i && (l += "_ws"), l
        };
        var t = {
            map: null,
            convert: function(n) {
                t.init();
                for (var e = "", i = 0; i < n.length; i++) {
                    var o = n.charAt(i);
                    e += o >= "A" && "Z" >= o || o >= "a" && "z" >= o ? t.map[o] : o
                }
                return e
            },
            init: function() {
                if (null == t.map) {
                    for (var n = new Array, e = "abcdefghijklmnopqrstuvwxyz", i = 0; i < e.length; i++) n[e.charAt(i)] = e.charAt((i + 13) % 26);
                    for (var i = 0; i < e.length; i++) n[e.charAt(i).toUpperCase()] = e.charAt((i + 13) % 26).toUpperCase();
                    t.map = n
                }
            }
        };
        window.am_convertMetersForDisplay = function(t, n) {
            return convertMeters(t, n) < .1 ? convertMetersForDisplay(t, n, !0, 2, !0) : convertMetersForDisplay(t, n, !0, 1, !0).replace(/^(\d{2,})\.\d/, "$1")
        }, window.htmlToText = function(t) {
            return t = replaceAll(t, "<", "&lt;"), t = replaceAll(t, ">", "&gt;"), t = replaceAll(t, "&mdash;", "&amp;mdash;"), t = replaceAll(t, "&rsquo;", "&amp;rsquo;")
        }, window.leadsWithNumber = function(t) {
            var n = /^[0-9]+$/;
            return t.substr(0, 1).match(n) ? !0 : !1
        }, window.StringList = function() {
            this.list = [], this.length = function() {
                return this.list.length
            }, this.get = function(t) {
                return this.list[t]
            }, this.indexOf = function(t) {
                for (var n in this.list)
                    if (this.list[n] == t) return n;
                return -1
            }, this.isInList = function(t) {
                return -1 != this.indexOf(t)
            }, this.addIfUnique = function(t) {
                this.isInList(t) || this.list.push(t)
            }, this.add = function(t) {
                this.list.push(t)
            }
        }, window.getLeadingNumber = function(t) {
            if (!leadsWithNumber(t)) return !1;
            var n = t.match(/[\d\.]+/g);
            return n && n[0] ? Number(n[0]) : !1
        }, window.supersluggify = function(t) {
            return t.replace(/\s/g, "-").replace(/&/g, "and").replace(/\W/g, "").toLowerCase()
        }, window.get_image_size = function(t, n) {
            var e = new Image;
            $(e).load(function() {
                n(e.width, e.height)
            }).error(function() {
                n()
            }).attr({
                src: t
            })
        }, window.cleanNumber = function(t) {
            if (null == t) return "";
            var n = t;
            return n = replaceAll(n, "(", ""), n = replaceAll(n, ")", ""), n = replaceAll(n, "-", ""), n = replaceAll(n, " ", "")
        }
    }(),
    function() {
        "use strict";
        var t = this;
        t._ws_ || (t._ws_ = require("../util-shared"));
        var n = {};
        n.renderRentalSidebarItem = function(t, n) {
            return blockTemplates["rentals-sidebar-item"](_(n || {}).extend({
                rental: t
            }))
        }, n.getImagePriceBeds = function(t, e) {
            var i = {};
            e = e || {};
            var o = (e.noImgSrc ? "data-sidebar-imgsrc=" : "src=") + n.getThumbURL(t, e.sizeCode);
            if (n.isMultiUnit(t)) {
                i.image = '<div class="apt-image-wrap"><img class="thumb" ' + o + " " + (e.attributes || "") + " /></div>";
                var r = n.makePriceRange(t);
                i.price = '<p class="price">' + r + "</p>";
                var a = t[K_BED][0] || "Studio",
                    s = t[K_BED][1] || "Studio",
                    c = s > a ? a + "-" + s + " beds" : "Studio" == a ? "Studio" + ("Studio" != s ? "-" + s + " bed" + (s > 1 ? "s" : "") : "") : a + " bed" + (a > 1 ? "s" : "");
                i.beds = '<p class="beds">' + c + "</p>"
            } else i.image = '<div class="apt-image-wrap"><img class="thumb" ' + o + " " + (e.attributes || "") + " /></div>", i.price = '<p class="price">' + (t[K_PRICE] > 0 ? "$" + formatNumber(t[K_PRICE]) : "") + "</p>", beds = t[K_BED], i.beds = '<p class="beds">' + (beds ? beds + " bed" + (1 == beds ? "" : "s") : "Studio") + "</p>";
            return i
        }, n.isMultiUnit = function(t) {
            return t[K_ID].toString().indexOf("_b_") > -1
        }, n.makePriceRange = function(t) {
            return _ws_.priceRangeString.apply({}, t[K_PRICE])
        }, n.rentalRange = function(t, n) {
            return {
                min: t[n][0],
                max: t[n][1]
            }
        }, n.getThumbURL = function(t, n, e) {
            if (!t[K_IMAGE]) return "//cdn2.walk.sc/2/s225/p/0/000000.jpg";
            var i = {
                s2: "s225"
            }[n || ""] || n || "s225";
            if (("" + t[K_IMAGE]).indexOf("full") >= 0) {
                var o = t[K_IMAGE].replace("full", i);
                return e && (o = o.replace("/p/", "/qf/").replace(".jpg", ".png")), o
            }
            var r = t[K_ID].split("_")[2],
                a = e ? "af" : "a",
                s = e ? "png" : "jpg";
            return window.CDN_HOSTS[r % window.CDN_HOSTS.length] + "/" + i + "/" + a + "/" + r + "/0." + s
        }, t.window ? window._wsr_ = n : module.exports = n
    }.call(this),
    function() {
        "use strict";
        window.showShareDialog = function(t, n, e) {
            n || (n = document.location.href), e || (e = "Check out this page on Walk Score");
            var i = function(t, n) {
                var i = "<h3>Share This</h3>",
                    o = '<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:url="' + n + '" addthis:title="' + e + '" addthis:via="WalkScore"><a class="addthis_button_facebook"></a><a class="addthis_button_twitter"></a><a class="addthis_button_email"></a><a class="addthis_button_compact"></a><a class="addthis_button_google_plusone" g:plusone:count="false"></a></div>';
                return i += "<p>Copy &amp; paste link:</p>", o = '<p id="social-label">Or share via:</p>' + o, isIOS() ? (i += "<textarea rows='4' cols='35' style='padding:14px'>" + n + "</textarea>", i += o, showDialog(i, "share-listing", !0, t.pageX - 100, t.pageY - 140, {
                    blockModal: !0
                }), $("#ws-dialog").bind("click", function(t) {
                    t.stopPropagation()
                }).find("textarea").attr("readOnly", !0).focus()) : (i += "<input type='text' style='width:320px;' value='" + n + "' onclick='this.select();' /></p>", i += o, showDialog(i, "share-listing", !0, t.pageX - 100, t.pageY - 140, {
                    blockModal: !0
                }), $("#ws-dialog input").attr("readOnly", !0).select()), addthis.toolbox(".addthis_toolbox"), !1
            };
            return window.ws_addThis.whenReady(_(getShortURL).bind({}, _(i).bind({}, t), n)), !1
        }, window.getShortURL = function() {
            var t = {};
            return function(n, e, i) {
                ensureWSUnderscoreMixins();
                var o = function(i) {
                    var o = t[e] = i.url;
                    n(o || e)
                };
                if (t[e]) return o({
                    url: t[e]
                });
                var r = {
                    url: e
                };
                $.ajax(_({
                    url: "/auth/shorten/",
                    data: r,
                    dataType: "json",
                    success: o,
                    error: o
                }).extend(i || {}))
            }
        }()
    }(),
    function() {
        "use strict";
        window.trackEvent = function(t, n, e, i) {
            !ENV_PRODUCTION && DEBUG_OUTPUT_ACTIVE && console && console.log ? console.log("Track Event:", t, "|", n, "|", e, "|", i) : window.ga && ga("send", "event", t, n, e, i)
        }, window.trackEventNonInteractive = function(t, n, e, i) {
            !ENV_PRODUCTION && DEBUG_OUTPUT_ACTIVE && console && console.log ? console.log("Track Non-Interactive Event:", t, "|", n, "|", e, "|", i) : window.ga && ga("send", "event", t, n, e, i, {
                nonInteraction: 1
            })
        }, window.trackActiveUser = function() {}, window.trackNavigation = function(t, n, e, i) {
            n && e && trackEvent(n, e, safeString(i)), t && (document.location = t)
        }, window.trackNavigationNewWindow = function(t, n, e, i) {
            n && e && trackEvent(n, e, safeString(i)), t && window.open(t, "newwin" + rand(9999))
        }
    }(),
    function() {
        "use strict";
        window.naturalStringCompare = function(t, n) {
            var e = function(t, n) {
                    if (t) {
                        if (n) {
                            var e = getLeadingNumber(t),
                                i = getLeadingNumber(n);
                            return e && i && e != i ? e - i : n > t ? -1 : t > n ? 1 : 0
                        }
                        return 1
                    }
                    return -1
                },
                i = _.map(_.zip(t.split(" "), n.split(" ")), function(t) {
                    return e(t[0], t[1])
                });
            return _.reduce(i, function(t, n) {
                return 0 != t ? t : n
            }, 0)
        }
    }(),
    function() {
        "use strict";
        window.getTransitLineGeometry = function(t, n, e) {
            if (!t) return n(null);
            var i = function(i) {
                var o = parseTransitLinestring(t, i);
                e && (o = _.map(o, function(t) {
                    return t.ws_coerce("google")
                })), n(o)
            };
            $.ajax({
                url: "/auth/transit/tline/" + t.key,
                dataType: "json",
                success: i,
                error: i
            })
        }, window.parseTransitLinestring = function(t, n) {
            var e = ((n || {}).geometry_wkt || "").match(/^LINESTRING\((.+)\)$/),
                i = _(["http://www.sfmta.com"]).oreduce(function(t, n) {
                    t[n] = !0
                }),
                o = e && !i[(n || {}).agency_url] ? _(e[1].split(",")).chain().map(function(t) {
                    return t.split(" ")
                }).filter(function(t) {
                    return t[0] && t[1]
                }).map(function(t) {
                    return new walkscore.maps.LatLng(t[1], t[0])
                }).value() : _((t || {}).stops).pluck("ll");
            return o
        }
    }(), removeFromArray = function(t, n, e) {
        var i = t.slice((e || n) + 1 || t.length);
        return t.length = 0 > n ? t.length + n : n, t.push.apply(t, i)
    }, removeFromArrayByName = function(t, n) {
        var e = _(t).indexOf(n); - 1 != e && removeFromArray(t, e)
    }, $.fn.textWidth = function() {
        var t = $(this).html(),
            n = "<span>" + t + "</span>";
        $(this).html(n);
        var e = $(this).find("span:first").width();
        return $(this).html(t), e
    }, $.fn.ellipsis = function(t, n) {
        return this.each(function() {
            function e() {
                return u.height() > o.height()
            }

            function i() {
                return u.width() > o.width()
            }
            var o = $(this);
            if ("hidden" == o.css("overflow")) {
                var r = o.html();
                if (t) {
                    for (var a = "", s = 0; t > s; s++) a += "X";
                    r = a + r
                }
                var c = o.hasClass("multiline");
                c = !0;
                var u = $(this.cloneNode(!0)).hide().html(r).css("position", "absolute").css("overflow", "visible").width(c ? o.width() : "auto").height(c ? "auto" : o.height());
                o.after(u);
                for (var l = c ? e : i, d = !1; r.length > 0 && l();) d = !0, r = r.substr(0, r.length - 1), u.html(r + "...");
                if (t && (r = r.substr(t), d && (r += "..."), u.html(r)), n && r.length && !d) {
                    for (var h = n, f = ["font-size", "line-height", "margin-top", "margin-bottom"], g = ["font-size", "line-height"], p = _(f).oreduce(function(t, n) {
                            t[n] = u.css(n).replace(/\D+/, "") - 0
                        }); !l() && p["font-size"] <= h;) _(g).each(function(t) {
                        u.css(t, ++p[t] + "px")
                    });
                    _(g).each(function(t) {
                        p[t]--
                    }), _(f).each(function(t) {
                        o.css(t, p[t] + "px")
                    })
                }
                o.html(u.html()), u.remove()
            }
        })
    }, $.fn.growToFit = function(t) {
        return this.each(function() {
            $(this).ellipsis(null, t || 40)
        })
    },
    function(t, n) {
        function e(t, n, e) {
            var i = d[n.type] || {};
            return null == t ? e || !n.def ? null : n.def : (t = i.floor ? ~~t : parseFloat(t), isNaN(t) ? n.def : i.mod ? (t + i.mod) % i.mod : 0 > t ? 0 : i.max < t ? i.max : t)
        }

        function i(n) {
            var e = u(),
                i = e._rgba = [];
            return n = n.toLowerCase(), g(c, function(t, o) {
                var r, a = o.re.exec(n),
                    s = a && o.parse(a),
                    c = o.space || "rgba";
                return s ? (r = e[c](s), e[l[c].cache] = r[l[c].cache], i = e._rgba = r._rgba, !1) : void 0
            }), i.length ? ("0,0,0,0" === i.join() && t.extend(i, r.transparent), e) : r[n]
        }

        function o(t, n, e) {
            return e = (e + 1) % 1, 1 > 6 * e ? t + (n - t) * e * 6 : 1 > 2 * e ? n : 2 > 3 * e ? t + (n - t) * (2 / 3 - e) * 6 : t
        }
        var r, a = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
            s = /^([\-+])=\s*(\d+\.?\d*)/,
            c = [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(t) {
                    return [t[1], t[2], t[3], t[4]]
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(t) {
                    return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]]
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                parse: function(t) {
                    return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function(t) {
                    return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)]
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function(t) {
                    return [t[1], t[2] / 100, t[3] / 100, t[4]]
                }
            }],
            u = t.Color = function(n, e, i, o) {
                return new t.Color.fn.parse(n, e, i, o)
            },
            l = {
                rgba: {
                    props: {
                        red: {
                            idx: 0,
                            type: "byte"
                        },
                        green: {
                            idx: 1,
                            type: "byte"
                        },
                        blue: {
                            idx: 2,
                            type: "byte"
                        }
                    }
                },
                hsla: {
                    props: {
                        hue: {
                            idx: 0,
                            type: "degrees"
                        },
                        saturation: {
                            idx: 1,
                            type: "percent"
                        },
                        lightness: {
                            idx: 2,
                            type: "percent"
                        }
                    }
                }
            },
            d = {
                "byte": {
                    floor: !0,
                    max: 255
                },
                percent: {
                    max: 1
                },
                degrees: {
                    mod: 360,
                    floor: !0
                }
            },
            h = u.support = {},
            f = t("<p>")[0],
            g = t.each;
        f.style.cssText = "background-color:rgba(1,1,1,.5)", h.rgba = f.style.backgroundColor.indexOf("rgba") > -1, g(l, function(t, n) {
            n.cache = "_" + t, n.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            }
        }), u.fn = t.extend(u.prototype, {
            parse: function(o, a, s, c) {
                if (o === n) return this._rgba = [null, null, null, null], this;
                (o.jquery || o.nodeType) && (o = t(o).css(a), a = n);
                var d = this,
                    h = t.type(o),
                    f = this._rgba = [];
                return a !== n && (o = [o, a, s, c], h = "array"), "string" === h ? this.parse(i(o) || r._default) : "array" === h ? (g(l.rgba.props, function(t, n) {
                    f[n.idx] = e(o[n.idx], n)
                }), this) : "object" === h ? (o instanceof u ? g(l, function(t, n) {
                    o[n.cache] && (d[n.cache] = o[n.cache].slice())
                }) : g(l, function(n, i) {
                    var r = i.cache;
                    g(i.props, function(t, n) {
                        if (!d[r] && i.to) {
                            if ("alpha" === t || null == o[t]) return;
                            d[r] = i.to(d._rgba)
                        }
                        d[r][n.idx] = e(o[t], n, !0)
                    }), d[r] && t.inArray(null, d[r].slice(0, 3)) < 0 && (d[r][3] = 1, i.from && (d._rgba = i.from(d[r])))
                }), this) : void 0
            },
            is: function(t) {
                var n = u(t),
                    e = !0,
                    i = this;
                return g(l, function(t, o) {
                    var r, a = n[o.cache];
                    return a && (r = i[o.cache] || o.to && o.to(i._rgba) || [], g(o.props, function(t, n) {
                        return null != a[n.idx] ? e = a[n.idx] === r[n.idx] : void 0
                    })), e
                }), e
            },
            _space: function() {
                var t = [],
                    n = this;
                return g(l, function(e, i) {
                    n[i.cache] && t.push(e)
                }), t.pop()
            },
            transition: function(t, n) {
                var i = u(t),
                    o = i._space(),
                    r = l[o],
                    a = 0 === this.alpha() ? u("transparent") : this,
                    s = a[r.cache] || r.to(a._rgba),
                    c = s.slice();
                return i = i[r.cache], g(r.props, function(t, o) {
                    var r = o.idx,
                        a = s[r],
                        u = i[r],
                        l = d[o.type] || {};
                    null !== u && (null === a ? c[r] = u : (l.mod && (u - a > l.mod / 2 ? a += l.mod : a - u > l.mod / 2 && (a -= l.mod)), c[r] = e((u - a) * n + a, o)))
                }), this[o](c)
            },
            blend: function(n) {
                if (1 === this._rgba[3]) return this;
                var e = this._rgba.slice(),
                    i = e.pop(),
                    o = u(n)._rgba;
                return u(t.map(e, function(t, n) {
                    return (1 - i) * o[n] + i * t
                }))
            },
            toRgbaString: function() {
                var n = "rgba(",
                    e = t.map(this._rgba, function(t, n) {
                        return null == t ? n > 2 ? 1 : 0 : t
                    });
                return 1 === e[3] && (e.pop(), n = "rgb("), n + e.join() + ")"
            },
            toHslaString: function() {
                var n = "hsla(",
                    e = t.map(this.hsla(), function(t, n) {
                        return null == t && (t = n > 2 ? 1 : 0), n && 3 > n && (t = Math.round(100 * t) + "%"), t
                    });
                return 1 === e[3] && (e.pop(), n = "hsl("), n + e.join() + ")"
            },
            toHexString: function(n) {
                var e = this._rgba.slice(),
                    i = e.pop();
                return n && e.push(~~(255 * i)), "#" + t.map(e, function(t) {
                    return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t
                }).join("")
            },
            toString: function() {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
            }
        }), u.fn.parse.prototype = u.fn, l.hsla.to = function(t) {
            if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
            var n, e, i = t[0] / 255,
                o = t[1] / 255,
                r = t[2] / 255,
                a = t[3],
                s = Math.max(i, o, r),
                c = Math.min(i, o, r),
                u = s - c,
                l = s + c,
                d = .5 * l;
            return n = c === s ? 0 : i === s ? 60 * (o - r) / u + 360 : o === s ? 60 * (r - i) / u + 120 : 60 * (i - o) / u + 240, e = 0 === u ? 0 : .5 >= d ? u / l : u / (2 - l), [Math.round(n) % 360, e, d, null == a ? 1 : a]
        }, l.hsla.from = function(t) {
            if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
            var n = t[0] / 360,
                e = t[1],
                i = t[2],
                r = t[3],
                a = .5 >= i ? i * (1 + e) : i + e - i * e,
                s = 2 * i - a;
            return [Math.round(255 * o(s, a, n + 1 / 3)), Math.round(255 * o(s, a, n)), Math.round(255 * o(s, a, n - 1 / 3)), r]
        }, g(l, function(i, o) {
            var r = o.props,
                a = o.cache,
                c = o.to,
                l = o.from;
            u.fn[i] = function(i) {
                if (c && !this[a] && (this[a] = c(this._rgba)), i === n) return this[a].slice();
                var o, s = t.type(i),
                    d = "array" === s || "object" === s ? i : arguments,
                    h = this[a].slice();
                return g(r, function(t, n) {
                    var i = d["object" === s ? t : n.idx];
                    null == i && (i = h[n.idx]), h[n.idx] = e(i, n)
                }), l ? (o = u(l(h)), o[a] = h, o) : u(h)
            }, g(r, function(n, e) {
                u.fn[n] || (u.fn[n] = function(o) {
                    var r, a = t.type(o),
                        c = "alpha" === n ? this._hsla ? "hsla" : "rgba" : i,
                        u = this[c](),
                        l = u[e.idx];
                    return "undefined" === a ? l : ("function" === a && (o = o.call(this, l), a = t.type(o)), null == o && e.empty ? this : ("string" === a && (r = s.exec(o), r && (o = l + parseFloat(r[2]) * ("+" === r[1] ? 1 : -1))), u[e.idx] = o, this[c](u)))
                })
            })
        }), u.hook = function(n) {
            var e = n.split(" ");
            g(e, function(n, e) {
                t.cssHooks[e] = {
                    set: function(n, o) {
                        var r, a, s = "";
                        if ("string" !== t.type(o) || (r = i(o))) {
                            if (o = u(r || o), !h.rgba && 1 !== o._rgba[3]) {
                                for (a = "backgroundColor" === e ? n.parentNode : n;
                                    ("" === s || "transparent" === s) && a && a.style;) try {
                                    s = t.css(a, "backgroundColor"), a = a.parentNode
                                } catch (c) {}
                                o = o.blend(s && "transparent" !== s ? s : "_default")
                            }
                            o = o.toRgbaString()
                        }
                        try {
                            n.style[e] = o
                        } catch (c) {}
                    }
                }, t.fx.step[e] = function(n) {
                    n.colorInit || (n.start = u(n.elem, e), n.end = u(n.end), n.colorInit = !0), t.cssHooks[e].set(n.elem, n.start.transition(n.end, n.pos))
                }
            })
        }, u.hook(a), t.cssHooks.borderColor = {
            expand: function(t) {
                var n = {};
                return g(["Top", "Right", "Bottom", "Left"], function(e, i) {
                    n["border" + i + "Color"] = t
                }), n
            }
        }, r = t.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(jQuery), this.JSON || (this.JSON = {}),
    function() {
        function f(t) {
            return 10 > t ? "0" + t : t
        }

        function quote(t) {
            return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function(t) {
                var n = meta[t];
                return "string" == typeof n ? n : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + t + '"'
        }

        function str(t, n) {
            var e, i, o, r, a, s = gap,
                c = n[t];
            switch (c && "object" == typeof c && "function" == typeof c.toJSON && (c = c.toJSON(t)), "function" == typeof rep && (c = rep.call(n, t, c)), typeof c) {
                case "string":
                    return quote(c);
                case "number":
                    return isFinite(c) ? String(c) : "null";
                case "boolean":
                case "null":
                    return String(c);
                case "object":
                    if (!c) return "null";
                    if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(c)) {
                        for (r = c.length, e = 0; r > e; e += 1) a[e] = str(e, c) || "null";
                        return o = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, o
                    }
                    if (rep && "object" == typeof rep)
                        for (r = rep.length, e = 0; r > e; e += 1) i = rep[e], "string" == typeof i && (o = str(i, c), o && a.push(quote(i) + (gap ? ": " : ":") + o));
                    else
                        for (i in c) Object.hasOwnProperty.call(c, i) && (o = str(i, c), o && a.push(quote(i) + (gap ? ": " : ":") + o));
                    return o = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, o
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                " ": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        "function" != typeof JSON.stringify && (JSON.stringify = function(t, n, e) {
            var i;
            if (gap = "", indent = "", "number" == typeof e)
                for (i = 0; e > i; i += 1) indent += " ";
            else "string" == typeof e && (indent = e);
            if (rep = n, n && "function" != typeof n && ("object" != typeof n || "number" != typeof n.length)) throw new Error("JSON.stringify");
            return str("", {
                "": t
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(t, n) {
                var e, i, o = t[n];
                if (o && "object" == typeof o)
                    for (e in o) Object.hasOwnProperty.call(o, e) && (i = walk(o, e), void 0 !== i ? o[e] = i : delete o[e]);
                return reviver.call(t, n, o)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(t) {
                    return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(),
    function() {
        for (var t = 0, n = ["ms", "moz", "webkit", "o"], e = 0; e < n.length && !window.requestAnimationFrame; ++e) window.requestAnimationFrame = window[n[e] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n[e] + "CancelAnimationFrame"] || window[n[e] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(n) {
            var e = (new Date).getTime(),
                i = Math.max(0, 16 - (e - t)),
                o = window.setTimeout(function() {
                    n(e + i)
                }, i);
            return t = e + i, o
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
            clearTimeout(t)
        })
    }();
var vendorProp = function(t, n) {
    var e = n.substr(0, 1).toUpperCase() + n.substr(1),
        i = _(BROWSER_PREFIXES).detect(function(n) {
            return !_(t[n + e]).isUndefined()
        });
    return i ? t[i + e] : t[n]
};
