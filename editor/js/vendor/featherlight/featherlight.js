/**
 * Featherlight - ultra slim jQuery lightbox
 * Version 0.4.9 - http://noelboss.github.io/featherlight/
 *
 * Copyright 2014, Noël Raoul Bossart (http://www.noelboss.com)
 * MIT Licensed.
**/
(function($) {
	"use strict";

	if('undefined' === typeof $) {
		if('console' in window){ window.console.info('Too much lightness, Featherlight needs jQuery.'); }
		return;
	}

	/* extend jQuery with standalone featherlight method  $.featherlight(elm, config); */
	var Fl = $.featherlight = function($content, config) {
		if(this.constructor === Fl) {  /* called with new */
			this.id = Fl.id++;
		} /* if $.featherlight() was called only with config or without anything, initialize manually */
		else if('string' !== typeof $content  && false === $content instanceof $){
			config = $.extend({}, Fl.defaults, $content || {});
			$(config.selector, config.context).featherlight();
		} else {
			var fl = new Fl().setup($content, config);
			fl.config.open.call(fl);
			return fl;
		}
	};

	var escapeHandler = function(event) {
		if (27 === event.keyCode && !event.isDefaultPrevented()) { // esc keycode
			var cur = Fl.current();
			if(cur && cur.config.closeOnEsc) {
				cur.$instance.find('.'+cur.config.namespace+'-close:first').click();
				event.preventDefault();
			}
		}
	};

	/* extend featherlight with defaults and methods */
	$.extend(Fl, {
		id: 0,                                    /* Used to id single featherlight instances */
		defaults: {                               /* You can access and override all defaults using $.featherlight.defaults */
			autostart:    true,                   /* Initialize all links with that match "selector" on document ready */
			namespace:    'featherlight',         /* Name of the events and css class prefix */
			selector:     '[data-featherlight]',  /* Elements that trigger the lightbox */
			context:      'body',                 /* Context used to search for the lightbox content and triggers */
			type: {                               /* Manually set type of lightbox. Otherwise, it will check for the targetAttrs value. */
				image: false,
				ajax: false
			},
			targetAttr:   'data-featherlight',    /* Attribute of the triggered element that contains the selector to the lightbox content */
			variant:      null,                   /* Class that will be added to change look of the lightbox */
			resetCss:     false,                  /* Reset all css */
			background:   null,                   /* Custom DOM for the background, wrapper and the closebutton */
			openTrigger:  'click',                /* Event that triggers the lightbox */
			closeTrigger: 'click',                /* Event that triggers the closing of the lightbox */
			openSpeed:    250,                    /* Duration of opening animation */
			closeSpeed:   250,                    /* Duration of closing animation */
			closeOnClick: 'background',           /* Close lightbox on click ('background', 'anywhere' or false) */
			closeOnEsc:   true,                   /* Close lightbox when pressing esc */
			closeIcon:    '&#10005;',             /* Close icon */
			beforeOpen:   $.noop,                 /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
			beforeClose:  $.noop,                 /* Called before close. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
			afterOpen:    $.noop,                 /* Called after open. Gets event as parameter, this contains all data */
			afterClose:   $.noop,                 /* Called after close. Gets event as parameter, this contains all data */
			contentFilters: ['jquery', 'image', 'html', 'ajax'], /* List of content filters to use to determine the content */
			/* opens the lightbox. "this" contains $instance with the lightbox, and with the config */
			open: function(event){
				var goOn = this.config.beforeOpen.call(this, event);
				if(false !== goOn){ /* if before function did not stop propagation */
					goOn = this.open(event);
				}
				if(false !== goOn){
					this.config.afterOpen.call(this, event);
				}
				return goOn;
			},
			/* closes the lightbox. "this" contains $instance with the lightbox, and with the config */
			close: function(event){
				var goOn = this.config.beforeClose.call(this, event);
				if(false !== goOn){ /* if before function did not stop propagation */
					this.close(event);
				}
			}
		},
		/* you can access and override all methods using $.featherlight.methods */
		methods: {
			/* setup iterates over a single instance of featherlight and prepares the background and binds the events */
			setup: function(target, config){
				/* all arguments are optional */
				if (typeof target === 'object' && target instanceof $ === false && !config) {
					config = target;
					target = undefined;
				}
				config = $.extend({}, Fl.defaults, config);

				var css = !config.resetCss ? config.namespace : config.namespace+'-reset', /* by adding -reset to the classname, we reset all the default css */
					$background = $(config.background || '<div id="'+css+'" class="'+css+'"><div id="'+css+'-content" class="'+css+'-content"><span class="'+css+'-close-icon '+ config.namespace + '-close">'+config.closeIcon+'</span></div></div>'),
					self = this;
					/* everything that we need later is stored in self (target) */
					$.extend(self, {
						config: config,
						target: target,
						$instance: $background.clone().addClass(config.variant) /* clone DOM for the background, wrapper and the close button */
					});

				/* close when click on background/anywhere/null or closebox */
				self.$instance.on(config.closeTrigger+'.'+config.namespace, function(event) {
					var $target = $(event.target);
					if( ('background' === config.closeOnClick  && $target.is('.'+config.namespace))
						|| 'anywhere' === config.closeOnClick
						|| $target.is('.'+config.namespace+'-close') ){
						event.preventDefault();
						config.close.call(self);
					}
				});

				return this;
			},

			attach: function($elm, $content, config){
				/* read attributes starting with data-featherlight- */
				var elementConfig = {};
				$.each($elm[0].attributes, function(){
					var match = this.name.match(/^data-featherlight-(.*)/);
					if (match) {
						var val = this.value;
						try { val = $.parseJSON(val); } catch(e) {}
						elementConfig[$.camelCase(match[1])] = val; }
				});

				this.$elm = $elm;
				this.setup($content, $.extend(elementConfig, config));
				$elm.on(this.config.openTrigger+'.'+this.config.namespace, $.proxy(this.config.open, this));
				return this;
			},

			/* this method prepares the content and converts it into a jQuery object */
			getContent: function(){
				var self = this,
					data = self.target || self.$elm.attr(self.config.targetAttr) || '';

				/* Find which filter applies */
				var filter;
				/* check explicit type like {type:{image: true}} */
				for(var filterName in self.config.type) {
					if(self.config.type[filterName] === true) {
						filter = Fl.contentFilters[filterName];
					}
				}
				/* check explicit type like data-featherlight="image" */
				if(!filter && data in Fl.contentFilters) {
					filter = Fl.contentFilters[data];
					data = self.target && self.$elm.attr(self.config.targetAttr);
				}
				data = data || self.$elm.attr('href') || '';
				/* otherwise it's implicit, run checks */
				if(!filter) {
					var target = data;
					data = null;
					$.each(self.config.contentFilters, function() {
						filter = Fl.contentFilters[this];
						if(filter.test)  { data = filter.test(target); }
						if(!data && filter.regex && target.match && target.match(filter.regex)) { data = target; }
						return !data;
					});
					if(!data) {
						if('console' in window){ window.console.error('Featherlight: no content filter found ' + (target ? ' for "' + target + '"' : ' (no target specified)')); }
						return false;
					}
				}
				/* Process it */
				return filter.process.call(self, data);
			},

			/* sets the content of $instance to $content */
			setContent: function($content){
				var self = this;
				/* we need a special class for the iframe */
				if($content.is('iframe') || $('iframe', $content).length > 0){
					self.$instance.addClass(self.config.namespace+'-iframe');
				}
				self.$content = $content.clone().addClass(self.config.namespace+'-inner');

				/* remove existing content */
				self.$instance.find('.'+self.config.namespace+'-inner').remove();
				self.$instance.find('.'+self.config.namespace+'-content').append(self.$content);
			},

			/* opens the lightbox. "this" contains $instance with the lightbox, and with the config */
			open: function(event){
				var self = this;
				if(event){
					event.preventDefault();
				}
				var $content = this.getContent();

				/* If we have content, add it and show lightbox */
				if($content){
					/* Add to opened registry */
					self.constructor._opened.add(self._openedCallback = function(response){
						if(self.$instance.closest('body').length > 0) {
							response.currentFeatherlight = self;
						}
					});
					/* Set content and show */

					if(this.config.closeOnEsc && escapeHandler) {
						$(document).bind('keyup.'+Fl.defaults.namespace, escapeHandler);
						escapeHandler = null;
					}
					this.setContent($content);
					this.$instance.appendTo('body').fadeIn(this.config.openSpeed);
				} else {
					return false;
				}
			},

			/* closes the lightbox. "this" contains $instance with the lightbox, and with the config */
			close: function(event){
				var self = this;
				self.constructor._opened.remove(self._openedCallback);
				self.$instance.fadeOut(self.config.closeSpeed,function(){
					self.$instance.detach();
					self.config.afterClose.call(self, event);
				});
			}
		},
		/* Contains the logic to determine content */
		contentFilters: {
			jquery: {
				regex: /^[#.]\w/,         /* Anything that starts with a class name or identifiers */
				test: function(elem)    { return elem instanceof $ && elem; },
				process: function(elem) { return $(elem); }
			},
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp)(\?\S*)?$/i,
				process: function(url)  { return $('<img src="'+url+'" alt="" class="'+this.config.namespace+'-image" />'); }
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			},
			ajax: {
				regex: /./,            /* At this point, any content is assumed to be an URL */
				process: function(url)  {
					var self = this;
					/* we are using load so one can specify a target with: url.html #targetelement */
					var content = $('<div></div>').load(url, function(response, status){
						if ( status !== "error" ) {
							$.featherlight(content.html(), $.extend({}, self.config, {type: {html: true}}));
						}
					});
				}
			}
		},

		current: function() {
			var response = {};
			this._opened.fire(response);
			return response.currentFeatherlight;
		},

		close: function() {
			var cur = Fl.current();
			if(cur) { cur.config.close.call(cur); }
		},

		_opened: $.Callbacks()
	});

	Fl.prototype = $.extend({constructor: Fl}, Fl.methods);

	/* extend jQuery with selector featherlight method $(elm).featherlight(config, elm); */
	$.fn.featherlight = function(config, $content) {
		this.each(function(){
			new Fl().attach($(this), $content, config);
		});
		return this;
	};

	/* bind featherlight on ready if config autostart is true */
	$(document).ready(function(){
		var config = Fl.defaults;
		if(config.autostart){
			$(config.selector, config.context).featherlight();
		}
	});
}(jQuery));
