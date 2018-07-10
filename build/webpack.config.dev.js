const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin=require('html-webpack-plugin')
const config = {
    mode: "development",
    entry: './demo/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "index.js"
    },
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:path.resolve(__dirname,'../demo/index.html'),
            // chunks:['index.js']
        })
    ]

}

module.exports = config