var array = require('./vendor/postgres-array');

module.exports = {
  create: function (source, transform) {
    return {
      parse: function() {
        return array.parse(source, transform);
      }
    };
  }
};
