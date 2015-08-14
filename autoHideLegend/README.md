# amCharts Plugin: Auto-Hide Legend

Version: 1.0.1


## Description

Hides chart legend if it contains more than certain amount of entries in it.

Works with both serial (Column, Line, XY) and sliced (Pie, Funnel) chart types.

## Installation

To enable, include `autoHideLegend.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/autoHideLegend/autoHideLegend.min.js"></script>
```

## Usage

To enable, add `autoHideCount` property to your `legend` block:

```
"legend": {
  "autoHideCount": 5
},
```

The above will hide the legend automatically if legend contains 5 or more 
entries.


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