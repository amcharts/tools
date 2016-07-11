/*
Plugin Name: amCharts smoothCustomBullets
Description: Adds clip-path on images to smooth the corners of the custom bullet images
Author: Benjamin Maertz, amCharts
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
AmCharts.addInitHandler( function( chart ) {
    var DEFAULTS = {
        borderRadius: "auto",
        updateClipPaths: updateClipPaths
    }

    // GET CHILDREN
    function getChildNodes( elm ) {
        return elm.childNodes ? elm.childNodes : elm.children;
    }

    // UPDATE CLIP PATHS
    function updateClipPaths() {
        var i1, i2, i3;
        var clipPaths = [];
        var i1s = getChildNodes( chart.bulletSet.node );
        var br = chart.smoothCustomBullets.borderRadius;

        // BULLET SETS
        for ( i1 = 0; i1 < i1s.length; i1++ ) {
            var i2s = getChildNodes( i1s[ i1 ] );

            // BULLET GROUPS
            for ( i2 = 0; i2 < i2s.length; i2++ ) {
                var i3s = getChildNodes( i2s[ i2 ] );

                // BULLET IMAGES (always wrapped in groups)
                for ( i3 = 0; i3 < i3s.length; i3++ ) {
                    var child = i3s[ i3 ];
                    var uid = AmCharts.getUniqueId();
                    var rx = br == "auto" ? child.getAttribute( "width" ) : br;

                    // UPDATE CHILD
                    child.setAttribute( "clip-path", [ "url(#", uid, ")" ].join( "" ) );

                    // ADD CLIP PATH
                    clipPaths.push( {
                        id: uid,
                        rect: {
                            id: "rect",
                            width: child.getAttribute( "width" ),
                            height: child.getAttribute( "height" ),
                            rx: rx
                        }
                    } );
                }
            }
        }

        // UPDATE DEFS
        AmCharts.extend( chart.defs, {
            clipPath: clipPaths
        } );

        // PARSE DEFS
        AmCharts.parseDefs( chart.defs, chart.container.defs );
    }

    // ENABLED?!
    if ( chart.smoothCustomBullets !== undefined ) {

        chart.smoothCustomBullets = AmCharts.extend( DEFAULTS, chart.smoothCustomBullets || {} )

        // PLA
        if ( chart.defs === undefined ) {
            chart.defs = {};
        }

        // EXPORT
        chart.smoothCustomBullets.updateClipPaths = updateClipPaths;

        // REAPPLY ON UPDATES
        chart.addListener( "drawn", updateClipPaths );
    }
} );