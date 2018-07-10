const path = require('path')
const webpack = require('webpack');
const config = {
    mode: "development",
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "index.js"
    },
    module: {
        rules: []
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
    ]

}

module.exports = config