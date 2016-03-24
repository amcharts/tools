# amCharts Plugin: Date Padding

Version: 1.0.2


## Description

Allows extending date-based category axis date/time range beyond actual start 
and end of the data. Can use absolute date and time, or relative period count.

Current version of the plugin support date-based Serial charts and Stock Chart.


## Installation

To enable, include `datePadding.min.js` on your web page.

I.e.:

```
<script src="//www.amcharts.com/lib/3/plugins/tools/datePadding/datePadding.min.js"></script>
```

This needs to go **after** all other amCharts includes.


## Usage

The plugin works by ditching pre-defined categories and creating it's own 
categories at specific angles.

To set plugin settings, use `datePadding` block:

```
"categoryAxis": {
  "parseDates": true,
  "minimumDate": "2012-01-01",
  "maximumDate": "2014-12-31"
}
```

Or

```
"categoryAxis": {
  "parseDates": true,
  "minPeriod": "DD",
  "prependPeriods": 5, // add 5 days start
  "appendPeriods": 5   // add 5 days to end
}
```

For Stock Chart, put datePadding parameters into `categoryAxesSettings`. I.e.:

```
"categoryAxesSettings": {
  "minimumDate": "2012-01-01",
  "maximumDate": "2014-12-31"
}
```

The plugin adds the following parameters to the 
`categoryAxis`/`categoryAxesSettings`:

Parameter | Description
--------- | -----------
appendPeriods | Adds a number of periods (as defined in `minPeriod`) to the end of data
prependPeriods | Adds a number of periods (as defined in `minPeriod`) to the start of data
maximumDate | Sets the end date/time
minimumDate | Sets the start date/time

Needless to say, mixing append/prepend and maximum/minimum settings does not 
make a lot of sense, although doing so will not blow anything up.


### What format should my maximumDate/minimumDate be in?

The plugin accepts whatever you are using for the chart data. It can be a Date
object:

```
"minimumDate": new Date(2014, 3, 1),
"maximumDate": new Date(2016, 3, 30)
```

(please note that months in JavaScript's Date constructor are zero-based)

Or, a string, if you also specified `dataDateFormat`:

```
"minimumDate": "2014-04-01,
"maximumDate": "2016-04-30"
```

Or, integer timestamps:

```
"minimumDate": 1396299600000,
"maximumDate": 1461963600000
```

(If you are using timestamps, make sure the `dataDateFormat` is not set)


### How do I configure it to work with Data Loader plugin?

No additional configuration is necessary. The plugin will automatically detect 
its cousin -- Data Loader plugin -- and adapt to it.


## Example

http://codepen.io/team/amcharts/pen/30c93a9bc4c636709e160a6f28be1b56


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

### 1.0.2
* Fixed a bug when using together with Data Loader on Stock Chart

### 1.0.1
* Added Stock Chart support
* Fixed a bug with `prependPeriods` not working properly

### 1.0.0
* Initial release