var config = require(__dirname + '/../../../config.js');
var dust = require('dustjs-linkedin');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var uglify = require('uglify-js');

var Dust = function () {
  this.templates = {};

  // Loading core Dust helpers
  require('dustjs-helpers');

	dust.onLoad = (function (templateName, opts, callback) {
    var template = templateName + '.dust';

    if (template.indexOf('partials') > -1) {
      template = this.options.partialPath + '/' + template.replace('partials/', '');
    } else {
      template = this.options.pagePath + '/' + template;
    }

    fs.readFile(template, { encoding: 'utf8' }, function (err, data) {
      if (err) {
        // no template file found?
        return callback(err, null);
      }

      return callback(null, data);
    });
  }).bind(this);
};

Dust.prototype._exportFunctionsAs = function (type) {
  var output = '';

  Object.keys(dust[type]).forEach(function (item) {
    var itemCode = dust[type][item].toString();

    if (itemCode.indexOf('[native code]') !== -1) {
      return;
    }

    output += ('dust.' + type +  '.' + item + '=' + itemCode + ';');
  });

  return output;
};

Dust.prototype._writeToFile = function (filePath, content, append, minify) {
  return new Promise(function (resolve, reject) {
    mkdirp(path.dirname(filePath), function (err, made) {
      if (err) {
        log.error({module: 'dust'}, {err: err}, "Error creating directory for file '%s'", filePath);

        return reject(err);
      }

      var writeFunction = append ? fs.appendFile : fs.writeFile;

      if (minify) {
        content = uglify.minify(content, {fromString: true}).code;
      }

      writeFunction.call(this, filePath, content, function (err) {
        if (err) {
          log.error({module: 'dust'}, {err: err}, "Error writing to file '%s'", filePath);

          return reject(err);
        }

        resolve(content);
      });
    });
  });
};

Dust.prototype.clearCache = function () {
  dust.cache = {};
};

Dust.prototype.compile = function (source, templateName, load) {
  load = (load !== false);

  // Skipping compilation if template is already loaded
  if (this.isLoaded(templateName)) return;

  try {
    var compiled = dust.compile(source, templateName);

    if (load) {
      dust.loadSource(compiled);
    }

    this.templates[templateName] = compiled;
  } catch (err) {
    log.error({module: 'dust'}, {err: err}, "Couldn\'t compile Dust template '%s'", templateName);
  }

  return compiled;
};

Dust.prototype.compileDirectory = function (directory, prefix, recursive) {
  prefix = prefix || '';

  var self = this;

  return new Promise(function (resolve, reject) {
    fs.readdir(directory, function (err, files) {
      var filesAbsolute = files.map(function (file) {
        return path.join(directory, file);
      });

      resolve(self.compileFiles(filesAbsolute, prefix, recursive));
    });
  });
};

Dust.prototype.compileFiles = function (files, prefix, recursive) {
  prefix = prefix || '';

  var self = this;

  return new Promise(function (resolve, reject) {
    var queue = [];

    files.forEach(function (file) {
      fs.stat(file, function (err, stats) {
        var basename = path.basename(file, '.dust');

        if (stats.isDirectory() && recursive) {
          queue.push(self.compileDirectory(file, path.join(prefix, basename)));
        } else if (stats.isFile() && (path.extname(file) === '.dust')) {
          var name = path.join(prefix, basename);

          fs.readFile(file, 'utf8', function (err, data) {
            queue.push(Promise.resolve(self.compile(data, name)));
          });
        }
      });
    });

    resolve(Promise.all(queue));
  });
};

Dust.prototype.getEngine = function () {
  return dust;
};

Dust.prototype.isLoaded = function (templateName) {
  return dust.cache.hasOwnProperty(templateName);
};

Dust.prototype.loadDirectory = function (directory) {
  return new Promise(function (resolve, reject) {
    fs.stat(directory, function (err, stats) {
      if (err) {
        reject(err);
      }

      if (stats.isDirectory()) {
        fs.readdir(directory, function (err, files) {
          if (err) {
            reject(err);
          }

          var filesToRead = files.length;

          if (filesToRead === 0) {
            return resolve();
          }

          files.forEach(function (file) {
            var filepath = path.resolve(directory, file);

            fs.stat(filepath, function (err, stats) {
              filesToRead--;

              if (err) {
                reject(err);
              }

              if (stats.isFile() && (path.extname(filepath) === '.js')) {
                require(filepath);
              }

              if (filesToRead === 0) {
                resolve();      
              }
            });
          });
        });
      }
    });
  });
};

Dust.prototype.render = function (templateName, data, callback) {
  dust.render(templateName, data, callback);
};

Dust.prototype.setConfig = function (key, value) {
  dust.config[key] = value;
};

Dust.prototype.setDebug = function (debug) {
  dust.isDebug = debug;
};

Dust.prototype.setDebugLevel = function (debugLevel) {
  dust.debugLevel = debugLevel;
};

Dust.prototype.setOptions = function (options) {
  this.options = options;
};

Dust.prototype.writeClientsideFiles = function () {
  var self = this;
  var compiledTemplates = this.templates;
  var queue = [];

  // Write templates
  if (config.get('dust.clientRender.templates.enabled')) {
    if (config.get('dust.clientRender.templates.format') === 'combined') {
      var templatesOutputFile = path.join(config.get('paths.public'), config.get('dust.clientRender.templates.path'));
      var templatesOutput = '';

      Object.keys(compiledTemplates).forEach(function (name) {
        templatesOutput += compiledTemplates[name];
      });

      queue.push(this._writeToFile(templatesOutputFile, templatesOutput));
    } else {
      Object.keys(compiledTemplates).forEach((function (name) {
        var templatesOutputFile = path.join(config.get('paths.public'), config.get('dust.clientRender.templates.path'), name) + '.js';

        queue.push(this._writeToFile(templatesOutputFile, compiledTemplates[name]));
      }).bind(this));
    }
  }

  // Write filters
  if (config.get('dust.clientRender.filters.enabled')) {
    var filtersOutputFile = path.join(config.get('paths.public'), config.get('dust.clientRender.filters.path'));
    var filtersOutput = this._exportFunctionsAs('filters');
    var fileAppend = (queue.length > 0) && ((config.get('dust.clientRender.filters.path') === config.get('dust.clientRender.templates.path')));

    queue.push(this._writeToFile(filtersOutputFile, filtersOutput, fileAppend, true));
  }

  // Write helpers
  if (config.get('dust.clientRender.helpers.enabled')) {
    var helpersOutputFile = path.join(config.get('paths.public'), config.get('dust.clientRender.helpers.path'));
    var helpersOutput = this._exportFunctionsAs('helpers');
    var fileAppend = (queue.length > 0) && ((config.get('dust.clientRender.helpers.path') === config.get('dust.clientRender.templates.path')) ||
                                            (config.get('dust.clientRender.helpers.path') === config.get('dust.clientRender.filters.path')));

    queue.push(this._writeToFile(helpersOutputFile, helpersOutput, fileAppend, true));
  }

  return Promise.all(queue);
};

module.exports = new Dust();
