# amCharts Plugin: Auto-Offset Value Axis

Version: 1.0


## Description

Normally, if your chart uses multiple value axes, you would need to set it's 
`offset` property manually, in order make them not overlap.

This plugin takes care of that and positions the axes automatically. It will 
even take the width of the actual axis labels into account when calculating the 
offsets.

Works with serial charts only.


## Installation

To enable, include `autoOffsetAxis.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/autoOffsetAxis/autoOffsetAxis.min.js"></script>
```

## Usage

Set `autoOffset: true` in each of the value axis definition in your chart 
config:

```
"valueAxes": [{
  "id": "v1",
  "position": "left",
  "autoOffset": true
}, {
  "id": "v2",
  "position": "left",
  "autoOffset": true
}]
```


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