/*
Plugin Name: amCharts smoothCustomBullets
Description: Adds clip-path on images to smooth the corners of the custom bullet images
Author: Benjamin Maertz, amCharts
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
AmCharts.addInitHandler( function( chart ) {
    var DEFAULTS = {
        "version": "1.0.1",

        "borderRadius": "auto",
        "updateClipPaths": updateClipPaths,

        "fillAlpha": 0,
        "fillColor": undefined,

        "borderAlpha": 0,
        "borderColor": undefined,
        "borderThickness": undefined,
        "borderLinejoin": undefined,
        "borderLinecap": undefined,
        "borderDasharray": undefined
    }

    // GET CHILDREN
    function getChildNodes( elm, tagName ) {
        if ( tagName ) {
            return elm.getElementsByTagName( tagName );
        }
        return elm.childNodes ? elm.childNodes : elm.children;
    }

    function updateAttribute( node, key, val ) {
        if ( val !== undefined ) {
            node.setAttribute( key, val );
        }
    }

    function getOption( key, alt ) {
        var cfg = chart.smoothCustomBullets;
        var val = cfg[ key ];

        // EXCEPTION
        if ( val == "0" && key == "fillAlpha" && cfg.fillColor !== undefined ) {
            val = 1;

        } else if ( val == "0" && key == "borderAlpha" && ( cfg.borderColor !== undefined || cfg.borderThickness ) ) {
            val = 1;
        }

        if ( val === undefined || val == "auto" ) {
            val = alt;
        }

        return val;
    }

    function createBorder( image, target, graph, dataPoint ) {
        var border;
        var cfg = chart.smoothCustomBullets;
        var width = image.getAttribute( "width" );
        var height = image.getAttribute( "height" );
        var transform = image.getAttribute( "transform" );
        var bR = cfg.borderRadius == "auto" ? width : cfg.borderRadius;
        var color = graph.colorField ? dataPoint[ graph.colorField ] : graph.bulletColorR;

        // CREATE RECT
        border = document.createElementNS( AmCharts.SVG_NS, "rect" );

        // APPLY SOME SUGAR
        updateAttribute( border, "fill", getOption( "fillColor", color ) );
        updateAttribute( border, "fill-opacity", getOption( "fillAlpha" ) );
        updateAttribute( border, "stroke", getOption( "borderColor", color ) );
        updateAttribute( border, "stroke-width", getOption( "borderThickness" ) );
        updateAttribute( border, "stroke-opacity", getOption( "borderAlpha" ) );
        updateAttribute( border, "stroke-linecap", getOption( "borderLinecap" ) );
        updateAttribute( border, "stroke-linejoin", getOption( "borderLinejoin" ) );
        updateAttribute( border, "stroke-dasharray", getOption( "borderDasharray" ) );

        // REQUIRED STUFF
        updateAttribute( border, "width", width );
        updateAttribute( border, "height", height );
        updateAttribute( border, "rx", getOption( "borderRadius", width ) );
        updateAttribute( border, "ry", getOption( "borderRadius", width ) );
        updateAttribute( border, "transform", transform );

        // APPEND TO TARGET
        target.appendChild( border );
    }

    // UPDATE CLIP PATHS
    function updateClipPaths() {
        var i1, i2, i3;
        var clipPaths = [];
        var i1s = chart.graphs;
        var cfg = chart.smoothCustomBullets;

        // WALKTHOUGH GRAPHS
        for ( i1 = 0; i1 < i1s.length; i1++ ) {
            var graph = i1s[ i1 ];
            var valueAxis = graph.valueAxis;
            var i2s = valueAxis.data;

            // WALKTHOUGH AXES
            for ( i2 = 0; i2 < i2s.length; i2++ ) {
                var dataPoint = i2s[ i2 ].axes[ valueAxis.id ].graphs[ graph.id ];
                var bulletGroup = dataPoint.bulletGraphics.node;
                var i3s = getChildNodes( bulletGroup, "image" );

                // WALKTHOUGH AXIS GRAPH IMAGES
                for ( i3 = 0; i3 < i3s.length; i3++ ) {
                    var image = i3s[ i3 ];
                    var uid = AmCharts.getUniqueId();
                    var width = image.getAttribute( "width" );
                    var height = image.getAttribute( "height" );
                    var bR = cfg.borderRadius == "auto" ? width : cfg.borderRadius;

                    // UPDATE IMAGE AND LINK WITH CLIPPATH
                    updateAttribute( image, "clip-path", [ "url(#", uid, ")" ].join( "" ) );

                    // CREATE BORDER
                    createBorder( image, bulletGroup, graph, dataPoint );

                    // CREATE CLIPPATH
                    clipPaths.push( {
                        id: uid,
                        rect: {
                            width: width,
                            height: height,
                            rx: bR
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