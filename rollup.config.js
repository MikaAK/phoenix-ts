import babel from 'rollup-plugin-babel'

export default [{
  format: 'es',
  entry: 'phoenix.js',
  dest: 'dist/phoenix.es6.js'
}, {
  entry: 'phoenix.js',
  format: 'cjs',
  plugins: [babel({exclude: 'node_modules/**'})],
  dest: 'dist/phoenix.es5.js',
  sourceMap: true
}]
