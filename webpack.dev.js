const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
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
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'css/[name].css',
            chunkFilename: 'css/[id].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html')
        })
    ], 
    devServer: {
        hot: true,
        open: true,
    },
    devtool: 'source-map',
}