import typescript from 'rollup-plugin-typescript2'
import cleanup from 'rollup-plugin-cleanup'

// import pkg from './package.json'
export default [
  {
    input : './src/typescript/index.ts',
    output : [
      // {
      //   file: pkg.main,
      //   format: 'cjs'
      // },
      {
        file : './dist/js/feed.js',
        strict : false,
        banner : '((document, window) => {',
        footer : '})(document, window)',
        format : 'esm',
      },
    ],
    // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    treeshake : true,
    plugins : [
      typescript({
        typescript : require('typescript'),
      }),
      cleanup({
        comments : 'some',
        extensions : ['ts', 'js', 'jsx', 'tag'],
      }),
    ],
  },
]
