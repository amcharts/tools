/*
Plugin Name: amCharts Animate Data
Description: Smoothly animates the `dataProvider`
Author: Paul Chapman, amCharts
Version: 1.0.0
Author URI: http://www.amcharts.com/

Copyright 2015 amCharts

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Please note that the above license covers only this plugin. It by all means does
not apply to any other amCharts products that are covered by different licenses.
*/

/* globals AmCharts */
/* jshint -W061 */

( function() {
	"use strict";


	function raf( self ) {
		requestAnimationFrame( function( now ) {
			self._onFrame( now );
		} );
	}


	function TweenData( oldValues, newValues, data ) {
		this.oldValues = oldValues;
		this.newValues = newValues;
		this.data = data;
	}


	function Animation( duration, easing, onComplete, chart, values, keys ) {
		this._finished = false;
		this._startTime = null;

		this._duration = duration;
		this._easing = easing || easeOut3;
		this._onComplete = onComplete;
		this._chart = chart;
		this._values = values;
		this._keys = keys;
	}

	Animation.prototype.cancel = function() {
		this._finished = true;
		this._startTime = null;

		this._duration = null;
		this._easing = null;
		this._onComplete = null;
		this._chart = null;
		this._values = null;
		this._keys = null;
	};

	Animation.prototype._onFrame = function( now ) {
		// This will only happen when the animation was cancelled
		if ( this._finished ) {
			return true;

		} else if ( this._startTime === null ) {
			this._startTime = now;
			return false;

		} else {
			var diff = now - this._startTime;

			if ( diff < this._duration ) {
				this._tick( diff / this._duration );
				return false;

			} else {
				this._end( 1 );
				// Cleanup all the properties
				this.cancel();
				return true;
			}
		}
	};

	Animation.prototype._tick = function( time ) {
		// Apply the easing to the time ratio
		time = this._easing( time );

		var values = this._values;
		var keys   = this._keys;

		for ( var i = 0; i < values.length; ++i ) {
			var info = values[ i ];
			var oldValues = info.oldValues;
			var newValues = info.newValues;
			var data = info.data;

			for ( var j = 0; j < keys.length; ++j ) {
				var key = keys[ j ];
				var oldValue = oldValues[ j ];
				var newValue = newValues[ j ];

				if ( oldValue != null && newValue != null ) {
					data[ key ] = tween( time, oldValue, newValue );
				}
			}
		}

		// TODO check the performance of this
		pushNew( needsValidation, this._chart );
	};

	Animation.prototype._end = function( time ) {
		this._tick( time );

		if ( this._onComplete != null ) {
			this._onComplete();
		}
	};


	function Animator() {
		this._animating = false;
		this._animations = [];
		this._onBeforeFrames = [];
		this._onAfterFrames = [];
	}

	Animator.prototype.animate = function( animation ) {
		this._animations.push( animation );

		if ( !this._animating ) {
			this._animating = true;

			raf( this );
		}
	};


	Animator.prototype.onBeforeFrame = function( f ) {
		this._onBeforeFrames.push( f );
	};

	Animator.prototype.onAfterFrame = function( f ) {
		this._onAfterFrames.push( f );
	};


	Animator.prototype._onFrame = function( now ) {
		var onBeforeFrames = this._onBeforeFrames;

		for ( var i = 0; i < onBeforeFrames.length; ++i ) {
			onBeforeFrames[ i ]( now );
		}


		var animations = this._animations;

		for ( var i = 0; i < animations.length; ++i ) {
			var animation = animations[ i ];

			// If the animation is finished...
			if ( animation._onFrame( now ) ) {
				// TODO this is a bit slow, but I don't know of a faster alternative
				animations.splice( i, 1 );
				--i;
			}
		}


		var onAfterFrames = this._onAfterFrames;

		for ( var i = 0; i < onAfterFrames.length; ++i ) {
			onAfterFrames[ i ]( now );
		}


		// All animations are finished
		if ( animations.length === 0 ) {
			this._animating = false;

		} else {
			raf( this );
		}
	};


	var _animator = new Animator();

	function tween( time, from, to ) {
		return ( time * ( to - from ) ) + from;
	}


	function easeInOut3( t ) {
		var r = ( t < 0.5 ? t * 2 : ( 1 - t ) * 2 );
		r *= r * r * r;
		return ( t < 0.5 ? r / 2 : 1 - ( r / 2 ) );
	}

	function easeIn3( t ) {
		t *= t * t * t;
		return t;
	}

	function easeOut3( t ) {
		var r = ( 1 - t );
		r *= r * r * r;
		return ( 1 - r );
	}


	var needsValidation = [];

	function isNaN( x ) {
		return x !== x;
	}

	function each( array, fn ) {
		var length = array.length;

		for ( var i = 0; i < length; ++i ) {
			fn( array[ i ] );
		}
	}

	// Super fast and memory efficient map
	function map( array, fn ) {
		var length = array.length;
		var output = new Array( length );

		for ( var i = 0; i < length; ++i ) {
			output[ i ] = fn( array[ i ] );
		}

		return output;
	}

	function pushNew( array, x ) {
		for ( var i = 0; i < array.length; ++i ) {
			if ( array[ i ] === x ) {
				return;
			}
		}

		array.push( x );
	}

	// TODO check the performance of this
	_animator.onAfterFrame( function() {
		for ( var i = 0; i < needsValidation.length; ++i ) {
			needsValidation[ i ].validateData();
		}

		needsValidation.length = 0;
	} );


	// This ensures that a key is only added once
	function addKey( keys, seen, key ) {
		if ( !seen[ key ] ) {
			seen[ key ] = true;
			keys.push( key );
		}
	}

	function addKeys( keys, seen, object, a ) {
		each( a, function( key ) {
			var value = object[ key ];

			if ( value != null ) {
				addKey( keys, seen, value );
			}
		} );
	}


	function getKeysSliced( chart, keys, seen ) {
		addKeys( keys, seen, chart, [
			"alphaField",
			"valueField"
		] );
	}

	function getKeysFunnel( chart, keys, seen ) {
		getKeysSliced( chart, keys, seen );
	}

	function getKeysPie( chart, keys, seen ) {
		getKeysSliced( chart, keys, seen );

		addKeys( keys, seen, chart, [
			"labelRadiusField"
		] );
	}

	function getKeysGraph( graph, keys, seen ) {
		addKeys( keys, seen, graph, [
			"alphaField",
			"bulletSizeField",
			"closeField",
			"dashLengthField",
			"errorField",
			"highField",
			"lowField",
			"openField",
			"valueField"
		] );
	}

	function getKeysGraphs( graphs, keys, seen ) {
		each( graphs, function( graph ) {
			getKeysGraph( graph, keys, seen );
		} );
	}

	function getKeysCategoryAxis( categoryAxis, keys, seen ) {
		addKeys( keys, seen, categoryAxis, [
			"widthField"
		] );
	}


	// Returns an array of all of the animatable keys
	function getKeys( chart ) {
		var keys = [];

		var seen = {};

		if ( chart.type === "funnel" ) {
			getKeysFunnel( chart, keys, seen );

		} else if ( chart.type === "pie" ) {
			getKeysPie( chart, keys, seen );

		} else if ( chart.type === "serial" ) {
			getKeysCategoryAxis( chart.categoryAxis, keys, seen );
			getKeysGraphs( chart.graphs, keys, seen );

		} else if ( chart.type === "radar" ) {
			getKeysGraphs( chart.graphs, keys, seen );
		}

		return keys;
	}


	function getCategoryField( chart ) {
		if ( chart.type === "funnel" || chart.type === "pie" ) {
			return chart.titleField;

		} else if ( chart.type === "serial" || chart.type === "radar" ) {
			return chart.categoryField;
		}
	}


	function getValue( value ) {
		if ( value == null ) {
			return null;

		} else {
			value = +value;

			// TODO test this
			// TODO what about Infinity, etc. ?
			if ( isNaN( value ) ) {
				return null;

			} else {
				return value;
			}
		}
	}

	function getValues( data, keys ) {
		return map( keys, function( key ) {
			return getValue( data[ key ] );
		} );
	}

	function getString( value ) {
		// TODO better algorithm for this ?
		return JSON.stringify( value );
	}


	function animateData( dataProvider, options ) {
		var chart = this;

		var categoryField = getCategoryField( chart );
		var keys = getKeys( chart );

		var categories = {};
		var values = [];

		each( chart.dataProvider, function( data ) {
			// TODO handle data which doesn't have a category
			var category = getString( data[ categoryField ] );

			categories[ category ] = data;
		} );

		each( dataProvider, function( data ) {
			// TODO handle data which doesn't have a category
			var category = getString( data[ categoryField ] );

			// If the new data has the same category as the old data...
			if ( category in categories ) {
				var oldValues = getValues( categories[ category ], keys );
				var newValues = getValues( data, keys );

				values.push( new TweenData( oldValues, newValues, data ) );
			}
		} );

		chart.dataProvider = dataProvider;

		var animation = new Animation(
			options.duration,
			options.easing,
			options.complete,
			chart,
			values,
			keys
		);

		_animator.animate( animation );

		return animation;
	}


	AmCharts.addInitHandler( function( chart ) {
		chart.animateData = animateData;
	}, [ "funnel", "pie", "serial", "radar" ] );

} )();
