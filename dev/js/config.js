require.config({
  paths: {
    'jquery': 'libs/jquery-1.10.0.min',
    'mustache': 'libs/mustache',
    'inflection': 'libs/inflection.min'
  },
  shim: {
    mustache: {
      exports: 'mustache'
    },
    inflection: {
      exports: 'inflection'
    },
    jquery: {
      exports: '$'
    }
  }
});
