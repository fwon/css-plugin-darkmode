'use strict';

const cssDarkMode = require('./lib/plugin.js');

(function (module, exports) {
  function PreProcessor(options) {
    this.options = options || {};
  }

  PreProcessor.prototype = {
    process: function (src, extra) {
      let cssType = 'css';
      if (extra.fileInfo && !/\.(less|scss|css|sass)$/i.test(extra.fileInfo.filename)) {
        return src;
      }

      cssType = extra.fileInfo.filename.match(/\.(less|scss|css|sass)$/i)[1];
      return cssDarkMode(src, {
        syntax: this.options.type || cssType
      });
    }
  };

  function CSSPluginDarkMode(options) {
    this.options = options || {};
  }
  // extract css parser for user
  CSSPluginDarkMode.Parser = cssDarkMode;
  CSSPluginDarkMode.prototype = {
    install: function (css, pluginManager) {
      pluginManager.addPreProcessor(new PreProcessor(this.options));
    },
    printUsage: function () {
      console.log('Transform css to darkmode....\n');
    }
  };

  module.exports = CSSPluginDarkMode;

})(module, exports);
