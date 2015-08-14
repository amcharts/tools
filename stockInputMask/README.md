# amCharts Plugin: Stock Chart Input Mask

## Description

If enabled this plugin will enforce certain date format as user is types in the 
date/time in period selector date fields.

It will automatically add dividers and punctuation according to `dateFormat` 
setting.

Works with Stock Chart only.


## Installation

To enable, include `stockInputMask.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/stockInputMask/stockInputMask.min.js"></script>
```

## Usage

Set `useInputMask: true` in `periodSelector` config block:

```
"periodSelector": {
  "position": "top",
  "dateFormat": "YYYY-MM-DD JJ:NN",
  "useInputMask": true
}
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