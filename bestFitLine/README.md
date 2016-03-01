# amCharts Plugin: Best fit line

Version: 1.0.0


## Description

Shows an automatically-calculated best fit trend line for a graph(s).

Works with serial chart only.

## Installation

To enable, include `bestFitLine.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/bestFitLine/bestFitLine.min.js"></script>
```

## Usage

To add a best fit line for a graph, include a `bestFitLine` object into graph's
config. I.e.:

```
"graphs": [{
  "valueField": "value",
  "bestFitLine": {
    "lineColor": "#cc0000",
    "lineAlpha": 0.8,
    "lineThickness": 2
  }
}]
```

A plugin will add another graph for the best fit line. What goes into 
`bestFitLine` object will be used as that graphs settings. So, you can use 
anything you could use on the normal graph, except for the `valueField` which 
will be assigned by the plugin.

http://docs.amcharts.com/3/javascriptcharts/AmGraph


## I don't want the best fit line to appear in legend!

Use `visibleInLegend` setting to remove it from legend:

```
"graphs": [{
  "valueField": "value",
  "bestFitLine": {
    "lineColor": "#cc0000",
    "lineAlpha": 0.8,
    "lineThickness": 2,
    "visibleInLegend": false
  }
}]
```

## Oh ok. But I don't want the rollover balloon either.

`showBalloon` is your friend here:

```
"graphs": [{
  "valueField": "value",
  "bestFitLine": {
    "lineColor": "#cc0000",
    "lineAlpha": 0.8,
    "lineThickness": 2,
    "visibleInLegend": false,
    "showBalloon": false
  }
}]
```

## Examples

Here are a couple of examples that use this plugin.

Category-based:
http://codepen.io/team/amcharts/pen/8bf741f6fc8c6c330ee317baa2bc1dee

Date-based:
http://codepen.io/team/amcharts/pen/0fc47f492f01aa42c3755e7da4a181f0

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