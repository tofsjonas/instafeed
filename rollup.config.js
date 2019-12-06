import typescript from 'rollup-plugin-typescript2'
// import pkg from './package.json'
export default [
  {
    input: './src/javascript/feed.ts',
    output: [
      // {
      //   file: pkg.main,
      //   format: 'cjs'
      // },
      {
        file: './dist/feed.js',
        strict: false,
        banner: '((document, window) => {',
        footer: '})(document, window)',
        // file: pkg.module,
        // globals: {
        //   window: 'window',
        //   document: 'document'
        // },
        // external: ['window', 'document'],
        // globals: ['window', 'document'],
        format: 'esm'
        // format: 'iife'
      }
    ],
    // external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    treeshake: true,
    plugins: [
      typescript({
        typescript: require('typescript')
      })
    ]
  }
]
