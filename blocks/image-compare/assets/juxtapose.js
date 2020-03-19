/**
 * Juxtapose - v1.2.0 - 2017-12-18
 * Copyright (c) 2017 Alex Duner and Northwestern University Knight Lab
 *
 * This code is governed by the terms of the Mozilla Public License (MPL) v2.0,
 * which is available here: https://github.com/NUKnightLab/juxtapose/blob/master/LICENSE
 *
 * This code is incorporated into Image Compare plugin, which is licensed under
 * GPLv2+, however you may use Juxtapose code separately under the terms of its
 * original MPL 2.0 license if you wish.
 */

/* global wp Image */

wp.domReady( function() {

	const juxtapose = {
		sliders: [],
		OPTIMIZATION_ACCEPTED: 1,
		OPTIMIZATION_WAS_CONSTRAINED: 2
	};

	function Graphic(properties, slider) {
		const self = this;
		this.image = new Image();

		this.loaded = false;
		this.image.onload = function() {
			self.loaded = true;
			slider._onLoaded();
		};

		this.image.src = properties.src;
		this.image.alt = properties.alt || '';
		this.label = properties.label || false;
		this.credit = properties.credit || false;
	}

	function getNaturalDimensions(DOMelement) {
		if (DOMelement.naturalWidth && DOMelement.naturalHeight) {
			return {width: DOMelement.naturalWidth, height: DOMelement.naturalHeight};
		}
		// http://www.jacklmoore.com/notes/naturalwidth-and-naturalheight-in-ie/
		const img = new Image();
		img.src = DOMelement.src;
		return {width: img.width, height: img.height};
	}

	function getImageDimensions(img) {
		const dimensions = {
			width: getNaturalDimensions(img).width,
			height: getNaturalDimensions(img).height,
			aspect: function() { return (this.width / this.height); }
		};
		return dimensions;
	}

	function addClass(element, c) {
		if (element.classList) {
			element.classList.add(c);
		} else {
			element.className += " " + c;
		}
	}

	function removeClass(element, c) {
		element.className = element.className.replace(/(\S+)\s*/g, function (w, match) {
			if (match === c) {
				return '';
			}
			return w;
		}).replace(/^\s+/, '');
	}

	function setText(element, text) {
		if (document.body.textContent) {
			element.textContent = text;
		} else {
			element.innerText = text;
		}
	}

	function getComputedWidthAndHeight(element) {
		return {
			width: parseInt(window.getComputedStyle(element).width, 10),
			height: parseInt(window.getComputedStyle(element).height, 10),
		};
	}

	function getPageX(e) {
		let pageX;
		if (e.pageX) {
			pageX = e.pageX;
		} else if (e.touches) {
			pageX = e.touches[0].pageX;
		} else {
			pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		}
		return pageX;
	}

	function getPageY(e) {
		let pageY;
		if (e.pageY) {
			pageY = e.pageY;
		} else if (e.touches) {
			pageY = e.touches[0].pageY;
		} else {
			pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return pageY;
	}

	function getLeftPercent(slider, input) {
		let leftPercent;
		if (typeof(input) === "string" || typeof(input) === "number") {
			leftPercent = parseInt(input, 10);
		} else {
			const sliderRect = slider.getBoundingClientRect();
			const offset = {
				top: sliderRect.top + document.body.scrollTop + document.documentElement.scrollTop,
				left: sliderRect.left + document.body.scrollLeft + document.documentElement.scrollLeft
			};
			const width = slider.offsetWidth;
			const pageX = getPageX(input);
			const relativeX = pageX - offset.left;
			leftPercent = (relativeX / width) * 100;
		}
		return leftPercent;
	}

	function getTopPercent(slider, input) {
		let topPercent;
		if (typeof(input) === "string" || typeof(input) === "number") {
			topPercent = parseInt(input, 10);
		} else {
			const sliderRect = slider.getBoundingClientRect();
			const offset = {
				top: sliderRect.top + document.body.scrollTop + document.documentElement.scrollTop,
				left: sliderRect.left + document.body.scrollLeft + document.documentElement.scrollLeft
			};
			const width = slider.offsetHeight;
			const pageY = getPageY(input);
			const relativeY = pageY - offset.top;
			topPercent = (relativeY / width) * 100;
		}
		return topPercent;
	}

	// values of BOOLEAN_OPTIONS are ignored. just used for 'in' test on keys
	const BOOLEAN_OPTIONS =  {'animate': true, 'showLabels': true, 'showCredits': true, 'makeResponsive': true };
	function interpretBoolean(x) {
		if (typeof(x) !== 'string') {
			return Boolean(x);
		}
		return !(x === 'false' || x === '');
	}

	function JXSlider(selector, images, options) {

		this.selector = selector;

		let i;
		this.options = { // new options must have default values set here.
			animate: true,
			showLabels: true,
			showCredits: true,
			makeResponsive: true,
			startingPosition: "50%",
			mode: 'horizontal',
			callback: null // pass a callback function if you like
		};

		for (i in this.options) {
			if(i in options) {
				if (i in BOOLEAN_OPTIONS) {
					this.options[i] = interpretBoolean(options[i]);
				} else {
					this.options[i] = options[i];
				}
			}
		}

		if (images.length === 2) {
			this.image-compare__image-before = new Graphic(images[0], this);
			this.image-compare__image-after = new Graphic(images[1], this);
		} else {
			console.warn("The images parameter takes two Image objects.");
		}

		if (this.image-compare__image-before.credit || this.image-compare__image-after.credit) {
			this.options.showCredits = true;
		} else {
			this.options.showCredits = false;
		}
	}

	JXSlider.prototype = {

		updateSlider: function(input, animate) {
			let leftPercent

			if (this.options.mode === "vertical") {
				leftPercent = getTopPercent(this.slider, input);
			} else {
				leftPercent = getLeftPercent(this.slider, input);
			}

			leftPercent = leftPercent.toFixed(2) + "%";
			const leftPercentNum = parseFloat(leftPercent);
			const rightPercent = (100 - leftPercentNum) + "%";

			if (leftPercentNum > 0 && leftPercentNum < 100) {
				removeClass(this.handle, 'transition');
				removeClass(this.rightImage, 'transition');
				removeClass(this.leftImage, 'transition');

				if (this.options.animate && animate) {
					addClass(this.handle, 'transition');
					addClass(this.leftImage, 'transition');
					addClass(this.rightImage, 'transition');
				}

				if (this.options.mode === "vertical") {
					this.handle.style.top = leftPercent;
					this.leftImage.style.height = leftPercent;
					this.rightImage.style.height = rightPercent;
				} else {
					this.handle.style.left = leftPercent;
					this.leftImage.style.width = leftPercent;
					this.rightImage.style.width = rightPercent;
				}
				this.sliderPosition = leftPercent;
			}
		},

		getPosition: function() {
			return this.sliderPosition;
		},

		displayLabel: function(element, labelText) {
			const label = document.createElement("div");
			label.className = 'jx-label';
			label.setAttribute('tabindex', 0); //put the controller in the natural tab order of the document

			setText(label, labelText);
			element.appendChild(label);
		},

		setStartingPosition: function(s) {
			this.options.startingPosition = s;
		},

		checkImages: function() {
			if (getImageDimensions(this.image-compare__image-before.image).aspect() ===
				getImageDimensions(this.image-compare__image-after.image).aspect()) {
				return true;
			}
			return false;
		},

		calculateDims: function(width, height){
			const ratio = getImageDimensions(this.image-compare__image-before.image).aspect();
			if (width) {
				height = width / ratio;
			} else if (height) {
				width = height * ratio;
			}
			return {
				width: width,
				height: height,
				ratio: ratio
			};
		},

		responsivizeIframe: function(dims){
			//Check the slider dimensions against the iframe (window) dimensions
			if (dims.height < window.innerHeight){
				//If the aspect ratio is greater than 1, imgs are landscape, so letterbox top and bottom
				if (dims.ratio >= 1){
					this.wrapper.style.paddingTop = parseInt((window.innerHeight - dims.height) / 2) + "px";
				}
			} else if (dims.height > window.innerHeight) {
				/* If the image is too tall for the window, which happens at 100% width on large screens,
				 * force dimension recalculation based on height instead of width */
				dims = this.calculateDims(0, window.innerHeight);
				this.wrapper.style.paddingLeft = parseInt((window.innerWidth - dims.width) / 2) + "px";
			}
			if (this.options.showCredits) {
				// accommodate the credits box within the iframe
				dims.height -= 13;
			}
			return dims;
		},

		setWrapperDimensions: function() {
			const wrapperWidth = getComputedWidthAndHeight(this.wrapper).width;
			const wrapperHeight = getComputedWidthAndHeight(this.wrapper).height;
			let dims = this.calculateDims(wrapperWidth, wrapperHeight);
			// if window is in iframe, make sure images don't overflow boundaries
			if (window.location !== window.parent.location && !this.options.makeResponsive) {
				dims = this.responsivizeIframe(dims);
			}

			this.wrapper.style.height = parseInt(dims.height) + "px";
			this.wrapper.style.width = parseInt(dims.width) + "px";
		},

		optimizeWrapper: function(maxWidth){
			let result = juxtapose.OPTIMIZATION_ACCEPTED;
			if ((this.image-compare__image-before.image.naturalWidth >= maxWidth) && (this.image-compare__image-after.image.naturalWidth >= maxWidth)) {
				this.wrapper.style.width = maxWidth + "px";
				result = juxtapose.OPTIMIZATION_WAS_CONSTRAINED;
			} else if (this.image-compare__image-after.image.naturalWidth < maxWidth) {
				this.wrapper.style.width = this.image-compare__image-after.image.naturalWidth + "px";
			} else {
				this.wrapper.style.width = this.image-compare__image-before.image.naturalWidth + "px";
			}
			this.setWrapperDimensions();
			return result;
		},

		_onLoaded: function() {

			if (this.image-compare__image-before && this.image-compare__image-before.loaded === true &&
				this.image-compare__image-after && this.image-compare__image-after.loaded === true) {

				this.wrapper = document.querySelector(this.selector);
				addClass(this.wrapper, 'juxtapose');

				this.wrapper.style.width = getNaturalDimensions(this.image-compare__image-before.image).width;
				this.setWrapperDimensions();

				this.slider = document.createElement("div");
				this.slider.className = 'jx-slider';
				this.wrapper.appendChild(this.slider);

				if (this.options.mode !== "horizontal") {
					addClass(this.slider, this.options.mode);
				}

				this.handle = document.createElement("div");
				this.handle.className = 'jx-handle';

				this.rightImage = document.createElement("div");
				this.rightImage.className = 'jx-image jx-right';
				this.rightImage.appendChild(this.image-compare__image-after.image);


				this.leftImage = document.createElement("div");
				this.leftImage.className = 'jx-image jx-left';
				this.leftImage.appendChild(this.image-compare__image-before.image);

				this.labCredit = document.createElement("a");
				this.labCredit.setAttribute('href', 'http://juxtapose.knightlab.com');
				this.labCredit.setAttribute('target', '_blank');
				this.labCredit.className = 'jx-knightlab';
				this.labLogo = document.createElement("div");
				this.labLogo.className = 'knightlab-logo';
				this.labCredit.appendChild(this.labLogo);
				this.projectName = document.createElement("span");
				this.projectName.className = 'juxtapose-name';
				setText(this.projectName, 'JuxtaposeJS');
				this.labCredit.appendChild(this.projectName);

				this.slider.appendChild(this.handle);
				this.slider.appendChild(this.leftImage);
				this.slider.appendChild(this.rightImage);
				this.slider.appendChild(this.labCredit);

				this.leftArrow = document.createElement("div");
				this.rightArrow = document.createElement("div");
				this.control = document.createElement("div");
				this.controller = document.createElement("div");

				this.leftArrow.className = 'jx-arrow jx-left';
				this.rightArrow.className = 'jx-arrow jx-right';
				this.control.className = 'jx-control';
				this.controller.className = 'jx-controller';

				this.controller.setAttribute('tabindex', 0); //put the controller in the natural tab order of the document
				this.controller.setAttribute('role', 'slider');
				this.controller.setAttribute('aria-valuenow', 50);
				this.controller.setAttribute('aria-valuemin', 0);
				this.controller.setAttribute('aria-valuemax', 100);

				this.handle.appendChild(this.leftArrow);
				this.handle.appendChild(this.control);
				this.handle.appendChild(this.rightArrow);
				this.control.appendChild(this.controller);

				this._init();
			}
		},

		_init: function() {

			if (this.checkImages() === false) {
				console.warn(this, "Check that the two images have the same aspect ratio for the slider to work correctly.");
			}

			this.updateSlider(this.options.startingPosition, false);

			if (this.options.showLabels === true) {
				if (this.image-compare__image-before.label) { this.displayLabel(this.leftImage, this.image-compare__image-before.label); }
				if (this.image-compare__image-after.label) { this.displayLabel(this.rightImage, this.image-compare__image-after.label); }
			}

			const self = this;
			window.addEventListener("resize", function() {
				self.setWrapperDimensions();
			});


			// Set up Javascript Events
			// On mousedown, call updateSlider then set animate to false
			// (if animate is true, adds css transition when updating).

			this.slider.addEventListener("mousedown", function(e) {
				e.preventDefault();
				self.updateSlider(e, true);
				let animate = true;

				this.addEventListener("mousemove", function(evt) {
					evt.preventDefault();
					if (animate) { self.updateSlider(evt, false); }
				});

				this.addEventListener('mouseup', function(evt) {
					evt.preventDefault();
					evt.stopPropagation();
					this.removeEventListener('mouseup', arguments.callee);
					animate = false;
				});
			});

			this.slider.addEventListener("touchstart", function(e) {
				e.preventDefault();
				e.stopPropagation();
				self.updateSlider(e, true);

				this.addEventListener("touchmove", function(evt) {
					evt.preventDefault();
					evt.stopPropagation();
					self.updateSlider(evt, false);
				});

			});

			/* keyboard accessibility */

			this.handle.addEventListener("keydown", function (e) {
				const key = e.which || e.keyCode;
				let ariaValue = parseFloat(this.style.left);

				//move jx-controller left
				if ( key === 37 ) {
					ariaValue = ariaValue - 1;
					const leftStart = parseFloat(this.style.left) - 1;
					self.updateSlider(leftStart, false);
					self.controller.setAttribute('aria-valuenow', ariaValue);
				}

				//move jx-controller right
				if ( key === 39 ) {
					ariaValue = ariaValue + 1;
					const rightStart = parseFloat(this.style.left) + 1;
					self.updateSlider(rightStart, false);
					self.controller.setAttribute('aria-valuenow', ariaValue);
				}
			});

			//toggle right-hand image visibility
			this.leftImage.addEventListener("keydown", function (event) {
				const key = event.which || event.keyCode;
				if ((key === 13) || (key === 32)) {
					self.updateSlider("90%", true);
					self.controller.setAttribute('aria-valuenow', 90);
				}
			});

			//toggle left-hand image visibility
			this.rightImage.addEventListener("keydown", function (event) {
				const key = event.which || event.keyCode;
				if ((key === 13) || (key === 32)) {
					self.updateSlider("10%", true);
					self.controller.setAttribute('aria-valuenow', 10);
				}
			});

			juxtapose.sliders.push(this);

			if (this.options.callback && typeof(this.options.callback) === 'function') {
				this.options.callback(this);
			}
		}

	};

	/*
	Given an element that is configured with the proper data elements, make a slider out of it.
	Normally this will just be used by scanPage.
	*/
	juxtapose.makeSlider = function (element, idx) {
		if (typeof idx === 'undefined') {
			idx = juxtapose.sliders.length; // not super threadsafe...
		}

		const w = element;

		const images = w.querySelectorAll('img');

		const options = {};
		// don't set empty string into options, that's a false false.
		if (w.getAttribute('data-animate')) {
			options.animate = w.getAttribute('data-animate');
		}
		if (w.getAttribute('data-showlabels')) {
			options.showLabels = w.getAttribute('data-showlabels');
		}
		if (w.getAttribute('data-showcredits')) {
			options.showCredits = w.getAttribute('data-showcredits');
		}
		if (w.getAttribute('data-startingposition')) {
			options.startingPosition = w.getAttribute('data-startingposition');
		}
		if (w.getAttribute('data-mode')) {
			options.mode = w.getAttribute('data-mode');
		}
		if (w.getAttribute('data-makeresponsive')) {
			options.mode = w.getAttribute('data-makeresponsive');
		}

		const specificClass = 'juxtapose-' + idx;
		addClass(element, specificClass);

		const selector = '.' + specificClass;

		if (w.innerHTML) {
			w.innerHTML = '';
		} else {
			w.innerText = '';
		}

		new juxtapose.JXSlider(
			selector,
			[
				{
					src: images[0].src,
					label: images[0].getAttribute('data-label'),
					alt: images[0].alt
				},
				{
					src: images[1].src,
					label: images[1].getAttribute('data-label'),
					alt: images[1].alt
				}
			],
			options
		);
	};

	//Enable HTML Implementation
	juxtapose.scanPage = function() {
		const elements = document.querySelectorAll('.juxtapose');
		for (let i = 0; i < elements.length; i++) {
			juxtapose.makeSlider(elements[i], i);
		}
	};

	juxtapose.JXSlider = JXSlider;
	window.juxtapose = juxtapose;

	juxtapose.scanPage();

});

