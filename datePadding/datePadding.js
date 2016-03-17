/*
Plugin Name: amCharts Date Padding
Description: Allows extending date-based category axis date/time range beyond actual start 
and end of the data. Can use absolute date and time, or relative period count.
Author: Martynas Majeris, amCharts
Version: 1.0.0
Author URI: http://www.amcharts.com/

Copyright 2016 amCharts

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

/**
 * Define a global function which can be used outside or inside
 */
AmCharts.datePaddingProcess = function( chart ) {
	/**
	 * Resolves any variable into a Date object
	 */
	function getDate( val, format ) {
		if ( typeof val === "string" && format !== undefined ) {
			// try parse date from string using dataDateFormat
			return AmCharts.stringToDate( val, format );
		} else {
			// last resort: dump everything into Date constructor
			// and let browser handle it
			return new Date( val );
		}
	}

	/**
	 * Formats the date into the format used in data
	 */
	function formatDate( date, sampleFormat, format ) {
		if ( typeof sampleFormat === "string" && format !== undefined ) {
			return AmCharts.formatDate( date, format );
		} else if ( typeof sampleFormat === "number" ) {
			return date.getTime();
		}
		return date;
	}

	/**
	 * Returns chart's minPeriod in milliseconds
	 */
	function getPeriod( minPeriod ) {
		minPeriod = minPeriod || "DD";
		var period = AmCharts.extractPeriod( minPeriod );
		return AmCharts.getPeriodDuration( period.period, period.count )
	}

	/**
	 * Adds periods to a Date object
	 */
	function addPeriod( date, minPeriod, count ) {
		minPeriod = minPeriod || "DD";
		var period = AmCharts.extractPeriod( minPeriod );
		var newDate = new Date( date );
		switch ( period.period ) {
			case "YYYY":
				newDate.setFullYear( newDate.getFullYear() + count );
				break;
			case "MM":
				newDate.setFullYear( newDate.getFullYear(), newDate.getMonth() + count );
				break;
			case "DD":
				newDate.setFullYear( newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + count );
				break;
			case "hh":
				newDate.setHours( newDate.getHours() + count );
				break;
			case "mm":
				newDate.setHours( newDate.getHours(), newDate.getMinutes() + count );
				break;
			case "ss":
				newDate.setHours( newDate.getHours(), newDate.getMinutes(), newDate.getSeconds() + count );
				break;
			case "fff":
				newDate.setTime( newDate.getTime() + count );
				break;
		}
		return newDate;
	}

	if ( chart.type == "stock" ) {

		/**
		 * Stock Chart
		 */

		// TODO
		// TODO
		// TODO
		// TODO

	} else {

		/**
		 * Serial Chart
		 */

		// check if chart is date-based
		// bail out if it isn't
		if ( chart.categoryAxis === undefined || chart.categoryAxis.parseDates !== true )
			return;

		// set shortcuts for frequently used chart elements
		var axis = chart.categoryAxis;

		// get first and last dates, min period in milliseconds
		var firstDate = getDate(
				chart.dataProvider[ 0 ][ chart.categoryField ],
				chart.dataDateFormat ),
			lastDate = getDate(
				chart.dataProvider[ chart.dataProvider.length - 1 ][ chart.categoryField ],
				chart.dataDateFormat ),
			sampleFormat = chart.dataProvider[ 0 ][ chart.categoryField ];

		// process prependPeriods
		if ( axis.prependPeriods !== undefined ) {
			// with equalSpacing enabled we need to add an empty data point for each minPeriod
			// without it we can just add one data point in the past
			var startFrom = axis.equalSpacing === true ? 1 : axis.appendPeriods;
			for ( var i = startFrom; i <= axis.appendPeriods; i++ ) {
				var dataPoint = {};
				dataPoint[ chart.categoryField ] = formatDate(
					addPeriod( firstDate, axis.minPeriod, -i ),
					sampleFormat,
					chart.dataDateFormat
				);
				chart.dataProvider.unshift( dataPoint );
			}
		}

		// process appendPeriods
		if ( axis.appendPeriods !== undefined ) {
			// with equalSpacing enabled we need to add an empty data point for each minPeriod
			// without it we can just add one data point in the future
			var startFrom = axis.equalSpacing === true ? 1 : axis.appendPeriods;
			for ( var i = startFrom; i <= axis.appendPeriods; i++ ) {
				var dataPoint = {};
				dataPoint[ chart.categoryField ] = formatDate(
					addPeriod( lastDate, axis.minPeriod, i ),
					sampleFormat,
					chart.dataDateFormat
				);
				chart.dataProvider.push( dataPoint );
			}
		}

		// process minimumDate
		if ( axis.minimumDate !== undefined ) {
			// get the new last date
			var newFirstDate = getDate( axis.minimumDate, chart.dataDateFormat );

			// check if new last date is after actual last date
			if ( newFirstDate.getTime() < firstDate.getTime() ) {
				if ( axis.equalSpacing === true ) {
					var currentPeriod = -1,
						currentDate = addPeriod( lastDate, axis.minPeriod, -1 );

					while ( currentDate.getTime() >= newFirstDate.getTime() ) {

						// add data point
						var dataPoint = {};
						dataPoint[ chart.categoryField ] = formatDate( currentDate, sampleFormat, chart.dataDateFormat );
						chart.dataProvider.unshift( dataPoint );

						// iterate to next period
						currentPeriod--;
						currentDate = addPeriod( lastDate, axis.minPeriod, currentPeriod );

					}
				} else {
					var dataPoint = {};
					dataPoint[ chart.categoryField ] = formatDate( newFirstDate, sampleFormat, chart.dataDateFormat );
					chart.dataProvider.unshift( dataPoint );
				}
			}
		}

		// process maximumDate
		if ( axis.maximumDate !== undefined ) {
			// get the new last date
			var newLastDate = getDate( axis.maximumDate, chart.dataDateFormat );

			// check if new last date is after actual last date
			if ( newLastDate.getTime() > lastDate.getTime() ) {
				if ( axis.equalSpacing === true ) {
					var currentPeriod = 1,
						currentDate = addPeriod( lastDate, axis.minPeriod, 1 );

					while ( currentDate.getTime() <= newLastDate.getTime() ) {

						// add data point
						var dataPoint = {};
						dataPoint[ chart.categoryField ] = formatDate( currentDate, sampleFormat, chart.dataDateFormat );
						chart.dataProvider.push( dataPoint );

						// iterate to next period
						currentPeriod++;
						currentDate = addPeriod( lastDate, axis.minPeriod, currentPeriod );

					}
				} else {
					var dataPoint = {};
					dataPoint[ chart.categoryField ] = formatDate( newLastDate, sampleFormat, chart.dataDateFormat );
					chart.dataProvider.push( dataPoint );
				}
			}
		}

	}
}

/**
 * Handle chart load
 */
AmCharts.addInitHandler( function( chart ) {

	// check if Data Loader is active
	if ( chart.type === "stock" ) {
		// TODO
		// TODO
		// TODO
		// TODO
	}
	else {
		var loader = chart.dataLoader;
		if( loader !== undefined && loader.url !== undefined ) {
			if ( loader.complete ) {
				loader._complete = loader.complete;
			}
			loader.complete = function( chart ) {
				// call original complete
				if( loader._complete )
					loader._complete.call(this);

				// now let's do our thing
				AmCharts.datePaddingProcess( chart );
			}
		}
		else {
			AmCharts.datePaddingProcess( chart );
		}
	}

}, [ "serial", "stock" ] );