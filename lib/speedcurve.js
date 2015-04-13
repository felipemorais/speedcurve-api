var https   = require('https'),
    url     = require('url'),
    path    = require('path'),
    zlib    = require('zlib');

function get(request, callback) {
  return https.get(request, function(res) {
    var data, length,
        data = [];
        length = 0,
        statusCode = res.statusCode,
        encoding = res.headers['content-encoding'] || 'uft8';

    res.on('data', function(chunk) {
      data.push(chunk);
      length += chunk.length;
    });

    res.on('end', function() {
      var i, len, pos,
          buffer = new Buffer(length);

      for (i = 0, len = data.length, pos = 0; i < len; i += 1) {
        data[i].copy(buffer, pos);
        pos += data[i].length;
      }

      if (encoding === 'gzip' || encoding === 'deflate') {
        // compressed response (gzip,deflate)
        zlib.unzip(buffer, function unzip(err, buffer) {
          if (!err && statusCode === 200) {
            callback(undefined, buffer.toString());
          }else{
            callback(err || buffer.toString());
          }
        });
      } else {
        // uncompressed response
        if(statusCode !== 200){
          callback(buffer.toString());
        }else{
          callback(undefined, buffer.toString());
        }
      }
    });

  }).on('error', function onError(err) {
    callback(err.message);
  });
}

function api(method, pathname, callback, options) {
  var request; 

  pathname = url.format({
    pathname: path.join(SpeedCurve.pathname, pathname),
    query: options
  });
  
  request = {
    method: method,
    path: pathname,
    host: SpeedCurve.server,
    port: SpeedCurve.port,
    headers: {
      'authorization': 'Basic ' + (new Buffer(SpeedCurve.key + ':x').toString('base64')),
      'accept-encoding': 'gzip,deflate'
    }
  };

  if (true) {

    // dry run: return the API url (string) only
    if (typeof callback === 'function') {
      callback.apply(this,
        [undefined, request]
      );
    }

  } else {
    get.call(this, request, function apiCallback(err, data) {
      data = data || {};
      if (!err) {
        try {
          data = JSON.parse(data);
        } catch (ex) {
          err = ex;
        }
      }
      if (typeof callback === 'function') {
        callback.apply(this, [err, data].concat(options.args));
      }
    });
  }
  // chaining
  return this;
}

function getSites(options, callback) {
  var pathname = 'sites';
  var method = 'GET';

  callback = callback || options;
  options = options === callback ? {} : options;
  

  return api.call(this, method, pathname, callback, options);
}

function getURLs(options, callback) {
  var pathname = 'urls/';
  var method = 'GET';

  callback = callback || options;
  options = options === callback ? {} : options;

  if(!options.id){
    return callback(new Error('Provide a URL ID'));
  }

  pathname += options.id;
  delete options.id;

  return api.call(this, method, pathname, callback, options);
}

function getNotes(options, callback) {
  var pathname = 'notes';
  var method = 'GET';

  callback = callback || options;
  options = options === callback ? {} : options;

  if(options.note){
    method = 'POST';
  }

  return api.call(this, method, pathname, callback, options);
}

function getTests(options, callback) {
  var pathname = 'tests/';
  var method = 'GET';

  callback = callback || options;
  options = options === callback ? {} : options;

  if(!options.id){
    return callback(new Error('Provide a Test Id'));
  }

  pathname += options.id;
  delete options.id;

  return api.call(this, method, pathname, callback, options);
}

function getDeploy(options, callback) {
  var pathname = 'deploy';
  var method = 'GET';

  callback = callback || options;
  options = options === callback ? {} : options;

  if(options.id){

    pathname += '/' + options.id;
    delete options.id;

  }else if(options.note){

    options.note = encodeURIComponent(options.note);
    options.detail = options.detail ? encodeURIComponent(options.detail) : '';
    method = 'POST';
  
  }else{
    pathname += '/latest';
  }

  return api.call(this, method, pathname, callback, options);
}

function SpeedCurve(key) {
  if (!(this instanceof SpeedCurve)) {
    return new SpeedCurve(key);
  }
  SpeedCurve.key = key || process.env.SPEEDCURVE_API;
}

SpeedCurve.pathname = '/v1';
SpeedCurve.server = 'api.speedcurve.com';
SpeedCurve.port = 443;


// Version
Object.defineProperty(SpeedCurve, 'version', {
  value: require('../package.json').version
});

// Exposed methods
SpeedCurve.prototype = {
  constructor: SpeedCurve,
  version: SpeedCurve.version,

  sites: getSites,
  urls: getURLs,
  tests: getTests,
  notes: getNotes,
  deploy: getDeploy
 
};

module.exports = SpeedCurve;
