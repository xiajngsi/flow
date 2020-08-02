const fs = require('fs');
const nodePath = require('path');
const extraBabelPlugins = [
  // [
  //   'babel-plugin-import',
  //   {
  //     libraryName: '@terminus/nusi',
  //     libraryDirectory: 'es',
  //     style: function(path, file) {
  //       let targetPath = nodePath.resolve(__dirname, 'node_modules/' + path + '/style/index.css');
  //       if (fs.existsSync(targetPath)) {
  //         console.log('xxx exist', targetPath);
  //         return targetPath;
  //       } else {
  //         console.log('xxx not exist', targetPath);
  //         return '';
  //       }
  //     },
  //   },
  //   '@terminus/nusi',
  // ],
  [
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    },
    'antd',
  ],
];
export default {
  esm: 'babel',
  disableTypeCheck: true,
  // lessInBabelMode: {
  //   javascriptEnabled: true,
  //   sourceMap: {},
  // },
  extraBabelPlugins,
  // extractCSS: true,
  // extraExternals: ['lodash', 'classnames'],
  // extraRollupPlugins: [],
};
