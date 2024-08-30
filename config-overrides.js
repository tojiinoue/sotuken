const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    assert: require.resolve('assert/'),
    events: require.resolve('events/') // events ポリフィルを追加
  };

  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin()
  ]);

  // 'node:' スキームのサポートを追加
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'node:buffer': 'buffer',
      'node:events': 'events',
      // 必要な他の 'node:' スキームのモジュールを追加
    }
  };

  return config;
};
