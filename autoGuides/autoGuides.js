/*
Plugin Name: amCharts Auto Guides
Description: Automatically add guides to mark out preset days, like weekends
using guides.
Author: Martynas Majeris, amCharts
Version: 1.0.3
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
 *    "hours": [ 19, 20, 21, 22, 23, 0, 1, 2, 3, 4 , 5, 6 ],
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
AmCharts.autoGuidesProcess = function( chart, axis, dataProvider, categoryField ) {
  /**
   * Check if all required settings are set
   */
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
    if ( lhs === undefined || rhs === undefined ) {
      return false;
    } else {
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
  if ( config.days === undefined && config.hours === undefined )
    config.days = [ 0, 6 ]; // Sunday and Saturday

  if ( config.days === undefined )
    config.days = [];

  if ( config.hours === undefined )
    config.hours = [];

  /**
   * Function overlays guide properties over new object
   */
  function populateGuide( guide, config ) {
    for ( var x in config ) {
      if ( config.hasOwnProperty( x ) && x != "days" && x != "hours" ) {
        guide[ x ] = config[ x ];
      }
    }
  }

  /**
   * Iterate thorugh each day in the range of data
   */
  var firstDate = getDate( dataProvider[ 0 ][ categoryField ], chart.dataDateFormat );
  var lastDate = getDate( dataProvider[ dataProvider.length - 1 ][ categoryField ], chart.dataDateFormat );
  lastDate.setHours( 23, 59, 59, 999 );
  for ( var t = firstDate.getTime(); t <= lastDate.getTime(); t += 86400000 ) {

    // get current date
    var date = new Date( t );

    /**
     * Populate days
     */
    if ( config.days.indexOf( AmCharts.useUTC ? date.getUTCDay() : date.getDay() ) !== -1 ) {
      
      // calculate beginning and end of day
      var start, end;
      if ( AmCharts.useUTC ) {
          start = new Date( Date.UTC( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0 ) );
          end = new Date( Date.UTC( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999 ) );
      }
      else {
          start = new Date( date );
          start.setHours( 0, 0, 0, 0 );
          end = new Date( start );
          end.setHours( 23, 59, 59, 999 );
      }

      // create guide
      var guide = {
        "date": start,
        "toDate": end,
        "expand": true
      };

      // translate all settings of the guide
      populateGuide( guide, config );

      // add guide
      axis.guides.push( guide );
    }

    /**
     * Populate hours for this day
     */
    for ( var h = 0; h < config.hours.length; h++ ) {
      var hour = config.hours[ h ];

      // calculate beginning and end of day
      var start = new Date( date );
      start.setHours( hour, 0, 0, 0 );
      var end = new Date( start );
      end.setHours( hour, 59, 59, 999 );

      // create guide
      var guide = {
        "date": start,
        "toDate": end,
        "expand": true
      };

      // translate all settings of the guide
      populateGuide( guide, config );

      // add guide
      axis.guides.push( guide );

    }
  }
};

/**
 * Handle chart load
 */
AmCharts.addInitHandler( function( chart ) {

  if ( chart.type === "stock" ) {

    /**
     * Stock chart
     */

    // get main data set
    var dataSet = chart.dataSets[ 0 ];

    // Data Loader used?
    var loader = dataSet.dataLoader;
    if ( loader !== undefined && loader.url !== undefined ) {
      if ( loader.complete ) {
        loader._complete = loader.complete;
      }
      loader.complete = function( chart ) {
        // call original complete
        if ( loader._complete )
          loader._complete.call( this, chart );

        // now let's do our thing
        for ( var i = 0; i < chart.panels.length; i++ ) {
          var panel = chart.panels[ i ];
          AmCharts.autoGuidesProcess( panel, panel.categoryAxis, dataSet.dataProvider, dataSet.categoryField );
        }
      };
    } else {

      // process each panel
      for ( var i = 0; i < chart.panels.length; i++ ) {
        var panel = chart.panels[ i ];
        AmCharts.autoGuidesProcess( panel, panel.categoryAxis, dataSet.dataProvider, dataSet.categoryField );
      }

    }

  } else {

    /**
     * Serial chart
     */

    // double check if it's not a Stock Panel
    if ( typeof chart.stockChart !== 'undefined' )
      return;

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
        AmCharts.autoGuidesProcess( chart, chart.categoryAxis, chart.dataProvider, chart.categoryField );
      };
    } else {
      AmCharts.autoGuidesProcess( chart, chart.categoryAxis, chart.dataProvider, chart.categoryField );
    }

  }

}, [ "serial", "stock" ] );
