/*
Plugin Name: amCharts Pie Dual Labels
Description: Allows adding secondary 
Author: Benjamin Maertz, amCharts
Version: 1.0.3
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
	function customLabel( chart ) {
		var _this = this;
		this.version = "1.0.3";
		this.chart = chart;
		this.config = {
			labelText: this.chart.labelText,
			labelFunction: this.chart.labelFunction,
			color: this.chart.color,
			fontFamily: this.chart.fontFamily,
			fontSize: this.chart.fontSize,
			maxLabelWidth: this.chart.maxLabelWidth,
			labelTickColor: this.chart.labelTickColor,
			labelTickAlpha: this.chart.labelTickAlpha,
			labelRadius: this.chart.labelRadius
		}

		this.drawTicks = function() {
			var _this = this.chart;
			var chartData = _this.chartData;
			var i;

			for ( i = 0; i < chartData.length; i++ ) {
				var dItem = chartData[ i ].customLabel;
				var label = dItem.label;
				if ( label ) {
					var x0 = dItem.tx0;
					var y0 = dItem.ty0;
					var x = dItem.tx;
					var x2 = dItem.tx2;
					var y = dItem.ty;

					var tick = AmCharts.line( _this.container, [ x0, x, x2 ], [ y0, y, y ], this.config.labelTickColor, this.config.labelTickAlpha );
					AmCharts.setCN( _this, tick, _this.type + "-tick" );
					AmCharts.setCN( _this, tick, dItem.className, true );
					dItem.tick = tick;
					dItem.wedge.push( tick );
				}
			}
		}
		this.setDepths = function() {
			var chart = this.chart;
			var chartData = chart.chartData;
			var i;
			for ( i = 0; i < chartData.length; i++ ) {
				var dItem = chartData[ i ];
				var wedge = dItem.customLabel.wedge;
				var startAngle = dItem.customLabel.startAngle;
				// find quarter
				//q0 || q1
				if ( ( startAngle >= 0 && startAngle < 180 ) ) {
					wedge.toFront();
				}
				//q2 || q3
				else if ( ( startAngle >= 180 ) ) {
					wedge.toBack();
				}
			}
		}
		this.arrangeLabels = function() {
			var _this = this.chart;
			var chartData = _this.chartData;
			var count = chartData.length;
			var dItem;

			// q0
			var i;
			for ( i = 0; i < chartData.length; i++ ) {
				dItem = chartData[ i ].customLabel;
				if ( !dItem.hidden ) {
					this.checkOverlapping( i, dItem );
				}
			}
		}
		this.checkOverlapping = function( index, dItem, lvl ) {
			var _this = this.chart;
			var overlapping;
			var i;
			var chartData = _this.chartData;
			var label = dItem.label;

			if ( label ) {
				overlapping = this.checkOverlappingReal( dItem, chartData[ index ] );
				if ( overlapping === true ) {
					var newY = dItem.ty + 1;
					dItem.ty = newY;
					label.translate( dItem.tx2, newY );
					if ( dItem.hitRect ) {
						var bbox = label.getBBox();
						dItem.hitRect.translate( dItem.tx2 + bbox.x, newY + bbox.y );
					}
					this.checkOverlapping( index, dItem );
				}
			}
		}
		this.checkOverlappingReal = function( dItem1, dItem2 ) {
			var overlapping = false;
			var label1 = dItem1.label;
			var label2 = dItem2.label;

			if ( !dItem1.hidden && !dItem2.hidden && label2 ) {
				var bb1 = label1.node.getBoundingClientRect();
				var bbox1 = {};
				bbox1.width = bb1.width;
				bbox1.height = bb1.height;
				bbox1.y = bb1.top;
				bbox1.x = bb1.left;

				var bb2 = label2.node.getBoundingClientRect();
				var bbox2 = {};
				bbox2.width = bb2.width;
				bbox2.height = bb2.height;
				bbox2.y = bb2.top;
				bbox2.x = bb2.left;

				if ( AmCharts.hitTest( bbox1, bbox2 ) ) {
					overlapping = true;
				}
			}
			return overlapping;
		}
		this.drawLabels = function() {
			var _this = this.chart;
			var chartData = _this.chartData;

			AmCharts.extend( this.config, this.chart.customLabel );

			if ( this.config.enabled != true ) {
				return;
			}

			if ( AmCharts.ifArray( chartData ) ) {
				if ( _this.realWidth > 0 && _this.realHeight > 0 ) {
					if ( AmCharts.VML ) {
						_this.startAlpha = 1;
					}
					var container = _this.container;
					var realWidth = _this.updateWidth();
					var realHeight = _this.updateHeight();
					var toCoordinate = AmCharts.toCoordinate;
					var marginLeft = toCoordinate( _this.marginLeft, realWidth );
					var marginRight = toCoordinate( _this.marginRight, realWidth );
					var marginTop = toCoordinate( _this.marginTop, realHeight ) + _this.getTitleHeight();
					var marginBottom = toCoordinate( _this.marginBottom, realHeight );
					var pieX;
					var pieY;
					var radius;
					var labelRadius = AmCharts.toNumber( _this.labelRadius );
					var labelWidth = _this.measureMaxLabel();

					if ( labelWidth > _this.maxLabelWidth ) {
						labelWidth = _this.maxLabelWidth;
					}

					var pullOutRadiusReal;

					if ( !_this.labelText || !_this.labelsEnabled ) {
						labelWidth = 0;
						labelRadius = 0;
					}

					if ( _this.pieX === undefined ) {
						pieX = ( realWidth - marginLeft - marginRight ) / 2 + marginLeft;
					} else {
						pieX = toCoordinate( _this.pieX, _this.realWidth );
					}

					if ( _this.pieY === undefined ) {
						pieY = ( realHeight - marginTop - marginBottom ) / 2 + marginTop;
					} else {
						pieY = toCoordinate( _this.pieY, realHeight );
					}

					radius = toCoordinate( _this.radius, realWidth, realHeight );

					// if radius is not defined, calculate from margins
					if ( !radius ) {
						var pureWidth;

						if ( labelRadius >= 0 ) {
							pureWidth = realWidth - marginLeft - marginRight - labelWidth * 2;
						} else {
							pureWidth = realWidth - marginLeft - marginRight;
						}

						var pureHeight = realHeight - marginTop - marginBottom;
						radius = Math.min( pureWidth, pureHeight );

						if ( pureHeight < pureWidth ) {
							radius = radius / ( 1 - _this.angle / 90 );

							if ( radius > pureWidth ) {
								radius = pureWidth;
							}
						}

						pullOutRadiusReal = AmCharts.toCoordinate( _this.pullOutRadius, radius );

						if ( labelRadius >= 0 ) {
							radius -= ( labelRadius + pullOutRadiusReal ) * 1.8;
						} else {
							radius -= pullOutRadiusReal * 1.8;
						}
						radius = radius / 2;
					}

					if ( radius < _this.minRadius ) {
						radius = _this.minRadius;
					}

					pullOutRadiusReal = toCoordinate( _this.pullOutRadius, radius );
					var startRadius = AmCharts.toCoordinate( _this.startRadius, radius );
					var innerRadius = toCoordinate( _this.innerRadius, radius );

					if ( innerRadius >= radius ) {
						innerRadius = radius - 1;
					}

					var startAngle = AmCharts.fitToBounds( _this.startAngle, 0, 360 );

					// in case the pie has 3D depth, start angle can only be equal to 90 or 270
					if ( _this.depth3D > 0 ) {
						if ( startAngle >= 270 ) {
							startAngle = 270;
						} else {
							startAngle = 90;
						}
					}

					startAngle -= 90;

					var yRadius = radius - radius * _this.angle / 90;
					var i;
					var sum = 0;
					var dItem;
					for ( i = 0; i < chartData.length; i++ ) {
						dItem = chartData[ i ];
						if ( dItem.hidden !== true ) {
							sum += AmCharts.roundTo( dItem.percents, _this.pf.precision );
						}
					}

					sum = AmCharts.roundTo( sum, _this.pf.precision );

					for ( i = 0; i < chartData.length; i++ ) {
						dItem = chartData[ i ];

						if ( dItem.hidden !== true && dItem.percents > 0 ) {
							// SLICE
							var arc = dItem.percents * 360 / 100;
							var ix = Math.sin( ( startAngle + arc / 2 ) / 180 * Math.PI );
							var iy = -Math.cos( ( startAngle + arc / 2 ) / 180 * Math.PI ) * ( yRadius / radius );
							var xx = pieX;
							var yy = pieY;
							var wedge = dItem.wedge;

							dItem.customLabel = {
								wedge: wedge,
								ix: ix,
								iy: iy
							}

							// LABEL ////////////////////////////////////////////////////////
							if ( _this.labelsEnabled && _this.labelText && dItem.percents >= _this.hideLabelsPercent ) {
								var labelAngle = startAngle + arc / 2;

								if ( labelAngle > 360 ) {
									labelAngle = labelAngle - 360;
								}

								var labelRadiusReal = labelRadius;
								if ( !isNaN( dItem.labelRadius ) ) {
									labelRadiusReal = dItem.labelRadius;
								}

								var tx = pieX + ix * ( radius + labelRadiusReal + this.config.labelRadius );
								var ty = pieY + iy * ( radius + labelRadiusReal + this.config.labelRadius );

								var align;
								var tickL = 0;
								if ( this.config.labelRadius >= 0 ) {
									var labelQuarter;
									//q0
									if ( labelAngle <= 90 && labelAngle >= 0 ) {
										labelQuarter = 0;
										align = "start";
										tickL = 8;
									}
									//q1
									else if ( labelAngle >= 90 && labelAngle < 180 ) {
										labelQuarter = 1;
										align = "start";
										tickL = 8;
									}
									//q2
									else if ( labelAngle >= 180 && labelAngle < 270 ) {
										labelQuarter = 2;
										align = "end";
										tickL = -8;
									}
									//q3
									else if ( ( labelAngle >= 270 && labelAngle < 360 ) ) {
										labelQuarter = 3;
										align = "end";
										tickL = -8;
									}
								} else {
									align = "middle";
								}

								var text = _this.formatString( this.config.labelText, dItem );

								var labelFunction = this.config.labelFunction;
								if ( labelFunction ) {
									text = labelFunction( dItem.customLabel, text );
								}

								var labelColor = dItem.labelColor;
								if ( !labelColor ) {
									labelColor = this.config.color;
								}

								if ( text !== "" ) {
									var txt = AmCharts.wrappedText( container, text, labelColor, this.config.fontFamily, this.config.fontSize, align, false, this.config.maxLabelWidth );
									AmCharts.setCN( _this, txt, "pie-label" );
									AmCharts.setCN( _this, txt, dItem.className, true );
									txt.translate( tx + tickL * 1.5, ty );
									txt.node.style.pointerEvents = "none";
									dItem.customLabel.tx = tx + tickL * 1.5;
									dItem.customLabel.ty = ty;
									dItem.customLabel.labelQuarter = labelQuarter;

									if ( labelRadiusReal >= 0 ) {
										var tbox = txt.getBBox();
										var hitRect = AmCharts.rect( container, tbox.width + 5, tbox.height + 5, "#FFFFFF", 0.005 );
										hitRect.translate( tx + tickL * 1.5 + tbox.x, ty + tbox.y );
										dItem.customLabel.hitRect = hitRect;
										wedge.push( txt );
										wedge.push( hitRect );
									} else {
										_this.freeLabelsSet.push( txt );
									}
									dItem.customLabel.label = txt;
								}
								dItem.customLabel.tx = tx;
								dItem.customLabel.tx2 = tx + tickL;

								dItem.customLabel.tx0 = pieX + ix * radius;
								dItem.customLabel.ty0 = pieY + iy * radius;
							}
							var rad = innerRadius + ( radius - innerRadius ) / 2;
							if ( dItem.pulled ) {
								rad += _this.pullOutRadiusReal;
							}

							dItem.customLabel.balloonX = ix * rad + pieX;
							dItem.customLabel.balloonY = iy * rad + pieY;

							dItem.customLabel.startX = Math.round( ix * startRadius );
							dItem.customLabel.startY = Math.round( iy * startRadius );
							dItem.customLabel.pullX = Math.round( ix * pullOutRadiusReal );
							dItem.customLabel.pullY = Math.round( iy * pullOutRadiusReal );

							// get start angle of next slice
							startAngle += dItem.percents * 360 / 100;
						}
					}

					if ( this.config.labelRadius > 0 && !this.config.labelRadiusField ) {
						this.arrangeLabels();
					}

					if ( this.config.labelRadius > 0 ) {
						this.drawTicks();
					}

					this.setDepths();
				}
			}
		}

		if ( this.chart.customLabel && this.chart.customLabel.enabled === true ) {
			this.chart.addListener( "drawn", function( e ) {
				_this.drawLabels();
			} );
		}
	}

	// CREATE INSTANCE
	new customLabel( chart );

}, [ "pie" ] );