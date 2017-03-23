/*
Plugin Name: amCharts Auto-Offset Value Axis
Description: Auto-offset multiple value axis so they do not overlap with each other
Author: Martynas Majeris, amCharts
Version: 1.4
Author URI: http://www.amcharts.com/

Copyright 2015-2017 amCharts

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

  // add function that updates current offsets
  chart.updateOffsets = function() {

    setTimeout( function() {
      // initialize offsets
      var offsets = {
        "left": 0,
        "right": 0,
        "top": 0,
        "bottom": 0
      };

      // initialize initial margin
      if ( chart.axisMargins === undefined ) {
        chart.axisMargins = {
          "left": chart.marginLeftReal,
          "right": chart.marginRightReal,
          "top": chart.marginTopReal,
          "bottom": chart.marginBottomReal
        };
      }

      // iterate through all of the axis
      for ( var i = 0; i < chart.valueAxes.length; i++ ) {
        var axis = chart.valueAxes[ i ];
        var axisWidth;
        if ( axis.position == "top" || axis.position == "bottom" ) {
          axisWidth = axis.getBBox().height + chart.autoMarginOffset + 10;
          if ( typeof axis.guides !== "undefined" && axis.guides.length )
            axisWidth -= chart.plotAreaHeight;
        } else {
          axisWidth = axis.getBBox().width + chart.autoMarginOffset + 10;
          if ( typeof axis.guides !== "undefined" && axis.guides.length )
            axisWidth -= chart.plotAreaWidth;
        }

        if ( axis.autoOffset === true && axis.foundGraphs ) {
          axis.offset = offsets[ axis.position ];
          offsets[ axis.position ] += axisWidth;

          if ( axis.axisThickness > 1 )
            offsets[ axis.position ] += axis.axisThickness;
        }
      }

      // check if offsets have been updated
      if ( offsets.left === 0 && offsets.right === 0 && offsets.top === 0 && offsets.bottom === 0 )
        return;

      chart.marginsUpdated = false;
      chart.validateNow( false, true );
    }, 0 );
  }

  // add init event
  chart.addListener( "init", chart.updateOffsets );

  // add events on legend events
  if ( chart.legend !== undefined ) {
    chart.addListener( "init", function() {
      chart.legend.addListener( "hideItem", chart.updateOffsets );
      chart.legend.addListener( "showItem", chart.updateOffsets );
    } );
  }

}, [ "serial" ] );