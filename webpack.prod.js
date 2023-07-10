const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './release'),
        filename: 'js/[name]_[contenthash].js',
        chunkFilename: 'js/[id].[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env',{
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                }],
                                '@babel/preset-react',
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                        }
                    }
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',{
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                ['autoprefixer',{
                                    "browsers":[
                                        "last 10 Chrome versions",
                                        "last 5 Firefox versions",
                                        "Safari >= 6",
                                        "ie > 8",
                                    ]
                                }],
                            ]
                        }
                    }
                }]  
            }
        ]   
    },
    optimization: {
        splitChunks: {
          chunks: 'async',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            react: {
                name: 'react',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                priority: 100,
            },
            antd: {
                name: 'antd',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](antd)[\\/]/,
                priority: 100,
            },
          },
        },
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true,
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html')
        })
    ], 
}