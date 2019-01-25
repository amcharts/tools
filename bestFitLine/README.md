# amCharts Plugin: Best fit line

Version: 1.0.9


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


### I don't want the best fit line to appear in legend!

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

### Oh ok. But I don't want the rollover balloon either.

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

### Hiding related trend line when graph is hidden

To enable that, set `hideWithParent` to `true` in `bestFitLine`:

```
"graphs": [{
  "valueField": "value",
  "bestFitLine": {
    "lineColor": "#cc0000",
    "lineAlpha": 0.8,
    "lineThickness": 2,
    "visibleInLegend": false,
    "showBalloon": false,
    "hideWithParent": true
  }
}]
```

### Extending trend line beyond the actual data of the graph

Add `extend: true` to your `bestFitLine` config, and the plugin will extend the
trend line to fit the whole scope of data, even if your actual graph starts and 
ends at some mid-point in data.

### Using another valueField from dataProvidor

Add `valueField: "theField"` to your `bestFitLine` config to change the field 
used to calculate the trend line.
Default is the current graph's valueField.

Can be useful when using "openField" setting in graph (bar charts that doesn't
start at 0).


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

### 1.0.9
* Fixed issue with graphs not being updated when the first graph did not change

### 1.0.8
* Fixed issue with multiple graphs with non-overlapping data points

### 1.0.7
* Calling `AmCharts.bestFitLineProcess()` repeatedly will not create new trend lines anymore

### 1.0.6
* Fixed failing if `dataProvider` was empty

### 1.0.5
* Introduced `AmCharts.bestFitLineProcess()` function whch can be used to refresh trend lines after data is updated

### 1.0.4
* Added "extend" config parameter

### 1.0.3
* Better handling of date-based data with gaps

### 1.0.2
* Fixed a bug where start of the trend line was offset by one category

### 1.0.1
* Implemented empty data point handling
* Implemented `hideWithParent` property (when trend line's graph is hidden, trend graph is hidden as well)

### 1.0
* Initial release