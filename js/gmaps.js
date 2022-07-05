<<<<<<< HEAD
"use strict";
(function(root, factory) {
  if(typeof exports === 'object') {
    module.exports = factory();
  }
  else if(typeof define === 'function' && define.amd) {
    define(['jquery', 'googlemaps!'], factory);
  }
  else {
    root.GMaps = factory();
  }


}(this, function() {

/*!
=======
"use strict"; !function (b, a) { "object" == typeof exports ? module.exports = a() : "function" == typeof define && define.amd ? define(["jquery", "googlemaps!"], a) : b.GMaps = a() }(this, function () {/*!
>>>>>>> parent of cc6f08b (gmap)
 * GMaps.js v0.4.25
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2017, Gustavo Leon
 * Released under the MIT License.
<<<<<<< HEAD
 */

var extend_object = function(obj, new_obj) {
  var name;

  if (obj === new_obj) {
    return obj;
  }

  for (name in new_obj) {
    if (new_obj[name] !== undefined) {
      obj[name] = new_obj[name];
    }
  }

  return obj;
};

var replace_object = function(obj, replace) {
  var name;

  if (obj === replace) {
    return obj;
  }

  for (name in replace) {
    if (obj[name] != undefined) {
      obj[name] = replace[name];
    }
  }

  return obj;
};

var array_map = function(array, callback) {
  var original_callback_params = Array.prototype.slice.call(arguments, 2),
      array_return = [],
      array_length = array.length,
      i;

  if (Array.prototype.map && array.map === Array.prototype.map) {
    array_return = Array.prototype.map.call(array, function(item) {
      var callback_params = original_callback_params.slice(0);
      callback_params.splice(0, 0, item);

      return callback.apply(this, callback_params);
    });
  }
  else {
    for (i = 0; i < array_length; i++) {
      callback_params = original_callback_params;
      callback_params.splice(0, 0, array[i]);
      array_return.push(callback.apply(this, callback_params));
    }
  }

  return array_return;
};

var array_flat = function(array) {
  var new_array = [],
      i;

  for (i = 0; i < array.length; i++) {
    new_array = new_array.concat(array[i]);
  }

  return new_array;
};

var coordsToLatLngs = function(coords, useGeoJSON) {
  var first_coord = coords[0],
      second_coord = coords[1];

  if (useGeoJSON) {
    first_coord = coords[1];
    second_coord = coords[0];
  }

  return new google.maps.LatLng(first_coord, second_coord);
};

var arrayToLatLng = function(coords, useGeoJSON) {
  var i;

  for (i = 0; i < coords.length; i++) {
    if (!(coords[i] instanceof google.maps.LatLng)) {
      if (coords[i].length > 0 && typeof(coords[i][0]) === "object") {
        coords[i] = arrayToLatLng(coords[i], useGeoJSON);
      }
      else {
        coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
      }
    }
  }

  return coords;
};

var getElementsByClassName = function (class_name, context) {
    var element,
        _class = class_name.replace('.', '');

    if ('jQuery' in this && context) {
        element = $("." + _class, context)[0];
    } else {
        element = document.getElementsByClassName(_class)[0];
    }
    return element;

};

var getElementById = function(id, context) {
  var element,
  id = id.replace('#', '');

  if ('jQuery' in window && context) {
    element = $('#' + id, context)[0];
  } else {
    element = document.getElementById(id);
  };

  return element;
};

var findAbsolutePosition = function(obj)  {
  var curleft = 0,
      curtop = 0;

  if (obj.getBoundingClientRect) {
      var rect = obj.getBoundingClientRect();
      var sx = -(window.scrollX ? window.scrollX : window.pageXOffset);
      var sy = -(window.scrollY ? window.scrollY : window.pageYOffset);

      return [(rect.left - sx), (rect.top - sy)];
  }

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }

  return [curleft, curtop];
};

var GMaps = (function(global) {
  "use strict";

  var doc = document;
  /**
   * Creates a new GMaps instance, including a Google Maps map.
   * @class GMaps
   * @constructs
   * @param {object} options - `options` accepts all the [MapOptions](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) and [events](https://developers.google.com/maps/documentation/javascript/reference#Map) listed in the Google Maps API. Also accepts:
   * * `lat` (number): Latitude of the map's center
   * * `lng` (number): Longitude of the map's center
   * * `el` (string or HTMLElement): container where the map will be rendered
   * * `markerClusterer` (function): A function to create a marker cluster. You can use MarkerClusterer or MarkerClustererPlus.
   */
  var GMaps = function(options) {

    if (!(typeof window.google === 'object' && window.google.maps)) {
      if (typeof window.console === 'object' && window.console.error) {
        console.error('Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js.');
      }

      return function() {};
    }

    if (!this) return new GMaps(options);

    options.zoom = options.zoom || 15;
    options.mapType = options.mapType || 'roadmap';

    var valueOrDefault = function(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    };

    var self = this,
        i,
        events_that_hide_context_menu = [
          'bounds_changed', 'center_changed', 'click', 'dblclick', 'drag',
          'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'projection_changed',
          'resize', 'tilesloaded', 'zoom_changed'
        ],
        events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'],
        options_to_be_deleted = ['el', 'lat', 'lng', 'mapType', 'width', 'height', 'markerClusterer', 'enableNewStyle'],
        identifier = options.el || options.div,
        markerClustererFunction = options.markerClusterer,
        mapType = google.maps.MapTypeId[options.mapType.toUpperCase()],
        map_center = new google.maps.LatLng(options.lat, options.lng),
        zoomControl = valueOrDefault(options.zoomControl, true),
        zoomControlOpt = options.zoomControlOpt || {
          style: 'DEFAULT',
          position: 'TOP_LEFT'
        },
        zoomControlStyle = zoomControlOpt.style || 'DEFAULT',
        zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT',
        panControl = valueOrDefault(options.panControl, true),
        mapTypeControl = valueOrDefault(options.mapTypeControl, true),
        scaleControl = valueOrDefault(options.scaleControl, true),
        streetViewControl = valueOrDefault(options.streetViewControl, true),
        overviewMapControl = valueOrDefault(overviewMapControl, true),
        map_options = {},
        map_base_options = {
          zoom: this.zoom,
          center: map_center,
          mapTypeId: mapType
        },
        map_controls_options = {
          panControl: panControl,
          zoomControl: zoomControl,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle[zoomControlStyle],
            position: google.maps.ControlPosition[zoomControlPosition]
          },
          mapTypeControl: mapTypeControl,
          scaleControl: scaleControl,
          streetViewControl: streetViewControl,
          overviewMapControl: overviewMapControl
        };

      if (typeof(options.el) === 'string' || typeof(options.div) === 'string') {
        if (identifier.indexOf("#") > -1) {
            /**
             * Container element
             *
             * @type {HTMLElement}
             */
            this.el = getElementById(identifier, options.context);
        } else {
            this.el = getElementsByClassName.apply(this, [identifier, options.context]);
        }
      } else {
          this.el = identifier;
      }

    if (typeof(this.el) === 'undefined' || this.el === null) {
      throw 'No element defined.';
    }

    window.context_menu = window.context_menu || {};
    window.context_menu[self.el.id] = {};

    /**
     * Collection of custom controls in the map UI
     *
     * @type {array}
     */
    this.controls = [];
    /**
     * Collection of map's overlays
     *
     * @type {array}
     */
    this.overlays = [];
    /**
     * Collection of KML/GeoRSS and FusionTable layers
     *
     * @type {array}
     */
    this.layers = [];
    /**
     * Collection of data layers (See {@link GMaps#addLayer})
     *
     * @type {object}
     */
    this.singleLayers = {};
    /**
     * Collection of map's markers
     *
     * @type {array}
     */
    this.markers = [];
    /**
     * Collection of map's lines
     *
     * @type {array}
     */
    this.polylines = [];
    /**
     * Collection of map's routes requested by {@link GMaps#getRoutes}, {@link GMaps#renderRoute}, {@link GMaps#drawRoute}, {@link GMaps#travelRoute} or {@link GMaps#drawSteppedRoute}
     *
     * @type {array}
     */
    this.routes = [];
    /**
     * Collection of map's polygons
     *
     * @type {array}
     */
    this.polygons = [];
    this.infoWindow = null;
    this.overlay_el = null;
    /**
     * Current map's zoom
     *
     * @type {number}
     */
    this.zoom = options.zoom;
    this.registered_events = {};

    this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
    this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;

    google.maps.visualRefresh = options.enableNewStyle;

    for (i = 0; i < options_to_be_deleted.length; i++) {
      delete options[options_to_be_deleted[i]];
    }

    if(options.disableDefaultUI != true) {
      map_base_options = extend_object(map_base_options, map_controls_options);
    }

    map_options = extend_object(map_base_options, options);

    for (i = 0; i < events_that_hide_context_menu.length; i++) {
      delete map_options[events_that_hide_context_menu[i]];
    }

    for (i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
      delete map_options[events_that_doesnt_hide_context_menu[i]];
    }

    /**
     * Google Maps map instance
     *
     * @type {google.maps.Map}
     */
    this.map = new google.maps.Map(this.el, map_options);

    if (markerClustererFunction) {
      /**
       * Marker Clusterer instance
       *
       * @type {object}
       */
      this.markerClusterer = markerClustererFunction.apply(this, [this.map]);
    }

    var buildContextMenuHTML = function(control, e) {
      var html = '',
          options = window.context_menu[self.el.id][control];

      for (var i in options){
        if (options.hasOwnProperty(i)) {
          var option = options[i];

          html += '<li><a id="' + control + '_' + i + '" href="#">' + option.title + '</a></li>';
        }
      }

      if (!getElementById('gmaps_context_menu')) return;

      var context_menu_element = getElementById('gmaps_context_menu');

      context_menu_element.innerHTML = html;

      var context_menu_items = context_menu_element.getElementsByTagName('a'),
          context_menu_items_count = context_menu_items.length,
          i;

      for (i = 0; i < context_menu_items_count; i++) {
        var context_menu_item = context_menu_items[i];

        var assign_menu_item_action = function(ev){
          ev.preventDefault();

          options[this.id.replace(control + '_', '')].action.apply(self, [e]);
          self.hideContextMenu();
        };

        google.maps.event.clearListeners(context_menu_item, 'click');
        google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
      }

      var position = findAbsolutePosition.apply(this, [self.el]),
          left = position[0] + e.pixel.x - 15,
          top = position[1] + e.pixel.y- 15;

      context_menu_element.style.left = left + "px";
      context_menu_element.style.top = top + "px";

      // context_menu_element.style.display = 'block';
    };

    this.buildContextMenu = function(control, e) {
      if (control === 'marker') {
        e.pixel = {};

        var overlay = new google.maps.OverlayView();
        overlay.setMap(self.map);

        overlay.draw = function() {
          var projection = overlay.getProjection(),
              position = e.marker.getPosition();

          e.pixel = projection.fromLatLngToContainerPixel(position);

          buildContextMenuHTML(control, e);
        };
      }
      else {
        buildContextMenuHTML(control, e);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      setTimeout(function() {
        context_menu_element.style.display = 'block';
      }, 0);
    };

    /**
     * Add a context menu for a map or a marker.
     *
     * @param {object} options - The `options` object should contain:
     * * `control` (string): Kind of control the context menu will be attached. Can be "map" or "marker".
     * * `options` (array): A collection of context menu items:
     *   * `title` (string): Item's title shown in the context menu.
     *   * `name` (string): Item's identifier.
     *   * `action` (function): Function triggered after selecting the context menu item.
     */
    this.setContextMenu = function(options) {
      window.context_menu[self.el.id][options.control] = {};

      var i,
          ul = doc.createElement('ul');

      for (i in options.options) {
        if (options.options.hasOwnProperty(i)) {
          var option = options.options[i];

          window.context_menu[self.el.id][options.control][option.name] = {
            title: option.title,
            action: option.action
          };
        }
      }

      ul.id = 'gmaps_context_menu';
      ul.style.display = 'none';
      ul.style.position = 'absolute';
      ul.style.minWidth = '100px';
      ul.style.background = 'white';
      ul.style.listStyle = 'none';
      ul.style.padding = '8px';
      ul.style.boxShadow = '2px 2px 6px #ccc';

      if (!getElementById('gmaps_context_menu')) {
        doc.body.appendChild(ul);
      }

      var context_menu_element = getElementById('gmaps_context_menu');

      google.maps.event.addDomListener(context_menu_element, 'mouseout', function(ev) {
        if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
          window.setTimeout(function(){
            context_menu_element.style.display = 'none';
          }, 400);
        }
      }, false);
    };

    /**
     * Hide the current context menu
     */
    this.hideContextMenu = function() {
      var context_menu_element = getElementById('gmaps_context_menu');

      if (context_menu_element) {
        context_menu_element.style.display = 'none';
      }
    };

    var setupListener = function(object, name) {
      google.maps.event.addListener(object, name, function(e){
        if (e == undefined) {
          e = this;
        }

        options[name].apply(this, [e]);

        self.hideContextMenu();
      });
    };

    //google.maps.event.addListener(this.map, 'idle', this.hideContextMenu);
    google.maps.event.addListener(this.map, 'zoom_changed', this.hideContextMenu);

    for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
      var name = events_that_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
      var name = events_that_doesnt_hide_context_menu[ev];

      if (name in options) {
        setupListener(this.map, name);
      }
    }

    google.maps.event.addListener(this.map, 'rightclick', function(e) {
      if (options.rightclick) {
        options.rightclick.apply(this, [e]);
      }

      if(window.context_menu[self.el.id]['map'] != undefined) {
        self.buildContextMenu('map', e);
      }
    });

    /**
     * Trigger a `resize` event, useful if you need to repaint the current map (for changes in the viewport or display / hide actions).
     */
    this.refresh = function() {
      google.maps.event.trigger(this.map, 'resize');
    };

    /**
     * Adjust the map zoom to include all the markers added in the map.
     */
    this.fitZoom = function() {
      var latLngs = [],
          markers_length = this.markers.length,
          i;

      for (i = 0; i < markers_length; i++) {
        if(typeof(this.markers[i].visible) === 'boolean' && this.markers[i].visible) {
          latLngs.push(this.markers[i].getPosition());
        }
      }

      this.fitLatLngBounds(latLngs);
    };

    /**
     * Adjust the map zoom to include all the coordinates in the `latLngs` array.
     *
     * @param {array} latLngs - Collection of `google.maps.LatLng` objects.
     */
    this.fitLatLngBounds = function(latLngs) {
      var total = latLngs.length,
          bounds = new google.maps.LatLngBounds(),
          i;

      for(i = 0; i < total; i++) {
        bounds.extend(latLngs[i]);
      }

      this.map.fitBounds(bounds);
    };

    /**
     * Center the map using the `lat` and `lng` coordinates.
     *
     * @param {number} lat - Latitude of the coordinate.
     * @param {number} lng - Longitude of the coordinate.
     * @param {function} [callback] - Callback that will be executed after the map is centered.
     */
    this.setCenter = function(lat, lng, callback) {
      this.map.panTo(new google.maps.LatLng(lat, lng));

      if (callback) {
        callback();
      }
    };

    /**
     * Return the HTML element container of the map.
     *
     * @returns {HTMLElement} the element container.
     */
    this.getElement = function() {
      return this.el;
    };

    /**
     * Increase the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed in.
     */
    this.zoomIn = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() + value;
      this.map.setZoom(this.zoom);
    };

    /**
     * Decrease the map's zoom.
     *
     * @param {number} [magnitude] - The number of times the map will be zoomed out.
     */
    this.zoomOut = function(value) {
      value = value || 1;

      this.zoom = this.map.getZoom() - value;
      this.map.setZoom(this.zoom);
    };

    var native_methods = [],
        method;

    for (method in this.map) {
      if (typeof(this.map[method]) == 'function' && !this[method]) {
        native_methods.push(method);
      }
    }

    for (i = 0; i < native_methods.length; i++) {
      (function(gmaps, scope, method_name) {
        gmaps[method_name] = function(){
          return scope[method_name].apply(scope, arguments);
        };
      })(this, this.map, native_methods[i]);
    }
  };

  return GMaps;
})(this);

GMaps.prototype.createControl = function(options) {
  var control = document.createElement('div');

  control.style.cursor = 'pointer';

  if (options.disableDefaultStyles !== true) {
    control.style.fontFamily = 'Roboto, Arial, sans-serif';
    control.style.fontSize = '11px';
    control.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  }

  for (var option in options.style) {
    control.style[option] = options.style[option];
  }

  if (options.id) {
    control.id = options.id;
  }

  if (options.title) {
    control.title = options.title;
  }

  if (options.classes) {
    control.className = options.classes;
  }

  if (options.content) {
    if (typeof options.content === 'string') {
      control.innerHTML = options.content;
    }
    else if (options.content instanceof HTMLElement) {
      control.appendChild(options.content);
    }
  }

  if (options.position) {
    control.position = google.maps.ControlPosition[options.position.toUpperCase()];
  }

  for (var ev in options.events) {
    (function(object, name) {
      google.maps.event.addDomListener(object, name, function(){
        options.events[name].apply(this, [this]);
      });
    })(control, ev);
  }

  control.index = 1;

  return control;
};

/**
 * Add a custom control to the map UI.
 *
 * @param {object} options - The `options` object should contain:
 * * `style` (object): The keys and values of this object should be valid CSS properties and values.
 * * `id` (string): The HTML id for the custom control.
 * * `classes` (string): A string containing all the HTML classes for the custom control.
 * * `content` (string or HTML element): The content of the custom control.
 * * `position` (string): Any valid [`google.maps.ControlPosition`](https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning) value, in lower or upper case.
 * * `events` (object): The keys of this object should be valid DOM events. The values should be functions.
 * * `disableDefaultStyles` (boolean): If false, removes the default styles for the controls like font (family and size), and box shadow.
 * @returns {HTMLElement}
 */
GMaps.prototype.addControl = function(options) {
  var control = this.createControl(options);

  this.controls.push(control);
  this.map.controls[control.position].push(control);

  return control;
};

/**
 * Remove a control from the map. `control` should be a control returned by `addControl()`.
 *
 * @param {HTMLElement} control - One of the controls returned by `addControl()`.
 * @returns {HTMLElement} the removed control.
 */
GMaps.prototype.removeControl = function(control) {
  var position = null,
      i;

  for (i = 0; i < this.controls.length; i++) {
    if (this.controls[i] == control) {
      position = this.controls[i].position;
      this.controls.splice(i, 1);
    }
  }

  if (position) {
    for (i = 0; i < this.map.controls.length; i++) {
      var controlsForPosition = this.map.controls[control.position];

      if (controlsForPosition.getAt(i) == control) {
        controlsForPosition.removeAt(i);

        break;
      }
    }
  }

  return control;
};

GMaps.prototype.createMarker = function(options) {
  if (options.lat == undefined && options.lng == undefined && options.position == undefined) {
    throw 'No latitude or longitude defined.';
  }

  var self = this,
      details = options.details,
      fences = options.fences,
      outside = options.outside,
      base_options = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      },
      marker_options = extend_object(base_options, options);

  delete marker_options.lat;
  delete marker_options.lng;
  delete marker_options.fences;
  delete marker_options.outside;

  var marker = new google.maps.Marker(marker_options);

  marker.fences = fences;

  if (options.infoWindow) {
    marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

    var info_window_events = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

    for (var ev = 0; ev < info_window_events.length; ev++) {
      (function(object, name) {
        if (options.infoWindow[name]) {
          google.maps.event.addListener(object, name, function(e){
            options.infoWindow[name].apply(this, [e]);
          });
        }
      })(marker.infoWindow, info_window_events[ev]);
    }
  }

  var marker_events = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'];

  var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

  for (var ev = 0; ev < marker_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this, [this]);
        });
      }
    })(marker, marker_events[ev]);
  }

  for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
    (function(map, object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(me){
          if(!me.pixel){
            me.pixel = map.getProjection().fromLatLngToPoint(me.latLng)
          }

          options[name].apply(this, [me]);
        });
      }
    })(this.map, marker, marker_events_with_mouse[ev]);
  }

  google.maps.event.addListener(marker, 'click', function() {
    this.details = details;

    if (options.click) {
      options.click.apply(this, [this]);
    }

    if (marker.infoWindow) {
      self.hideInfoWindows();
      marker.infoWindow.open(self.map, marker);
    }
  });

  google.maps.event.addListener(marker, 'rightclick', function(e) {
    e.marker = this;

    if (options.rightclick) {
      options.rightclick.apply(this, [e]);
    }

    if (window.context_menu[self.el.id]['marker'] != undefined) {
      self.buildContextMenu('marker', e);
    }
  });

  if (marker.fences) {
    google.maps.event.addListener(marker, 'dragend', function() {
      self.checkMarkerGeofence(marker, function(m, f) {
        outside(m, f);
      });
    });
  }

  return marker;
};

GMaps.prototype.addMarker = function(options) {
  var marker;
  if(options.hasOwnProperty('gm_accessors_')) {
    // Native google.maps.Marker object
    marker = options;
  }
  else {
    if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
      marker = this.createMarker(options);
    }
    else {
      throw 'No latitude or longitude defined.';
    }
  }

  marker.setMap(this.map);

  if(this.markerClusterer) {
    this.markerClusterer.addMarker(marker);
  }

  this.markers.push(marker);

  GMaps.fire('marker_added', marker, this);

  return marker;
};

GMaps.prototype.addMarkers = function(array) {
  for (var i = 0, marker; marker=array[i]; i++) {
    this.addMarker(marker);
  }

  return this.markers;
};

GMaps.prototype.hideInfoWindows = function() {
  for (var i = 0, marker; marker = this.markers[i]; i++){
    if (marker.infoWindow) {
      marker.infoWindow.close();
    }
  }
};

GMaps.prototype.removeMarker = function(marker) {
  for (var i = 0; i < this.markers.length; i++) {
    if (this.markers[i] === marker) {
      this.markers[i].setMap(null);
      this.markers.splice(i, 1);

      if(this.markerClusterer) {
        this.markerClusterer.removeMarker(marker);
      }

      GMaps.fire('marker_removed', marker, this);

      break;
    }
  }

  return marker;
};

GMaps.prototype.removeMarkers = function (collection) {
  var new_markers = [];

  if (typeof collection == 'undefined') {
    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      marker.setMap(null);

      GMaps.fire('marker_removed', marker, this);
    }

    if(this.markerClusterer && this.markerClusterer.clearMarkers) {
      this.markerClusterer.clearMarkers();
    }

    this.markers = new_markers;
  }
  else {
    for (var i = 0; i < collection.length; i++) {
      var index = this.markers.indexOf(collection[i]);

      if (index > -1) {
        var marker = this.markers[index];
        marker.setMap(null);

        if(this.markerClusterer) {
          this.markerClusterer.removeMarker(marker);
        }

        GMaps.fire('marker_removed', marker, this);
      }
    }

    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      if (marker.getMap() != null) {
        new_markers.push(marker);
      }
    }

    this.markers = new_markers;
  }
};

GMaps.prototype.drawOverlay = function(options) {
  var overlay = new google.maps.OverlayView(),
      auto_show = true;

  overlay.setMap(this.map);

  if (options.auto_show != null) {
    auto_show = options.auto_show;
  }

  overlay.onAdd = function() {
    var el = document.createElement('div');

    el.style.borderStyle = "none";
    el.style.borderWidth = "0px";
    el.style.position = "absolute";
    el.style.zIndex = 100;
    el.innerHTML = options.content;

    overlay.el = el;

    if (!options.layer) {
      options.layer = 'overlayLayer';
    }
    
    var panes = this.getPanes(),
        overlayLayer = panes[options.layer],
        stop_overlay_events = ['contextmenu', 'DOMMouseScroll', 'dblclick', 'mousedown'];

    overlayLayer.appendChild(el);

    for (var ev = 0; ev < stop_overlay_events.length; ev++) {
      (function(object, name) {
        google.maps.event.addDomListener(object, name, function(e){
          if (navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
            e.cancelBubble = true;
            e.returnValue = false;
          }
          else {
            e.stopPropagation();
          }
        });
      })(el, stop_overlay_events[ev]);
    }

    if (options.click) {
      panes.overlayMouseTarget.appendChild(overlay.el);
      google.maps.event.addDomListener(overlay.el, 'click', function() {
        options.click.apply(overlay, [overlay]);
      });
    }

    google.maps.event.trigger(this, 'ready');
  };

  overlay.draw = function() {
    var projection = this.getProjection(),
        pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

    options.horizontalOffset = options.horizontalOffset || 0;
    options.verticalOffset = options.verticalOffset || 0;

    var el = overlay.el,
        content = el.children[0],
        content_height = content.clientHeight,
        content_width = content.clientWidth;

    switch (options.verticalAlign) {
      case 'top':
        el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
        break;
      default:
      case 'middle':
        el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
        break;
      case 'bottom':
        el.style.top = (pixel.y + options.verticalOffset) + 'px';
        break;
    }

    switch (options.horizontalAlign) {
      case 'left':
        el.style.left = (pixel.x - content_width + options.horizontalOffset) + 'px';
        break;
      default:
      case 'center':
        el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + 'px';
        break;
      case 'right':
        el.style.left = (pixel.x + options.horizontalOffset) + 'px';
        break;
    }

    el.style.display = auto_show ? 'block' : 'none';

    if (!auto_show) {
      options.show.apply(this, [el]);
    }
  };

  overlay.onRemove = function() {
    var el = overlay.el;

    if (options.remove) {
      options.remove.apply(this, [el]);
    }
    else {
      overlay.el.parentNode.removeChild(overlay.el);
      overlay.el = null;
    }
  };

  this.overlays.push(overlay);
  return overlay;
};

GMaps.prototype.removeOverlay = function(overlay) {
  for (var i = 0; i < this.overlays.length; i++) {
    if (this.overlays[i] === overlay) {
      this.overlays[i].setMap(null);
      this.overlays.splice(i, 1);

      break;
    }
  }
};

GMaps.prototype.removeOverlays = function() {
  for (var i = 0, item; item = this.overlays[i]; i++) {
    item.setMap(null);
  }

  this.overlays = [];
};

GMaps.prototype.drawPolyline = function(options) {
  var path = [],
      points = options.path;

  if (points.length) {
    if (points[0][0] === undefined) {
      path = points;
    }
    else {
      for (var i = 0, latlng; latlng = points[i]; i++) {
        path.push(new google.maps.LatLng(latlng[0], latlng[1]));
      }
    }
  }

  var polyline_options = {
    map: this.map,
    path: path,
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight,
    geodesic: options.geodesic,
    clickable: true,
    editable: false,
    visible: true
  };

  if (options.hasOwnProperty("clickable")) {
    polyline_options.clickable = options.clickable;
  }

  if (options.hasOwnProperty("editable")) {
    polyline_options.editable = options.editable;
  }

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  if (options.hasOwnProperty("zIndex")) {
    polyline_options.zIndex = options.zIndex;
  }

  var polyline = new google.maps.Polyline(polyline_options);

  var polyline_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polyline_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polyline, polyline_events[ev]);
  }

  this.polylines.push(polyline);

  GMaps.fire('polyline_added', polyline, this);

  return polyline;
};

GMaps.prototype.removePolyline = function(polyline) {
  for (var i = 0; i < this.polylines.length; i++) {
    if (this.polylines[i] === polyline) {
      this.polylines[i].setMap(null);
      this.polylines.splice(i, 1);

      GMaps.fire('polyline_removed', polyline, this);

      break;
    }
  }
};

GMaps.prototype.removePolylines = function() {
  for (var i = 0, item; item = this.polylines[i]; i++) {
    item.setMap(null);
  }

  this.polylines = [];
};

GMaps.prototype.drawCircle = function(options) {
  options =  extend_object({
    map: this.map,
    center: new google.maps.LatLng(options.lat, options.lng)
  }, options);

  delete options.lat;
  delete options.lng;

  var polygon = new google.maps.Circle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawRectangle = function(options) {
  options = extend_object({
    map: this.map
  }, options);

  var latLngBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]),
    new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1])
  );

  options.bounds = latLngBounds;

  var polygon = new google.maps.Rectangle(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  return polygon;
};

GMaps.prototype.drawPolygon = function(options) {
  var useGeoJSON = false;

  if(options.hasOwnProperty("useGeoJSON")) {
    useGeoJSON = options.useGeoJSON;
  }

  delete options.useGeoJSON;

  options = extend_object({
    map: this.map
  }, options);

  if (useGeoJSON == false) {
    options.paths = [options.paths.slice(0)];
  }

  if (options.paths.length > 0) {
    if (options.paths[0].length > 0) {
      options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
    }
  }

  var polygon = new google.maps.Polygon(options),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

  for (var ev = 0; ev < polygon_events.length; ev++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(e){
          options[name].apply(this, [e]);
        });
      }
    })(polygon, polygon_events[ev]);
  }

  this.polygons.push(polygon);

  GMaps.fire('polygon_added', polygon, this);

  return polygon;
};

GMaps.prototype.removePolygon = function(polygon) {
  for (var i = 0; i < this.polygons.length; i++) {
    if (this.polygons[i] === polygon) {
      this.polygons[i].setMap(null);
      this.polygons.splice(i, 1);

      GMaps.fire('polygon_removed', polygon, this);

      break;
    }
  }
};

GMaps.prototype.removePolygons = function() {
  for (var i = 0, item; item = this.polygons[i]; i++) {
    item.setMap(null);
  }

  this.polygons = [];
};

GMaps.prototype.getFromFusionTables = function(options) {
  var events = options.events;

  delete options.events;

  var fusion_tables_options = options,
      layer = new google.maps.FusionTablesLayer(fusion_tables_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromFusionTables = function(options) {
  var layer = this.getFromFusionTables(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.getFromKML = function(options) {
  var url = options.url,
      events = options.events;

  delete options.url;
  delete options.events;

  var kml_options = options,
      layer = new google.maps.KmlLayer(url, kml_options);

  for (var ev in events) {
    (function(object, name) {
      google.maps.event.addListener(object, name, function(e) {
        events[name].apply(this, [e]);
      });
    })(layer, ev);
  }

  this.layers.push(layer);

  return layer;
};

GMaps.prototype.loadFromKML = function(options) {
  var layer = this.getFromKML(options);
  layer.setMap(this.map);

  return layer;
};

GMaps.prototype.addLayer = function(layerName, options) {
  //var default_layers = ['weather', 'clouds', 'traffic', 'transit', 'bicycling', 'panoramio', 'places'];
  options = options || {};
  var layer;

  switch(layerName) {
    case 'weather': this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
      break;
    case 'clouds': this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
      break;
    case 'traffic': this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
      break;
    case 'transit': this.singleLayers.transit = layer = new google.maps.TransitLayer();
      break;
    case 'bicycling': this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
      break;
    case 'panoramio':
        this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
        layer.setTag(options.filter);
        delete options.filter;

        //click event
        if (options.click) {
          google.maps.event.addListener(layer, 'click', function(event) {
            options.click(event);
            delete options.click;
          });
        }
      break;
      case 'places':
        this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);

        //search, nearbySearch, radarSearch callback, Both are the same
        if (options.search || options.nearbySearch || options.radarSearch) {
          var placeSearchRequest  = {
            bounds : options.bounds || null,
            keyword : options.keyword || null,
            location : options.location || null,
            name : options.name || null,
            radius : options.radius || null,
            rankBy : options.rankBy || null,
            types : options.types || null
          };

          if (options.radarSearch) {
            layer.radarSearch(placeSearchRequest, options.radarSearch);
          }

          if (options.search) {
            layer.search(placeSearchRequest, options.search);
          }

          if (options.nearbySearch) {
            layer.nearbySearch(placeSearchRequest, options.nearbySearch);
          }
        }

        //textSearch callback
        if (options.textSearch) {
          var textSearchRequest  = {
            bounds : options.bounds || null,
            location : options.location || null,
            query : options.query || null,
            radius : options.radius || null
          };

          layer.textSearch(textSearchRequest, options.textSearch);
        }
      break;
  }

  if (layer !== undefined) {
    if (typeof layer.setOptions == 'function') {
      layer.setOptions(options);
    }
    if (typeof layer.setMap == 'function') {
      layer.setMap(this.map);
    }

    return layer;
  }
};

GMaps.prototype.removeLayer = function(layer) {
  if (typeof(layer) == "string" && this.singleLayers[layer] !== undefined) {
     this.singleLayers[layer].setMap(null);

     delete this.singleLayers[layer];
  }
  else {
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i] === layer) {
        this.layers[i].setMap(null);
        this.layers.splice(i, 1);

        break;
      }
    }
  }
};

var travelMode, unitSystem;

GMaps.prototype.getRoutes = function(options) {
  switch (options.travelMode) {
    case 'bicycling':
      travelMode = google.maps.TravelMode.BICYCLING;
      break;
    case 'transit':
      travelMode = google.maps.TravelMode.TRANSIT;
      break;
    case 'driving':
      travelMode = google.maps.TravelMode.DRIVING;
      break;
    default:
      travelMode = google.maps.TravelMode.WALKING;
      break;
  }

  if (options.unitSystem === 'imperial') {
    unitSystem = google.maps.UnitSystem.IMPERIAL;
  }
  else {
    unitSystem = google.maps.UnitSystem.METRIC;
  }

  var base_options = {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: false,
        waypoints: []
      },
      request_options =  extend_object(base_options, options);

  request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
  request_options.destination = /string/.test(typeof options.destination) ? options.destination : new google.maps.LatLng(options.destination[0], options.destination[1]);
  request_options.travelMode = travelMode;
  request_options.unitSystem = unitSystem;

  delete request_options.callback;
  delete request_options.error;

  var self = this,
      routes = [],
      service = new google.maps.DirectionsService();

  service.route(request_options, function(result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      for (var r in result.routes) {
        if (result.routes.hasOwnProperty(r)) {
          routes.push(result.routes[r]);
        }
      }

      if (options.callback) {
        options.callback(routes, result, status);
      }
    }
    else {
      if (options.error) {
        options.error(result, status);
      }
    }
  });
};

GMaps.prototype.removeRoutes = function() {
  this.routes.length = 0;
};

GMaps.prototype.getElevations = function(options) {
  options = extend_object({
    locations: [],
    path : false,
    samples : 256
  }, options);

  if (options.locations.length > 0) {
    if (options.locations[0].length > 0) {
      options.locations = array_flat(array_map([options.locations], arrayToLatLng,  false));
    }
  }

  var callback = options.callback;
  delete options.callback;

  var service = new google.maps.ElevationService();

  //location request
  if (!options.path) {
    delete options.path;
    delete options.samples;

    service.getElevationForLocations(options, function(result, status) {
      if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  //path request
  } else {
    var pathRequest = {
      path : options.locations,
      samples : options.samples
    };

    service.getElevationAlongPath(pathRequest, function(result, status) {
     if (callback && typeof(callback) === "function") {
        callback(result, status);
      }
    });
  }
};

GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;

GMaps.prototype.renderRoute = function(options, renderOptions) {
  var self = this,
      panel = ((typeof renderOptions.panel === 'string') ? document.getElementById(renderOptions.panel.replace('#', '')) : renderOptions.panel),
      display;

  renderOptions.panel = panel;
  renderOptions = extend_object({
    map: this.map
  }, renderOptions);
  display = new google.maps.DirectionsRenderer(renderOptions);

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes, response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
      }
    }
  });
};

GMaps.prototype.drawRoute = function(options) {
  var self = this;

  this.getRoutes({
    origin: options.origin,
    destination: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    avoidHighways: options.avoidHighways,
    avoidTolls: options.avoidTolls,
    optimizeWaypoints: options.optimizeWaypoints,
    callback: function(routes) {
      if (routes.length > 0) {
        var polyline_options = {
          path: routes[routes.length - 1].overview_path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);

        if (options.callback) {
          options.callback(routes[routes.length - 1]);
        }
      }
    }
  });
};

GMaps.prototype.travelRoute = function(options) {
  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      unitSystem: options.unitSystem,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        options.step(step);
      }
    }
  }
};

GMaps.prototype.drawSteppedRoute = function(options) {
  var self = this;

  if (options.origin && options.destination) {
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      waypoints : options.waypoints,
      error: options.error,
      callback: function(e) {
        //start callback
        if (e.length > 0 && options.start) {
          options.start(e[e.length - 1]);
        }

        //step callback
        if (e.length > 0 && options.step) {
          var route = e[e.length - 1];
          if (route.legs.length > 0) {
            var steps = route.legs[0].steps;
            for (var i = 0, step; step = steps[i]; i++) {
              step.step_number = i;
              var polyline_options = {
                path: step.path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              };

              if (options.hasOwnProperty("icons")) {
                polyline_options.icons = options.icons;
              }

              self.drawPolyline(polyline_options);
              options.step(step, (route.legs[0].steps.length - 1));
            }
          }
        }

        //end callback
        if (e.length > 0 && options.end) {
           options.end(e[e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    if (options.route.legs.length > 0) {
      var steps = options.route.legs[0].steps;
      for (var i = 0, step; step = steps[i]; i++) {
        step.step_number = i;
        var polyline_options = {
          path: step.path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        };

        if (options.hasOwnProperty("icons")) {
          polyline_options.icons = options.icons;
        }

        self.drawPolyline(polyline_options);
        options.step(step);
      }
    }
  }
};

GMaps.Route = function(options) {
  this.origin = options.origin;
  this.destination = options.destination;
  this.waypoints = options.waypoints;

  this.map = options.map;
  this.route = options.route;
  this.step_count = 0;
  this.steps = this.route.legs[0].steps;
  this.steps_length = this.steps.length;

  var polyline_options = {
    path: new google.maps.MVCArray(),
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight
  };

  if (options.hasOwnProperty("icons")) {
    polyline_options.icons = options.icons;
  }

  this.polyline = this.map.drawPolyline(polyline_options).getPath();
};

GMaps.Route.prototype.getRoute = function(options) {
  var self = this;

  this.map.getRoutes({
    origin : this.origin,
    destination : this.destination,
    travelMode : options.travelMode,
    waypoints : this.waypoints || [],
    error: options.error,
    callback : function() {
      self.route = e[0];

      if (options.callback) {
        options.callback.call(self);
      }
    }
  });
};

GMaps.Route.prototype.back = function() {
  if (this.step_count > 0) {
    this.step_count--;
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.pop();
      }
    }
  }
};

GMaps.Route.prototype.forward = function() {
  if (this.step_count < this.steps_length) {
    var path = this.route.legs[0].steps[this.step_count].path;

    for (var p in path){
      if (path.hasOwnProperty(p)){
        this.polyline.push(path[p]);
      }
    }
    this.step_count++;
  }
};

GMaps.prototype.checkGeofence = function(lat, lng, fence) {
  return fence.containsLatLng(new google.maps.LatLng(lat, lng));
};

GMaps.prototype.checkMarkerGeofence = function(marker, outside_callback) {
  if (marker.fences) {
    for (var i = 0, fence; fence = marker.fences[i]; i++) {
      var pos = marker.getPosition();
      if (!this.checkGeofence(pos.lat(), pos.lng(), fence)) {
        outside_callback(marker, fence);
      }
    }
  }
};

GMaps.prototype.toImage = function(options) {
  var options = options || {},
      static_map_options = {};

  static_map_options['size'] = options['size'] || [this.el.clientWidth, this.el.clientHeight];
  static_map_options['lat'] = this.getCenter().lat();
  static_map_options['lng'] = this.getCenter().lng();

  if (this.markers.length > 0) {
    static_map_options['markers'] = [];
    
    for (var i = 0; i < this.markers.length; i++) {
      static_map_options['markers'].push({
        lat: this.markers[i].getPosition().lat(),
        lng: this.markers[i].getPosition().lng()
      });
    }
  }

  if (this.polylines.length > 0) {
    var polyline = this.polylines[0];
    
    static_map_options['polyline'] = {};
    static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
    static_map_options['polyline']['strokeColor'] = polyline.strokeColor
    static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity
    static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight
  }

  return GMaps.staticMapURL(static_map_options);
};

GMaps.staticMapURL = function(options){
  var parameters = [],
      data,
      static_root = (location.protocol === 'file:' ? 'http:' : location.protocol ) + '//maps.googleapis.com/maps/api/staticmap';

  if (options.url) {
    static_root = options.url;
    delete options.url;
  }

  static_root += '?';

  var markers = options.markers;
  
  delete options.markers;

  if (!markers && options.marker) {
    markers = [options.marker];
    delete options.marker;
  }

  var styles = options.styles;

  delete options.styles;

  var polyline = options.polyline;
  delete options.polyline;

  /** Map options **/
  if (options.center) {
    parameters.push('center=' + options.center);
    delete options.center;
  }
  else if (options.address) {
    parameters.push('center=' + options.address);
    delete options.address;
  }
  else if (options.lat) {
    parameters.push(['center=', options.lat, ',', options.lng].join(''));
    delete options.lat;
    delete options.lng;
  }
  else if (options.visible) {
    var visible = encodeURI(options.visible.join('|'));
    parameters.push('visible=' + visible);
  }

  var size = options.size;
  if (size) {
    if (size.join) {
      size = size.join('x');
    }
    delete options.size;
  }
  else {
    size = '630x300';
  }
  parameters.push('size=' + size);

  if (!options.zoom && options.zoom !== false) {
    options.zoom = 15;
  }

  var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
  delete options.sensor;
  parameters.push('sensor=' + sensor);

  for (var param in options) {
    if (options.hasOwnProperty(param)) {
      parameters.push(param + '=' + options[param]);
    }
  }

  /** Markers **/
  if (markers) {
    var marker, loc;

    for (var i = 0; data = markers[i]; i++) {
      marker = [];

      if (data.size && data.size !== 'normal') {
        marker.push('size:' + data.size);
        delete data.size;
      }
      else if (data.icon) {
        marker.push('icon:' + encodeURI(data.icon));
        delete data.icon;
      }

      if (data.color) {
        marker.push('color:' + data.color.replace('#', '0x'));
        delete data.color;
      }

      if (data.label) {
        marker.push('label:' + data.label[0].toUpperCase());
        delete data.label;
      }

      loc = (data.address ? data.address : data.lat + ',' + data.lng);
      delete data.address;
      delete data.lat;
      delete data.lng;

      for(var param in data){
        if (data.hasOwnProperty(param)) {
          marker.push(param + ':' + data[param]);
        }
      }

      if (marker.length || i === 0) {
        marker.push(loc);
        marker = marker.join('|');
        parameters.push('markers=' + encodeURI(marker));
      }
      // New marker without styles
      else {
        marker = parameters.pop() + encodeURI('|' + loc);
        parameters.push(marker);
      }
    }
  }

  /** Map Styles **/
  if (styles) {
    for (var i = 0; i < styles.length; i++) {
      var styleRule = [];
      if (styles[i].featureType){
        styleRule.push('feature:' + styles[i].featureType.toLowerCase());
      }

      if (styles[i].elementType) {
        styleRule.push('element:' + styles[i].elementType.toLowerCase());
      }

      for (var j = 0; j < styles[i].stylers.length; j++) {
        for (var p in styles[i].stylers[j]) {
          var ruleArg = styles[i].stylers[j][p];
          if (p == 'hue' || p == 'color') {
            ruleArg = '0x' + ruleArg.substring(1);
          }
          styleRule.push(p + ':' + ruleArg);
        }
      }

      var rule = styleRule.join('|');
      if (rule != '') {
        parameters.push('style=' + rule);
      }
    }
  }

  /** Polylines **/
  function parseColor(color, opacity) {
    if (color[0] === '#'){
      color = color.replace('#', '0x');

      if (opacity) {
        opacity = parseFloat(opacity);
        opacity = Math.min(1, Math.max(opacity, 0));
        if (opacity === 0) {
          return '0x00000000';
        }
        opacity = (opacity * 255).toString(16);
        if (opacity.length === 1) {
          opacity += opacity;
        }

        color = color.slice(0,8) + opacity;
      }
    }
    return color;
  }

  if (polyline) {
    data = polyline;
    polyline = [];

    if (data.strokeWeight) {
      polyline.push('weight:' + parseInt(data.strokeWeight, 10));
    }

    if (data.strokeColor) {
      var color = parseColor(data.strokeColor, data.strokeOpacity);
      polyline.push('color:' + color);
    }

    if (data.fillColor) {
      var fillcolor = parseColor(data.fillColor, data.fillOpacity);
      polyline.push('fillcolor:' + fillcolor);
    }

    var path = data.path;
    if (path.join) {
      for (var j=0, pos; pos=path[j]; j++) {
        polyline.push(pos.join(','));
      }
    }
    else {
      polyline.push('enc:' + path);
    }

    polyline = polyline.join('|');
    parameters.push('path=' + encodeURI(polyline));
  }

  /** Retina support **/
  var dpi = window.devicePixelRatio || 1;
  parameters.push('scale=' + dpi);

  parameters = parameters.join('&');
  return static_root + parameters;
};

GMaps.prototype.addMapType = function(mapTypeId, options) {
  if (options.hasOwnProperty("getTileUrl") && typeof(options["getTileUrl"]) == "function") {
    options.tileSize = options.tileSize || new google.maps.Size(256, 256);

    var mapType = new google.maps.ImageMapType(options);

    this.map.mapTypes.set(mapTypeId, mapType);
  }
  else {
    throw "'getTileUrl' function required.";
  }
};

GMaps.prototype.addOverlayMapType = function(options) {
  if (options.hasOwnProperty("getTile") && typeof(options["getTile"]) == "function") {
    var overlayMapTypeIndex = options.index;

    delete options.index;

    this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
  }
  else {
    throw "'getTile' function required.";
  }
};

GMaps.prototype.removeOverlayMapType = function(overlayMapTypeIndex) {
  this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
};

GMaps.prototype.addStyle = function(options) {
  var styledMapType = new google.maps.StyledMapType(options.styles, { name: options.styledMapName });

  this.map.mapTypes.set(options.mapTypeId, styledMapType);
};

GMaps.prototype.setStyle = function(mapTypeId) {
  this.map.setMapTypeId(mapTypeId);
};

GMaps.prototype.createPanorama = function(streetview_options) {
  if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
    streetview_options.lat = this.getCenter().lat();
    streetview_options.lng = this.getCenter().lng();
  }

  this.panorama = GMaps.createPanorama(streetview_options);

  this.map.setStreetView(this.panorama);

  return this.panorama;
};

GMaps.createPanorama = function(options) {
  var el = getElementById(options.el, options.context);

  options.position = new google.maps.LatLng(options.lat, options.lng);

  delete options.el;
  delete options.context;
  delete options.lat;
  delete options.lng;

  var streetview_events = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'resize', 'visible_changed'],
      streetview_options = extend_object({visible : true}, options);

  for (var i = 0; i < streetview_events.length; i++) {
    delete streetview_options[streetview_events[i]];
  }

  var panorama = new google.maps.StreetViewPanorama(el, streetview_options);

  for (var i = 0; i < streetview_events.length; i++) {
    (function(object, name) {
      if (options[name]) {
        google.maps.event.addListener(object, name, function(){
          options[name].apply(this);
        });
      }
    })(panorama, streetview_events[i]);
  }

  return panorama;
};

GMaps.prototype.on = function(event_name, handler) {
  return GMaps.on(event_name, this, handler);
};

GMaps.prototype.off = function(event_name) {
  GMaps.off(event_name, this);
};

GMaps.prototype.once = function(event_name, handler) {
  return GMaps.once(event_name, this, handler);
};

GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocated', 'geolocation_failed'];

GMaps.on = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    return google.maps.event.addListener(object, event_name, handler);
  }
  else {
    var registered_event = {
      handler : handler,
      eventName : event_name
    };

    object.registered_events[event_name] = object.registered_events[event_name] || [];
    object.registered_events[event_name].push(registered_event);

    return registered_event;
  }
};

GMaps.off = function(event_name, object) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map; 
    google.maps.event.clearListeners(object, event_name);
  }
  else {
    object.registered_events[event_name] = [];
  }
};

GMaps.once = function(event_name, object, handler) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    if(object instanceof GMaps) object = object.map;
    return google.maps.event.addListenerOnce(object, event_name, handler);
  }
};

GMaps.fire = function(event_name, object, scope) {
  if (GMaps.custom_events.indexOf(event_name) == -1) {
    google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
  }
  else {
    if(event_name in scope.registered_events) {
      var firing_events = scope.registered_events[event_name];

      for(var i = 0; i < firing_events.length; i++) {
        (function(handler, scope, object) {
          handler.apply(scope, [object]);
        })(firing_events[i]['handler'], scope, object);
      }
    }
  }
};

GMaps.geolocate = function(options) {
  var complete_callback = options.always || options.complete;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      options.success(position);

      if (complete_callback) {
        complete_callback();
      }
    }, function(error) {
      options.error(error);

      if (complete_callback) {
        complete_callback();
      }
    }, options.options);
  }
  else {
    options.not_supported();

    if (complete_callback) {
      complete_callback();
    }
  }
};

GMaps.geocode = function(options) {
  this.geocoder = new google.maps.Geocoder();
  var callback = options.callback;
  if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
    options.latLng = new google.maps.LatLng(options.lat, options.lng);
  }

  delete options.lat;
  delete options.lng;
  delete options.callback;
  
  this.geocoder.geocode(options, function(results, status) {
    callback(results, status);
  });
};

if (typeof window.google === 'object' && window.google.maps) {
  //==========================
  // Polygon containsLatLng
  // https://github.com/tparkin/Google-Maps-Point-in-Polygon
  // Poygon getBounds extension - google-maps-extensions
  // http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
  if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function(latLng) {
      var bounds = new google.maps.LatLngBounds();
      var paths = this.getPaths();
      var path;

      for (var p = 0; p < paths.getLength(); p++) {
        path = paths.getAt(p);
        for (var i = 0; i < path.getLength(); i++) {
          bounds.extend(path.getAt(i));
        }
      }

      return bounds;
    };
  }

  if (!google.maps.Polygon.prototype.containsLatLng) {
    // Polygon containsLatLng - method to determine if a latLng is within a polygon
    google.maps.Polygon.prototype.containsLatLng = function(latLng) {
      // Exclude points outside of bounds as there is no way they are in the poly
      var bounds = this.getBounds();

      if (bounds !== null && !bounds.contains(latLng)) {
        return false;
      }

      // Raycast point in polygon method
      var inPoly = false;

      var numPaths = this.getPaths().getLength();
      for (var p = 0; p < numPaths; p++) {
        var path = this.getPaths().getAt(p);
        var numPoints = path.getLength();
        var j = numPoints - 1;

        for (var i = 0; i < numPoints; i++) {
          var vertex1 = path.getAt(i);
          var vertex2 = path.getAt(j);

          if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
            if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
              inPoly = !inPoly;
            }
          }

          j = i;
        }
      }

      return inPoly;
    };
  }

  if (!google.maps.Circle.prototype.containsLatLng) {
    google.maps.Circle.prototype.containsLatLng = function(latLng) {
      if (google.maps.geometry) {
        return google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
      }
      else {
        return true;
      }
    };
  }

  google.maps.Rectangle.prototype.containsLatLng = function(latLng) {
    return this.getBounds().contains(latLng);
  };

  google.maps.LatLngBounds.prototype.containsLatLng = function(latLng) {
    return this.contains(latLng);
  };

  google.maps.Marker.prototype.setFences = function(fences) {
    this.fences = fences;
  };

  google.maps.Marker.prototype.addFence = function(fence) {
    this.fences.push(fence);
  };

  google.maps.Marker.prototype.getId = function() {
    return this['__gm_id'];
  };
}

//==========================
// Array indexOf
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
          throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
          return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
          n = Number(arguments[1]);
          if (n != n) { // shortcut for verifying if it's NaN
              n = 0;
          } else if (n != 0 && n != Infinity && n != -Infinity) {
              n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
              return k;
          }
      }
      return -1;
  }
}

return GMaps;
}));
=======
 */ var d, e, b, c, f = function (a, b) { var c; if (a === b) return a; for (c in b) void 0 !== b[c] && (a[c] = b[c]); return a }, g = function (a, d) { var b, e = Array.prototype.slice.call(arguments, 2), c = [], f = a.length; if (Array.prototype.map && a.map === Array.prototype.map) c = Array.prototype.map.call(a, function (b) { var a = e.slice(0); return a.splice(0, 0, b), d.apply(this, a) }); else for (b = 0; b < f; b++)(callback_params = e).splice(0, 0, a[b]), c.push(d.apply(this, callback_params)); return c }, h = function (c) { var a, b = []; for (a = 0; a < c.length; a++)b = b.concat(c[a]); return b }, i = function (a, d) { var b = a[0], c = a[1]; return d && (b = a[1], c = a[0]), new google.maps.LatLng(b, c) }, j = function (b, c) { var a; for (a = 0; a < b.length; a++)b[a] instanceof google.maps.LatLng || (b[a].length > 0 && "object" == typeof b[a][0] ? b[a] = j(b[a], c) : b[a] = i(b[a], c)); return b }, k = function (c, a) { var b = c.replace(".", ""); return "jQuery" in this && a ? $("." + b, a)[0] : document.getElementsByClassName(b)[0] }, l = function (a, b) { var a = a.replace("#", ""); return "jQuery" in window && b ? $("#" + a, b)[0] : document.getElementById(a) }, m = function (a) { var b = 0, c = 0; if (a.getBoundingClientRect) { var d = a.getBoundingClientRect(), e = -(window.scrollX ? window.scrollX : window.pageXOffset), f = -(window.scrollY ? window.scrollY : window.pageYOffset); return [d.left - e, d.top - f] } if (a.offsetParent) do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent) return [b, c] }, a = (b = document, c = function (a) { if (!("object" == typeof window.google && window.google.maps)) return "object" == typeof window.console && window.console.error && console.error("Google Maps API is required. Please register the following JavaScript library https://maps.googleapis.com/maps/api/js."), function () { }; if (!this) return new c(a); a.zoom = a.zoom || 15, a.mapType = a.mapType || "roadmap"; var d, g = function (a, b) { return void 0 === a ? b : a }, x = this, i = ["bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "idle", "maptypeid_changed", "projection_changed", "resize", "tilesloaded", "zoom_changed"], j = ["mousemove", "mouseout", "mouseover"], s = ["el", "lat", "lng", "mapType", "width", "height", "markerClusterer", "enableNewStyle"], n = a.el || a.div, t = a.markerClusterer, y = google.maps.MapTypeId[a.mapType.toUpperCase()], z = new google.maps.LatLng(a.lat, a.lng), A = g(a.zoomControl, !0), u = a.zoomControlOpt || { style: "DEFAULT", position: "TOP_LEFT" }, B = u.style || "DEFAULT", C = u.position || "TOP_LEFT", D = g(a.panControl, !0), E = g(a.mapTypeControl, !0), F = g(a.scaleControl, !0), G = g(a.streetViewControl, !0), v = g(v, !0), o = {}, q = { zoom: this.zoom, center: z, mapTypeId: y }, H = { panControl: D, zoomControl: A, zoomControlOptions: { style: google.maps.ZoomControlStyle[B], position: google.maps.ControlPosition[C] }, mapTypeControl: E, scaleControl: F, streetViewControl: G, overviewMapControl: v }; if ("string" == typeof a.el || "string" == typeof a.div ? n.indexOf("#") > -1 ? this.el = l(n, a.context) : this.el = k.apply(this, [n, a.context]) : this.el = n, void 0 === this.el || null === this.el) throw "No element defined."; for (d = 0, window.context_menu = window.context_menu || {}, window.context_menu[x.el.id] = {}, this.controls = [], this.overlays = [], this.layers = [], this.singleLayers = {}, this.markers = [], this.polylines = [], this.routes = [], this.polygons = [], this.infoWindow = null, this.overlay_el = null, this.zoom = a.zoom, this.registered_events = {}, this.el.style.width = a.width || this.el.scrollWidth || this.el.offsetWidth, this.el.style.height = a.height || this.el.scrollHeight || this.el.offsetHeight, google.maps.visualRefresh = a.enableNewStyle; d < s.length; d++)delete a[s[d]]; for (!0 != a.disableDefaultUI && (q = f(q, H)), o = f(q, a), d = 0; d < i.length; d++)delete o[i[d]]; for (d = 0; d < j.length; d++)delete o[j[d]]; this.map = new google.maps.Map(this.el, o), t && (this.markerClusterer = t.apply(this, [this.map])); var I = function (d, e) { var f = "", c = window.context_menu[x.el.id][d]; for (var a in c) if (c.hasOwnProperty(a)) { var j = c[a]; f += '<li><a id="' + d + "_" + a + '" href="#">' + j.title + "</a></li>" } if (l("gmaps_context_menu")) { var b = l("gmaps_context_menu"); b.innerHTML = f; var a, g = b.getElementsByTagName("a"), k = g.length; for (a = 0; a < k; a++) { var h = g[a], n = function (a) { a.preventDefault(), c[this.id.replace(d + "_", "")].action.apply(x, [e]), x.hideContextMenu() }; google.maps.event.clearListeners(h, "click"), google.maps.event.addDomListenerOnce(h, "click", n, !1) } var i = m.apply(this, [x.el]), o = i[0] + e.pixel.x - 15, p = i[1] + e.pixel.y - 15; b.style.left = o + "px", b.style.top = p + "px" } }; this.buildContextMenu = function (a, b) { if ("marker" === a) { b.pixel = {}; var c = new google.maps.OverlayView; c.setMap(x.map), c.draw = function () { var d = c.getProjection(), e = b.marker.getPosition(); b.pixel = d.fromLatLngToContainerPixel(e), I(a, b) } } else I(a, b); var d = l("gmaps_context_menu"); setTimeout(function () { d.style.display = "block" }, 0) }, this.setContextMenu = function (c) { window.context_menu[x.el.id][c.control] = {}; var d, a = b.createElement("ul"); for (d in c.options) if (c.options.hasOwnProperty(d)) { var e = c.options[d]; window.context_menu[x.el.id][c.control][e.name] = { title: e.title, action: e.action } } a.id = "gmaps_context_menu", a.style.display = "none", a.style.position = "absolute", a.style.minWidth = "100px", a.style.background = "white", a.style.listStyle = "none", a.style.padding = "8px", a.style.boxShadow = "2px 2px 6px #ccc", l("gmaps_context_menu") || b.body.appendChild(a); var f = l("gmaps_context_menu"); google.maps.event.addDomListener(f, "mouseout", function (a) { a.relatedTarget && this.contains(a.relatedTarget) || window.setTimeout(function () { f.style.display = "none" }, 400) }, !1) }, this.hideContextMenu = function () { var a = l("gmaps_context_menu"); a && (a.style.display = "none") }; var w = function (b, c) { google.maps.event.addListener(b, c, function (b) { void 0 == b && (b = this), a[c].apply(this, [b]), x.hideContextMenu() }) }; google.maps.event.addListener(this.map, "zoom_changed", this.hideContextMenu); for (var e = 0; e < i.length; e++) { var h = i[e]; h in a && w(this.map, h) } for (var e = 0; e < j.length; e++) { var h = j[e]; h in a && w(this.map, h) } google.maps.event.addListener(this.map, "rightclick", function (b) { a.rightclick && a.rightclick.apply(this, [b]), void 0 != window.context_menu[x.el.id].map && x.buildContextMenu("map", b) }), this.refresh = function () { google.maps.event.trigger(this.map, "resize") }, this.fitZoom = function () { var a, b = [], c = this.markers.length; for (a = 0; a < c; a++)"boolean" == typeof this.markers[a].visible && this.markers[a].visible && b.push(this.markers[a].getPosition()); this.fitLatLngBounds(b) }, this.fitLatLngBounds = function (b) { var a, d = b.length, c = new google.maps.LatLngBounds; for (a = 0; a < d; a++)c.extend(b[a]); this.map.fitBounds(c) }, this.setCenter = function (b, c, a) { this.map.panTo(new google.maps.LatLng(b, c)), a && a() }, this.getElement = function () { return this.el }, this.zoomIn = function (a) { a = a || 1, this.zoom = this.map.getZoom() + a, this.map.setZoom(this.zoom) }, this.zoomOut = function (a) { a = a || 1, this.zoom = this.map.getZoom() - a, this.map.setZoom(this.zoom) }; var p, r = []; for (p in this.map) "function" != typeof this.map[p] || this[p] || r.push(p); for (d = 0; d < r.length; d++)!function (a, c, b) { a[b] = function () { return c[b].apply(c, arguments) } }(this, this.map, r[d]) }); return a.prototype.createControl = function (a) { var b = document.createElement("div"); for (var c in b.style.cursor = "pointer", !0 !== a.disableDefaultStyles && (b.style.fontFamily = "Roboto, Arial, sans-serif", b.style.fontSize = "11px", b.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px"), a.style) b.style[c] = a.style[c]; for (var d in a.id && (b.id = a.id), a.title && (b.title = a.title), a.classes && (b.className = a.classes), a.content && ("string" == typeof a.content ? b.innerHTML = a.content : a.content instanceof HTMLElement && b.appendChild(a.content)), a.position && (b.position = google.maps.ControlPosition[a.position.toUpperCase()]), a.events) !function (b, c) { google.maps.event.addDomListener(b, c, function () { a.events[c].apply(this, [this]) }) }(b, d); return b.index = 1, b }, a.prototype.addControl = function (b) { var a = this.createControl(b); return this.controls.push(a), this.map.controls[a.position].push(a), a }, a.prototype.removeControl = function (b) { var a, c = null; for (a = 0; a < this.controls.length; a++)this.controls[a] == b && (c = this.controls[a].position, this.controls.splice(a, 1)); if (c) for (a = 0; a < this.map.controls.length; a++) { var d = this.map.controls[b.position]; if (d.getAt(a) == b) { d.removeAt(a); break } } return b }, a.prototype.createMarker = function (a) { if (void 0 == a.lat && void 0 == a.lng && void 0 == a.position) throw "No latitude or longitude defined."; var k = this, l = a.details, i = a.fences, m = a.outside, j = { position: new google.maps.LatLng(a.lat, a.lng), map: null }, d = f(j, a); delete d.lat, delete d.lng, delete d.fences, delete d.outside; var c = new google.maps.Marker(d); if (c.fences = i, a.infoWindow) { c.infoWindow = new google.maps.InfoWindow(a.infoWindow); for (var e = ["closeclick", "content_changed", "domready", "position_changed", "zindex_changed"], b = 0; b < e.length; b++)!function (c, b) { a.infoWindow[b] && google.maps.event.addListener(c, b, function (c) { a.infoWindow[b].apply(this, [c]) }) }(c.infoWindow, e[b]) } for (var g = ["animation_changed", "clickable_changed", "cursor_changed", "draggable_changed", "flat_changed", "icon_changed", "position_changed", "shadow_changed", "shape_changed", "title_changed", "visible_changed", "zindex_changed"], h = ["dblclick", "drag", "dragend", "dragstart", "mousedown", "mouseout", "mouseover", "mouseup"], b = 0; b < g.length; b++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function () { a[b].apply(this, [this]) }) }(c, g[b]); for (var b = 0; b < h.length; b++)!function (d, c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { c.pixel || (c.pixel = d.getProjection().fromLatLngToPoint(c.latLng)), a[b].apply(this, [c]) }) }(this.map, c, h[b]); return google.maps.event.addListener(c, "click", function () { this.details = l, a.click && a.click.apply(this, [this]), c.infoWindow && (k.hideInfoWindows(), c.infoWindow.open(k.map, c)) }), google.maps.event.addListener(c, "rightclick", function (b) { b.marker = this, a.rightclick && a.rightclick.apply(this, [b]), void 0 != window.context_menu[k.el.id].marker && k.buildContextMenu("marker", b) }), c.fences && google.maps.event.addListener(c, "dragend", function () { k.checkMarkerGeofence(c, function (a, b) { m(a, b) }) }), c }, a.prototype.addMarker = function (c) { var b; if (c.hasOwnProperty("gm_accessors_")) b = c; else if (c.hasOwnProperty("lat") && c.hasOwnProperty("lng") || c.position) b = this.createMarker(c); else throw "No latitude or longitude defined."; return b.setMap(this.map), this.markerClusterer && this.markerClusterer.addMarker(b), this.markers.push(b), a.fire("marker_added", b, this), b }, a.prototype.addMarkers = function (c) { for (var a, b = 0; a = c[b]; b++)this.addMarker(a); return this.markers }, a.prototype.hideInfoWindows = function () { for (var a, b = 0; a = this.markers[b]; b++)a.infoWindow && a.infoWindow.close() }, a.prototype.removeMarker = function (c) { for (var b = 0; b < this.markers.length; b++)if (this.markers[b] === c) { this.markers[b].setMap(null), this.markers.splice(b, 1), this.markerClusterer && this.markerClusterer.removeMarker(c), a.fire("marker_removed", c, this); break } return c }, a.prototype.removeMarkers = function (d) { var e = []; if (void 0 === d) { for (var b = 0; b < this.markers.length; b++) { var c = this.markers[b]; c.setMap(null), a.fire("marker_removed", c, this) } this.markerClusterer && this.markerClusterer.clearMarkers && this.markerClusterer.clearMarkers(), this.markers = e } else { for (var b = 0; b < d.length; b++) { var f = this.markers.indexOf(d[b]); if (f > -1) { var c = this.markers[f]; c.setMap(null), this.markerClusterer && this.markerClusterer.removeMarker(c), a.fire("marker_removed", c, this) } } for (var b = 0; b < this.markers.length; b++) { var c = this.markers[b]; null != c.getMap() && e.push(c) } this.markers = e } }, a.prototype.drawOverlay = function (b) { var a = new google.maps.OverlayView, c = !0; return a.setMap(this.map), null != b.auto_show && (c = b.auto_show), a.onAdd = function () { var e, f, c = document.createElement("div"); c.style.borderStyle = "none", c.style.borderWidth = "0px", c.style.position = "absolute", c.style.zIndex = 100, c.innerHTML = b.content, a.el = c, b.layer || (b.layer = "overlayLayer"); var g = this.getPanes(), i = g[b.layer], h = ["contextmenu", "DOMMouseScroll", "dblclick", "mousedown"]; i.appendChild(c); for (var d = 0; d < h.length; d++)e = c, f = h[d], google.maps.event.addDomListener(e, f, function (a) { -1 != navigator.userAgent.toLowerCase().indexOf("msie") && document.all ? (a.cancelBubble = !0, a.returnValue = !1) : a.stopPropagation() }); b.click && (g.overlayMouseTarget.appendChild(a.el), google.maps.event.addDomListener(a.el, "click", function () { b.click.apply(a, [a]) })), google.maps.event.trigger(this, "ready") }, a.draw = function () { var e = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(b.lat, b.lng)); b.horizontalOffset = b.horizontalOffset || 0, b.verticalOffset = b.verticalOffset || 0; var d = a.el, f = d.children[0], g = f.clientHeight, h = f.clientWidth; switch (b.verticalAlign) { case "top": d.style.top = e.y - g + b.verticalOffset + "px"; break; default: case "middle": d.style.top = e.y - g / 2 + b.verticalOffset + "px"; break; case "bottom": d.style.top = e.y + b.verticalOffset + "px" }switch (b.horizontalAlign) { case "left": d.style.left = e.x - h + b.horizontalOffset + "px"; break; default: case "center": d.style.left = e.x - h / 2 + b.horizontalOffset + "px"; break; case "right": d.style.left = e.x + b.horizontalOffset + "px" }d.style.display = c ? "block" : "none", c || b.show.apply(this, [d]) }, a.onRemove = function () { var c = a.el; b.remove ? b.remove.apply(this, [c]) : (a.el.parentNode.removeChild(a.el), a.el = null) }, this.overlays.push(a), a }, a.prototype.removeOverlay = function (b) { for (var a = 0; a < this.overlays.length; a++)if (this.overlays[a] === b) { this.overlays[a].setMap(null), this.overlays.splice(a, 1); break } }, a.prototype.removeOverlays = function () { for (var a, b = 0; a = this.overlays[b]; b++)a.setMap(null); this.overlays = [] }, a.prototype.drawPolyline = function (b) { var f = [], d = b.path; if (d.length) { if (void 0 === d[0][0]) f = d; else for (var g, i = 0; g = d[i]; i++)f.push(new google.maps.LatLng(g[0], g[1])) } var c = { map: this.map, path: f, strokeColor: b.strokeColor, strokeOpacity: b.strokeOpacity, strokeWeight: b.strokeWeight, geodesic: b.geodesic, clickable: !0, editable: !1, visible: !0 }; b.hasOwnProperty("clickable") && (c.clickable = b.clickable), b.hasOwnProperty("editable") && (c.editable = b.editable), b.hasOwnProperty("icons") && (c.icons = b.icons), b.hasOwnProperty("zIndex") && (c.zIndex = b.zIndex); for (var e = new google.maps.Polyline(c), j = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], h = 0; h < j.length; h++)!function (c, a) { b[a] && google.maps.event.addListener(c, a, function (c) { b[a].apply(this, [c]) }) }(e, j[h]); return this.polylines.push(e), a.fire("polyline_added", e, this), e }, a.prototype.removePolyline = function (c) { for (var b = 0; b < this.polylines.length; b++)if (this.polylines[b] === c) { this.polylines[b].setMap(null), this.polylines.splice(b, 1), a.fire("polyline_removed", c, this); break } }, a.prototype.removePolylines = function () { for (var a, b = 0; a = this.polylines[b]; b++)a.setMap(null); this.polylines = [] }, a.prototype.drawCircle = function (a) { delete (a = f({ map: this.map, center: new google.maps.LatLng(a.lat, a.lng) }, a)).lat, delete a.lng; for (var b = new google.maps.Circle(a), d = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], c = 0; c < d.length; c++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { a[b].apply(this, [c]) }) }(b, d[c]); return this.polygons.push(b), b }, a.prototype.drawRectangle = function (a) { a = f({ map: this.map }, a); var e = new google.maps.LatLngBounds(new google.maps.LatLng(a.bounds[0][0], a.bounds[0][1]), new google.maps.LatLng(a.bounds[1][0], a.bounds[1][1])); a.bounds = e; for (var b = new google.maps.Rectangle(a), d = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], c = 0; c < d.length; c++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function (c) { a[b].apply(this, [c]) }) }(b, d[c]); return this.polygons.push(b), b }, a.prototype.drawPolygon = function (b) { var d = !1; b.hasOwnProperty("useGeoJSON") && (d = b.useGeoJSON), delete b.useGeoJSON, b = f({ map: this.map }, b), !1 == d && (b.paths = [b.paths.slice(0)]), b.paths.length > 0 && b.paths[0].length > 0 && (b.paths = h(g(b.paths, j, d))); for (var c = new google.maps.Polygon(b), i = ["click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "rightclick"], e = 0; e < i.length; e++)!function (c, a) { b[a] && google.maps.event.addListener(c, a, function (c) { b[a].apply(this, [c]) }) }(c, i[e]); return this.polygons.push(c), a.fire("polygon_added", c, this), c }, a.prototype.removePolygon = function (c) { for (var b = 0; b < this.polygons.length; b++)if (this.polygons[b] === c) { this.polygons[b].setMap(null), this.polygons.splice(b, 1), a.fire("polygon_removed", c, this); break } }, a.prototype.removePolygons = function () { for (var a, b = 0; a = this.polygons[b]; b++)a.setMap(null); this.polygons = [] }, a.prototype.getFromFusionTables = function (a) { var c = a.events; delete a.events; var b = new google.maps.FusionTablesLayer(a); for (var d in c) !function (a, b) { google.maps.event.addListener(a, b, function (a) { c[b].apply(this, [a]) }) }(b, d); return this.layers.push(b), b }, a.prototype.loadFromFusionTables = function (b) { var a = this.getFromFusionTables(b); return a.setMap(this.map), a }, a.prototype.getFromKML = function (a) { var c = a.url, d = a.events; delete a.url, delete a.events; var b = new google.maps.KmlLayer(c, a); for (var e in d) !function (a, b) { google.maps.event.addListener(a, b, function (a) { d[b].apply(this, [a]) }) }(b, e); return this.layers.push(b), b }, a.prototype.loadFromKML = function (b) { var a = this.getFromKML(b); return a.setMap(this.map), a }, a.prototype.addLayer = function (d, a) { switch (a = a || {}, d) { case "weather": this.singleLayers.weather = b = new google.maps.weather.WeatherLayer; break; case "clouds": this.singleLayers.clouds = b = new google.maps.weather.CloudLayer; break; case "traffic": this.singleLayers.traffic = b = new google.maps.TrafficLayer; break; case "transit": this.singleLayers.transit = b = new google.maps.TransitLayer; break; case "bicycling": this.singleLayers.bicycling = b = new google.maps.BicyclingLayer; break; case "panoramio": this.singleLayers.panoramio = b = new google.maps.panoramio.PanoramioLayer, b.setTag(a.filter), delete a.filter, a.click && google.maps.event.addListener(b, "click", function (b) { a.click(b), delete a.click }); break; case "places": if (this.singleLayers.places = b = new google.maps.places.PlacesService(this.map), a.search || a.nearbySearch || a.radarSearch) { var b, c = { bounds: a.bounds || null, keyword: a.keyword || null, location: a.location || null, name: a.name || null, radius: a.radius || null, rankBy: a.rankBy || null, types: a.types || null }; a.radarSearch && b.radarSearch(c, a.radarSearch), a.search && b.search(c, a.search), a.nearbySearch && b.nearbySearch(c, a.nearbySearch) } if (a.textSearch) { var e = { bounds: a.bounds || null, location: a.location || null, query: a.query || null, radius: a.radius || null }; b.textSearch(e, a.textSearch) } }if (void 0 !== b) return "function" == typeof b.setOptions && b.setOptions(a), "function" == typeof b.setMap && b.setMap(this.map), b }, a.prototype.removeLayer = function (a) { if ("string" == typeof a && void 0 !== this.singleLayers[a]) this.singleLayers[a].setMap(null), delete this.singleLayers[a]; else for (var b = 0; b < this.layers.length; b++)if (this.layers[b] === a) { this.layers[b].setMap(null), this.layers.splice(b, 1); break } }, a.prototype.getRoutes = function (a) { switch (a.travelMode) { case "bicycling": d = google.maps.TravelMode.BICYCLING; break; case "transit": d = google.maps.TravelMode.TRANSIT; break; case "driving": d = google.maps.TravelMode.DRIVING; break; default: d = google.maps.TravelMode.WALKING }e = "imperial" === a.unitSystem ? google.maps.UnitSystem.IMPERIAL : google.maps.UnitSystem.METRIC; var b = f({ avoidHighways: !1, avoidTolls: !1, optimizeWaypoints: !1, waypoints: [] }, a); b.origin = /string/.test(typeof a.origin) ? a.origin : new google.maps.LatLng(a.origin[0], a.origin[1]), b.destination = /string/.test(typeof a.destination) ? a.destination : new google.maps.LatLng(a.destination[0], a.destination[1]), b.travelMode = d, b.unitSystem = e, delete b.callback, delete b.error; var c = []; new google.maps.DirectionsService().route(b, function (b, d) { if (d === google.maps.DirectionsStatus.OK) { for (var e in b.routes) b.routes.hasOwnProperty(e) && c.push(b.routes[e]); a.callback && a.callback(c, b, d) } else a.error && a.error(b, d) }) }, a.prototype.removeRoutes = function () { this.routes.length = 0 }, a.prototype.getElevations = function (a) { (a = f({ locations: [], path: !1, samples: 256 }, a)).locations.length > 0 && a.locations[0].length > 0 && (a.locations = h(g([a.locations], j, !1))); var d = a.callback; delete a.callback; var b = new google.maps.ElevationService; if (a.path) { var c = { path: a.locations, samples: a.samples }; b.getElevationAlongPath(c, function (a, b) { d && "function" == typeof d && d(a, b) }) } else delete a.path, delete a.samples, b.getElevationForLocations(a, function (a, b) { d && "function" == typeof d && d(a, b) }) }, a.prototype.cleanRoute = a.prototype.removePolylines, a.prototype.renderRoute = function (a, b) { var c, d = "string" == typeof b.panel ? document.getElementById(b.panel.replace("#", "")) : b.panel; b.panel = d, b = f({ map: this.map }, b), c = new google.maps.DirectionsRenderer(b), this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, avoidHighways: a.avoidHighways, avoidTolls: a.avoidTolls, optimizeWaypoints: a.optimizeWaypoints, callback: function (d, a, b) { b === google.maps.DirectionsStatus.OK && c.setDirections(a) } }) }, a.prototype.drawRoute = function (a) { var b = this; this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, avoidHighways: a.avoidHighways, avoidTolls: a.avoidTolls, optimizeWaypoints: a.optimizeWaypoints, callback: function (c) { if (c.length > 0) { var d = { path: c[c.length - 1].overview_path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (d.icons = a.icons), b.drawPolyline(d), a.callback && a.callback(c[c.length - 1]) } } }) }, a.prototype.travelRoute = function (a) { if (a.origin && a.destination) this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, unitSystem: a.unitSystem, error: a.error, callback: function (b) { if (b.length > 0 && a.start && a.start(b[b.length - 1]), b.length > 0 && a.step) { var c = b[b.length - 1]; if (c.legs.length > 0) for (var d, f = c.legs[0].steps, e = 0; d = f[e]; e++)d.step_number = e, a.step(d, c.legs[0].steps.length - 1) } b.length > 0 && a.end && a.end(b[b.length - 1]) } }); else if (a.route && a.route.legs.length > 0) for (var b, d = a.route.legs[0].steps, c = 0; b = d[c]; c++)b.step_number = c, a.step(b) }, a.prototype.drawSteppedRoute = function (a) { var e = this; if (a.origin && a.destination) this.getRoutes({ origin: a.origin, destination: a.destination, travelMode: a.travelMode, waypoints: a.waypoints, error: a.error, callback: function (b) { if (b.length > 0 && a.start && a.start(b[b.length - 1]), b.length > 0 && a.step) { var d = b[b.length - 1]; if (d.legs.length > 0) for (var c, h = d.legs[0].steps, f = 0; c = h[f]; f++) { c.step_number = f; var g = { path: c.path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (g.icons = a.icons), e.drawPolyline(g), a.step(c, d.legs[0].steps.length - 1) } } b.length > 0 && a.end && a.end(b[b.length - 1]) } }); else if (a.route && a.route.legs.length > 0) for (var b, f = a.route.legs[0].steps, c = 0; b = f[c]; c++) { b.step_number = c; var d = { path: b.path, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (d.icons = a.icons), e.drawPolyline(d), a.step(b) } }, a.Route = function (a) { this.origin = a.origin, this.destination = a.destination, this.waypoints = a.waypoints, this.map = a.map, this.route = a.route, this.step_count = 0, this.steps = this.route.legs[0].steps, this.steps_length = this.steps.length; var b = { path: new google.maps.MVCArray, strokeColor: a.strokeColor, strokeOpacity: a.strokeOpacity, strokeWeight: a.strokeWeight }; a.hasOwnProperty("icons") && (b.icons = a.icons), this.polyline = this.map.drawPolyline(b).getPath() }, a.Route.prototype.getRoute = function (a) { var b = this; this.map.getRoutes({ origin: this.origin, destination: this.destination, travelMode: a.travelMode, waypoints: this.waypoints || [], error: a.error, callback: function () { b.route = e[0], a.callback && a.callback.call(b) } }) }, a.Route.prototype.back = function () { if (this.step_count > 0) { this.step_count--; var a = this.route.legs[0].steps[this.step_count].path; for (var b in a) a.hasOwnProperty(b) && this.polyline.pop() } }, a.Route.prototype.forward = function () { if (this.step_count < this.steps_length) { var a = this.route.legs[0].steps[this.step_count].path; for (var b in a) a.hasOwnProperty(b) && this.polyline.push(a[b]); this.step_count++ } }, a.prototype.checkGeofence = function (a, b, c) { return c.containsLatLng(new google.maps.LatLng(a, b)) }, a.prototype.checkMarkerGeofence = function (a, e) { if (a.fences) for (var b, c = 0; b = a.fences[c]; c++) { var d = a.getPosition(); this.checkGeofence(d.lat(), d.lng(), b) || e(a, b) } }, a.prototype.toImage = function (e) { var e = e || {}, b = {}; if (b.size = e.size || [this.el.clientWidth, this.el.clientHeight], b.lat = this.getCenter().lat(), b.lng = this.getCenter().lng(), this.markers.length > 0) { b.markers = []; for (var c = 0; c < this.markers.length; c++)b.markers.push({ lat: this.markers[c].getPosition().lat(), lng: this.markers[c].getPosition().lng() }) } if (this.polylines.length > 0) { var d = this.polylines[0]; b.polyline = {}, b.polyline.path = google.maps.geometry.encoding.encodePath(d.getPath()), b.polyline.strokeColor = d.strokeColor, b.polyline.strokeOpacity = d.strokeOpacity, b.polyline.strokeWeight = d.strokeWeight } return a.staticMapURL(b) }, a.staticMapURL = function (a) { var b, c = [], m = ("file:" === location.protocol ? "http:" : location.protocol) + "//maps.googleapis.com/maps/api/staticmap"; a.url && (m = a.url, delete a.url), m += "?"; var j = a.markers; delete a.markers, !j && a.marker && (j = [a.marker], delete a.marker); var f = a.styles; delete a.styles; var e = a.polyline; if (delete a.polyline, a.center) c.push("center=" + a.center), delete a.center; else if (a.address) c.push("center=" + a.address), delete a.address; else if (a.lat) c.push(["center=", a.lat, ",", a.lng].join("")), delete a.lat, delete a.lng; else if (a.visible) { var s = encodeURI(a.visible.join("|")); c.push("visible=" + s) } var i = a.size; i ? (i.join && (i = i.join("x")), delete a.size) : i = "630x300", c.push("size=" + i), a.zoom || !1 === a.zoom || (a.zoom = 15); var t = !a.hasOwnProperty("sensor") || !!a.sensor; for (var g in delete a.sensor, c.push("sensor=" + t), a) a.hasOwnProperty(g) && c.push(g + "=" + a[g]); if (j) for (var d = 0; b = j[d]; d++) { for (var g in x = [], b.size && "normal" !== b.size ? (x.push("size:" + b.size), delete b.size) : b.icon && (x.push("icon:" + encodeURI(b.icon)), delete b.icon), b.color && (x.push("color:" + b.color.replace("#", "0x")), delete b.color), b.label && (x.push("label:" + b.label[0].toUpperCase()), delete b.label), y = b.address ? b.address : b.lat + "," + b.lng, delete b.address, delete b.lat, delete b.lng, b) b.hasOwnProperty(g) && x.push(g + ":" + b[g]); x.length || 0 === d ? (x.push(y), x = x.join("|"), c.push("markers=" + encodeURI(x))) : (x = c.pop() + encodeURI("|" + y), c.push(x)) } if (f) for (var d = 0; d < f.length; d++) { var k = []; f[d].featureType && k.push("feature:" + f[d].featureType.toLowerCase()), f[d].elementType && k.push("element:" + f[d].elementType.toLowerCase()); for (var h = 0; h < f[d].stylers.length; h++)for (var l in f[d].stylers[h]) { var n = f[d].stylers[h][l]; ("hue" == l || "color" == l) && (n = "0x" + n.substring(1)), k.push(l + ":" + n) } var p = k.join("|"); "" != p && c.push("style=" + p) } function q(b, a) { if ("#" === b[0] && (b = b.replace("#", "0x"), a)) { if (0 === (a = Math.min(1, Math.max(a = parseFloat(a), 0)))) return "0x00000000"; 1 === (a = (255 * a).toString(16)).length && (a += a), b = b.slice(0, 8) + a } return b } if (e) { if (b = e, e = [], b.strokeWeight && e.push("weight:" + parseInt(b.strokeWeight, 10)), b.strokeColor) { var u = q(b.strokeColor, b.strokeOpacity); e.push("color:" + u) } if (b.fillColor) { var v = q(b.fillColor, b.fillOpacity); e.push("fillcolor:" + v) } var o = b.path; if (o.join) for (var x, y, r, h = 0; r = o[h]; h++)e.push(r.join(",")); else e.push("enc:" + o); e = e.join("|"), c.push("path=" + encodeURI(e)) } var w = window.devicePixelRatio || 1; return c.push("scale=" + w), m + (c = c.join("&")) }, a.prototype.addMapType = function (b, a) { if (a.hasOwnProperty("getTileUrl") && "function" == typeof a.getTileUrl) { a.tileSize = a.tileSize || new google.maps.Size(256, 256); var c = new google.maps.ImageMapType(a); this.map.mapTypes.set(b, c) } else throw "'getTileUrl' function required." }, a.prototype.addOverlayMapType = function (a) { if (a.hasOwnProperty("getTile") && "function" == typeof a.getTile) { var b = a.index; delete a.index, this.map.overlayMapTypes.insertAt(b, a) } else throw "'getTile' function required." }, a.prototype.removeOverlayMapType = function (a) { this.map.overlayMapTypes.removeAt(a) }, a.prototype.addStyle = function (a) { var b = new google.maps.StyledMapType(a.styles, { name: a.styledMapName }); this.map.mapTypes.set(a.mapTypeId, b) }, a.prototype.setStyle = function (a) { this.map.setMapTypeId(a) }, a.prototype.createPanorama = function (b) { return b.hasOwnProperty("lat") && b.hasOwnProperty("lng") || (b.lat = this.getCenter().lat(), b.lng = this.getCenter().lng()), this.panorama = a.createPanorama(b), this.map.setStreetView(this.panorama), this.panorama }, a.createPanorama = function (a) { var g = l(a.el, a.context); a.position = new google.maps.LatLng(a.lat, a.lng), delete a.el, delete a.context, delete a.lat, delete a.lng; for (var c = ["closeclick", "links_changed", "pano_changed", "position_changed", "pov_changed", "resize", "visible_changed"], d = f({ visible: !0 }, a), b = 0; b < c.length; b++)delete d[c[b]]; for (var e = new google.maps.StreetViewPanorama(g, d), b = 0; b < c.length; b++)!function (c, b) { a[b] && google.maps.event.addListener(c, b, function () { a[b].apply(this) }) }(e, c[b]); return e }, a.prototype.on = function (b, c) { return a.on(b, this, c) }, a.prototype.off = function (b) { a.off(b, this) }, a.prototype.once = function (b, c) { return a.once(b, this, c) }, a.custom_events = ["marker_added", "marker_removed", "polyline_added", "polyline_removed", "polygon_added", "polygon_removed", "geolocated", "geolocation_failed"], a.on = function (c, b, d) { if (-1 == a.custom_events.indexOf(c)) return b instanceof a && (b = b.map), google.maps.event.addListener(b, c, d); var e = { handler: d, eventName: c }; return b.registered_events[c] = b.registered_events[c] || [], b.registered_events[c].push(e), e }, a.off = function (c, b) { -1 == a.custom_events.indexOf(c) ? (b instanceof a && (b = b.map), google.maps.event.clearListeners(b, c)) : b.registered_events[c] = [] }, a.once = function (c, b, d) { if (-1 == a.custom_events.indexOf(c)) return b instanceof a && (b = b.map), google.maps.event.addListenerOnce(b, c, d) }, a.fire = function (b, e, c) { if (-1 == a.custom_events.indexOf(b)) google.maps.event.trigger(e, b, Array.prototype.slice.apply(arguments).slice(2)); else if (b in c.registered_events) for (var f = c.registered_events[b], d = 0; d < f.length; d++)!function (a, b, c) { a.apply(b, [c]) }(f[d].handler, c, e) }, a.geolocate = function (a) { var b = a.always || a.complete; navigator.geolocation ? navigator.geolocation.getCurrentPosition(function (c) { a.success(c), b && b() }, function (c) { a.error(c), b && b() }, a.options) : (a.not_supported(), b && b()) }, a.geocode = function (a) { this.geocoder = new google.maps.Geocoder; var b = a.callback; a.hasOwnProperty("lat") && a.hasOwnProperty("lng") && (a.latLng = new google.maps.LatLng(a.lat, a.lng)), delete a.lat, delete a.lng, delete a.callback, this.geocoder.geocode(a, function (a, c) { b(a, c) }) }, "object" == typeof window.google && window.google.maps && (google.maps.Polygon.prototype.getBounds || (google.maps.Polygon.prototype.getBounds = function (f) { for (var a, d = new google.maps.LatLngBounds, e = this.getPaths(), b = 0; b < e.getLength(); b++) { a = e.getAt(b); for (var c = 0; c < a.getLength(); c++)d.extend(a.getAt(c)) } return d }), google.maps.Polygon.prototype.containsLatLng || (google.maps.Polygon.prototype.containsLatLng = function (a) { var h = this.getBounds(); if (null !== h && !h.contains(a)) return !1; for (var e = !1, k = this.getPaths().getLength(), f = 0; f < k; f++)for (var g = this.getPaths().getAt(f), i = g.getLength(), j = i - 1, c = 0; c < i; c++) { var b = g.getAt(c), d = g.getAt(j); (b.lng() < a.lng() && d.lng() >= a.lng() || d.lng() < a.lng() && b.lng() >= a.lng()) && b.lat() + (a.lng() - b.lng()) / (d.lng() - b.lng()) * (d.lat() - b.lat()) < a.lat() && (e = !e), j = c } return e }), google.maps.Circle.prototype.containsLatLng || (google.maps.Circle.prototype.containsLatLng = function (a) { return !google.maps.geometry || google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), a) <= this.getRadius() }), google.maps.Rectangle.prototype.containsLatLng = function (a) { return this.getBounds().contains(a) }, google.maps.LatLngBounds.prototype.containsLatLng = function (a) { return this.contains(a) }, google.maps.Marker.prototype.setFences = function (a) { this.fences = a }, google.maps.Marker.prototype.addFence = function (a) { this.fences.push(a) }, google.maps.Marker.prototype.getId = function () { return this["__gm_id"] }), Array.prototype.indexOf || (Array.prototype.indexOf = function (e) { if (this == null) throw new TypeError; var d = Object(this), c = d.length >>> 0; if (0 === c) return -1; var a = 0; if (arguments.length > 1 && (a = Number(arguments[1]), a != a ? a = 0 : 0 != a && a != 1 / 0 && a != -1 / 0 && (a = (a > 0 || -1) * Math.floor(Math.abs(a)))), a >= c) return -1; for (var b = a >= 0 ? a : Math.max(c - Math.abs(a), 0); b < c; b++)if (b in d && d[b] === e) return b; return -1 }), a
})
>>>>>>> parent of cc6f08b (gmap)
