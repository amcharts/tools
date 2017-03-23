/*
Plugin Name: amCharts smoothCustomBullets
Description: Adds clip-path on images to smooth the corners of the custom bullet images
Author: Benjamin Maertz, amCharts
Version: 1.0.4
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
        "version": "1.0.4",

        "borderRadius": "auto",

        "fillAlpha": 0,
        "fillColor": undefined,

        "borderAlpha": 0,
        "borderColor": undefined,
        "borderThickness": undefined,
        "borderLinejoin": undefined,
        "borderLinecap": undefined,
        "borderDasharray": undefined,

        "positiveOffset": 0,
        "negativeOffset": 3
    }
    var TIMER = 0;
    var INITIALIZED = false;

    // GET CHILDREN
    function getChildNodes( elm, tagName ) {
        if ( tagName ) {
            return elm.getElementsByTagName( tagName );
        }
        return elm.childNodes ? elm.childNodes : elm.children;
    }

    // UPDATE ATTRIBUTE
    function updateAttribute( node, key, val ) {
        if ( val !== undefined ) {
            node.setAttribute( key, val );
        }
    }

    // GET OPTION
    function getOption( key, alt ) {
        var cfg = chart.smoothCustomBullets;
        var val = cfg[ key ];

        // EXCEPTION
        if ( val == "0" && key == "borderAlpha" && ( cfg.borderColor !== undefined || cfg.borderThickness ) ) {
            val = 1;
        }

        if ( val === undefined || val == "auto" ) {
            val = alt;
        }

        return val;
    }

    // CREATES OVERLAYING RECT (BORDER)
    function createBorder( image, target, graph, dataPoint ) {
        var border, color;
        var cfg = chart.smoothCustomBullets;
        var width = image.getAttribute( "width" );
        var height = image.getAttribute( "height" );
        var transform = image.getAttribute( "transform" );
        var bR = cfg.borderRadius == "auto" ? width : cfg.borderRadius;

        // GET RIGHT COLOR
        if ( dataPoint.isNegative && graph.negativeLineColor ) {
            color = graph.negativeLineColor;
        } else if ( graph.lineColorField && dataPoint[ graph.lineColorField ] ) {
            color = dataPoint[ graph.lineColorField ];
        } else if ( graph.colorField && dataPoint[ graph.colorField ] ) {
            color = dataPoint[ graph.colorField ];
        } else {
            color = graph.bulletColorR;
        }

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

    // GET OFFSET VALUE
    function getOffsetValue( value, graph ) {
        if ( value instanceof Function ) {
            return value( graph );
        } else if ( !isNaN( value ) ) {
            return Number( value );
        } else {
            return 0
        }
    }

    // UPDATE CLIP PATHS
    function updateClipPaths( e ) {
        var i1, i2, i3;
        var clipPaths = [];
        var i1s = chart.graphs;
        var cfg = chart.smoothCustomBullets;
        var eventType = e ? e.type : undefined;

        // WAIT FOR INITIALIZATION
        if ( !INITIALIZED ) {
            return;
        }

        // DELAYING EXCEPTION
        clearTimeout( TIMER );
        if ( [ "axisChanged", "axisZoomed" ].indexOf( eventType ) != -1 ) {
            TIMER = setTimeout( updateClipPaths, AmCharts.updateRate );
            return;
        }

        // WALKTHOUGH GRAPHS
        for ( i1 = 0; i1 < i1s.length; i1++ ) {
            var graph = i1s[ i1 ];
            var valueAxis = graph.valueAxis;
            var i2s = graph.data;
            var baseCoord = graph.baseCoord;

            // WALKTHOUGH DATAPOINTS
            for ( i2 = 0; i2 < i2s.length; i2++ ) {
                var i3s = Object.keys( i2s[ i2 ].axes );

                // WALKTHOUGH AXES
                for ( i3 = 0; i3 < i3s.length; i3++ ) {
                    var dataPoint = i2s[ i2 ].axes[ i3s[ i3 ] ].graphs[ graph.id ];

                    // HAS BULLETGRAPHICS
                    if ( dataPoint.bulletGraphics !== undefined ) {
                        var bulletGroup = dataPoint.bulletGraphics.node;
                        var i4s = getChildNodes( bulletGroup, "image" );
                        var bulletCTM = bulletGroup.getCTM();

                        // WALKTHOUGH IMAGES
                        for ( i4 = 0; i4 < i4s.length; i4++ ) {
                            var image = i4s[ i4 ];
                            var uid = AmCharts.getUniqueId();
                            var width = image.getAttribute( "width" );
                            var height = image.getAttribute( "height" );
                            var bR = cfg.borderRadius == "auto" ? width : cfg.borderRadius;
                            var imageCTM;

                            // APPLY OFFSET
                            if ( image.transform && image.transform.baseVal && image.transform.baseVal.numberOfItems ) {
                                imageCTM = image.transform.baseVal.getItem( 0 );

                                if ( bulletCTM.f < baseCoord ) {
                                    imageCTM.matrix.f += getOffsetValue( cfg.positiveOffset, graph );
                                } else {
                                    imageCTM.matrix.f += getOffsetValue( cfg.negativeOffset, graph );
                                }
                            }

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

        // MERGE SETTINGS
        chart.smoothCustomBullets = AmCharts.extend( DEFAULTS, chart.smoothCustomBullets || {} )

        // PLACEHOLDER
        if ( chart.defs === undefined ) {
            chart.defs = {};
        }

        // EXPORT
        chart.smoothCustomBullets.updateClipPaths = updateClipPaths;

        // REAPPLY ON UPDATES
        chart.addListener( "init", function() {
            // FLAG AS INITIALIZED DUE ZOOMED EVENT
            INITIALIZED = true;

            // VALUE AXES
            if ( chart.valueAxes ) {
                for ( i1 = 0; i1 < chart.valueAxes.length; i1++ ) {
                    chart.valueAxes[ i1 ].addListener( "axisChanged", updateClipPaths );
                    chart.valueAxes[ i1 ].addListener( "axisZoomed", updateClipPaths );
                }
            }

            // CHART CURSOR
            if ( chart.chartCursor ) {
                chart.chartCursor.addListener( "zoomed", updateClipPaths );
            }
        } );
        chart.addListener( "drawn", updateClipPaths );
        chart.addListener( "zoomed", updateClipPaths );


    }
}, [ "serial", "xy", "radar", "stock", "gantt" ] );