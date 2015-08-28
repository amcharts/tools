/*
Plugin Name: amCharts Show Value Labels
Description: Shows the current value in a label above each grid line
Author: Paul Chapman, amCharts
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
	var seen = false;

	// Fix this later
	function validate( chart ) {
		seen = true;

		try {
			chart.validateNow( false, true );
		} finally {
			seen = false;
		}
	}

	function getPeriod( graph ) {
		return graph.valueField + graph.periodValue;
	}

	function processGraph( categoryField, guides, graph ) {
		if ( graph.valueLabels ) {
			var data = graph.data;

			var type = getPeriod( graph );

			for ( var i = 0; i < data.length; ++i ) {
				var info = data[ i ].dataContext;

				// These are the default options
				var object = AmCharts.extend( {
					"date": info[ categoryField ],
					"label": info[ type ],
					"lineAlpha": 0,
					"inside": true
				}, graph.valueLabels );

				guides.push( object );
			}

			return true;
		}
	}

	function processPanel( panel ) {
		var graphs = panel.stockGraphs;
		var categoryAxis = panel.categoryAxis;
		var categoryField = panel.categoryField;
		var guides = categoryAxis.guides;

		guides.length = 0;

		var processed = false;

		for ( var i = 0; i < graphs.length; ++i ) {
			if ( processGraph( categoryField, guides, graphs[ i ] ) ) {
				processed = true;
			}
		}

		return processed;
	}

	function processPanels( chart ) {
		var panels = chart.panels;

		var processed = false;

		for ( var i = 0; i < panels.length; ++i ) {
			if ( processPanel( panels[ i ] ) ) {
				processed = true;
			}
		}

		return processed;
	}

	chart.addListener( "zoomed", function() {
		if ( !seen ) {
			if ( processPanels( chart ) ) {
				validate( chart );
			}
		}
	} );
}, [ "stock" ] );
