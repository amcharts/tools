# amCharts Plugin: Auto Guides

Version: 1.2.1


## Description

Automatically add guides to mark out preset days, like weekends using guides.

Current version of the plugin supports date-based Serial charts and Stock Chart
only.


## Installation

To enable, include `autoGuides.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/autoGuides/autoGuides.min.js"></script>
```

This needs to go **after** all other amCharts includes.


## Usage

The plugin works by ditching pre-defined categories and creating it's own
categories at specific angles.

To set plugin settings, use `autoGuides` block:

```
"categoryAxis": {
  "parseDates": true,
  "autoGuides": {
    "days": [ 0, 6 ],
    "hours": [ 19, 20, 21, 22, 23, 0, 1, 2, 3, 4 , 5, 6 ],
    "lineColor": "#000",
    "lineAlpha": 0.2,
    "fillColor": "#000",
    "fillAlpha": 0.2
  }
}
```

Use `days` array to specify week days to add guide to. Note that 0 is Sunday,
1 - Monday, and all the way to 6 - Saturday.

Or, if you'd rather mark out certain hours of the day, use `hours` array
instead.

Since the plugin will create a guide for each matching day, you can add any
Guide setting to it which will be applied to the guides.

For a list of available settings, refer to this class reference:
http://docs.amcharts.com/3/javascriptcharts/Guide

### Stock Chart

Stock Chart works the same way, except the `categoryAxis` block goes into each
panel config.

## Examples

Daily:
http://codepen.io/team/amcharts/pen/188a5aaa16cdd760ee16208523074798

Hourly:
http://codepen.io/team/amcharts/pen/dcfd0c1a3bfcb9e900cafad0a1bc0caf

Stock Chart:
http://codepen.io/team/amcharts/pen/2be9ef03793ec1efefc981ddcd96c4bc


### How do I configure it to work with Data Loader plugin?

No additional configuration is necessary. The plugin will automatically detect
its cousin -- Data Loader plugin -- and adapt to it.


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

# 1.2.1
* Add additional checks for `dataProvider`

# 1.2
* Added Stock Chart support

### 1.0.2
* Added support for `hours`

### 1.0.1
* Added support for Data Loader

### 1.0.0
* Initial release