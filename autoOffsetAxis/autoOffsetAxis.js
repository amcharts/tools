/*
Plugin Name: amCharts Auto-Offset Value Axis
Description: Auto-offset multiple value axis so they do not overlap with each other
Author: Martynas Majeris, amCharts
Version: 1.0
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

	// add init event
	chart.addListener( "init", updateOffsets );

	// add events on legend events
	if ( chart.legend !== undefined ) {
		chart.addListener( "init", function() {
			chart.legend.addListener( "hideItem", updateOffsets );
			chart.legend.addListener( "showItem", updateOffsets );
		} );
	}

	function updateOffsets() {

		setTimeout( function() {
			// initialize offsets
			var offsets = {
				"left": 0,
				"right": 0
			};

			// initialize initial margin
			if ( chart.axisMargins === undefined ) {
				chart.axisMargins = {
					"left": chart.marginLeftReal,
					"right": chart.marginRightReal
				};
			}

			// iterate through all of the axis
			for ( var i = 0; i < chart.valueAxes.length; i++ ) {
				var axis = chart.valueAxes[ i ];
				var axisWidth = axis.getBBox().width + chart.autoMarginOffset + 10;
				if ( axis.autoOffset === true && axis.foundGraphs ) {
					axis.offset = offsets[ axis.position ];
					offsets[ axis.position ] += axisWidth;
				}
			}
			chart.validateNow( false, true );
			chart.invalidateSize();
		}, 0 );
	}

}, [ "serial" ] );