(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Do(parent) {
	var listeners = [];
	this.do = function(callback) {
		listeners.push(callback);
	};
	this.undo = function(callback) {
		listeners.splice(listeners.indexOf(callback), 1);
	};
	this.fire = function() {
		for (var v = 0; v < listeners.length; v++) {
			listeners[v].apply(parent, arguments);
		}
	};
}

if (typeof(module) === 'object') module.exports = Do;

},{}],2:[function(require,module,exports){
module.exports={
  "name": "timeliner_gui",
  "version": "0.0.2 Kai1 by https://github.com/akjava",
  "description": "Timeliner GUI",
  "main": "timeliner.js",
  "scripts": {
    "build": "browserify src/*.js --full-path=false -o timeliner_gui.js",
    "mini": "browserify src/*.js -g uglifyify --full-path=false -o timeliner_gui.min.js",
    "watch": "watchify src/*.js -o timeliner_gui.js -v",
    "start": "npm run watch",
    "test": "echo \"Error: no tests :(\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tschw/timeliner_gui.git"
  },
  "keywords": [
    "timeline",
    "animation",
    "keyframe",
    "controls",
    "gui"
  ],
  "author": "tschw (the fork)",
  "contributors": [
  	"Joshua 'zz85' Koo (original author)"
  ],
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/tschw/timeliner_gui/issues"
  },
  "homepage": "https://github.com/tschw/timeliner_gui",
  "devDependencies": {
    "do.js": "^1.0.0",
    "uglifyify": "^2.6.0"
  }
}

},{}],3:[function(require,module,exports){
/**************************/
// Dispatcher
/**************************/

function Dispatcher() {

	var event_listeners = {

	};

	function on(type, listener) {
		if (!(type in event_listeners)) {
			event_listeners[type] = [];
		}
		var listeners = event_listeners[type];
		listeners.push(listener);
	}

	function fire(type) {
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		var listeners = event_listeners[type];
		if (!listeners) return;
		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners[i];
			listener.apply(listener, args);
		}
	}

	this.on = on;
	this.fire = fire;

}

module.exports = Dispatcher;
},{}],4:[function(require,module,exports){
var LayoutConstants = require('./layout_constants'),
	LayerUI = require('./layer_view'),
	IconButton = require('./widget/icon_button'),
	style = require('./utils').style,
	Theme = require('./theme'),
	STORAGE_PREFIX = require('./utils').STORAGE_PREFIX,
	NumberUI = require('./widget/number')
	;

function LayerCabinet(context) {

	var div = document.createElement('div');

	var top = document.createElement('div');
	top.style.cssText = 'margin: 0px; top: 0; left: 0; height: ' + LayoutConstants.MARKER_TRACK_HEIGHT + 'px';
	// top.style.textAlign = 'right';

	var layer_scroll = document.createElement('div');
	style(layer_scroll, {
		position: 'absolute',
		top: LayoutConstants.MARKER_TRACK_HEIGHT + 'px',
		// height: (height - LayoutConstants.MARKER_TRACK_HEIGHT) + 'px'
		left: 0,
		right: 0,
		bottom: 0,
		overflow: 'hidden'
	});

	div.appendChild(layer_scroll);

	var playing = false;


	var button_styles = {
		width: '22px',
		height: '22px',
		padding: '2px'
	};

	var op_button_styles = {
		width: '32px',
		padding: '3px 4px 3px 4px'
	};


	var dispatcher = context.dispatcher,
		controller = context.controller;

	var play_button = new IconButton(16, 'play', "Play", dispatcher);
	style(play_button.dom, button_styles, { marginTop: '2px' } );
	play_button.onClick(function(e) {
		e.preventDefault();
		dispatcher.fire('controls.toggle_play');
	});

	var stop_button = new IconButton(16, 'stop', "Stop", dispatcher);
	style(stop_button.dom, button_styles, { marginTop: '2px' } );
	stop_button.onClick(function(e) {
		dispatcher.fire('controls.stop');
	});
/*

	var undo_button = new IconButton(16, 'undo', 'undo', dispatcher);
	style(undo_button.dom, op_button_styles);
	undo_button.onClick(function() {
		dispatcher.fire('controls.undo');
	});

	var redo_button = new IconButton(16, 'repeat', 'redo', dispatcher);
	style(redo_button.dom, op_button_styles);
	redo_button.onClick(function() {
		dispatcher.fire('controls.redo');
	});
*/
	var range = document.createElement('input');
	range.type = "range";
	range.value = 0;
	range.min = -1;
	range.max = +1;
	range.step = 0.125;

	style(range, {
		width: '80px',
		margin: '0px',
		marginLeft: '2px',
		marginRight: '2px'
	});

	var draggingRange = 0;

	range.addEventListener('mousedown', function() {
		draggingRange = 1;
	});

	range.addEventListener('mouseup', function() {
		draggingRange = 0;
		changeRange();
	});

	range.addEventListener('mousemove', function() {
		if (!draggingRange) return;
		changeRange();
	});

	div.appendChild(top);

	var time_options = {
		min: 0,
		step: 0.125
	};
	var currentTime = new NumberUI(time_options);
	var totalTime = new NumberUI(time_options);

	currentTime.onChange.do(function(value, done) {
		dispatcher.fire('time.update', value);
		currentTime.paint();
	});

	totalTime.onChange.do(function(value, done) {
		dispatcher.fire('totalTime.update', value);
		totalTime.paint();
	});

	// Play Controls
	top.appendChild(currentTime.dom);
	top.appendChild(document.createTextNode('/')); // 0:00:00 / 0:10:00
	top.appendChild(totalTime.dom)
	top.appendChild(play_button.dom);
	top.appendChild(stop_button.dom);
	top.appendChild(range);


	var operations_div = document.createElement('div');
	style(operations_div, {
		marginTop: '4px',
		// borderBottom: '1px solid ' + Theme.b
	});
	top.appendChild(operations_div);
	// top.appendChild(document.createElement('br'));

/*
	// open _alt
	var file_open = new IconButton(16, 'folder_open_alt', 'Open', dispatcher);
	style(file_open.dom, op_button_styles);
	operations_div.appendChild(file_open.dom);

	function populateOpen() {
		while (dropdown.length) {
			dropdown.remove(0);
		}

		var option;
		option = document.createElement('option');
		option.text = 'New';
		option.value = '*new*';
		dropdown.add(option);

		option = document.createElement('option');
		option.text = 'Import JSON';
		option.value = '*import*';
		dropdown.add(option);

		// Doesn't work
		// option = document.createElement('option');
		// option.text = 'Select File';
		// option.value = '*select*';
		// dropdown.add(option);

		option = document.createElement('option');
		option.text = '==Open==';
		option.disabled = true;
		option.selected = true;
		dropdown.add(option);

		var regex = new RegExp(STORAGE_PREFIX + '(.*)');
		for (var key in localStorage) {
			// console.log(key);

			var match = regex.exec(key);
			if (match) {
				option = document.createElement('option');
				option.text = match[1];

				dropdown.add(option);
			}
		}

	}

	// listen on other tabs
	window.addEventListener('storage', function(e) {
		var regex = new RegExp(STORAGE_PREFIX + '(.*)');
		if (regex.exec(e.key)) {
			populateOpen();
		}
	});

	dispatcher.on('save:done', populateOpen);

	var dropdown = document.createElement('select');

	style(dropdown, {
		position: 'absolute',
		// right: 0,
		// margin: 0,
		opacity: 0,
		width: '16px',
		height: '16px',
		// zIndex: 1,
	});

	dropdown.addEventListener('change', function(e) {
		// console.log('changed', dropdown.length, dropdown.value);

		switch (dropdown.value) {
			case '*new*':
				dispatcher.fire('new');
				break;
			case '*import*':
				dispatcher.fire('import');
				break;
			case '*select*':
				dispatcher.fire('openfile');
				break;
			default:
				dispatcher.fire('open', dropdown.value);
				break;
		}
	});

	file_open.dom.insertBefore(dropdown, file_open.dom.firstChild);

	populateOpen();

	// // json import
	// var import_json = new IconButton(16, 'signin', 'Import JSON', dispatcher);
	// operations_div.appendChild(import_json.dom);
	// import_json.onClick(function() {
	// 	dispatcher.fire('import');
	// });

	// // new
	// var file_alt = new IconButton(16, 'file_alt', 'New', dispatcher);
	// operations_div.appendChild(file_alt.dom);
	// save

	var save = new IconButton(16, 'save', 'Save', dispatcher);
	style(save.dom, op_button_styles);
	operations_div.appendChild(save.dom);
	save.onClick(function() {
		dispatcher.fire('save');
	});

	// save as
	var save_as = new IconButton(16, 'paste', 'Save as', dispatcher);
	style(save_as.dom, op_button_styles);
	operations_div.appendChild(save_as.dom);
	save_as.onClick(function() {
		dispatcher.fire('save_as');
	});
*/
	// download json (export)
	var download_alt = new IconButton(16, 'download_alt', 'Download animation', dispatcher);
	style(download_alt.dom, op_button_styles);
	operations_div.appendChild(download_alt.dom);
	download_alt.onClick(function() {
		dispatcher.fire('export');
	});

	var upload_alt = new IconButton(16, 'upload_alt', 'Upload animation', dispatcher);
	style(upload_alt.dom, op_button_styles);
	operations_div.appendChild(upload_alt.dom);
	upload_alt.onClick(function() {
		dispatcher.fire('openfile');
	});
/*
	var span = document.createElement('span');
	span.style.width = '20px';
	span.style.display = 'inline-block';
	operations_div.appendChild(span);

	operations_div.appendChild(undo_button.dom);
	operations_div.appendChild(redo_button.dom);
	operations_div.appendChild(document.createElement('br'));
*/
	// Cloud Download / Upload edit pencil

	/*
	// // show layer
	// var eye_open = new IconButton(16, 'eye_open', 'eye_open', dispatcher);
	// operations_div.appendChild(eye_open.dom);

	// // hide / disable layer
	// var eye_close = new IconButton(16, 'eye_close', 'eye_close', dispatcher);
	// operations_div.appendChild(eye_close.dom);


	// remove layer
	var minus = new IconButton(16, 'minus', 'minus', dispatcher);
	operations_div.appendChild(minus.dom);

	// check
	var ok = new IconButton(16, 'ok', 'ok', dispatcher);
	operations_div.appendChild(ok.dom);

	// cross
	var remove = new IconButton(16, 'remove', 'remove', dispatcher);
	operations_div.appendChild(remove.dom);

	*/


	// range.addEventListener('change', changeRange);


	function convertPercentToTime(t) {
		var min_time = 1;
		var max_time = 10 * 60; // 10 minutes
		var v = 500 / (t * (max_time - min_time) + min_time);
		return v;
	}

	function convertTimeToPercent(v) {
		var min_time = 1;
		var max_time = 10 * 60; // 10 minutes
		var t  = ((500 / v) - min_time)  / (max_time - min_time);
		return t;
	}

	function changeRange() {
		//console.log("range.value", range.value);

		dispatcher.fire('update.scale', 6 * Math.pow(100, range.value));
	}

	var layer_uis = [];
	var unused_layers = [];

	this.layers = layer_uis;

	this.setControlStatus = function(v) {
		playing = v;
		if (playing) {
			play_button.setIcon('pause');
			play_button.setTip('Pause');
		}
		else {
			play_button.setIcon('play');
			play_button.setTip('Play');
		}
	};

	this.updateState = function() {

		var layers = context.controller.getChannelNames();

		//console.log(layer_uis.length, layers);
		var i, layer;
		for (i = 0; i < layers.length; i++) {
			layer = layers[i];

			if (!layer_uis[i]) {
				var layer_ui;
				if (unused_layers.length) {
					layer_ui = unused_layers.pop();
					layer_ui.dom.style.display = 'block';
				} else {
					// new
					layer_ui = new LayerUI(context, layer);
					layer_scroll.appendChild(layer_ui.dom);
				}
				layer_uis.push(layer_ui);
			}

			layer_uis[i].setState(layer);
		}

		//console.log('Total layers (view, hidden, total)', layer_uis.length, unused_layers.length,
		//	layer_uis.length + unused_layers.length);

	};

	function repaint() {

		var layers = context.controller.getChannelNames();
		var time = context.currentTime;
		currentTime.setValue(time);
		totalTime.setValue(context.totalTime);
		currentTime.paint();
		totalTime.paint();

		// TODO needed?
		for (var i = layer_uis.length; i-- > 0;) {
			// quick hack
			if (i >= layers.length) {
				layer_uis[i].dom.style.display = 'none';
				unused_layers.push(layer_uis.pop());
				continue;
			}

			// console.log('yoz', states.get(i).value);
			layer_uis[i].setState(layers[i]);
			// layer_uis[i].setState('layers'+':'+i);
			layer_uis[i].repaint(time);
		}

	}

	this.repaint = repaint;
	this.updateState();

	this.scrollTo = function(x) {
		layer_scroll.scrollTop = x * (layer_scroll.scrollHeight - layer_scroll.clientHeight);
	};

	this.dom = div;

	repaint();
}

module.exports = LayerCabinet;

},{"./layer_view":5,"./layout_constants":6,"./theme":7,"./utils":11,"./widget/icon_button":13,"./widget/number":14}],5:[function(require,module,exports){
var Theme = require('./theme'),
	LayoutConstants = require('./layout_constants'),
	utils = require('./utils');

function LayerView(context, channelName) {

	var dom = document.createElement('div');
	var label = document.createElement('span');
	
	label.style.cssText = 'font-size: 12px; padding: 4px;';

	var height = (LayoutConstants.LINE_HEIGHT - 1);

	var keyframe_button = document.createElement('button');
	keyframe_button.innerHTML = '&#9672;'; // '&diams;' &#9671; 9679 9670 9672
	keyframe_button.style.cssText = 'background: none; font-size: 12px; padding: 0px; font-family: monospace; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;'; //  border-style:inset;
	
	keyframe_button.addEventListener('click', function(e) {
		context.dispatcher.fire('keyframe', channelName);
	});

	/*
	// Prev Keyframe
	var button = document.createElement('button');
	button.textContent = '<';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);

	// Next Keyframe
	button = document.createElement('button');
	button.textContent = '>';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);
	*/

	dom.appendChild(label);
	dom.appendChild(keyframe_button);

	dom.style.cssText = 'margin: 0px; border-bottom:1px solid ' + Theme.b + '; top: 0; left: 0; height: ' + height + 'px; line-height: ' + height + 'px; color: ' + Theme.c;
	this.dom = dom;


	var repaint = function repaint(time) {

		keyframe_button.style.color = Theme.b;

		if (time == null || context.draggingKeyframe || channelName == null ) return;

		var keyTimes = context.controller.getChannelKeyTimes(channelName);

		if ( utils.binarySearch( keyTimes, time ) >= 0 ) {

			keyframe_button.style.color = Theme.c;
		}

	};

	this.repaint = repaint;

	this.setState = function(name) {

		channelName = name;
		label.textContent = name;

		repaint();
	};

}

module.exports = LayerView;

},{"./layout_constants":6,"./theme":7,"./utils":11}],6:[function(require,module,exports){

// Dimensions
module.exports = {
	LINE_HEIGHT: 26,
	DIAMOND_SIZE: 10,
	MARKER_TRACK_HEIGHT: 60,
	WIDTH: 600,
	HEIGHT: 200,
	LEFT_PANE_WIDTH: 250,
	TIME_SCALE: 60 // number of pixels to 1 secon,
};

},{}],7:[function(require,module,exports){
module.exports = {
	// photoshop colors
	a: '#343434',
	b: '#535353',
	c: '#b8b8b8',
	d: '#d6d6d6',
};
},{}],8:[function(require,module,exports){
var LayoutConstants = require('./layout_constants'),
	Theme = require('./theme'),
	utils = require('./utils'),
	proxy_ctx = utils.proxy_ctx;

var LINE_HEIGHT = LayoutConstants.LINE_HEIGHT,
	DIAMOND_SIZE = LayoutConstants.DIAMOND_SIZE,
	MARKER_TRACK_HEIGHT = LayoutConstants.MARKER_TRACK_HEIGHT,

	LEFT_PANE_WIDTH = LayoutConstants.LEFT_PANE_WIDTH,
	time_scale = LayoutConstants.TIME_SCALE;


var frame_start = 0; // this is the current scroll position.
// TODO
// dirty rendering
// drag block
// drag current time
// pointer on timescale

var tickMark1, tickMark2, tickMark3;

function time_scaled() {

	var div = 60;

	tickMark1 = time_scale / div;
	tickMark2 = 2 * tickMark1;
	tickMark3 = 8 * tickMark1;

}

time_scaled();


/**************************/
// Timeline Panel
/**************************/

function TimelinePanel(context) {

	var dispatcher = context.dispatcher;

	var scrollTop = 0, scrollLeft = 0;

	var dpr = window.devicePixelRatio;
	var canvas = document.createElement('canvas');

	var layers;

	this.updateState = function() {
		layers = context.controller.getChannelNames();
		repaint();
	};

	this.updateState();

	this.scrollTo = function(s) {
		scrollTop = s * Math.max(layers.length * LINE_HEIGHT - context.scrollHeight, 0);
		repaint();
	};

	this.resize = function() {
		dpr = window.devicePixelRatio;
		canvas.width = context.width * dpr;
		canvas.height = context.height * dpr;
		canvas.style.width = context.width + 'px';
		canvas.style.height = context.height + 'px';
		context.scrollHeight = context.height - MARKER_TRACK_HEIGHT;
	};

	this.dom = canvas;
	this.resize();

	var ctx = canvas.getContext('2d');
	var ctx_wrap = proxy_ctx(ctx);

	var current_frame; // currently in seconds
	// var currentTime = 0; // in frames? could have it in string format (0:00:00:1-60)


	var LEFT_GUTTER = 20;
	var i, x, y, il, j;

	var needsRepaint = false;
	var renderItems = [];

	var timeDrag = 0;
	var channelDrag;

	function Diamond(t, x, y) {

		var self = this;

		var isOver = false;

		this.time = t;

		this.path = function(ctx_wrap) {
			ctx_wrap
				.beginPath()
				.moveTo(x, y)
				.lineTo(x + DIAMOND_SIZE / 2, y + DIAMOND_SIZE / 2)
				.lineTo(x, y + DIAMOND_SIZE)
				.lineTo(x - DIAMOND_SIZE / 2, y + DIAMOND_SIZE / 2)
				.closePath();
		};

		this.paint = function(ctx_wrap) {
			self.path(ctx_wrap);
			if (!isOver)
				ctx_wrap.fillStyle(Theme.c);
			else
				ctx_wrap.fillStyle('yellow'); // Theme.d

			ctx_wrap.fill()
			.stroke();
		};

		this.mouseover = function() {
			isOver = true;
			canvas.style.cursor = 'move'; // pointer move ew-resize
			self.paint(ctx_wrap);
		};

		this.mouseout = function() {
			isOver = false;
			canvas.style.cursor = 'default';
			self.paint(ctx_wrap);
		};

		this.mousedrag = function(e, domEvent) {

			if ( channelDrag !== undefined ) {

				var t = x_to_time(e.offsetx),
					delta = Math.max(t - timeDrag, - timeDrag),
					shift = domEvent.shiftKey;

				if ( delta ) {

					context.draggingKeyframe = true;

					context.controller.moveKeyframe( channelDrag, timeDrag, delta, shift );

					timeDrag += delta;
					repaint();

				}

			}

		};

	}


	function repaint() {
		needsRepaint = true;
	}


	function drawLayerContents() {

		renderItems.length = 0;

		// horizontal Layer lines
		for (i = 0, il = layers.length; i <= il; i++) {
			ctx.strokeStyle = Theme.b;
			ctx.beginPath();
			y = i * LINE_HEIGHT;
			y = ~~y - 0.5;

			ctx_wrap
			.moveTo(0, y)
			.lineTo(width, y)
			.stroke();
		}

		// Draw Diamonds
		for (i = 0; i < il; i++) {
			// check for keyframes
			var layer = layers[i];
			var times = context.controller.getChannelKeyTimes( layer );

			y = i * LINE_HEIGHT;

			// TODO use upper and lower bound here

			for (var j = 0; j < times.length; j++) {

				var time = times[ j ];

				renderItems.push(new Diamond(
						time, time_to_x( time ),
						y + LINE_HEIGHT * 0.5 - DIAMOND_SIZE / 2));
			}
		}

		// render
		for (i = 0, il = renderItems.length; i < il; i++) {
			var item = renderItems[i];
			item.paint(ctx_wrap);
		}
	}

	var TOP_SCROLL_TRACK = 20;
	var scroller = {
		left: 0,
		grip_length: 0,
		k: 1
	};
	var left;

	function drawScroller() {
		var w = width;

		var totalTime = context.totalTime;
		var viewTime = w / time_scale;


		var k = w / totalTime; // pixels per seconds
		scroller.k = k;

		// 800 / 5 = 180

		// var k = Math.min(viewTime / totalTime, 1);
		// var grip_length = k * w;

		scroller.grip_length = viewTime * k;
		var h = TOP_SCROLL_TRACK;

		scroller.left = context.scrollTime * k;
		scroller.left = Math.min(Math.max(0, scroller.left), w - scroller.grip_length);

		ctx.beginPath();
		ctx.fillStyle = Theme.b; // 'cyan';
		ctx.rect(0, 5, w, h);
		ctx.fill();

		ctx.fillStyle = Theme.c; // 'yellow';

		ctx.beginPath();
		ctx.rect(scroller.left, 5, scroller.grip_length, h);
		ctx.fill();

		var r = current_frame * k;

		// ctx.fillStyle = Theme.a; // 'yellow';
		// ctx.fillRect(0, 5, w, 2);

		ctx.fillStyle = 'red';
		ctx.fillRect(0, 5, r, 2);

		// ctx.strokeStyle = 'red';
		// ctx.lineWidth = 2;
		// ctx.beginPath();
		// ctx.moveTo(r, 5);
		// ctx.lineTo(r, 15);
		// ctx.stroke();

	}


	function setTimeScale(v) {

		if (time_scale !== v) {
			time_scale = v;
			time_scaled();
		}
	}

	this.setTimeScale = setTimeScale;

	var over = null;
	var mousedownItem = null;

	function check() {
		var item;
		var last_over = over;
		// over = [];
		over = null;
		for (i = renderItems.length; i-- > 0;) {
			item = renderItems[i];
			item.path(ctx_wrap);

			if (ctx.isPointInPath(pointer.x * dpr, pointer.y * dpr)) {
				// over.push(item);
				over = item;
				break;
			}
		}

		// clear old mousein
		if (last_over && last_over != over) {
			item = last_over;
			if (item.mouseout) item.mouseout();
		}

		if (over) {
			item = over;
			if (item.mouseover) item.mouseover();

			if (mousedown2) {
				mousedownItem = item;
			}
		}

		// console.log(pointer)
	}

	function pointerEvents() {

		if (!pointer) return;

		ctx_wrap
			.save()
			.scale(dpr, dpr)
			.translate(0, MARKER_TRACK_HEIGHT)
			.beginPath()
			.rect(0, 0, context.width, context.scrollHeight)
			.translate(-scrollLeft, -scrollTop)
			.clip()
				.run(check)
			.restore();
	}

	function _paint() {

		if (! needsRepaint) {
			pointerEvents();
			return;
		}

		setTimeScale(context.timeScale);

		current_frame = context.currentTime;
		frame_start =  context.scrollTime;

		/**************************/
		// background

		ctx.fillStyle = Theme.a;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.scale(dpr, dpr);

		//

		ctx.lineWidth = 1; // .5, 1, 2

		width = context.width,
		height = context.height;

		var units = time_scale / tickMark1;
		var offsetUnits = (frame_start * time_scale) % units;

		var count = (width - LEFT_GUTTER + offsetUnits) / units;

		// console.log('time_scale', time_scale, 'tickMark1', tickMark1, 'units', units, 'offsetUnits', offsetUnits, frame_start);

		// time_scale = pixels to 1 second (40)
		// tickMark1 = marks per second (marks / s)
		// units = pixels to every mark (40)

		// labels only
		for (i = 0; i < count; i++) {
			x = i * units + LEFT_GUTTER - offsetUnits;

			// vertical lines
			ctx.strokeStyle = Theme.b;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();

			ctx.fillStyle = Theme.d;
			ctx.textAlign = 'center';

			var t = (i * units - offsetUnits) / time_scale + frame_start;
			t = utils.format_friendly_seconds(t);
			ctx.fillText(t, x, 38);
		}

		units = time_scale / tickMark2;
		count = (width - LEFT_GUTTER + offsetUnits) / units;

		// marker lines - main
		for (i = 0; i < count; i++) {
			ctx.strokeStyle = Theme.c;
			ctx.beginPath();
			x = i * units + LEFT_GUTTER - offsetUnits;
			ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0);
			ctx.lineTo(x, MARKER_TRACK_HEIGHT - 16);
			ctx.stroke();
		}

		var mul = tickMark3 / tickMark2;
		units = time_scale / tickMark3;
		count = (width - LEFT_GUTTER + offsetUnits) / units;

		// small ticks
		for (i = 0; i < count; i++) {
			if (i % mul === 0) continue;
			ctx.strokeStyle = Theme.c;
			ctx.beginPath();
			x = i * units + LEFT_GUTTER - offsetUnits;
			ctx.moveTo(x, MARKER_TRACK_HEIGHT - 0);
			ctx.lineTo(x, MARKER_TRACK_HEIGHT - 10);
			ctx.stroke();
		}

		// Encapsulate a scroll rect for the layers
		ctx_wrap
			.save()
			.translate(0, MARKER_TRACK_HEIGHT)
			.beginPath()
			.rect(0, 0, context.width, context.scrollHeight)
			.translate(-scrollLeft, -scrollTop)
			.clip()
				.run(drawLayerContents)
			.restore();

		drawScroller();

		// Current Marker / Cursor
		ctx.strokeStyle = 'red'; // Theme.c
		x = (current_frame - frame_start) * time_scale + LEFT_GUTTER;

		var txt = utils.format_friendly_seconds(current_frame);
		var textWidth = ctx.measureText(txt).width;

		var base_line = MARKER_TRACK_HEIGHT- 5, half_rect = textWidth / 2 + 4;

		ctx.beginPath();
		ctx.moveTo(x, base_line);
		ctx.lineTo(x, height);
		ctx.stroke();

		ctx.fillStyle = 'red'; // black
		ctx.textAlign = 'center';
		ctx.beginPath();
		ctx.moveTo(x, base_line + 5);
		ctx.lineTo(x + 5, base_line);
		ctx.lineTo(x + half_rect, base_line);
		ctx.lineTo(x + half_rect, base_line - 14);
		ctx.lineTo(x - half_rect, base_line - 14);
		ctx.lineTo(x - half_rect, base_line);
		ctx.lineTo(x - 5, base_line);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = 'white';
		ctx.fillText(txt, x, base_line - 4);

		ctx.restore();

		needsRepaint = false;
		// pointerEvents();

	}

	function y_to_track(y) {
		if (y - MARKER_TRACK_HEIGHT < 0) return -1;
		return (y - MARKER_TRACK_HEIGHT + scrollTop) / LINE_HEIGHT | 0;
	}


	function x_to_time(x) {
		var units = time_scale / tickMark3;

		// return frame_start + (x - LEFT_GUTTER) / time_scale;

		return frame_start + ((x - LEFT_GUTTER) / units | 0) / tickMark3;
	}

	function time_to_x(s) {
		var ds = s - frame_start;
		ds *= time_scale;
		ds += LEFT_GUTTER;

		return ds;
	}

	var me = this;
	this.repaint = repaint;
	this._paint = _paint;

	repaint();

	var mousedown = false, selection = false;

	var dragObject;
	var canvasBounds;

	document.addEventListener('mousemove', onMouseMove);

	canvas.addEventListener('dblclick', function(e) {
		canvasBounds = canvas.getBoundingClientRect();
		var mx = e.clientX - canvasBounds.left , my = e.clientY - canvasBounds.top;


		var track = y_to_track(my);
		var s = x_to_time(mx);


		dispatcher.fire('keyframe', layers[track], current_frame);

	});

	function onMouseMove(e) {
		canvasBounds = canvas.getBoundingClientRect();
		var mx = e.clientX - canvasBounds.left , my = e.clientY - canvasBounds.top;
		onPointerMove(mx, my);
	}

	var pointerdidMoved = false;
	var pointer = null;

	function onPointerMove(x, y) {
		if (mousedownItem) return;
		pointerdidMoved = true;
		pointer = {x: x, y: y};
	}

	canvas.addEventListener('mouseout', function() {
		pointer = null;
	});

	var mousedown2 = false, mouseDownThenMove = false;
	utils.handleDrag(canvas, function down(e) {
			mousedown2 = true;
			pointer = {
				x: e.offsetx,
				y: e.offsety
			};
			pointerEvents();
			if (mousedownItem instanceof Diamond) {
				timeDrag = mousedownItem.time;
				channelDrag = layers[ y_to_track(e.offsety) ];
				if (!channelDrag) mousedownItem = null;
			}
			dispatcher.fire('time.update', x_to_time(e.offsetx));
			// Hit criteria
		}, function move(e, domEvent) {
			mousedown2 = false;
			if (mousedownItem) {
				mouseDownThenMove = true;
				if (mousedownItem.mousedrag) {
					mousedownItem.mousedrag(e,domEvent);
				}
			} else {
				dispatcher.fire('time.update', x_to_time(e.offsetx));
			}
		}, function up() {
			if (mouseDownThenMove) {
				dispatcher.fire('keyframe.move');
			}
			mousedown2 = false;
			mousedownItem = null;
			mouseDownThenMove = false;
			context.draggingKeyframe = false;
			repaint();
		}
	);

	/** Handles dragging for scroll bar **/

	var draggingx;

	utils.handleDrag(canvas, function down(e) {
			draggingx = scroller.left;
		}, function move(e) {
			context.scrollTime = Math.max(0, (draggingx + e.dx) / scroller.k);
			repaint();
		}, function up() {
		}, function(e) {
			var bar = e.offsetx >= scroller.left && e.offsetx <= scroller.left + scroller.grip_length;
			return e.offsety <= TOP_SCROLL_TRACK && bar;
		}
	);

	/*** End handling for scrollbar ***/

}

module.exports = TimelinePanel;

},{"./layout_constants":6,"./theme":7,"./utils":11}],9:[function(require,module,exports){
/*
 * @author Joshua Koo http://joshuakoo.com
 */

var undo = require('./undo'),
	Dispatcher = require('./dispatcher'),
	Theme = require('./theme'),
	UndoManager = undo.UndoManager,
	UndoState = undo.UndoState,
	LayoutConstants = require('./layout_constants'),
	utils = require('./utils'),
	LayerCabinet = require('./layer_cabinet'),
	TimelinePanel = require('./timeline_panel'),
	package_json = require('../package.json'),
	IconButton = require('./widget/icon_button'),
	style = utils.style,
	saveToFile = utils.saveToFile,
	openAs = utils.openAs,
	STORAGE_PREFIX = utils.STORAGE_PREFIX,
	ScrollBar = require('./widget/scrollbar')
	;

var Z_INDEX = 999;

function LayerProp(name) {
	this.name = name;
	this.values = [];

	this._color = '#' + (Math.random() * 0xffffff | 0).toString(16);
	/*
	this.max
	this.min
	this.step
	*/
}

/* I'm not good at node.js ,I faild to build
 * get build fiel from https://github.com/sidfarkus
 * 
 * 
 */
function Timeliner( controller ) {

	var dispatcher = new Dispatcher();

	controller.timeliner = this;
	controller.init( this );

	var context = {

		width: LayoutConstants.WIDTH,
		height: LayoutConstants.HEIGHT,
		scrollHeight: 0,

		totalTime: 20.0,
		timeScale: 6,

		currentTime: 0.0,
		scrollTime: 0.0,

		dispatcher: dispatcher,

		controller: controller,
		fileName:"animation"

	};
	this.context=context;//allow access

	var timeline = new TimelinePanel(context);
	var layer_panel = new LayerCabinet(context);

	var undo_manager = new UndoManager(dispatcher);

	var scrollbar = new ScrollBar(0, 10);

	var div = document.createElement('div');

	controller.setDuration(context.totalTime);

/*
	setTimeout(function() {
		// hack!
		undo_manager.save(new UndoState(data, 'Loaded'), true);
	});
*/
	dispatcher.on('keyframe', function(channelName) {

		var time = context.currentTime;

		if ( time == null || channelName == null ) return;

		var keyTimes = controller.getChannelKeyTimes( channelName, time );

		if ( utils.binarySearch( keyTimes, time ) < 0 ) {

			controller.setKeyframe( channelName, time );

//			undo_manager.save(new UndoState(data, 'Add Keyframe'));
		} else {

			controller.delKeyframe( channelName, time );

//			undo_manager.save(new UndoState(data, 'Remove Keyframe'));
		}

		repaintAll(); // TODO repaint one channel would be enough

	});

	dispatcher.on('keyframe.move', function(layer, value) {
//		undo_manager.save(new UndoState(data, 'Move Keyframe'));
	});


	var start_play = null,
		played_from = 0; // requires some more tweaking

	var setCurrentTime = function setCurrentTime(value) {
		var time = Math.min(Math.max(value, 0), context.totalTime);
		context.currentTime = time;
		controller.setDisplayTime( time );

		if (start_play) start_play = performance.now() - value * 1000;
		repaintAll();
	}

	dispatcher.on('controls.toggle_play', function() {
		if (start_play) {
			pausePlaying();
		} else {
			startPlaying();
		}
	});

	dispatcher.on('controls.restart_play', function() {
		if (!start_play) {
			startPlaying();
		}

		setCurrentTime(played_from);
	});

	dispatcher.on('controls.play', startPlaying);
	dispatcher.on('controls.pause', pausePlaying);

	function startPlaying() {
		// played_from = timeline.current_frame;
		start_play = performance.now() - context.currentTime * 1000;
		layer_panel.setControlStatus(true);
		// dispatcher.fire('controls.status', true);
	}

	function pausePlaying() {
		start_play = null;
		layer_panel.setControlStatus(false);
		// dispatcher.fire('controls.status', false);
	}

	dispatcher.on('controls.stop', function() {
		if (start_play !== null) pausePlaying();
		setCurrentTime(0);
	});

	dispatcher.on('time.update', setCurrentTime);

	dispatcher.on('totalTime.update', function(value) {
		context.totalTime = value;
		controller.setDuration(value);
		timeline.repaint();
	});

	dispatcher.on('update.scale', function(v) {
		context.timeScale = v;
		timeline.setTimeScale(v);
		timeline.repaint();
	});

	// handle undo / redo
	dispatcher.on('controls.undo', function() {
/*
		var history = undo_manager.undo();
		data.setJSONString(history.state);

		updateState();
*/
	});

	dispatcher.on('controls.redo', function() {
/*
		var history = undo_manager.redo();
		data.setJSONString(history.state);

		updateState();
*/
	});

	/*
		Paint Routines
	*/

	var needsResize = true;
	function paint() {
		requestAnimationFrame(paint);

		if (start_play) {
			var t = (performance.now() - start_play) / 1000;
			setCurrentTime(t);


			if (t > context.totalTime) {
				// simple loop
				start_play = performance.now();
			}
		}

		if (needsResize) {
			div.style.width = context.width + 'px';
			div.style.height = context.height + 'px';

			restyle(layer_panel.dom, timeline.dom);

			timeline.resize();
			repaintAll();
			needsResize = false;

			dispatcher.fire('resize');
		}

		timeline._paint();
	}

	paint();

	/*
		End Paint Routines
	*/

	function save(name) {
/*
		if (!name) name = 'autosave';

		var json = data.getJSONString();

		try {
			localStorage[STORAGE_PREFIX + name] = json;
			dispatcher.fire('save:done');
		} catch (e) {
			console.log('Cannot save', name, json);
		}
*/
	}

	function saveAs(name) {
		if (!name) name = context.name;
		name = prompt('Pick a name to save to (localStorage)', name);
		if (name) {
			context.name = name;
			save(name);
		}
	}

	function saveSimply() {
		var name = context.name;
		if (name) {
			save(name);
		} else {
			saveAs(name);
		}
	}

	function exportJSON() {

		var structs = controller.serialize();
//		var ret = prompt('Hit OK to download otherwise Copy and Paste JSON');
//		if (!ret) {
//			console.log(JSON.stringify(structs, null, '\t'));
//			return;
//		}

		var fileName = context.fileName+'.json';

		saveToFile(JSON.stringify(structs, null, '\t'), fileName);

	}

	function load(structs) {

		controller.deserialize(structs);

		// TODO reset context

//		undo_manager.clear();
//		undo_manager.save(new UndoState(data, 'Loaded'), true);

		updateState();

	}

	function loadJSONString(o) {
		// should catch and check errors here
		var json = JSON.parse(o);
		load(json);
	}

	function updateState() {
		layer_panel.updateState();
		timeline.updateState();

		repaintAll();
	}

	function repaintAll() {
		var layers = context.controller.getChannelNames();
		var content_height = layers.length * LayoutConstants.LINE_HEIGHT;
		scrollbar.setLength(context.scrollHeight / content_height);

		layer_panel.repaint();
		timeline.repaint();
	}

	function promptImport() {
		var json = prompt('Paste JSON in here to Load');
		if (!json) return;
		//console.log('Loading.. ', json);
		loadJSONString(json);
	}

	function open(title) {
		if (title) {
			loadJSONString(localStorage[STORAGE_PREFIX + title]);
		}
	}

	this.openLocalSave = open;

	dispatcher.on('import', function() {
		promptImport();
	}.bind(this));

	dispatcher.on('new', function() {
		data.blank();
		updateState();
	});

	dispatcher.on('openfile', function() {
		openAs(function(data) {
			// console.log('loaded ' + data);
			loadJSONString(data);
		}, div);
	});

	dispatcher.on('open', open);
	dispatcher.on('export', exportJSON);

	dispatcher.on('save', saveSimply);
	dispatcher.on('save_as', saveAs);

	// Expose API
	this.save = save;
	this.load = load;

	/*
		Start DOM Stuff (should separate file)
	*/

	style(div, {
		textAlign: 'left',
		lineHeight: '1em',
		position: 'absolute',
		top: '22px'
	});

	var pane = document.createElement('div');

	style(pane, {
		position: 'fixed',
		top: '20px',
		left: '20px',
		margin: 0,
		border: '1px solid ' + Theme.a,
		padding: 0,
		overflow: 'hidden',
		backgroundColor: Theme.a,
		color: Theme.d,
		zIndex: Z_INDEX,
		fontFamily: 'monospace',
		fontSize: '12px'
	});


	var header_styles = {
		position: 'absolute',
		top: '0px',
		width: '100%',
		height: '22px',
		lineHeight: '22px',
		overflow: 'hidden'
	};

	var button_styles = {
		width: '20px',
		height: '20px',
		padding: '2px',
		marginRight: '2px'
	};

	var pane_title = document.createElement('div');
	style(pane_title, header_styles, {
		borderBottom: '1px solid ' + Theme.b,
		textAlign: 'center'
	});

	var title_bar = document.createElement('span');
	pane_title.appendChild(title_bar);

	title_bar.innerHTML = package_json.description + " " + package_json.version;
	pane_title.appendChild(title_bar);

	var top_right_bar = document.createElement('div');
	style(top_right_bar, header_styles, {
		textAlign: 'right'
	});

	pane_title.appendChild(top_right_bar);

	// resize minimize
	// var resize_small = new IconButton(10, 'resize_small', 'minimize', dispatcher);
	// top_right_bar.appendChild(resize_small.dom);

	// resize full
	var resize_full = new IconButton(10, 'resize_full', 'Maximize', dispatcher);
	style(resize_full.dom, button_styles, { marginRight: '2px' });
	top_right_bar.appendChild(resize_full.dom);

	var pane_status = document.createElement('div');

	var footer_styles = {
		position: 'absolute',
		width: '100%',
		height: '22px',
		lineHeight: '22px',
		bottom: '0',
		// padding: '2px',
		fontSize: '11px'
	};

	style(pane_status, footer_styles, {
		borderTop: '1px solid ' + Theme.b,
		background: Theme.a,
	});

	pane.appendChild(div);
	pane.appendChild(pane_status);
	pane.appendChild(pane_title);

	var label_status = document.createElement('span');
	label_status.textContent = 'Hello!';
	label_status.style.marginLeft = '10px';

	dispatcher.on('status', function(text) {
		label_status.textContent = text;
	});


	dispatcher.on('state:save', function(description) {
		dispatcher.fire('status', description);
		save('autosave');
	});


	var bottom_right = document.createElement('div');
	style(bottom_right, footer_styles, {
		textAlign: 'right'
	});


	// var button_save = document.createElement('button');
	// style(button_save, button_styles);
	// button_save.textContent = 'Save';
	// button_save.onclick = function() {
	// 	save();
	// };

	// var button_load = document.createElement('button');
	// style(button_load, button_styles);
	// button_load.textContent = 'Import';
	// button_load.onclick = this.promptLoad;

	// var button_open = document.createElement('button');
	// style(button_open, button_styles);
	// button_open.textContent = 'Open';
	// button_open.onclick = this.promptOpen;


	// bottom_right.appendChild(button_load);
	// bottom_right.appendChild(button_save);
	// bottom_right.appendChild(button_open);

	pane_status.appendChild(label_status);
	pane_status.appendChild(bottom_right);


/*
	// zoom in
	var zoom_in = new IconButton(12, 'zoom_in', 'zoom in', dispatcher);
	// zoom out
	var zoom_out = new IconButton(12, 'zoom_out', 'zoom out', dispatcher);
	// settings
	var cog = new IconButton(12, 'cog', 'settings', dispatcher);

	// bottom_right.appendChild(zoom_in.dom);
	// bottom_right.appendChild(zoom_out.dom);
	// bottom_right.appendChild(cog.dom);

	// add layer
	var plus = new IconButton(12, 'plus', 'New Layer', dispatcher);
	plus.onClick(function() {
		var name = prompt('Layer name?');
		addLayer(name);

		// undo_manager.save(new UndoState(data, 'Layer added'));

		repaintAll();
	});
	style(plus.dom, button_styles);
	bottom_right.appendChild(plus.dom);


	// trash
	var trash = new IconButton(12, 'trash', 'Delete save', dispatcher);
	trash.onClick(function() {
		var name = data.get('name').value;
		if (name && localStorage[STORAGE_PREFIX + name]) {
			var ok = confirm('Are you sure you wish to delete ' + name + '?');
			if (ok) {
				delete localStorage[STORAGE_PREFIX + name];
				dispatcher.fire('status', name + ' deleted');
				dispatcher.fire('save:done');
			}
		}
	});
	style(trash.dom, button_styles, { marginRight: '2px' });
	bottom_right.appendChild(trash.dom);

*/

	// pane_status.appendChild(document.createTextNode(' | TODO <Dock Full | Dock Botton | Snap Window Edges | zoom in | zoom out | Settings | help>'));

	/*
			End DOM Stuff
	*/

	var ghostpane = document.createElement('div');
	//ghostpane.id = 'ghostpane';
	style(ghostpane, {
		background: '#999',
		opacity: 0.2,
		position: 'fixed',
		margin: 0,
		padding: 0,
		zIndex: (Z_INDEX - 1),
		// transition: 'all 0.25s ease-in-out',
		transitionProperty: 'top, left, width, height, opacity',
 		transitionDuration: '0.25s',
		transitionTimingFunction: 'ease-in-out'
	});

	document.body.appendChild(pane);
	document.body.appendChild(ghostpane);

	div.appendChild(layer_panel.dom);
	div.appendChild(timeline.dom);

	div.appendChild(scrollbar.dom);

	// percentages
	scrollbar.onScroll.do(function(type, scrollTo) {
		switch(type) {
			case 'scrollto':
				layer_panel.scrollTo(scrollTo);
				timeline.scrollTo(scrollTo);
				break;
	//		case 'pageup':
	// 			scrollTop -= pageOffset;
	// 			me.draw();
	// 			me.updateScrollbar();
	// 			break;
	// 		case 'pagedown':
	// 			scrollTop += pageOffset;
	// 			me.draw();
	// 			me.updateScrollbar();
	// 			break;
		}
	});



	// document.addEventListener('keypress', function(e) {
	// 	console.log('kp', e);
	// });
	// document.addEventListener('keyup', function(e) {
	// 	if (undo) console.log('UNDO');

	// 	console.log('kd', e);
	// });

	// TODO: Keyboard Shortcuts
	// Esc - Stop and review to last played from / to the start?
	// Space - play / pause from current position
	// Enter - play all
	// k - keyframe

	document.addEventListener('keydown', function(e) {
		var play = e.keyCode == 32; // space
		var enter = e.keyCode == 13; //
		var undo = e.metaKey && e.keyCode == 91 && !e.shiftKey;

		var active = document.activeElement;
		// console.log( active.nodeName );

		if (active.nodeName.match(/(INPUT|BUTTON|SELECT)/)) {
			active.blur();
		}

		if (play) {
			dispatcher.fire('controls.toggle_play');
		}
		else if (enter) {
			// FIXME: Return should play from the start or last played from?
			dispatcher.fire('controls.restart_play');
			// dispatcher.fire('controls.undo');
		}
		else if (e.keyCode == 27) {
			// Esc = stop. FIXME: should rewind head to last played from or Last pointed from?
			dispatcher.fire('controls.pause');
		}
		//else console.log(e.keyCode);
	});

	function resize(newWidth, newHeight) {
		// TODO: remove ugly hardcodes
		context.width = newWidth - LayoutConstants.LEFT_PANE_WIDTH - 4;
		context.height = newHeight - 44;
		context.scrollHeight = context.height - LayoutConstants.MARKER_TRACK_HEIGHT;
		scrollbar.setHeight(context.scrollHeight - 2);

		style(scrollbar.dom, {
			top: LayoutConstants.MARKER_TRACK_HEIGHT + 'px',
			left: (newWidth - 16 - 4) + 'px',
		});

		needsResize = true;
	}

	function restyle(left, right) {
		left.style.cssText = 'position: absolute; left: 0px; top: 0px; height: ' + context.height + 'px;';
		style(left, {
			// background: Theme.a,
			overflow: 'hidden'
		});
		left.style.width = LayoutConstants.LEFT_PANE_WIDTH + 'px';

		// right.style.cssText = 'position: absolute; top: 0px;';
		right.style.position = 'absolute';
		right.style.top = '0px';
		right.style.left = LayoutConstants.LEFT_PANE_WIDTH + 'px';
	}

/*
	function addLayer(name) {
		var layer = new LayerProp(name);

		layers = layer_store.value;
		layers.push(layer);

		layer_panel.updateState();
	}

	this.addLayer = addLayer;
*/

	this.dispose = function dispose() {

		var domParent = pane.parentElement;
		domParent.removeChild(pane);
		domParent.removeChild(ghostpane);

	};

	(function DockingWindow() {
		"use strict";

		// Minimum resizable area
		var minWidth = 120;
		var minHeight = 100;

		// Thresholds
		var FULLSCREEN_MARGINS = 2;
		var SNAP_MARGINS = 12;
		var MARGINS = 2;

		var DEFAULT_SNAP = 'snap-bottom-edge';

		// End of what's configurable.

		var clicked = null;
		var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

		var preSnapped = {
			width: LayoutConstants.WIDTH,
			height: LayoutConstants.HEIGHT
		};
		var snapType = DEFAULT_SNAP;

		var x, y, b = pane.getBoundingClientRect();

		var redraw = false;

		// var pane = document.getElementById('pane');
		// var ghostpane = document.getElementById('ghostpane');

		var mouseOnTitle = false;

		pane_title.addEventListener('mouseover', function() {
			mouseOnTitle = true;
		});

		pane_title.addEventListener('mouseout', function() {
			mouseOnTitle = false;
		});

		resize_full.onClick(function() {
			// TOOD toggle back to restored size
			if (!preSnapped) preSnapped = {
				width: b.width,
				height: b.height
			};

			snapType = 'full-screen';
			resizeEdges();
		});

		// pane_status.addEventListener('mouseover', function() {
		// 	mouseOnTitle = true;
		// });

		// pane_status.addEventListener('mouseout', function() {
		// 	mouseOnTitle = false;
		// });

		window.addEventListener('resize', function() {
			if (snapType)
				resizeEdges();
			else
				needsResize = true;
		});

		// utils
		function setBounds(element, x, y, w, h) {
			element.style.left = x + 'px';
			element.style.top = y + 'px';
			element.style.width = w + 'px';
			element.style.height = h + 'px';

			if (element === pane) {
				resize(w, h);
			}
		}

		function hintHide() {
			setBounds(ghostpane, b.left, b.top, b.width, b.height);
			ghostpane.style.opacity = 0;
		}

		setBounds(pane, 0, 0, context.width, context.height);
		setBounds(ghostpane, 0, 0, context.width, context.height);

		// Mouse events
		pane.addEventListener('mousedown', onMouseDown);
		pane.addEventListener('mouseover', onMouseOver);
		pane.addEventListener('mouseout',onMouseOut);
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);

		// Touch events
		pane.addEventListener('touchstart', onTouchDown);
		document.addEventListener('touchmove', onTouchMove);
		document.addEventListener('touchend', onTouchEnd);

		var mouseOver = false;
		function onMouseOver(e) { mouseOver = true; }
		function onMouseOut(e) { mouseOver = false; }

		function onTouchDown(e) {
			onDown(e.touches[0]);
			e.preventDefault();
		}

		function onTouchMove(e) {
			onMove(e.touches[0]);
		}

		function onTouchEnd(e) {
			if (e.touches.length == 0) onUp(e.changedTouches[0]);
		}

		function onMouseDown(e) {
			onDown(e);
		}

		function onDown(e) {
			calc(e);

			var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
			var isMoving = !isResizing && canMove();

			clicked = {
				x: x,
				y: y,
				cx: e.clientX,
				cy: e.clientY,
				w: b.width,
				h: b.height,
				isResizing: isResizing,
				isMoving: isMoving,
				onTopEdge: onTopEdge,
				onLeftEdge: onLeftEdge,
				onRightEdge: onRightEdge,
				onBottomEdge: onBottomEdge
			};

			if (isResizing || isMoving) {
				e.preventDefault();
			}
			e.stopPropagation();
		}

		function canMove() {
			return mouseOnTitle;
			// return x > 0 && x < b.width && y > 0 && y < b.height
			// && y < 18;
		}

		function calc(e) {
			b = pane.getBoundingClientRect();
			x = e.clientX - b.left;
			y = e.clientY - b.top;

			onTopEdge = y < MARGINS;
			onLeftEdge = x < MARGINS;
			onRightEdge = x >= b.width - MARGINS;
			onBottomEdge = y >= b.height - MARGINS;
		}

		var e; // current mousemove event

		function onMove(ee) {
			e = ee;
			calc(e);

			redraw = true;

			if (mouseOver) {
				e.stopPropagation();
			}
		}

		function animate() {

			requestAnimationFrame(animate);

			if (!redraw) return;

			redraw = false;

			if (clicked && clicked.isResizing) {

				if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
				if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

				if (clicked.onLeftEdge) {
					var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
					if (currentWidth > minWidth) {
						pane.style.width = currentWidth + 'px';
						pane.style.left = e.clientX + 'px';
					}
				}

				if (clicked.onTopEdge) {
					var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
					if (currentHeight > minHeight) {
						pane.style.height = currentHeight + 'px';
						pane.style.top = e.clientY + 'px';
					}
				}

				hintHide();

				resize(b.width, b.height);

				return;
			}

			if (clicked && clicked.isMoving) {

				switch(checks()) {
					case 'full-screen':
						setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-top-edge':
						setBounds(ghostpane, 0, 0, window.innerWidth, window.innerHeight * 0.25);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-left-edge':
						setBounds(ghostpane, 0, 0, window.innerWidth * 0.35, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-right-edge':
						setBounds(ghostpane, window.innerWidth * 0.65, 0, window.innerWidth * 0.35, window.innerHeight);
						ghostpane.style.opacity = 0.2;
						break;
					case 'snap-bottom-edge':
						setBounds(ghostpane, 0, window.innerHeight * 0.75, window.innerWidth, window.innerHeight * 0.25);
						ghostpane.style.opacity = 0.2;
						break;
					default:
						hintHide();
				}

				if (preSnapped) {
					setBounds(pane,
						e.clientX - preSnapped.width / 2,
						e.clientY - Math.min(clicked.y, preSnapped.height),
						preSnapped.width,
						preSnapped.height
					);
					return;
				}

				// moving
				pane.style.top = (e.clientY - clicked.y) + 'px';
				pane.style.left = (e.clientX - clicked.x) + 'px';

				return;
			}

			// This code executes when mouse moves without clicking

			// style cursor
			if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
				pane.style.cursor = 'nwse-resize';
			} else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
				pane.style.cursor = 'nesw-resize';
			} else if (onRightEdge || onLeftEdge) {
				pane.style.cursor = 'ew-resize';
			} else if (onBottomEdge || onTopEdge) {
				pane.style.cursor = 'ns-resize';
			} else if (canMove()) {
				pane.style.cursor = 'move';
			} else {
				pane.style.cursor = 'default';
			}
		}

		function checks() {
			/*
			var rightScreenEdge, bottomScreenEdge;

			rightScreenEdge = window.innerWidth - MARGINS;
			bottomScreenEdge = window.innerHeight - MARGINS;

			// Edge Checkings
			// hintFull();
			if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS)
				return 'full-screen';

			// hintTop();
			if (b.top < MARGINS) return 'snap-top-edge';

			// hintLeft();
			if (b.left < MARGINS) return 'snap-left-edge';

			// hintRight();
			if (b.right > rightScreenEdge) return 'snap-right-edge';

			// hintBottom();
			if (b.bottom > bottomScreenEdge) return 'snap-bottom-edge';
			*/

			if (e.clientY < FULLSCREEN_MARGINS) return 'full-screen';

			if (e.clientY < SNAP_MARGINS) return 'snap-top-edge';

			// hintLeft();
			if (e.clientX < SNAP_MARGINS) return 'snap-left-edge';

			// hintRight();
			if (window.innerWidth - e.clientX < SNAP_MARGINS) return 'snap-right-edge';

			// hintBottom();
			if (window.innerHeight- e.clientY < SNAP_MARGINS) return 'snap-bottom-edge';

		}

		animate();

		function resizeEdges() {
			var x, y, w, h;
			switch(snapType) {
				case 'full-screen':
					x = 0, y = 0, w = window.innerWidth, h = window.innerHeight;
					break;
				case 'snap-top-edge':
					x = 0, y = 0, w = window.innerWidth, h = window.innerHeight * 0.25;
					break;
				case 'snap-left-edge':
					x = 0, y = 0, w = window.innerWidth * 0.35, h = window.innerHeight;
					break;
				case 'snap-right-edge':
					x = window.innerWidth * 0.65, y = 0, w = window.innerWidth * 0.35, h = window.innerHeight;
					break;
				case 'snap-bottom-edge':
					x = 0, y = window.innerHeight * 0.75, w = window.innerWidth, h = window.innerHeight * 0.25;
					break;
				default:
					return;
			}
			setBounds(pane, x, y, w, h);
			setBounds(ghostpane, x, y, w, h);
		}

		function onUp(e) {
			calc(e);

			if (clicked && clicked.isMoving) {
				// Snap
				snapType = checks();
				if (snapType) {
					preSnapped = {
						width: b.width,
						height: b.height
					};
					resizeEdges();
				} else {
					preSnapped = null;
				}

				hintHide();

			}

			clicked = null;

			if (mouseOver) {
				e.stopPropagation();
			}
		}

		resizeEdges();

	})();

}

Timeliner.binarySearch = utils.binarySearch;

window.Timeliner = Timeliner;

},{"../package.json":2,"./dispatcher":3,"./layer_cabinet":4,"./layout_constants":6,"./theme":7,"./timeline_panel":8,"./undo":10,"./utils":11,"./widget/icon_button":13,"./widget/scrollbar":15}],10:[function(require,module,exports){
/**************************/
// Undo Manager
/**************************/

function UndoState(state, description) {
	// this.state = JSON.stringify(state);
	this.state = state.getJSONString();
	this.description = description;
}

function UndoManager(dispatcher, max) {
	this.dispatcher = dispatcher;
	this.MAX_ITEMS = max || 100;
	this.clear();
}

UndoManager.prototype.save = function(state, suppress) {
	var states = this.states;
	var next_index = this.index + 1;
	var to_remove = states.length - next_index;
	states.splice(next_index, to_remove, state);

	if (states.length > this.MAX_ITEMS) {
		states.shift();
	}

	this.index = states.length - 1;

	// console.log('Undo State Saved: ', state.description);
	if (!suppress) this.dispatcher.fire('state:save', state.description);
};

UndoManager.prototype.clear = function() {
	this.states = [];
	this.index = -1;
	// FIXME: leave default state or always leave one state?
};

UndoManager.prototype.canUndo = function() {
	return this.index > 0;
	// && this.states.length > 1
};

UndoManager.prototype.canRedo = function() {
	return this.index < this.states.length - 1;
};

UndoManager.prototype.undo = function() {
	if (this.canUndo()) {
		this.dispatcher.fire('status', 'Undo: ' + this.get().description);
		this.index--;
	} else {
		this.dispatcher.fire('status', 'Nothing to undo');
	}

	return this.get();
};

UndoManager.prototype.redo = function() {
	if (this.canRedo()) {
		this.index++;
		this.dispatcher.fire('status', 'Redo: ' + this.get().description);
	} else {
		this.dispatcher.fire('status', 'Nothing to redo');
	}

	return this.get();
};

UndoManager.prototype.get = function() {
	return this.states[this.index];
};

module.exports = {
	UndoState: UndoState,
	UndoManager: UndoManager
};
},{}],11:[function(require,module,exports){
module.exports = {
	STORAGE_PREFIX: 'timeliner-',
	Z_INDEX: 999,
	style: style,
	saveToFile: saveToFile,
	openAs: openAs,
	format_friendly_seconds: format_friendly_seconds,
	proxy_ctx: proxy_ctx,
	handleDrag: handleDrag,
	binarySearch: binarySearch
};

/**************************/
// Utils
/**************************/

function binarySearch(arr, num) {

	var l = 0, r = arr.length, found = false;

	while ( l <  r ) {

		var m = ( l + r ) >> 1;

		if ( arr[ m ] < num ) {

			l = m + 1;

		} else {

			r = m;

			found = arr[ m ] === num;

		}

	}

	return found ? l : ~l;

}

function handleDrag(element, ondown, onmove, onup, down_criteria) {
	var pointer = null;
	var bounds = element.getBoundingClientRect();
	
	element.addEventListener('mousedown', onMouseDown);

	function onMouseDown(e) {
		handleStart(e);

		if (down_criteria && !down_criteria(pointer,e)) {
			pointer = null;
			return;
		}

		
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		
		ondown(pointer,e);

		e.preventDefault();
	}
	
	function onMouseMove(e) {
		handleMove(e);
		pointer.moved = true;
		onmove(pointer, e);
	}

	function handleStart(e) {
		bounds = element.getBoundingClientRect();
		var currentx = e.clientX, currenty = e.clientY;
		pointer = {
			startx: currentx,
			starty: currenty,
			x: currentx,
			y: currenty,
			dx: 0,
			dy: 0,
			offsetx: currentx - bounds.left,
			offsety: currenty - bounds.top,
			moved: false
		};
	}
	
	function handleMove(e) {
		bounds = element.getBoundingClientRect();
		var currentx = e.clientX,
		currenty = e.clientY,
		offsetx = currentx - bounds.left,
		offsety = currenty - bounds.top;
		pointer.x = currentx;
		pointer.y = currenty;
		pointer.dx = e.clientX - pointer.startx;
		pointer.dy = e.clientY - pointer.starty;
		pointer.offsetx = offsetx;
		pointer.offsety = offsety;
	}
	
	function onMouseUp(e) {
		handleMove(e);
		onup(pointer,e);
		pointer = null;
		
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}

	element.addEventListener('touchstart', onTouchStart);

	function onTouchStart(te) {
		
		if (te.touches.length == 1) {
			
			var e = te.touches[0];
			if (down_criteria && !down_criteria(e)) return;
			te.preventDefault();
			handleStart(e);
			ondown(pointer,e);
		}
		
		element.addEventListener('touchmove', onTouchMove);
		element.addEventListener('touchend', onTouchEnd);
	}
	
	function onTouchMove(te) {
		var e = te.touches[0];
		onMouseMove(e);
	}

	function onTouchEnd(e) {
		// var e = e.touches[0];
		onMouseUp(e);
		element.removeEventListener('touchmove', onTouchMove);
		element.removeEventListener('touchend', onTouchEnd);
	}


	this.release = function() {
		element.removeEventListener('mousedown', onMouseDown);
		element.removeEventListener('touchstart', onTouchStart);
	};
}

function style(element, var_args) {
	for (var i = 1; i < arguments.length; ++i) {
		var styles = arguments[i];
		for (var s in styles) {
			element.style[s] = styles[s];
		}
	}
}

function saveToFile(string, filename) {
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";

	var blob = new Blob([string], { type: 'octet/stream' }), // application/json
		url = window.URL.createObjectURL(blob);
	
	a.href = url;
	a.download = filename;

	fakeClick(a);

	setTimeout(function() {
		// cleanup and revoke
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, 500);
}



var input, openCallback;

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	//console.log('handle file select', files.length);

	var f = files[0];
	if (!f) return;
	// Can try to do MINE match
	// if (!f.type.match('application/json')) {
	//   return;
	// }
	//console.log('match', f.type);

	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = function(e) {
		var data = e.target.result;
		openCallback(data);
	};
	
	reader.readAsText(f);

	input.value = '';
}


function openAs(callback, target) {
	//console.log('openfile...');
	openCallback = callback;

	if (!input) {
		input = document.createElement('input');
		input.style.display = 'none';
		input.type = 'file';
		input.addEventListener('change', handleFileSelect);
		target = target || document.body;
		target.appendChild(input);
	}
	
	fakeClick(input);
}

function fakeClick(target) {
	var e = document.createEvent("MouseEvents");
	e.initMouseEvent(
		'click', true, false, window, 0, 0, 0, 0, 0,
		false, false, false, false, 0, null
	);
	target.dispatchEvent(e);
}

function format_friendly_seconds(s, type) {
	// TODO Refactor to 60fps???
	// 20 mins * 60 sec = 1080 
	// 1080s * 60fps = 1080 * 60 < Number.MAX_SAFE_INTEGER

	var raw_secs = s | 0;
	var secs_micro = s % 60;
	var secs = raw_secs % 60;
	var raw_mins = raw_secs / 60 | 0;
	var mins = raw_mins % 60;
	var hours = raw_mins / 60 | 0;

	var secs_str = (secs / 100).toFixed(2).substring(2);

	var str = mins + ':' + secs_str;

	if (s % 1 > 0) {
		var t2 = (s % 1) * 60;
		if (type === 'frames') str = secs + '+' + t2.toFixed(0) + 'f';
		else str += ((s % 1).toFixed(2)).substring(1);
		// else str = mins + ':' + secs_micro;
		// else str = secs_micro + 's'; /// .toFixed(2)
	}
	return str;	
}

function proxy_ctx(ctx) {
	// Creates a proxy 2d context wrapper which 
	// allows the fluent / chaining API.
	var wrapper = {};

	function proxy_function(c) {
		return function() {
			// Warning: this doesn't return value of function call
			ctx[c].apply(ctx, arguments);
			return wrapper;
		};
	}

	function proxy_property(c) {
		return function(v) {
			ctx[c] = v;
			return wrapper;
		};
	}

	wrapper.run = function(args) {
		args(wrapper);
		return wrapper;
	};

	for (var c in ctx) {
		// if (!ctx.hasOwnProperty(c)) continue;
		// console.log(c, typeof(ctx[c]), ctx.hasOwnProperty(c));
		// string, number, boolean, function, object

		var type = typeof(ctx[c]);
		switch(type) {
			case 'object':
				break;
			case 'function':
				wrapper[c] = proxy_function(c);
				break;
			default:
				wrapper[c] = proxy_property(c);
				break;
		}
	}

	return wrapper;
}

},{}],12:[function(require,module,exports){
module.exports={
	"unitsPerEm": 1792,
	"ascender": 1536,
	"descender": -256,
	"fonts": {
		"plus": {
			"advanceWidth": 1408,
			"commands": "M,1408,800 C,1408,853,1365,896,1312,896 L,896,896 L,896,1312 C,896,1365,853,1408,800,1408 L,608,1408 C,555,1408,512,1365,512,1312 L,512,896 L,96,896 C,43,896,0,853,0,800 L,0,608 C,0,555,43,512,96,512 L,512,512 L,512,96 C,512,43,555,0,608,0 L,800,0 C,853,0,896,43,896,96 L,896,512 L,1312,512 C,1365,512,1408,555,1408,608 Z"
		},
		"minus": {
			"advanceWidth": 1408,
			"commands": "M,1408,800 C,1408,853,1365,896,1312,896 L,96,896 C,43,896,0,853,0,800 L,0,608 C,0,555,43,512,96,512 L,1312,512 C,1365,512,1408,555,1408,608 Z"
		},
		"ok": {
			"advanceWidth": 1792,
			"commands": "M,1671,970 C,1671,995,1661,1020,1643,1038 L,1507,1174 C,1489,1192,1464,1202,1439,1202 C,1414,1202,1389,1192,1371,1174 L,715,517 L,421,812 C,403,830,378,840,353,840 C,328,840,303,830,285,812 L,149,676 C,131,658,121,633,121,608 C,121,583,131,558,149,540 L,511,178 L,647,42 C,665,24,690,14,715,14 C,740,14,765,24,783,42 L,919,178 L,1643,902 C,1661,920,1671,945,1671,970 Z"
		},
		"remove": {
			"advanceWidth": 1408,
			"commands": "M,1298,214 C,1298,239,1288,264,1270,282 L,976,576 L,1270,870 C,1288,888,1298,913,1298,938 C,1298,963,1288,988,1270,1006 L,1134,1142 C,1116,1160,1091,1170,1066,1170 C,1041,1170,1016,1160,998,1142 L,704,848 L,410,1142 C,392,1160,367,1170,342,1170 C,317,1170,292,1160,274,1142 L,138,1006 C,120,988,110,963,110,938 C,110,913,120,888,138,870 L,432,576 L,138,282 C,120,264,110,239,110,214 C,110,189,120,164,138,146 L,274,10 C,292,-8,317,-18,342,-18 C,367,-18,392,-8,410,10 L,704,304 L,998,10 C,1016,-8,1041,-18,1066,-18 C,1091,-18,1116,-8,1134,10 L,1270,146 C,1288,164,1298,189,1298,214 Z"
		},
		"zoom_in": {
			"advanceWidth": 1664,
			"commands": "M,1024,736 C,1024,753,1009,768,992,768 L,768,768 L,768,992 C,768,1009,753,1024,736,1024 L,672,1024 C,655,1024,640,1009,640,992 L,640,768 L,416,768 C,399,768,384,753,384,736 L,384,672 C,384,655,399,640,416,640 L,640,640 L,640,416 C,640,399,655,384,672,384 L,736,384 C,753,384,768,399,768,416 L,768,640 L,992,640 C,1009,640,1024,655,1024,672 M,1152,704 C,1152,457,951,256,704,256 C,457,256,256,457,256,704 C,256,951,457,1152,704,1152 C,951,1152,1152,951,1152,704 M,1664,-128 C,1664,-94,1650,-61,1627,-38 L,1284,305 C,1365,422,1408,562,1408,704 C,1408,1093,1093,1408,704,1408 C,315,1408,0,1093,0,704 C,0,315,315,0,704,0 C,846,0,986,43,1103,124 L,1446,-218 C,1469,-242,1502,-256,1536,-256 C,1607,-256,1664,-199,1664,-128 Z"
		},
		"zoom_out": {
			"advanceWidth": 1664,
			"commands": "M,1024,736 C,1024,753,1009,768,992,768 L,416,768 C,399,768,384,753,384,736 L,384,672 C,384,655,399,640,416,640 L,992,640 C,1009,640,1024,655,1024,672 M,1152,704 C,1152,457,951,256,704,256 C,457,256,256,457,256,704 C,256,951,457,1152,704,1152 C,951,1152,1152,951,1152,704 M,1664,-128 C,1664,-94,1650,-61,1627,-38 L,1284,305 C,1365,422,1408,562,1408,704 C,1408,1093,1093,1408,704,1408 C,315,1408,0,1093,0,704 C,0,315,315,0,704,0 C,846,0,986,43,1103,124 L,1446,-218 C,1469,-242,1502,-256,1536,-256 C,1607,-256,1664,-199,1664,-128 Z"
		},
		"cog": {
			"advanceWidth": 1536,
			"commands": "M,1024,640 C,1024,499,909,384,768,384 C,627,384,512,499,512,640 C,512,781,627,896,768,896 C,909,896,1024,781,1024,640 M,1536,749 C,1536,766,1524,782,1507,785 L,1324,813 C,1314,846,1300,879,1283,911 C,1317,958,1354,1002,1388,1048 C,1393,1055,1396,1062,1396,1071 C,1396,1079,1394,1087,1389,1093 C,1347,1152,1277,1214,1224,1263 C,1217,1269,1208,1273,1199,1273 C,1190,1273,1181,1270,1175,1264 L,1033,1157 C,1004,1172,974,1184,943,1194 L,915,1378 C,913,1395,897,1408,879,1408 L,657,1408 C,639,1408,625,1396,621,1380 C,605,1320,599,1255,592,1194 C,561,1184,530,1171,501,1156 L,363,1263 C,355,1269,346,1273,337,1273 C,303,1273,168,1127,144,1094 C,139,1087,135,1080,135,1071 C,135,1062,139,1054,145,1047 C,182,1002,218,957,252,909 C,236,879,223,849,213,817 L,27,789 C,12,786,0,768,0,753 L,0,531 C,0,514,12,498,29,495 L,212,468 C,222,434,236,401,253,369 C,219,322,182,278,148,232 C,143,225,140,218,140,209 C,140,201,142,193,147,186 C,189,128,259,66,312,18 C,319,11,328,7,337,7 C,346,7,355,10,362,16 L,503,123 C,532,108,562,96,593,86 L,621,-98 C,623,-115,639,-128,657,-128 L,879,-128 C,897,-128,911,-116,915,-100 C,931,-40,937,25,944,86 C,975,96,1006,109,1035,124 L,1173,16 C,1181,11,1190,7,1199,7 C,1233,7,1368,154,1392,186 C,1398,193,1401,200,1401,209 C,1401,218,1397,227,1391,234 C,1354,279,1318,323,1284,372 C,1300,401,1312,431,1323,463 L,1508,491 C,1524,494,1536,512,1536,527 Z"
		},
		"trash": {
			"advanceWidth": 1408,
			"commands": "M,512,800 C,512,818,498,832,480,832 L,416,832 C,398,832,384,818,384,800 L,384,224 C,384,206,398,192,416,192 L,480,192 C,498,192,512,206,512,224 M,768,800 C,768,818,754,832,736,832 L,672,832 C,654,832,640,818,640,800 L,640,224 C,640,206,654,192,672,192 L,736,192 C,754,192,768,206,768,224 M,1024,800 C,1024,818,1010,832,992,832 L,928,832 C,910,832,896,818,896,800 L,896,224 C,896,206,910,192,928,192 L,992,192 C,1010,192,1024,206,1024,224 M,1152,76 C,1152,28,1125,0,1120,0 L,288,0 C,283,0,256,28,256,76 L,256,1024 L,1152,1024 L,1152,76 M,480,1152 L,529,1269 C,532,1273,540,1279,546,1280 L,863,1280 C,868,1279,877,1273,880,1269 L,928,1152 M,1408,1120 C,1408,1138,1394,1152,1376,1152 L,1067,1152 L,997,1319 C,977,1368,917,1408,864,1408 L,544,1408 C,491,1408,431,1368,411,1319 L,341,1152 L,32,1152 C,14,1152,0,1138,0,1120 L,0,1056 C,0,1038,14,1024,32,1024 L,128,1024 L,128,72 C,128,-38,200,-128,288,-128 L,1120,-128 C,1208,-128,1280,-34,1280,76 L,1280,1024 L,1376,1024 C,1394,1024,1408,1038,1408,1056 Z"
		},
		"file_alt": {
			"advanceWidth": 1536,
			"commands": "M,1468,1156 L,1156,1468 C,1119,1505,1045,1536,992,1536 L,96,1536 C,43,1536,0,1493,0,1440 L,0,-160 C,0,-213,43,-256,96,-256 L,1440,-256 C,1493,-256,1536,-213,1536,-160 L,1536,992 C,1536,1045,1505,1119,1468,1156 M,1024,1400 C,1041,1394,1058,1385,1065,1378 L,1378,1065 C,1385,1058,1394,1041,1400,1024 L,1024,1024 M,1408,-128 L,128,-128 L,128,1408 L,896,1408 L,896,992 C,896,939,939,896,992,896 L,1408,896 Z"
		},
		"download_alt": {
			"advanceWidth": 1664,
			"commands": "M,1280,192 C,1280,157,1251,128,1216,128 C,1181,128,1152,157,1152,192 C,1152,227,1181,256,1216,256 C,1251,256,1280,227,1280,192 M,1536,192 C,1536,157,1507,128,1472,128 C,1437,128,1408,157,1408,192 C,1408,227,1437,256,1472,256 C,1507,256,1536,227,1536,192 M,1664,416 C,1664,469,1621,512,1568,512 L,1104,512 L,968,376 C,931,340,883,320,832,320 C,781,320,733,340,696,376 L,561,512 L,96,512 C,43,512,0,469,0,416 L,0,96 C,0,43,43,0,96,0 L,1568,0 C,1621,0,1664,43,1664,96 M,1339,985 C,1329,1008,1306,1024,1280,1024 L,1024,1024 L,1024,1472 C,1024,1507,995,1536,960,1536 L,704,1536 C,669,1536,640,1507,640,1472 L,640,1024 L,384,1024 C,358,1024,335,1008,325,985 C,315,961,320,933,339,915 L,787,467 C,799,454,816,448,832,448 C,848,448,865,454,877,467 L,1325,915 C,1344,933,1349,961,1339,985 Z"
		},
		"repeat": {
			"advanceWidth": 1536,
			"commands": "M,1536,1280 C,1536,1306,1520,1329,1497,1339 C,1473,1349,1445,1344,1427,1325 L,1297,1196 C,1156,1329,965,1408,768,1408 C,345,1408,0,1063,0,640 C,0,217,345,-128,768,-128 C,997,-128,1213,-27,1359,149 C,1369,162,1369,181,1357,192 L,1220,330 C,1213,336,1204,339,1195,339 C,1186,338,1177,334,1172,327 C,1074,200,927,128,768,128 C,486,128,256,358,256,640 C,256,922,486,1152,768,1152 C,899,1152,1023,1102,1117,1015 L,979,877 C,960,859,955,831,965,808 C,975,784,998,768,1024,768 L,1472,768 C,1507,768,1536,797,1536,832 Z"
		},
		"pencil": {
			"advanceWidth": 1536,
			"commands": "M,363,0 L,256,0 L,256,128 L,128,128 L,128,235 L,219,326 L,454,91 M,886,928 C,886,922,884,916,879,911 L,337,369 C,332,364,326,362,320,362 C,307,362,298,371,298,384 C,298,390,300,396,305,401 L,847,943 C,852,948,858,950,864,950 C,877,950,886,941,886,928 M,832,1120 L,0,288 L,0,-128 L,416,-128 L,1248,704 M,1515,1024 C,1515,1058,1501,1091,1478,1115 L,1243,1349 C,1219,1373,1186,1387,1152,1387 C,1118,1387,1085,1373,1062,1349 L,896,1184 L,1312,768 L,1478,934 C,1501,957,1515,990,1515,1024 Z"
		},
		"edit": {
			"advanceWidth": 1792,
			"commands": "M,888,352 L,832,352 L,832,448 L,736,448 L,736,504 L,852,620 L,1004,468 M,1328,1072 C,1337,1063,1336,1048,1327,1039 L,977,689 C,968,680,953,679,944,688 C,935,697,936,712,945,721 L,1295,1071 C,1304,1080,1319,1081,1328,1072 M,1408,478 C,1408,491,1400,502,1388,507 C,1376,512,1363,510,1353,500 L,1289,436 C,1283,430,1280,422,1280,414 L,1280,288 C,1280,200,1208,128,1120,128 L,288,128 C,200,128,128,200,128,288 L,128,1120 C,128,1208,200,1280,288,1280 L,1120,1280 C,1135,1280,1150,1278,1165,1274 C,1176,1270,1188,1273,1197,1282 L,1246,1331 C,1254,1339,1257,1349,1255,1360 C,1253,1370,1246,1379,1237,1383 C,1200,1400,1160,1408,1120,1408 L,288,1408 C,129,1408,0,1279,0,1120 L,0,288 C,0,129,129,0,288,0 L,1120,0 C,1279,0,1408,129,1408,288 M,1312,1216 L,640,544 L,640,256 L,928,256 L,1600,928 M,1756,1084 C,1793,1121,1793,1183,1756,1220 L,1604,1372 C,1567,1409,1505,1409,1468,1372 L,1376,1280 L,1664,992 L,1756,1084 Z"
		},
		"play": {
			"advanceWidth": 1408,
			"commands": "M,1384,609 C,1415,626,1415,654,1384,671 L,56,1409 C,25,1426,0,1411,0,1376 L,0,-96 C,0,-131,25,-146,56,-129 Z"
		},
		"pause": {
			"advanceWidth": 1536,
			"commands": "M,1536,1344 C,1536,1379,1507,1408,1472,1408 L,960,1408 C,925,1408,896,1379,896,1344 L,896,-64 C,896,-99,925,-128,960,-128 L,1472,-128 C,1507,-128,1536,-99,1536,-64 M,640,1344 C,640,1379,611,1408,576,1408 L,64,1408 C,29,1408,0,1379,0,1344 L,0,-64 C,0,-99,29,-128,64,-128 L,576,-128 C,611,-128,640,-99,640,-64 Z"
		},
		"stop": {
			"advanceWidth": 1536,
			"commands": "M,1536,1344 C,1536,1379,1507,1408,1472,1408 L,64,1408 C,29,1408,0,1379,0,1344 L,0,-64 C,0,-99,29,-128,64,-128 L,1472,-128 C,1507,-128,1536,-99,1536,-64 Z"
		},
		"resize_full": {
			"advanceWidth": 1536,
			"commands": "M,755,480 C,755,488,751,497,745,503 L,631,617 C,625,623,616,627,608,627 C,600,627,591,623,585,617 L,253,285 L,109,429 C,97,441,81,448,64,448 C,29,448,0,419,0,384 L,0,-64 C,0,-99,29,-128,64,-128 L,512,-128 C,547,-128,576,-99,576,-64 C,576,-47,569,-31,557,-19 L,413,125 L,745,457 C,751,463,755,472,755,480 M,1536,1344 C,1536,1379,1507,1408,1472,1408 L,1024,1408 C,989,1408,960,1379,960,1344 C,960,1327,967,1311,979,1299 L,1123,1155 L,791,823 C,785,817,781,808,781,800 C,781,792,785,783,791,777 L,905,663 C,911,657,920,653,928,653 C,936,653,945,657,951,663 L,1283,995 L,1427,851 C,1439,839,1455,832,1472,832 C,1507,832,1536,861,1536,896 Z"
		},
		"resize_small": {
			"advanceWidth": 1536,
			"commands": "M,768,576 C,768,611,739,640,704,640 L,256,640 C,221,640,192,611,192,576 C,192,559,199,543,211,531 L,355,387 L,23,55 C,17,49,13,40,13,32 C,13,24,17,15,23,9 L,137,-105 C,143,-111,152,-115,160,-115 C,168,-115,177,-111,183,-105 L,515,227 L,659,83 C,671,71,687,64,704,64 C,739,64,768,93,768,128 M,1523,1248 C,1523,1256,1519,1265,1513,1271 L,1399,1385 C,1393,1391,1384,1395,1376,1395 C,1368,1395,1359,1391,1353,1385 L,1021,1053 L,877,1197 C,865,1209,849,1216,832,1216 C,797,1216,768,1187,768,1152 L,768,704 C,768,669,797,640,832,640 L,1280,640 C,1315,640,1344,669,1344,704 C,1344,721,1337,737,1325,749 L,1181,893 L,1513,1225 C,1519,1231,1523,1240,1523,1248 Z"
		},
		"eye_open": {
			"advanceWidth": 1792,
			"commands": "M,1664,576 C,1493,312,1217,128,896,128 C,575,128,299,312,128,576 C,223,723,353,849,509,929 C,469,861,448,783,448,704 C,448,457,649,256,896,256 C,1143,256,1344,457,1344,704 C,1344,783,1323,861,1283,929 C,1439,849,1569,723,1664,576 M,944,960 C,944,934,922,912,896,912 C,782,912,688,818,688,704 C,688,678,666,656,640,656 C,614,656,592,678,592,704 C,592,871,729,1008,896,1008 C,922,1008,944,986,944,960 M,1792,576 C,1792,601,1784,624,1772,645 C,1588,947,1251,1152,896,1152 C,541,1152,204,947,20,645 C,8,624,0,601,0,576 C,0,551,8,528,20,507 C,204,205,541,0,896,0 C,1251,0,1588,204,1772,507 C,1784,528,1792,551,1792,576 Z"
		},
		"eye_close": {
			"advanceWidth": 1792,
			"commands": "M,555,201 C,379,280,232,415,128,576 C,223,723,353,849,509,929 C,469,861,448,783,448,704 C,448,561,517,426,633,342 M,944,960 C,944,934,922,912,896,912 C,782,912,688,819,688,704 C,688,678,666,656,640,656 C,614,656,592,678,592,704 C,592,871,729,1008,896,1008 C,922,1008,944,986,944,960 M,1307,1151 C,1307,1162,1301,1172,1291,1178 C,1270,1190,1176,1248,1158,1248 C,1146,1248,1136,1242,1130,1232 L,1076,1135 C,1017,1146,956,1152,896,1152 C,527,1152,218,949,20,645 C,7,625,0,600,0,576 C,0,551,7,527,20,507 C,135,327,298,177,492,89 C,482,72,448,18,448,2 C,448,-10,454,-20,464,-26 C,485,-38,580,-96,598,-96 C,609,-96,620,-90,626,-80 L,675,9 C,886,386,1095,765,1306,1142 C,1307,1144,1307,1149,1307,1151 M,1344,704 C,1344,732,1341,760,1336,788 L,1056,286 C,1229,352,1344,518,1344,704 M,1792,576 C,1792,602,1785,623,1772,645 C,1694,774,1569,899,1445,982 L,1382,870 C,1495,792,1590,691,1664,576 C,1508,334,1261,157,970,132 L,896,0 C,1197,0,1467,137,1663,362 C,1702,407,1741,456,1772,507 C,1785,529,1792,550,1792,576 Z"
		},
		"folder_open": {
			"advanceWidth": 1920,
			"commands": "M,1879,584 C,1879,629,1828,640,1792,640 L,704,640 C,616,640,498,586,440,518 L,104,122 C,88,104,73,80,73,56 C,73,11,124,0,160,0 L,1248,0 C,1336,0,1454,54,1512,122 L,1848,518 C,1864,536,1879,560,1879,584 M,1536,928 C,1536,1051,1435,1152,1312,1152 L,768,1152 L,768,1184 C,768,1307,667,1408,544,1408 L,224,1408 C,101,1408,0,1307,0,1184 L,0,224 C,0,216,1,207,1,199 L,6,205 L,343,601 C,424,697,579,768,704,768 L,1536,768 Z"
		},
		"signin": {
			"advanceWidth": 1536,
			"commands": "M,1184,640 C,1184,657,1177,673,1165,685 L,621,1229 C,609,1241,593,1248,576,1248 C,541,1248,512,1219,512,1184 L,512,896 L,64,896 C,29,896,0,867,0,832 L,0,448 C,0,413,29,384,64,384 L,512,384 L,512,96 C,512,61,541,32,576,32 C,593,32,609,39,621,51 L,1165,595 C,1177,607,1184,623,1184,640 M,1536,992 C,1536,1151,1407,1280,1248,1280 L,928,1280 C,883,1280,896,1212,896,1184 C,896,1147,935,1152,960,1152 L,1248,1152 C,1336,1152,1408,1080,1408,992 L,1408,288 C,1408,200,1336,128,1248,128 L,928,128 C,883,128,896,60,896,32 C,896,15,911,0,928,0 L,1248,0 C,1407,0,1536,129,1536,288 Z"
		},
		"upload_alt": {
			"advanceWidth": 1664,
			"commands": "M,1280,64 C,1280,29,1251,0,1216,0 C,1181,0,1152,29,1152,64 C,1152,99,1181,128,1216,128 C,1251,128,1280,99,1280,64 M,1536,64 C,1536,29,1507,0,1472,0 C,1437,0,1408,29,1408,64 C,1408,99,1437,128,1472,128 C,1507,128,1536,99,1536,64 M,1664,288 C,1664,341,1621,384,1568,384 L,1141,384 C,1114,310,1043,256,960,256 L,704,256 C,621,256,550,310,523,384 L,96,384 C,43,384,0,341,0,288 L,0,-32 C,0,-85,43,-128,96,-128 L,1568,-128 C,1621,-128,1664,-85,1664,-32 M,1339,936 C,1349,959,1344,987,1325,1005 L,877,1453 C,865,1466,848,1472,832,1472 C,816,1472,799,1466,787,1453 L,339,1005 C,320,987,315,959,325,936 C,335,912,358,896,384,896 L,640,896 L,640,448 C,640,413,669,384,704,384 L,960,384 C,995,384,1024,413,1024,448 L,1024,896 L,1280,896 C,1306,896,1329,912,1339,936 Z"
		},
		"save": {
			"advanceWidth": 1536,
			"commands": "M,384,0 L,384,384 L,1152,384 L,1152,0 M,1280,0 L,1280,416 C,1280,469,1237,512,1184,512 L,352,512 C,299,512,256,469,256,416 L,256,0 L,128,0 L,128,1280 L,256,1280 L,256,864 C,256,811,299,768,352,768 L,928,768 C,981,768,1024,811,1024,864 L,1024,1280 C,1044,1280,1083,1264,1097,1250 L,1378,969 C,1391,956,1408,915,1408,896 L,1408,0 M,896,928 C,896,911,881,896,864,896 L,672,896 C,655,896,640,911,640,928 L,640,1248 C,640,1265,655,1280,672,1280 L,864,1280 C,881,1280,896,1265,896,1248 L,896,928 M,1536,896 C,1536,949,1506,1022,1468,1060 L,1188,1340 C,1150,1378,1077,1408,1024,1408 L,96,1408 C,43,1408,0,1365,0,1312 L,0,-32 C,0,-85,43,-128,96,-128 L,1440,-128 C,1493,-128,1536,-85,1536,-32 Z"
		},
		"undo": {
			"advanceWidth": 1536,
			"commands": "M,1536,640 C,1536,1063,1191,1408,768,1408 C,571,1408,380,1329,239,1196 L,109,1325 C,91,1344,63,1349,40,1339 C,16,1329,0,1306,0,1280 L,0,832 C,0,797,29,768,64,768 L,512,768 C,538,768,561,784,571,808 C,581,831,576,859,557,877 L,420,1015 C,513,1102,637,1152,768,1152 C,1050,1152,1280,922,1280,640 C,1280,358,1050,128,768,128 C,609,128,462,200,364,327 C,359,334,350,338,341,339 C,332,339,323,336,316,330 L,179,192 C,168,181,167,162,177,149 C,323,-27,539,-128,768,-128 C,1191,-128,1536,217,1536,640 Z"
		},
		"paste": {
			"advanceWidth": 1792,
			"commands": "M,768,-128 L,768,1024 L,1152,1024 L,1152,608 C,1152,555,1195,512,1248,512 L,1664,512 L,1664,-128 M,1024,1312 C,1024,1295,1009,1280,992,1280 L,288,1280 C,271,1280,256,1295,256,1312 L,256,1376 C,256,1393,271,1408,288,1408 L,992,1408 C,1009,1408,1024,1393,1024,1376 L,1024,1312 M,1280,640 L,1280,939 L,1579,640 M,1792,512 C,1792,565,1762,638,1724,676 L,1316,1084 C,1305,1095,1293,1104,1280,1112 L,1280,1440 C,1280,1493,1237,1536,1184,1536 L,96,1536 C,43,1536,0,1493,0,1440 L,0,96 C,0,43,43,0,96,0 L,640,0 L,640,-160 C,640,-213,683,-256,736,-256 L,1696,-256 C,1749,-256,1792,-213,1792,-160 Z"
		},
		"folder_open_alt": {
			"advanceWidth": 1920,
			"commands": "M,1781,605 C,1781,590,1772,577,1763,566 L,1469,203 C,1435,161,1365,128,1312,128 L,224,128 C,202,128,171,135,171,163 C,171,178,180,191,189,203 L,483,566 C,517,607,587,640,640,640 L,1728,640 C,1750,640,1781,633,1781,605 M,640,768 C,549,768,442,717,384,646 L,128,331 L,128,1184 C,128,1237,171,1280,224,1280 L,544,1280 C,597,1280,640,1237,640,1184 L,640,1120 C,640,1067,683,1024,736,1024 L,1312,1024 C,1365,1024,1408,981,1408,928 L,1408,768 M,1909,605 C,1909,629,1904,652,1894,673 C,1864,737,1796,768,1728,768 L,1536,768 L,1536,928 C,1536,1051,1435,1152,1312,1152 L,768,1152 L,768,1184 C,768,1307,667,1408,544,1408 L,224,1408 C,101,1408,0,1307,0,1184 L,0,224 C,0,101,101,0,224,0 L,1312,0 C,1402,0,1511,52,1568,122 L,1863,485 C,1890,519,1909,561,1909,605 Z"
		}
	}
}
},{}],13:[function(require,module,exports){
var font = require('./font.json'),
	Theme = require('../theme'),
	style = require('../utils').style;

var dp;

function IconButton(size, icon, tooltip, dp) {
	var iconStyle = {
		padding: '0.2em 0.4em',
		margin: '0em',
		background: 'none',
		outline: 'none',
		fontSize: '16px',
		border: 'none',
		borderRadius: '0.2em',
	};

	var button = document.createElement('button');
	style(button, iconStyle);

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	button.appendChild(canvas);

	this.ctx = ctx;
	this.dom = button;
	this.canvas = canvas;

	var me = this;
	this.size = size;
	var dpr = 1;

	this.resize = function() {
		dpr = window.devicePixelRatio;
		var height = size;

		var glyph = font.fonts[icon];

		canvas.height = height * dpr;
		canvas.style.height = height + 'px';

		var scale = height / font.unitsPerEm;
		var width = glyph.advanceWidth * scale + 0.5 | 0;

		width += 2;
		height += 2;

		canvas.width = width * dpr;
		canvas.style.width = width + 'px';

		ctx.fillStyle = Theme.c;
		me.draw();
	};

	if (dp) dp.on('resize', this.resize);

	this.setSize = function(s) {
		size = s;
		this.resize();
	};

	this.setIcon = function(icon) {
		me.icon = icon;

		if (!font.fonts[icon]) console.error('Font icon not found!');
		this.resize();
	};

	this.onClick = function(e) {
		button.addEventListener('click', e);
	};

	var LONG_HOLD_DURATION = 500;
	var longHoldTimer;

	this.onLongHold = function(f) {
		// not most elagent but oh wells.
		function startHold(e) {
			e.preventDefault();
			e.stopPropagation();
			longHoldTimer = setTimeout(function() {
				if (longHoldTimer) {
					//console.log('LONG HOLD-ED!');
					f();
				}
			}, LONG_HOLD_DURATION);
		}

		function clearLongHoldTimer() {
			clearTimeout(longHoldTimer);
		}

		button.addEventListener('mousedown', startHold);
		button.addEventListener('touchstart', startHold);
		button.addEventListener('mouseup', clearLongHoldTimer);
		button.addEventListener('mouseout', clearLongHoldTimer);
		button.addEventListener('touchend', clearLongHoldTimer);
	};

	this.setTip = function(tip) {
		tooltip = tip;
	};

	var borders = {
		border: '1px solid ' + Theme.b,
		// boxShadow: Theme.b + ' 1px 1px'
	};

	var no_borders = {
		border: '1px solid transparent',
		// boxShadow: 'none'
	};

	var normal = 'none'; // Theme.b;
	var up = Theme.c;
	var down = Theme.b;

	button.style.background = normal;
	style(button, no_borders);

	button.addEventListener('mouseover', function() {
		// button.style.background = up;
		style(button, borders);

		ctx.fillStyle = Theme.d;
		// me.dropshadow = true;
		ctx.shadowColor = Theme.b;
		ctx.shadowBlur = 0.5 * dpr;
		ctx.shadowOffsetX = 1 * dpr;
		ctx.shadowOffsetY = 1 * dpr;
		me.draw();

		if (tooltip && dp) dp.fire('status', tooltip);
	});

	button.addEventListener('mousedown', function() {
		button.style.background = down;
		// ctx.fillStyle = Theme.b;
		// me.draw();
	});

	button.addEventListener('mouseup', function() {
		// ctx.fillStyle = Theme.d;
		button.style.background = normal;
		style(button, borders);
		// me.draw();
	});

	button.addEventListener('mouseout', function() {
		// ctx.fillStyle = Theme.c;


		button.style.background = normal;
		style(button, no_borders);
		me.dropshadow = false;
		ctx.fillStyle = Theme.c;
		ctx.shadowColor = null;
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		me.draw();
	});

	if (icon) this.setIcon(icon);
}

IconButton.prototype.CMD_MAP = {
	M: 'moveTo',
	L: 'lineTo',
	Q: 'quadraticCurveTo',
	C: 'bezierCurveTo',
	Z: 'closePath'
};

IconButton.prototype.draw = function() {
	if (!this.icon) return;

	var ctx = this.ctx;

	var glyph = font.fonts[this.icon];

	var height = this.size;
	var dpr = window.devicePixelRatio;
	var scale = height / font.unitsPerEm * dpr;
	var path_commands =  glyph.commands.split(' ');

	ctx.save();
	ctx.clearRect(0, 0, this.canvas.width * dpr, this.canvas.height * dpr);

	if (this.dropshadow) {
		ctx.save();
		ctx.fillStyle = Theme.b;
		ctx.translate(1.5 * dpr, 1.5 * dpr);
		ctx.scale(scale, -scale);
		ctx.translate(0 , -font.ascender);
		ctx.beginPath();

		for (var i = 0, il = path_commands.length; i < il; i++) {
			var cmds = path_commands[i].split(',');
			var params = cmds.slice(1);

			ctx[this.CMD_MAP[cmds[0]]].apply(ctx, params);
		}
		ctx.fill();
		ctx.restore();
	}

	ctx.scale(scale, -scale);
	ctx.translate(0, -font.ascender);
	ctx.beginPath();

	for (var i = 0, il = path_commands.length; i < il; i++) {
		var cmds = path_commands[i].split(',');
		var params = cmds.slice(1);

		ctx[this.CMD_MAP[cmds[0]]].apply(ctx, params);
	}
	ctx.fill();
	ctx.restore();

	/*
	var triangle = height / 3 * dpr;
	ctx.save();
	// ctx.translate(dpr * 2, 0);
	// ctx.fillRect(this.canvas.width - triangle, this.canvas.height - triangle, triangle, triangle);
	ctx.beginPath();
	ctx.moveTo(this.canvas.width - triangle, this.canvas.height - triangle / 2);
	ctx.lineTo(this.canvas.width, this.canvas.height - triangle / 2);
	ctx.lineTo(this.canvas.width - triangle / 2, this.canvas.height);
	ctx.fill();
	ctx.restore();
	*/
};

module.exports = IconButton;

},{"../theme":7,"../utils":11,"./font.json":12}],14:[function(require,module,exports){
var Theme = require('../theme'),
	Do = require('do.js'),
	style = require('../utils').style,
	handleDrag = require('../utils').handleDrag
	;

/**************************/
// NumberUI
/**************************/

function NumberUI(config) {
	config = config || {};
	var min = config.min === undefined ? -Infinity : config.min;
	var step = config.step || 0.1;
	var precision = config.precision || 3;
	// Range
	// Max

	var span = document.createElement('input');
	// span.type = 'number'; // spinner
	
	style(span, {
		textAlign: 'center',
		fontSize: '10px',
		padding: '1px',
		cursor: 'ns-resize',
		width: '40px',
		margin: 0,
		marginRight: '10px',
		appearance: 'none',
		outline: 'none',
		border: 0,
		background: 'none',
		borderBottom: '1px dotted '+ Theme.c,
		color: Theme.c
	});

	var me = this;
	var state, value = 0, unchanged_value;

	this.onChange = new Do();

	span.addEventListener('change', function(e) {
		//console.log('input changed', span.value);
		value = parseFloat(span.value, 10);

		fireChange();
	});

	handleDrag(span, onDown, onMove, onUp);

	function onUp(e) {
		if (e.moved) fireChange();
		else {
			// single click
			span.focus();
		}
	}

	function onMove(e) {
		var dx = e.dx;
		var dy = e.dy;
	
		var stepping = 1 * step;
		// value = unchanged_value + dx * 0.000001 + dy * -10 * 0.01;
		value = unchanged_value + dx * stepping + dy * -stepping;

		value = Math.max(min, value);

		// value = +value.toFixed(precision); // or toFixed toPrecision
		me.onChange.fire(value, true);
	}

	function onDown(e) {
		unchanged_value = value;
	}

	function fireChange() {
		me.onChange.fire(value);
	}

	this.dom = span;

	// public
	this.setValue = function(v) {
		value = v;
	};

	this.paint = function() {
		if (value != null) span.value = value.toFixed(precision);
	};
}

module.exports = NumberUI;

},{"../theme":7,"../utils":11,"do.js":1}],15:[function(require,module,exports){
var SimpleEvent = require('do.js');
var utils = require('../utils');

// ********** class: ScrollBar ****************** //
/*
	Simple UI widget that displays a scrolltrack 
	and slider, that fires some scroll events
*/
// ***********************************************

var scrolltrack_style = {
	// float: 'right',
	position: 'absolute',
	// right: '0',
	// top: '0',
	// bottom: '0',
	background: '-webkit-gradient(linear, left top, right top, color-stop(0, rgb(29,29,29)), color-stop(0.6, rgb(50,50,50)) )',
	border: '1px solid rgb(29, 29, 29)',
	// zIndex: '1000',
	textAlign: 'center',
	cursor: 'pointer'
};

var scrollbar_style = {
	background: '-webkit-gradient(linear, left top, right top, color-stop(0.2, rgb(88,88,88)), color-stop(0.6, rgb(64,64,64)) )',
	border: '1px solid rgb(25,25,25)',
	// position: 'absolute',
	position: 'relative',
	borderRadius: '6px'
};

function ScrollBar(h, w, dispatcher) {

	var SCROLLBAR_WIDTH = w ? w : 12;
	var SCROLLBAR_MARGIN = 3;
	var SCROLL_WIDTH = SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2;
	var MIN_BAR_LENGTH = 25;

	var scrolltrack = document.createElement('div');
	utils.style(scrolltrack, scrolltrack_style);

	var scrolltrackHeight = h - 2;
	scrolltrack.style.height = scrolltrackHeight + 'px';
	scrolltrack.style.width = SCROLL_WIDTH + 'px';;

	// var scrollTop = 0;
	var scrollbar = document.createElement('div');
	// scrollbar.className = 'scrollbar';
	utils.style(scrollbar, scrollbar_style);
	scrollbar.style.width = SCROLLBAR_WIDTH + 'px';
	scrollbar.style.height = h / 2;
	scrollbar.style.top = 0;
	scrollbar.style.left = SCROLLBAR_MARGIN + 'px'; // 0; //S

	scrolltrack.appendChild(scrollbar);

	var me = this;

	var bar_length, bar_y;

	// Sets lengths of scrollbar by percentage
	this.setLength = function(l) {
		// limit 0..1
		l = Math.max(Math.min(1, l), 0);
		l *= scrolltrackHeight;
		bar_length = Math.max(l, MIN_BAR_LENGTH);
		scrollbar.style.height = bar_length + 'px';
	};

	this.setHeight = function(height) {
		h = height;

		scrolltrackHeight = h - 2;
		scrolltrack.style.height = scrolltrackHeight + 'px' ;
	};

	// Moves scrollbar to position by Percentage
	this.setPosition = function(p) {
		p = Math.max(Math.min(1, p), 0);
		var emptyTrack = scrolltrackHeight - bar_length;
		bar_y = p * emptyTrack;
		scrollbar.style.top = bar_y;
	};

	this.setLength(1);
	this.setPosition(0);
	this.onScroll = new SimpleEvent();

	var mouse_down_grip;

	function onDown(event) {
		event.preventDefault();

		if (event.target == scrollbar) {
			mouse_down_grip = event.clientY;
			document.addEventListener('mousemove', onMove, false);
			document.addEventListener('mouseup', onUp, false);
		} else {
			if (event.clientY < bar_y) {
				me.onScroll.fire('pageup');
			} else if (event.clientY > (bar_y + bar_length)) {
				me.onScroll.fire('pagedown');
			}
			// if want to drag scroller to empty track instead
			// me.setPosition(event.clientY / (scrolltrackHeight - 1));
		}
	}

	function onMove(event) {
		event.preventDefault();

		// event.target == scrollbar
		var emptyTrack = scrolltrackHeight - bar_length;
		var scrollto = (event.clientY - mouse_down_grip) / emptyTrack;

		// clamp limits to 0..1
		if (scrollto > 1) scrollto = 1;
		if (scrollto < 0) scrollto = 0;
		me.setPosition(scrollto);
		me.onScroll.fire('scrollto', scrollto);
	}

	function onUp(event) {
		onMove(event);
		document.removeEventListener('mousemove', onMove, false);
		document.removeEventListener('mouseup', onUp, false);
	}

	scrolltrack.addEventListener('mousedown', onDown, false);
	this.dom = scrolltrack;

}

module.exports = ScrollBar;

},{"../utils":11,"do.js":1}]},{},[3,4,5,6,7,8,9,10,11]);