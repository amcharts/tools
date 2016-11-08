# amCharts Plugin: Smooth custom bullet images

Version: 1.0.4


## Description

Automatically adds a border radius to custom bullet images set in pixel.

## Installation

To enable, include `smoothCustomBullets.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/smoothCustomBullets/smoothCustomBullets.min.js"></script>
```

This needs to go **after** all other amCharts includes.


## Usage

The plugin creates an individual clip path on every custom bullet image to smooth the corners.

To set plugin settings, use `smoothCustomBullets` block:

```
"smoothCustomBullets": {
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
```

By default the plugin uses the `bulletSize` of every data point to smooth the corners which results in a circle and uses the `bulletColor`
if none has been specified.

Parameter | Default | Description
--------- | ----------- | -----------
borderRadius | "auto" | A numeric or string value which defines the size of the curved corner (~"em", ~"ex", ~"px", ~"in", ~"cm", ~"mm", ~"pt", ~"pc").
updateClipPaths | | Method which generates the clippaths and borders.
fillAlpha | 0 | A numeric value from 0 to 1 which controls the opacity of the overlaying layer.
fillColor | undefined | A string value which defines the color of the overlaying layer.
borderAlpha | 0 | A numeric value from 0 to 1 which controls the opacity of the border.
borderColor | undefined | A string value which specifies the color of the border by default it takes the [`bulletColor`](http://docs.amcharts.com/3/javascriptcharts/AmGraph#bulletColor)
borderThickness | undefined | A numeric value which controls the thickness of the border.
borderLinejoin | undefined | A string value which specifies the shape to be used at the corners of paths or basic shapes when they are stroked.
borderLinecap | undefined | A string value which specifies the shape to be used at the end of open subpaths when they are stroked.
borderDasharray | undefined | A comma separated string value which controls the pattern of dashes and gaps used to stroke paths.
positiveOffset | 0 | Numeric value in pixel which sets the offset on positive bullet points.
negativeOffset | 3 | Numeric value in pixel which sets the offset on negative bullet points.


## Examples

Manual:
http://codepen.io/team/amcharts/pen/093ec9772abcc4c241f39393cd7b76d5

Dynamic:
http://codepen.io/team/amcharts/pen/94204d7cd4f563b7da2c731ff115d71c


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

# 1.0.4
* Fixed: Double placement issue caused by initial "zoomed" event
* Added: `positiveOffset` and `negativeOffset` config option to adjust the offset of the bullet points

# 1.0.3
* Fixed: Update issue on valueAxis

### 1.0.2
* Fixed: Issue collecting bullets on XY charts
* Added: Support on `negativeColor` setting in graphs
* Added: Support on `zoomed` event on charts
* Added: Support on folowing chart types "serial", "xy", "radar", "stock", "gantt"

### 1.0.1
* Added: border / fill options, see [usage](#usage)

### 1.0.0
* Initial release