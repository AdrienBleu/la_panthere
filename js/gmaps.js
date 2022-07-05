"use strict"; !function (b, a) { "object" == typeof exports ? module.exports = a() : "function" == typeof define && define.amd ? define(["jquery", "googlemaps!"], a) : b.GMaps = a() }(this, function () {/*!
 * GMaps.js v0.4.25
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2017, Gustavo Leon
 * Released under the MIT License.
 */ var d, e, b, c, f = function (a, b) { var c; if (a === b) return a; for (c in b) void 0 !== b[c] && (a[c] = b[c]); return a }, g = function (a, d) { var b, e = Array.prototype.slice.call(arguments, 2), c = [], f = a.length; if (Array.prototype.map && a.map === Array.prototype.map) c = Array.prototype.map.call(a, function (b) { var a = e.slice(0); return a.splice(0, 0, b), d.apply(this, a) }); else for (b = 0; b < f; b++)(callback_params = e).splice(0, 0, a[b]), c.push(d.apply(this, callback_params)); return c }, h = function (c) { var a, b = []; for (a = 0; a < c.length; a++)b = b.concat(c[a]); return b }, i = function (a, d) { var b = a[0], c = a[1]; return d && (b = a[1], c = a[0]), new google.maps.LatLng(b, c) }, j = function (b, c) { var a; for (a = 0; a < b.length; a++)b[a] instanceof google.maps.LatLng || (b[a].length > 0 && "object" == typeof b[a][0] ? b[a] = j(b[a], c) : b[a] = i(b[a], c)); return b }, k = function (c, a) { var b = c.replace(".", ""); return "jQuery" in this && a ? $("." + b, a)[0] : document.getElementsByClassName(b)[0] }, l = function (a, b) { var a = a.replace("#", ""); return "jQuery" in window && b ? $("#" + a, b)[0] : document.getElementById(a) }, m = function (a) { var b = 0, c = 0; if (a.getBoundingClientRect) { var d = a.getBoundingClientRect(), e = -(window.scrollX ? window.scrollX : window.pageXOffset), f = -(window.scrollY ? window.scrollY : window.pageYOffset); return [d.left - e, d.top - f] } if (a.offsetParent) do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent) return [b, c] }, a = (b = document, c = function (a) { if (!("object" == typeof window.google && window.google.maps)) return "object" == typeof window.console && window.console.error && console.error("Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js."), function () { }; if (!this) return new c(a); a.zoom = a.zoom || 15, a.mapType = a.mapType || "roadmap"; var d, g = function (a, b) { return void 0 === a ? b : a }, x = this, i = ["bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "idle", "maptypeid_changed", "projection_changed", "resize", "tilesloaded", "zoom_changed"], j = ["mousemove", "mouseout", "mouseover"], s = ["el", "lat", "lng", "mapType", "width", "height", "markerClusterer", "enableNewStyle"], n = a.el || a.div, t = a.markerClusterer, y = google.maps.MapTypeId[a.mapType.toUpperCase()], z = new google.maps.LatLng(a.lat, a.lng), A = g(a.zoomControl, !0), u = a.zoomControlOpt || { style: "DEFAULT", position: "TOP_LEFT" }, B = u.style || "DEFAULT", C = u.position || "TOP_LEFT", D = g(a.panControl, !0), E = g(a.mapTypeControl, !0), F = g(a.scaleControl, !0), G = g(a.streetViewControl, !0), v = g(v, !0), o = {}, q = { zoom: this.zoom, center: z, mapTypeId: y }, H = { panControl: D, zoomControl: A, zoomControlOptions: { style: google.maps.ZoomControlStyle[B], position: google.maps.ControlPosition[C] }, mapTypeControl: E, scaleControl: F, streetViewControl: G, overviewMapControl: v }; if ("string" == typeof a.el || "string" == typeof a.div ? n.indexOf("#") > -1 ? this.el = l(n, a.context) : this.el = k.apply(this, [n, a.context]) : this.el = n, void 0 === this.el || null === this.el) throw "No element defined."; for (d = 0, window.context_menu = window.context_menu || {}, window.context_menu[x.el.id] = {}, this.controls = [], this.overlays = [], this.layers = [], this.singleLayers = {}, this.markers = [], this.polylines = [], this.routes = [], this.polygons = [], this.infoWindow = null, this.overlay_el = null, this.zoom = a.zoom, this.registered_events = {}, this.el.style.width = a.width || this.el.scrollWidth || this.el.offsetWidth, this.el.style.height = a.height || this.el.scrollHeight || this.el.offsetHeight, google.maps.visualRefresh = a.enableNewStyle; d < s.length; d++)delete a[s[d]]; for (!0 != a.disableDefaultUI && (q = f(q, H)), o = f(q, a), d = 0; d < i.length; d++)delete o[i[d]]; for (d = 0; d < j.length; d++)delete o[j[d]]; this.map = new google.maps.Map(this.el, o), t && (this.markerClusterer = t.apply(this, [this.map])); var I = function (d, e) { var f = "", c = window.context_menu[x.el.id][d]; for (var a in c) if (c.hasOwnProperty(a)) { var j = c[a]; f += '<li><a id="' + d + "_" + a + '" href="#">' + j.title + "</a></li>" } if (l("gmaps_context_menu")) { var b = l("gmaps_context_menu"); b.innerHTML = f; var a, g = b.getElementsByTagName("a"), k = g.length; for (a = 0; a < k; a++) { var h = g[a], n = function (a) { a.preventDefault(), c[this.id.replace(d + "_", "")].action.apply(x, [e]), x.hideContextMenu() }; google.maps.event.clearListeners(h, "click"), google.maps.event.addDomListenerOnce(h, "click", n, !1) } var i = m.apply(this, [x.el]), o = i[0] + e.pixel.x - 15, p = i[1] + e.pixel.y - 15; b.style.left = o + "px", b.style.top = p + "px" } }; this.buildContextMenu = function (a, b) { if ("marker" === a) { b.pixel = {}; var c = new google.maps.OverlayView; c.setMap(x.map), c.draw = function () { var d = c.getProjection(), e = b.marker.getPosition(); b.pixel = d.fromLatLngToContainerPixel(e), I(a, b) } } else I(a, b); var d = l("gmaps_context_menu"); setTimeout(function () { d.style.display = "block" }, 0) }, this.setContextMenu = function (c) { window.context_menu[x.el.id][c.control] = {}; var d, a = b.createElement("ul"); for (d in c.options) if (c.options.hasOwnProperty(d)) { var e = c.options[d]; window.context_menu[x.el.id][c.control][e.name] = { title: e.title, action: e.action } } a.id = "gmaps_context_menu", a.style.display = "none", a.style.position = "absolute", a.style.minWidth = "100px", a.style.background = "white", a.style.listStyle = "none", a.style.padding = "8px", a.style.boxShadow = "2px 2px 6px #ccc", l("gmaps_context_menu") || b.body.appendChild(a); var f = l("gmaps_context_menu"); google.maps.event.addDomListener(f, "mouseout", function (a) { a.relatedTarget && this.contains(a.relatedTarget) || window.setTimeout(function () { f.style.display = "none" }, 400) }, !1) }, this.hideContextMenu = function () { var a = l("gmaps_context_menu"); a && (a.style.display = "none") }; var w = function (b, c) { google.maps.event.addListener(b, c, function (b) { void 0 == b && (b = this), a[c].apply(this, [b]), x.hideContextMenu() }) }; google.maps.event.addListener(this.map, "zoom_changed", this.hideContextMenu); for (var e = 0; e < i.length; e++) { var h = i[e]; h in a && w(this.map, h) } for (var e = 0; e < j.length; e++) { var h = j[e]; h in a && w(this.map, h) } google.maps.event.addListener(this.map, "rightclick", function (b) { a.rightclick && a.rightclick.apply(this, [b]), void 0 != window.context_menu[x.el.id].map && x.buildContextMenu("map", b) }), this.refresh = function () { google.maps.event.trigger(this.map, "resize") }, this.fitZoom = function () { var a, b = [], c = this.markers.length; for (a = 0; a < c; a++)"boolean" == typeof this.markers[a].visible && this.markers[a].visible && b.push(this.markers[a].getPosition()); this.fitLatLngBounds(b) }, this.fitLatLngBounds = function (b) { var a, d = b.length, c = new google.maps.LatLngBounds; for (a = 0; a < d; a++)c.extend(b[a]); this.map.fitBounds(c) }, this.setCenter = function (b, c, a) { this.map.panTo(new google.maps.LatLng(b, c)), a && a() }, this.getElement = function () { return this.el }, this.zoomIn = function (a) { a = a || 1, this.zoom = this.map.getZoom() + a, this.map.setZoom(this.zoom) }, this.zoomOut = function (a) { a = a || 1, this.zoom = this.map.getZoom() - a, this.map.setZoom(this.zoom) }; var p, r = []; for (p in this.map) "function" != typeof this.map[p] || this[p] || r.push(p); for (d = 0; d < r.length; d++)!function (a, c, b) { a[b] = function () { return c[b].apply(c, arguments) } }(this, this.map, r[d]) }); return a.prototype.createControl = function (a) { var b = document.createElement("div"); for (var c in b.style.cursor = "pointer", !0 !== a.disableDefaultStyles && (b.style.fontFamily = "Roboto, Arial, sans-serif", b.style.fontSize = "11px", b.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px"), a.style) b.style[c] = a.style[c]; for (var d in a.id && (b.id = a.id), a.title && (b.title = a.title), a.classes && (b.className = a.classes), a.content && ("string" == typeof a.content ? b.innerHTML = a.content : a.content instanceof HTMLElement && b.appendChild(a.content)), a.position && (b.position = google.maps.ControlPosition[a.position.toUpperCase()]), a.events) !function (b, c) { google.maps.event.addDomListener(b, c, function () { a.events[c].apply(this, [this]) }) }(b, d); return b.index = 1, b }, a.prototype.addControl = function (b) { var a = this.createControl(b); return this.controls.push(a), this.map.controls[a.position].push(a), a }, a.prototype.removeControl = function (b) { var a, c = null; for (a = 0; a < this.controls.length; a++)this.controls[a] == b && (c = this.controls[a].position, this.controls.splice(a, 1)); if (c) for (a = 0; a < this.map.controls.length; a++) { var d = this.map.controls[b.position]; if (d.getAt(a) == b) { d.removeAt(a); break } } return b }, a.prototype.createMarker = function (a) { if (void 0 == a.lat && void 0 == a.lng && void 0 == a.position) throw "No latitude or longitude defined."; var k = this, l = a.details, i = a.fences, m = a.outside, j = { position: new google.maps.LatLng(a.lat, a.lng), map: null }, d = f(j, a); delete d.lat, delete d.lng, delete d.fences, delete d.outside; var c = new google.maps.Marker(d); if (c.fences = i, a.infoWindow) { c.infoWindow = new google.maps.InfoWindow(a.infoWindow); for (var e = ["closeclick", "content_changed", "domready", "position_changed", "zindex_changed"], b = 0; b < e.length; b++)!function (c, b) { a.infoWindow[b] && google.maps.event.addListener(c, b, function (c) { a.infoWindow[b].apply(this, [c]) }) }(c.infoWindow, e[b]) } for (var g = ["animation_changed", "clickable_changed", "cursor_changed", "draggable_changed", "flat_changed", "icon_changed", "position_changed", "shadow_changed", "shape_changed", "title_changed", "visible_changed", "zindex_changed"], h = ["dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup"], b = 0; b < g.length; b++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function () { a[b].apply(this, [this]) }) }(c, g[b]); for (var b = 0; b < h.length; b++)!function (d, c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { c.pixel || (c.pixel = d.getProjection().fromLatLngToPoint(c.latLng)), a[b].apply(this, [c]) }) }(this.map, c, h[b]); return google.maps.event.addListener(c, "click", function () { this.details = l, a.click && a.click.apply(this, [this]), c.infoWindow && (k.hideInfoWindows(), c.infoWindow.open(k.map, c)) }), google.maps.event.addListener(c, "rightclick", function (b) { b.marker = this, a.rightclick && a.rightclick.apply(this, [b]), void 0 != window.context_menu[k.el.id].marker && k.buildContextMenu("marker", b) }), c.fences && google.maps.event.addListener(c, "dragend", function () { k.checkMarkerGeofence(c, function (a, b) { m(a, b) }) }), c }, a.prototype.addMarker = function (c) { var b; if (c.hasOwnProperty("gm_accessors_")) b = c; else if (c.hasOwnProperty("lat") && c.hasOwnProperty("lng") || c.position) b = this.createMarker(c); else throw "No latitude or longitude defined."; return b.setMap(this.map), this.markerClusterer && this.markerClusterer.addMarker(b), this.markers.push(b), a.fire("marker_added", b, this), b }, a.prototype.addMarkers = function (c) { for (var a, b = 0; a = c[b]; b++)this.addMarker(a); return this.markers }, a.prototype.hideInfoWindows = function () { for (var a, b = 0; a = this.markers[b]; b++)a.infoWindow && a.infoWindow.close() }, a.prototype.removeMarker = function (c) { for (var b = 0; b < this.markers.length; b++)if (this.markers[b] === c) { this.markers[b].setMap(null), this.markers.splice(b, 1), this.markerClusterer && this.markerClusterer.removeMarker(c), a.fire("marker_removed", c, this); break } return c }, a.prototype.removeMarkers = function (d) { var e = []; if (void 0 === d) { for (var b = 0; b < this.markers.length; b++) { var c = this.markers[b]; c.setMap(null), a.fire("marker_removed", c, this) } this.markerClusterer && this.markerClusterer.clearMarkers && this.markerClusterer.clearMarkers(), this.markers = e } else { for (var b = 0; b < d.length; b++) { var f = this.markers.indexOf(d[b]); if (f > -1) { var c = this.markers[f]; c.setMap(null), this.markerClusterer && this.markerClusterer.removeMarker(c), a.fire("marker_removed", c, this) } } for (var b = 0; b < this.markers.length; b++) { var c = this.markers[b]; null != c.getMap() && e.push(c) } this.markers = e } }, a.prototype.drawOverlay = function (b) { var a = new google.maps.OverlayView, c = !0; return a.setMap(this.map), null != b.auto_show && (c = b.auto_show), a.onAdd = function () { var e, f, c = document.createElement("div"); c.style.borderStyle = "none", c.style.borderWidth = "0px", c.style.position = "absolute", c.style.zIndex = 100, c.innerHTML = b.content, a.el = c, b.layer || (b.layer = "overlayLayer"); var g = this.getPanes(), i = g[b.layer], h = ["contextmenu", "DOMMouseScroll", "dblclick", "mousedown"]; i.appendChild(c); for (var d = 0; d < h.length; d++)e = c, f = h[d], google.maps.event.addDomListener(e, f, function (a) { -1 != navigator.userAgent.toLowerCase().indexOf("msie") && document.all ? (a.cancelBubble = !0, a.returnValue = !1) : a.stopPropagation() }); b.click && (g.overlayMouseTarget.appendChild(a.el), google.maps.event.addDomListener(a.el, "click", function () { b.click.apply(a, [a]) })), google.maps.event.trigger(this, "ready") }, a.draw = function () { var e = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(b.lat, b.lng)); b.horizontalOffset = b.horizontalOffset || 0, b.verticalOffset = b.verticalOffset || 0; var d = a.el, f = d.children[0], g = f.clientHeight, h = f.clientWidth; switch (b.verticalAlign) { case "top": d.style.top = e.y - g + b.verticalOffset + "px"; break; default: case "middle": d.style.top = e.y - g / 2 + b.verticalOffset + "px"; break; case "bottom": d.style.top = e.y + b.verticalOffset + "px" }switch (b.horizontalAlign) { case "left": d.style.left = e.x - h + b.horizontalOffset + "px"; break; default: case "center": d.style.left = e.x - h / 2 + b.horizontalOffset + "px"; break; case "right": d.style.left = e.x + b.horizontalOffset + "px" }d.style.display = c ? "block" : "none", c || b.show.apply(this, [d]) }, a.onRemove = function () { var c = a.el; b.remove ? b.remove.apply(this, [c]) : (a.el.parentNode.removeChild(a.el), a.el = null) }, this.overlays.push(a), a }, a.prototype.removeOverlay = function (b) { for (var a = 0; a < this.overlays.length; a++)if (this.overlays[a] === b) { this.overlays[a].setMap(null), this.overlays.splice(a, 1); break } }, a.prototype.removeOverlays = function () { for (var a, b = 0; a = this.overlays[b]; b++)a.setMap(null); this.overlays = [] }, a.prototype.drawPolyline = function (b) { var f = [], d = b.path; if (d.length) { if (void 0 === d[0][0]) f = d; else for (var g, i = 0; g = d[i]; i++)f.push(new google.maps.LatLng(g[0], g[1])) } var c = { map: this.map, path: f, strokeColor: b.strokeColor, strokeOpacity: b.strokeOpacity, strokeWeight: b.strokeWeight, geodesic: b.geodesic, clickable: !0, editable: !1, visible: !0 }; b.hasOwnProperty("clickable") && (c.clickable = b.clickable), b.hasOwnProperty("editable") && (c.editable = b.editable), b.hasOwnProperty("icons") && (c.icons = b.icons), b.hasOwnProperty("zIndex") && (c.zIndex = b.zIndex); for (var e = new google.maps.Polyline(c), j = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], h = 0; h < j.length; h++)!function (c, a) { b[a] && google.maps.event.addListener(c, a, function (c) { b[a].apply(this, [c]) }) }(e, j[h]); return this.polylines.push(e), a.fire("polyline_added", e, this), e }, a.prototype.removePolyline = function (c) { for (var b = 0; b < this.polylines.length; b++)if (this.polylines[b] === c) { this.polylines[b].setMap(null), this.polylines.splice(b, 1), a.fire("polyline_removed", c, this); break } }, a.prototype.removePolylines = function () { for (var a, b = 0; a = this.polylines[b]; b++)a.setMap(null); this.polylines = [] }, a.prototype.drawCircle = function (a) { delete (a = f({ map: this.map, center: new google.maps.LatLng(a.lat, a.lng) }, a)).lat, delete a.lng; for (var b = new google.maps.Circle(a), d = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], c = 0; c < d.length; c++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { a[b].apply(this, [c]) }) }(b, d[c]); return this.polygons.push(b), b }, a.prototype.drawRectangle = function (a) { a = f({ map: this.map }, a); var e = new google.maps.LatLngBounds(new google.maps.LatLng(a.bounds[0][0], a.bounds[0][1]), new google.maps.LatLng(a.bounds[1][0], a.bounds[1][1])); a.bounds = e; for (var b = new google.maps.Rectangle(a), d = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], c = 0; c < d.length; c++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { a[b].apply(this, [c]) }) }(b, d[c]); return this.polygons.push(b), b }, a.prototype.drawPolygon = function (b) { var d = !1; b.hasOwnProperty("useGeoJSON") && (d = b.useGeoJSON), delete b.useGeoJSON, b = f({ map: this.map }, b), !1 == d && (b.paths = [b.paths.slice(0)]), b.paths.length > 0 && b.paths[0].length > 0 && (b.paths = h(g(b.paths, j, d))); for (var c = new google.maps.Polygon(b), i = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], e = 0; e < i.length; e++)!function (c, a) { b[a] && google.maps.event.addListener(c, a, function (c) { b[a].apply(this, [c]) }) }(c, i[e]); return this.polygons.push(c), a.fire("polygon_added", c, this), c }, a.prototype.removePolygon = function (c) { for (var b = 0; b < this.polygons.length; b++)if (this.polygons[b] === c) { this.polygons[b].setMap(null), this.polygons.splice(b, 1), a.fire("polygon_removed", c, this); break } }, a.prototype.removePolygons = function () { for (var a, b = 0; a = this.polygons[b]; b++)a.setMap(null); this.polygons = [] }, a.prototype.getFromFusionTables = function (a) { var c = a.events; delete a.events; var b = new google.maps.FusionTablesLayer(a); for (var d in c) !function (a, b) { google.maps.event.addListener(a, b, function (a) { c[b].apply(this, [a]) }) }(b, d); return this.layers.push(b), b }, a.prototype.loadFromFusionTables = function (b) { var a = this.getFromFusionTables(b); return a.setMap(this.map), a }, a.prototype.getFromKML = function (a) { var c = a.url, d = a.events; delete a.url, delete a.events; var b = new google.maps.KmlLayer(c, a); for (var e in d) !function (a, b) { google.maps.event.addListener(a, b, function (a) { d[b].apply(this, [a]) }) }(b, e); return this.layers.push(b), b }, a.prototype.loadFromKML = function (b) { var a = this.getFromKML(b); return a.setMap(this.map), a }, a.prototype.addLayer = function (d, a) { switch (a = a || {}, d) { case "weather": this.singleLayers.weather = b = new google.maps.weather.WeatherLayer; break; case "clouds": this.singleLayers.clouds = b = new google.maps.weather.CloudLayer; break; case "traffic": this.singleLayers.traffic = b = new google.maps.TrafficLayer; break; case "transit": this.singleLayers.transit = b = new google.maps.TransitLayer; break; case "bicycling": this.singleLayers.bicycling = b = new google.maps.BicyclingLayer; break; case "panoramio": this.singleLayers.panoramio = b = new google.maps.panoramio.PanoramioLayer, b.setTag(a.filter), delete a.filter, a.click && google.maps.event.addListener(b, "click", function (b) { a.click(b), delete a.click }); break; case "places": if (this.singleLayers.places = b = new google.maps.places.PlacesService(this.map), a.search || a.nearbySearch || a.radarSearch) { var b, c = { bounds: a.bounds || null, keyword: a.keyword || null, location: a.location || null, name: a.name || null, radius: a.radius || null, rankBy: a.rankBy || null, types: a.types || null }; a.radarSearch && b.radarSearch(c, a.radarSearch), a.search && b.search(c, a.search), a.nearbySearch && b.nearbySearch(c, a.nearbySearch) } if (a.textSearch) { var e = { bounds: a.bounds || null, location: a.location || null, query: a.query || null, radius: a.radius || null }; b.textSearch(e, a.textSearch) } }if (void 0 !== b) return "function" == typeof b.setOptions && b.setOptions(a), "function" == typeof b.setMap && b.setMap(this.map), b }, a.prototype.removeLayer = function (a) { if ("string" == typeof a && void 0 !== this.singleLayers[a]) this.singleLayers[a].setMap(null), delete this.singleLayers[a]; else for (var b = 0; b < this.layers.length; b++)if (this.layers[b] === a) { this.layers[b].setMap(null), this.layers.splice(b, 1); break } }, a.prototype.getRoutes = function (a) { switch (a.travelMode) { case "bicycling": d = google.maps.TravelMode.BICYCLING; break; case "transit": d = google.maps.TravelMode.TRANSIT; break; case "driving": d = google.maps.TravelMode.DRIVING; break; default: d = google.maps.TravelMode.WALKING }e = "imperial" === a.unitSystem ? google.maps.UnitSystem.IMPERIAL : google.maps.UnitSystem.METRIC; var b = f({ avoidHighways: !1, avoidTolls: !1, optimizeWaypoints: !1, waypoints: [] }, a); b.origin = /string/.test(typeof a.origin) ? a.origin : new google.maps.LatLng(a.origin[0], a.origin[1]), b.destination = /string/.test(typeof a.destination) ? a.destination : new google.maps.LatLng(a.destination[0], a.destination[1]), b.travelMode = d, b.unitSystem = e, delete b.callback, delete b.error; var c = []; new google.maps.DirectionsService().route(b, function (b, d) { if (d === google.maps.DirectionsStatus.OK) { for (var e in b.routes) b.routes.hasOwnProperty(e) && c.push(b.routes[e]); a.callback && a.callback(c, b, d) } else a.error && a.error(b, d) }) }, a.prototype.removeRoutes = function () { this.routes.length = 0 }, a.prototype.getElevations = function (a) { (a = f({ locations: [], path: !1, samples: 256 }, a)).locations.length > 0 && a.locations[0].length > 0 && (a.locations = h(g([a.locations], j, !1))); var d = a.callback; delete a.callback; var b = new google.maps.ElevationService; if (a.path) { var c = { path: a.locations, samples: a.samples }; b.getElevationAlongPath(c, function (a, b) { d && "function" == typeof d && d(a, b) }) } else delete a.path, delete a.samples, b.getElevationForLocations(a, function (a, b) { d && "function" == typeof d && d(a, b) }) }, a.prototype.cleanRoute = a.prototype.removePolylines, a.prototype.renderRoute = function (a, b) { var c, d = "string" == typeof b.panel ? document.getElementById(b.panel.replace("#", "")) : b.panel; b.panel = d, b = f({ map: this.map }, b), c = new google.maps.DirectionsRenderer(b), this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, avoidHighways: a.avoidHighways, avoidTolls: a.avoidTolls, optimizeWaypoints: a.optimizeWaypoints, callback: function (d, a, b) { b === google.maps.DirectionsStatus.OK && c.setDirections(a) } }) }, a.prototype.drawRoute = function (a) { var b = this; this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, avoidHighways: a.avoidHighways, avoidTolls: a.avoidTolls, optimizeWaypoints: a.optimizeWaypoints, callback: function (c) { if (c.length > 0) { var d = { path: c[c.length - 1].overview_path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (d.icons = a.icons), b.drawPolyline(d), a.callback && a.callback(c[c.length - 1]) } } }) }, a.prototype.travelRoute = function (a) { if (a.origin && a.destination) this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, callback: function (b) { if (b.length > 0 && a.start && a.start(b[b.length - 1]), b.length > 0 && a.step) { var c = b[b.length - 1]; if (c.legs.length > 0) for (var d, f = c.legs[0].steps, e = 0; d = f[e]; e++)d.step_number = e, a.step(d, c.legs[0].steps.length - 1) } b.length > 0 && a.end && a.end(b[b.length - 1]) } }); else if (a.route && a.route.legs.length > 0) for (var b, d = a.route.legs[0].steps, c = 0; b = d[c]; c++)b.step_number = c, a.step(b) }, a.prototype.drawSteppedRoute = function (a) { var e = this; if (a.origin && a.destination) this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, error: a.error, callback: function (b) { if (b.length > 0 && a.start && a.start(b[b.length - 1]), b.length > 0 && a.step) { var d = b[b.length - 1]; if (d.legs.length > 0) for (var c, h = d.legs[0].steps, f = 0; c = h[f]; f++) { c.step_number = f; var g = { path: c.path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (g.icons = a.icons), e.drawPolyline(g), a.step(c, d.legs[0].steps.length - 1) } } b.length > 0 && a.end && a.end(b[b.length - 1]) } }); else if (a.route && a.route.legs.length > 0) for (var b, f = a.route.legs[0].steps, c = 0; b = f[c]; c++) { b.step_number = c; var d = { path: b.path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (d.icons = a.icons), e.drawPolyline(d), a.step(b) } }, a.Route = function (a) { this.origin = a.origin, this.destination = a.destination, this.waypoints = a.waypoints, this.map = a.map, this.route = a.route, this.step_count = 0, this.steps = this.route.legs[0].steps, this.steps_length = this.steps.length; var b = { path: new google.maps.MVCArray, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (b.icons = a.icons), this.polyline = this.map.drawPolyline(b).getPath() }, a.Route.prototype.getRoute = function (a) { var b = this; this.map.getRoutes({ origin: this.origin, destination: this.destination, travelMode: a.travelMode, waypoints: this.waypoints || [], error: a.error, callback: function () { b.route = e[0], a.callback && a.callback.call(b) } }) }, a.Route.prototype.back = function () { if (this.step_count > 0) { this.step_count--; var a = this.route.legs[0].steps[this.step_count].path; for (var b in a) a.hasOwnProperty(b) && this.polyline.pop() } }, a.Route.prototype.forward = function () { if (this.step_count < this.steps_length) { var a = this.route.legs[0].steps[this.step_count].path; for (var b in a) a.hasOwnProperty(b) && this.polyline.push(a[b]); this.step_count++ } }, a.prototype.checkGeofence = function (a, b, c) { return c.containsLatLng(new google.maps.LatLng(a, b)) }, a.prototype.checkMarkerGeofence = function (a, e) { if (a.fences) for (var b, c = 0; b = a.fences[c]; c++) { var d = a.getPosition(); this.checkGeofence(d.lat(), d.lng(), b) || e(a, b) } }, a.prototype.toImage = function (e) { var e = e || {}, b = {}; if (b.size = e.size || [this.el.clientWidth, this.el.clientHeight], b.lat = this.getCenter().lat(), b.lng = this.getCenter().lng(), this.markers.length > 0) { b.markers = []; for (var c = 0; c < this.markers.length; c++)b.markers.push({ lat: this.markers[c].getPosition().lat(), lng: this.markers[c].getPosition().lng() }) } if (this.polylines.length > 0) { var d = this.polylines[0]; b.polyline = {}, b.polyline.path = google.maps.geometry.encoding.encodePath(d.getPath()), b.polyline.strokeColor = d.strokeColor, b.polyline.strokeOpacity = d.strokeOpacity, b.polyline.strokeWeight = d.strokeWeight } return a.staticMapURL(b) }, a.staticMapURL = function (a) { var b, c = [], m = ("file:" === location.protocol ? "http:" : location.protocol) + "//maps.googleapis.com/maps/api/staticmap"; a.url && (m = a.url, delete a.url), m += "?"; var j = a.markers; delete a.markers, !j && a.marker && (j = [a.marker], delete a.marker); var f = a.styles; delete a.styles; var e = a.polyline; if (delete a.polyline, a.center) c.push("center=" + a.center), delete a.center; else if (a.address) c.push("center=" + a.address), delete a.address; else if (a.lat) c.push(["center=", a.lat, ",", a.lng].join("")), delete a.lat, delete a.lng; else if (a.visible) { var s = encodeURI(a.visible.join("|")); c.push("visible=" + s) } var i = a.size; i ? (i.join && (i = i.join("x")), delete a.size) : i = "630x300", c.push("size=" + i), a.zoom || !1 === a.zoom || (a.zoom = 15); var t = !a.hasOwnProperty("sensor") || !!a.sensor; for (var g in delete a.sensor, c.push("sensor=" + t), a) a.hasOwnProperty(g) && c.push(g + "=" + a[g]); if (j) for (var d = 0; b = j[d]; d++) { for (var g in x = [], b.size && "normal" !== b.size ? (x.push("size:" + b.size), delete b.size) : b.icon && (x.push("icon:" + encodeURI(b.icon)), delete b.icon), b.color && (x.push("color:" + b.color.replace("#", "0x")), delete b.color), b.label && (x.push("label:" + b.label[0].toUpperCase()), delete b.label), y = b.address ? b.address : b.lat + "," + b.lng, delete b.address, delete b.lat, delete b.lng, b) b.hasOwnProperty(g) && x.push(g + ":" + b[g]); x.length || 0 === d ? (x.push(y), x = x.join("|"), c.push("markers=" + encodeURI(x))) : (x = c.pop() + encodeURI("|" + y), c.push(x)) } if (f) for (var d = 0; d < f.length; d++) { var k = []; f[d].featureType && k.push("feature:" + f[d].featureType.toLowerCase()), f[d].elementType && k.push("element:" + f[d].elementType.toLowerCase()); for (var h = 0; h < f[d].stylers.length; h++)for (var l in f[d].stylers[h]) { var n = f[d].stylers[h][l]; ("hue" == l || "color" == l) && (n = "0x" + n.substring(1)), k.push(l + ":" + n) } var p = k.join("|"); "" != p && c.push("style=" + p) } function q(b, a) { if ("#" === b[0] && (b = b.replace("#", "0x"), a)) { if (0 === (a = Math.min(1, Math.max(a = parseFloat(a), 0)))) return "0x00000000"; 1 === (a = (255 * a).toString(16)).length && (a += a), b = b.slice(0, 8) + a } return b } if (e) { if (b = e, e = [], b.strokeWeight && e.push("weight:" + parseInt(b.strokeWeight, 10)), b.strokeColor) { var u = q(b.strokeColor, b.strokeOpacity); e.push("color:" + u) } if (b.fillColor) { var v = q(b.fillColor, b.fillOpacity); e.push("fillcolor:" + v) } var o = b.path; if (o.join) for (var x, y, r, h = 0; r = o[h]; h++)e.push(r.join(",")); else e.push("enc:" + o); e = e.join("|"), c.push("path=" + encodeURI(e)) } var w = window.devicePixelRatio || 1; return c.push("scale=" + w), m + (c = c.join("&")) }, a.prototype.addMapType = function (b, a) { if (a.hasOwnProperty("getTileUrl") && "function" == typeof a.getTileUrl) { a.tileSize = a.tileSize || new google.maps.Size(256, 256); var c = new google.maps.ImageMapType(a); this.map.mapTypes.set(b, c) } else throw "'getTileUrl' function required." }, a.prototype.addOverlayMapType = function (a) { if (a.hasOwnProperty("getTile") && "function" == typeof a.getTile) { var b = a.index; delete a.index, this.map.overlayMapTypes.insertAt(b, a) } else throw "'getTile' function required." }, a.prototype.removeOverlayMapType = function (a) { this.map.overlayMapTypes.removeAt(a) }, a.prototype.addStyle = function (a) { var b = new google.maps.StyledMapType(a.styles, { name: a.styledMapName }); this.map.mapTypes.set(a.mapTypeId, b) }, a.prototype.setStyle = function (a) { this.map.setMapTypeId(a) }, a.prototype.createPanorama = function (b) { return b.hasOwnProperty("lat") && b.hasOwnProperty("lng") || (b.lat = this.getCenter().lat(), b.lng = this.getCenter().lng()), this.panorama = a.createPanorama(b), this.map.setStreetView(this.panorama), this.panorama }, a.createPanorama = function (a) { var g = l(a.el, a.context); a.position = new google.maps.LatLng(a.lat, a.lng), delete a.el, delete a.context, delete a.lat, delete a.lng; for (var c = ["closeclick", "links_changed", "pano_changed", "position_changed", "pov_changed", "resize", "visible_changed"], d = f({ visible: !0 }, a), b = 0; b < c.length; b++)delete d[c[b]]; for (var e = new google.maps.StreetViewPanorama(g, d), b = 0; b < c.length; b++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function () { a[b].apply(this) }) }(e, c[b]); return e }, a.prototype.on = function (b, c) { return a.on(b, this, c) }, a.prototype.off = function (b) { a.off(b, this) }, a.prototype.once = function (b, c) { return a.once(b, this, c) }, a.custom_events = ["marker_added", "marker_removed", "polyline_added", "polyline_removed", "polygon_added", "polygon_removed", "geolocated", "geolocation_failed"], a.on = function (c, b, d) { if (-1 == a.custom_events.indexOf(c)) return b instanceof a && (b = b.map), google.maps.event.addListener(b, c, d); var e = { handler: d, eventName: c }; return b.registered_events[c] = b.registered_events[c] || [], b.registered_events[c].push(e), e }, a.off = function (c, b) { -1 == a.custom_events.indexOf(c) ? (b instanceof a && (b = b.map), google.maps.event.clearListeners(b, c)) : b.registered_events[c] = [] }, a.once = function (c, b, d) { if (-1 == a.custom_events.indexOf(c)) return b instanceof a && (b = b.map), google.maps.event.addListenerOnce(b, c, d) }, a.fire = function (b, e, c) { if (-1 == a.custom_events.indexOf(b)) google.maps.event.trigger(e, b, Array.prototype.slice.apply(arguments).slice(2)); else if (b in c.registered_events) for (var f = c.registered_events[b], d = 0; d < f.length; d++)!function (a, b, c) { a.apply(b, [c]) }(f[d].handler, c, e) }, a.geolocate = function (a) { var b = a.always || a.complete; navigator.geolocation ? navigator.geolocation.getCurrentPosition(function (c) { a.success(c), b && b() }, function (c) { a.error(c), b && b() }, a.options) : (a.not_supported(), b && b()) }, a.geocode = function (a) { this.geocoder = new google.maps.Geocoder; var b = a.callback; a.hasOwnProperty("lat") && a.hasOwnProperty("lng") && (a.latLng = new google.maps.LatLng(a.lat, a.lng)), delete a.lat, delete a.lng, delete a.callback, this.geocoder.geocode(a, function (a, c) { b(a, c) }) }, "object" == typeof window.google && window.google.maps && (google.maps.Polygon.prototype.getBounds || (google.maps.Polygon.prototype.getBounds = function (f) { for (var a, d = new google.maps.LatLngBounds, e = this.getPaths(), b = 0; b < e.getLength(); b++) { a = e.getAt(b); for (var c = 0; c < a.getLength(); c++)d.extend(a.getAt(c)) } return d }), google.maps.Polygon.prototype.containsLatLng || (google.maps.Polygon.prototype.containsLatLng = function (a) { var h = this.getBounds(); if (null !== h && !h.contains(a)) return !1; for (var e = !1, k = this.getPaths().getLength(), f = 0; f < k; f++)for (var g = this.getPaths().getAt(f), i = g.getLength(), j = i - 1, c = 0; c < i; c++) { var b = g.getAt(c), d = g.getAt(j); (b.lng() < a.lng() && d.lng() >= a.lng() || d.lng() < a.lng() && b.lng() >= a.lng()) && b.lat() + (a.lng() - b.lng()) / (d.lng() - b.lng()) * (d.lat() - b.lat()) < a.lat() && (e = !e), j = c } return e }), google.maps.Circle.prototype.containsLatLng || (google.maps.Circle.prototype.containsLatLng = function (a) { return !google.maps.geometry || google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), a) <= this.getRadius() }), google.maps.Rectangle.prototype.containsLatLng = function (a) { return this.getBounds().contains(a) }, google.maps.LatLngBounds.prototype.containsLatLng = function (a) { return this.contains(a) }, google.maps.Marker.prototype.setFences = function (a) { this.fences = a }, google.maps.Marker.prototype.addFence = function (a) { this.fences.push(a) }, google.maps.Marker.prototype.getId = function () { return this["__gm_id"] }), Array.prototype.indexOf || (Array.prototype.indexOf = function (e) { if (this == null) throw new TypeError; var d = Object(this), c = d.length >>> 0; if (0 === c) return -1; var a = 0; if (arguments.length > 1 && (a = Number(arguments[1]), a != a ? a = 0 : 0 != a && a != 1 / 0 && a != -1 / 0 && (a = (a > 0 || -1) * Math.floor(Math.abs(a)))), a >= c) return -1; for (var b = a >= 0 ? a : Math.max(c - Math.abs(a), 0); b < c; b++)if (b in d && d[b] === e) return b; return -1 }), a
})