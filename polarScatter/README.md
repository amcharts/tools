# amCharts Plugin: Polar Scatter

Version: 1.0.0


## Description

Enhances Radar/Polar chart type with ability to use it as an circular XY scatter
chart.

## Installation

To enable, include `polarScatter.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js"></script>
```

## Usage

The plugin works by ditching pre-defined categories and creating it's own 
categories at specific angles.

To set plugin settings, use `polarScatter` block:

```
"polarScatter": {
  "minimum": 0,
  "maximum": 359,
  "step": 1
}
```

Parameters are as follows:

Parameter | Default | Description
--------- | ------- | -----------
maximum | 359 | End value
minimum | 0 | Start value
step | 1 | Granularity of your data

The actual positions of the scatter points go into `series` array under 
specific graph:

```
"graphs": [ {
  "title": "Trial #1",
  "balloonText": "[[category]]: [[value]] m/s",
  "bullet": "round",
  "lineAlpha": 0,
  "series": [[83,5.1],[44,5.8],[76,9],[2,1.4],[100,8.3],[96,1.7],[68,3.9],[0,3],[100,4.1],[16,5.5],[71,6.8],[100,7.9],[9,6.8],[85,8.3],[51,6.7],[95,3.8],[95,4.4],[1,0.2],[107,9.7],[50,4.2],[42,9.2],[35,8],[44,6],[64,0.7],[53,3.3],[92,4.1],[43,7.3],[15,7.5],[43,4.3],[90,9.9]]
}, {
  "title": "Trial #2",
  "balloonText": "[[category]]: [[value]] m/s",
  "bullet": "round",
  "lineAlpha": 0,
  "series": [[178,1.3],[129,3.4],[99,2.4],[80,9.9],[118,9.4],[103,8.7],[91,4.2],[151,1.2],[168,5.2],[168,1.6],[152,1.2],[149,3.4],[182,8.8],[106,6.7],[111,9.2],[130,6.3],[147,2.9],[81,8.1],[138,7.7],[107,3.9],[124,0.7],[130,2.6],[86,9.2],[169,7.5],[122,9.9],[100,3.8],[172,4.1],[140,7.3],[161,2.3],[141,0.9]]
} ]
```

Each entry in the `series` array is a two-unit array. The first number is a 
category/angle/circular position, the second one is value.

Use graph's regular settings to modify appearance like bullets, colors, etc:

http://docs.amcharts.com/3/javascriptcharts/AmGraph


### OMG! My chart looks like an ugly sea urchin!

The plugin works by adding a lot of categories, which creates a value axis for
each of those. Using default settings (360 categories around the circle) it may
look a bit off.

There's no other solution but to upgrade to the latest version of the 
JavaScript Charts. Since version 3.19.5 it supports a `valueAxis` property
`axisFrequency` which allows controlling the number of axes/labels on the polar
chart.

The plugin will automatically set it for you if you don't do it. But if you 
feel like tinkering with it you can do so like this:

```
"valueAxes": [ {
  "gridType": "circles",
  "minimum": 0,
  "axisFrequency": 30
} ]
```

## Examples

http://codepen.io/team/amcharts/pen/c7dffa24ca45a567d664328201014e68

## License

All software included in this collection is licensed under Apache License 2.0.

This basically means you're free to use or modify it, even make your own 
versions or completely different products out of them.

Please see attached file "license.txt" for the complete license or online here:

http://www.apache.org/licenses/LICENSE-2.0


## Contact us

* Email:contact@amcharts.com
* Web: http://www.amcharts.com/
* Facebook: https://www.facebook.com/amcharts
* Twitter: https://twitter.com/amcharts


## Changelog

### 1.0
* Initial release