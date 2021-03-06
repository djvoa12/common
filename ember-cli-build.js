'use strict';
/* eslint camelcase: 0 */

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    dotEnv: {
      clientAllowedKeys: ['ILIOS_FRONTEND_API_NAMESPACE', 'ILIOS_FRONTEND_API_HOST']
    },
    'ember-cli-uglify': {
      uglify: {
        compress: {
          collapse_vars: false
        }
      }
    },
    'ember-froala-editor': {
      languages: ['fr','es'],
      plugins: ['lists', 'code_view', 'link'],
      themes: 'gray'
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  return app.toTree();
};
