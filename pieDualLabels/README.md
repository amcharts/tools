# amCharts Plugin: Pie Dual Labels

Version: 1.0.1


## Description

Allows adding a secondary label to Pie chart slices.

## Installation

To enable, include `pieDualLabels.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/pieDualLabels/pieDualLabels.min.js"></script>
```

## Usage

To enable second set of labels for your chart slices, use the `customLabel` 
block in chart config:

```
"customLabel": {
  "enabled": true,
  "labelText": "[[litres]]",
  "labelRadius": 15
}
```

Parameter | Description
--------- | -----------
enabled | Needs to be set to boolean true for plugin to work
labelText | What to display in the secondary label. You can use double-square bracket metacodes to specify which field in the data to use in the label. It works exactly like [`labelText`](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#labelText) property of the Pie chart.
labelRadius | A pixel value at which to put the label. Can be negative to make the label appear inside the slice.
labelFunction | Callback method to filter the output before the label gets drawn ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#labelFunction))
labelTickColor | A HEX color code to define the tick color ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#labelTickColor))
labelTickAlpha | Number between 0-1 to define the tick opacity ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#labelTickAlpha))
color | A HEX color code to define the label color ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#color)) 
fontFamily | Defines the label font family ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#fontFamily))
fontSize | A pixel value to define the label font size ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#fontSize))
maxLabelWidth | A pixel value to define the maximum with of the label, gets wrapped when the label exceeds this width ([documentation](http://docs.amcharts.com/3/javascriptcharts/AmPieChart#maxLabelWidth))


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

### 1.0.1
* Fixed overlapping issue

### 1.0
* Initial release