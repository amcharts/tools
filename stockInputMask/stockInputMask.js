/*
Plugin Name: amCharts Stock Chart Input Mask
Description: Applies input mask to date inputs according to set date format on Stock Chart
Author: Martynas Majeris, amCharts
Version: 1.0.1
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

AmCharts.addInitHandler( function( chart ) {

	// check if plugin enabled
	if ( chart.periodSelector === undefined || chart.periodSelector.useInputMask !== true )
		return;

	// init format storage
	var parts = [];

	// add events on rendered event
	chart.addListener( "rendered", function( event ) {

		// prepare a regular expression mask format
		var partsTmp = chart.periodSelector.dateFormat.split( /([^A-Z]+)|([A-Z]+)/ig );
		for ( var i = 0; i < partsTmp.length; i++ ) {
			var part = partsTmp[ i ];
			if ( part === undefined || part === "" )
				continue;
			if ( part.match( /[A-Z]+/i ) )
				parts.push( part.length );
			else
				parts.push( part );
		}

		// find all fields in period selector and apply proper events to it
		var container = event.chart.periodSelectorContainer;
		var fields = container.getElementsByClassName( "amChartsInputField" );
		for ( var i = 0; i < fields.length; i++ ) {
			var field = fields[ i ];
			field.onkeyup = function( e ) {
				if ( ( e.which >= 96 ) && ( e.which <= 105 ) )
					applyInput( this );
			};
			field.onblur = function() {
				applyInput( this );
			};
		}
	} );

	function applyInput( input ) {

		// save current carret position
		if ( input.setSelectionRange !== undefined ) {
			var caretStart = input.selectionStart;
			var caretEnd = input.selectionEnd;
			var retainCaretPostition = caretEnd < input.value.length;
		}

		// apply the mask
		var str = input.value;
		var numbers = str.replace( /[^0-9]+/gi, "" );
		var result = "";
		var index = 0;
		var lengthIndex = 0;
		for ( var i = 0; i < parts.length; i++ ) {
			if ( lengthIndex > str.length ) {
				input.value = result.substr( 0, lengthIndex + 1 );
				return;
			}
			var part = parts[ i ];
			if ( part > 0 ) {
				result += numbers.substr( index, part );
				index += part;
				lengthIndex += part;
			} else {
				result += part;
				lengthIndex += part.length;
			}
		}
		input.value = result;

		// restore carret position
		if ( retainCaretPostition && input.setSelectionRange !== undefined )
			input.setSelectionRange( caretStart, caretEnd );

	}
}, [ "stock" ] );