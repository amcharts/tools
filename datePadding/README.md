# amCharts Plugin: Date Padding

Version: 1.0.0


## Description

Allows extending date-based category axis date/time range beyond actual start 
and end of the data. Can use absolute date and time, or relative period count.

Current version of the plugin support only date-based Serial charts. Support
for Stock Chart is going to be available soon.


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
  "minimumDate": "2012-01-01",
  "maximumDate": "2014-12-31"
}
```

Or

```
"categoryAxis": {
  "minPeriod": "DD",
  "prependPeriods": 5, // add 5 days start
  "appendPeriods": 5   // add 5 days to end
}
```

The plugin adds the following parameters to the `categoryAxis`:

Parameter | Description
--------- | -----------
appendPeriods | Adds a number of periods (as defined in `minPeriod`) to the end of data
prependPeriods | Adds a number of periods (as defined in `minPeriod`) to the start of data
maximumDate | Sets the end date/time
minimumDate | Sets the start date/time

Needless to say, mixing append/prepend and maximum/minimum settings does not 
make a lot of sense, although doing so will not blow anything up.


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

### 1.0
* Initial release