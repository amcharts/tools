/*
Plugin Name: amCharts Auto Guides
Description: Automatically add guides to mark out preset days, like weekends
using guides.
Author: Martynas Majeris, amCharts
Version: 1.0.1
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
 * To enable add "autoGuides" block in "categoryAxis":
 *
 * "autoGuides": {
 *    "days": [ 0, 6 ],
 *    "lineColor": "#000",
 *    "lineAlpha": 0.2,
 *    "fillColor": "#000",
 *    "fillAlpha": 0.2
 *  }
 *
 * The "autoGuides" accepts any parameter that guide has, except "date/toDate"
 * and "expand" * that will be overwritten
 * http://docs.amcharts.com/3/javascriptstockchart/Guide
 */

/**
 * Define a global function which can be used outside or inside
 */
AmCharts.autoGuidesProcess = function( chart ) {
    /**
   * Check if all required settings are set
   */
  var axis = chart.categoryAxis;
  if ( axis === undefined ||
    axis.autoGuides === undefined ||
    axis.parseDates !== true )
    return;

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
   * Used to check if both dates are the same so
   * we don't mark the same day again with a guide
   */
  function isSameDay( lhs, rhs ) {
    if ( lhs === undefined  || rhs === undefined) {
      return false;
    }
    else {
      var normalizedDate = new Date( rhs );
      normalizedDate.setHours( 0, 0, 0, 0 );
      return lhs.getTime() === normalizedDate.getTime();
    }
  }

  /**
   * Init guides array
   */
  if ( axis.guides === undefined )
    axis.guides = [];

  /**
   * Set defaults
   */
  var config = axis.autoGuides;
  if ( config.days === undefined )
    config.days = [ 0, 6 ]; // Sunday and Saturday

  /**
   * Iterate through data and check for set days
   */
  var markedDay;
  for ( var i = 0; i < chart.dataProvider.length; i++ ) {
    var date = getDate( chart.dataProvider[ i ][ chart.categoryField ], chart.dataDateFormat );
    if ( !isSameDay( markedDay, date ) && config.days.indexOf( date.getDay() ) !== -1 ) {

      // calculate beginning and end of day
      var start = new Date( date );
      start.setHours( 0, 0, 0, 0 );
      var end = new Date( start );
      end.setHours( 23, 59, 59, 999 );

      /**
       * record the day so we don't set another guide on the
       * same day for data periods < DD
       */
      markedDay = new Date( start );

      // create guide
      var guide = {
        "date": start,
        "toDate": end,
        "expand": true
      };

      // translate all settings of the guide
      for ( var x in config ) {
        if ( config.hasOwnProperty( x ) && x != "days" ) {
          guide[ x ] = config[ x ];
        }
      }

      // add guide
      axis.guides.push( guide );

    }
  }
};

/**
 * Handle chart load
 */
AmCharts.addInitHandler( function( chart ) {

  // check for Data Loader
  var loader = chart.dataLoader;
  if ( loader !== undefined && loader.url !== undefined ) {
    if ( loader.complete ) {
      loader._complete = loader.complete;
    }
    loader.complete = function( chart ) {
      // call original complete
      if ( loader._complete )
        loader._complete.call( this, chart );

      // now let's do our thing
      AmCharts.autoGuidesProcess( chart );
    };
  } else {
    AmCharts.autoGuidesProcess( chart );
  }

}, [ "serial" ] );
