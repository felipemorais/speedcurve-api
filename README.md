## SpeedCurve API Wrapper for NodeJS

SpeedCurve API Wrapper is a [NPM](https://npmjs.org) package that wraps [SpeedCurve API](http://api.speedcurve.com) for [NodeJS](https://nodejs.org) as a module and a command-line tool.

## Getting started

```bash
$ npm install speedcurve-api -g
```

## Basics

### Command line
```bash
$ speedcurve deploy --note="I'm a note" --detail="I'm a longer note with way more detail."
```

### Module
```javascript
var SpeedCurve = require('speedcurve-api');
var spd = new SpeedCurve('<your-api-key>', [dry-run]);

spd.deploy({
	  note: 'I am a note',
	  detail: 'I am a longer note with way more detail.'
	}, function(err, data) {
	  console.log(err || data);
	});
```
