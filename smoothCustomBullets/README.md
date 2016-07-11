# amCharts Plugin: Smooth custom bullet images

Version: 1.0.0


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
  "borderRadius": "auto"
}
```

You can define your own `borderRadius` as a number or these following types ~"em", ~"ex", ~"px", ~"in", ~"cm", ~"mm", ~"pt", ~"pc".
By default the plugin uses the `bulletSize` of every data point to smooth the corners which results in a circle.


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

# 1.0.0
* Initial release