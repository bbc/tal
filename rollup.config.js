var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

module.exports = [{
    input: 'rollup/tal-exit-strategies.js',
    output: {
        file: 'static/script/lib/tal-exit-strategies.js',
        format: 'amd',
        amd: {
            id: 'antie/lib/tal-exit-strategies'
        }
    },
    plugins: [
        commonjs(),
        nodeResolve()
    ]
}];
