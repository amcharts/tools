/*
Plugin Name: amCharts Show Value Labels
Description: Shows the current value in a label above each grid line
Author: Paul Chapman, amCharts
Version: 1.2.0
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

	function processGraph( categoryField, guides, graph, from, to ) {
		if ( graph.valueLabels ) {
			var data = graph.data;

			var type = getPeriod( graph );

			for ( var i = 0; i < data.length; ++i ) {
				var info = data[ i ].dataContext;

				// These are the default options
				var defaults = {
					"label": info[ type ],
					"lineAlpha": 0,
					"inside": true
				};

				defaults[ from ] = info[ categoryField ];
				defaults[ to ] = info[ categoryField ];

				var object = AmCharts.extend( defaults, graph.valueLabels );

				guides.push( object );
			}

			return true;
		}
	}

	function processGraphs( chart, graphs ) {
		var categoryAxis = chart.categoryAxis;
		var categoryField = chart.categoryField;
		var guides = categoryAxis.guides;
		var from = ( categoryAxis.parseDates ? "date" : "category" );
		var to = ( categoryAxis.parseDates ? "toDate" : "toCategory" );

		guides.length = 0;

		var processed = false;

		for ( var i = 0; i < graphs.length; ++i ) {
			if ( processGraph( categoryField, guides, graphs[ i ], from, to ) ) {
				processed = true;
			}
		}

		return processed;
	}

	function processPanels( panels ) {
		var processed = false;

		for ( var i = 0; i < panels.length; ++i ) {
			var panel = panels[ i ];

			if ( processGraphs( panel, panel.stockGraphs ) ) {
				processed = true;
			}
		}

		return processed;
	}

	function processChart( chart ) {
		if ( chart.type === "stock" ) {
			return processPanels( chart.panels );

		} else {
			return processGraphs( chart, chart.graphs );
		}
	}

	function process() {
		if ( !seen ) {
			if ( processChart( chart ) ) {
				validate( chart );
			}
		}
	}

	chart.addListener( "zoomed", process );
	chart.addListener( "dataUpdated", process );

}, [ "serial", "stock" ] );
