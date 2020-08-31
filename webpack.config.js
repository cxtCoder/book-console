var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
    entry: {
        app: ['./src/main.js']
    },
    node: {
        fs: "empty" //xlsx-style bug
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: 'dist/',
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {test: /\.css$/, loader: 'style-loader'},
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'vendor': path.resolve(__dirname,'./src/vendor')
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/bookManage': 'http://localhost:9088'
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    externals: {
        // 'echarts': 'echarts'
        'jquery': "jQuery",
        'bootstrap': "bootStrap"
    },
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = false
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false,
                drop_debugger: true
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        // new BundleAnalyzerPlugin(),
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
            threshold: 10240,//对10K以上的数据进行压缩
            minRatio: 0.8,
            deleteOriginalAssets: false,//是否删除源文件
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            favicon: './dist/favicon.ico'
        })
    ])
}