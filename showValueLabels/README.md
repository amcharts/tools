# amCharts Plugin: Show Value Labels

Version: 1.1.0


## Description

For each grid line, displays a label which shows the current value.

Works with serial and stock charts.

## Installation

To enable, include `showValueLabels.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/showValueLabels/showValueLabels.min.js"></script>
```

## Usage

To enable, set the `valueLabels` property to `{}` in your `graphs` (or `stockGraphs` if you are using a stock chart):

```
"graphs": [{
  "valueLabels": {}
}]
```

You can also supply additional options:

```
"graphs": [{
  "valueLabels": {
    "labelRotation": 90
  }
}]
```

The options are exactly the same as for [guides](http://docs.amcharts.com/3/javascriptstockchart/Guide).


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

### 1.1.0
* Renaming `showValueLabels` to `valueLabels`
* `valueLabels` now accepts additional options, rather than a simple boolean

### 1.0.0
* Initial release
