import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['dist/demo.js'],
  output: {
    name: 'lagdotcomSimpleInputs',
    file: 'demo/bundle.js',
    format: 'iife',
  },
  plugins: [commonjs()],
};
