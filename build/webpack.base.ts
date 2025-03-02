/**
 * 导入webpack的Configuration类型，用于定义webpack配置对象的类型
 * 明确配置对象的结构，提高代码的类型安全性和可维护性
 */
import { Configuration, DllReferencePlugin } from "webpack";
/**
 * 导入Node.js的path模块，用于处理文件路径
 * 方便在不同操作系统下正确处理文件和目录的路径
 */
import path from "path";
/**
 * 导入MiniCssExtractPlugin，用于将CSS提取到单独的文件中
 * 避免CSS被打包到JavaScript文件中，提高加载性能
 */
import MiniCssExtractPlugin from "mini-css-extract-plugin";
/**
 * 导入HtmlWebpackPlugin，用于生成HTML文件并自动注入打包后的资源
 * 简化HTML文件的生成过程，自动处理资源引用
 */
import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * 定义基础的webpack配置对象
 * @type {Configuration}
 * 此配置对象包含了webpack打包的基本设置，如入口、输出、解析规则等
 */
const baseConfig: Configuration = {
  /**
   * 入口文件的路径，指定webpack开始打包的文件
   * 从该文件开始，webpack会递归地分析和打包其依赖的所有文件
   */
  entry: path.join(__dirname, "../src/index.tsx"),
  output: {
    /**
     * 打包后文件输出的目录
     */
    path: path.join(__dirname, "../dist"),
    /**
     * 打包后文件的公共前缀路径
     */
    publicPath: "/",
    /**
     * 每个输出js文件的名称，使用chunkhash保证文件名的唯一性
     */
    filename: "static/js/[name].[chunkhash:8].js",
    /**
     * 没有设置入口时的chunk命名配置
     */
    chunkFilename: "static/js/[name].[chunkhash:8].js",
    /**
     * webpack5内置了clean-webpack-plugin，配置为true时，在打包前会默认清空output目录
     */
    clean: true,
  },
  resolve: {
    /**
     * 自动解析确定的扩展，当导入文件时可以省略这些扩展名
     */
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      /**
       * 配置别名，使用@代替src目录，方便导入文件
       */
      "@": path.resolve(__dirname, "../src"),
    },
  },
  cache: {
    /**
     * 使用文件缓存，提高打包速度
     */
    type: "filesystem",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)?$/, // 匹配.ts, tsx, js, jsx文件
        exclude: /node_modules/, // 排除node_modules目录
        include: path.resolve(__dirname, "../src"), // 只编译src目录下的文件
        enforce: "pre", // 在babel-loader对源码进行转换前执行
        use: ["thread-loader", "babel-loader"], // 使用thread-loader开启多进程打包 babel-loader 转换js文件
      },
      {
        test: /\.(css|scss)$/, // 匹配css, scss文件
        use: [
          MiniCssExtractPlugin.loader, // 提取css到单独文件
          "css-loader", // 解析css
          "sass-loader", // 解析sass
          {
            loader: "postcss-loader", // 自动添加css前缀
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer", // 添加前缀
                    {
                      // 配置要兼容到的环境
                      browsers: [
                        "last 10 Chrome versions",
                        "last 5 Firefox versions",
                        "Safari >= 6",
                        "ie > 8",
                      ],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/images/[name].[contenthash:6][ext]",
        },
      },
      /**
       * 匹配字体文件的正则表达式，支持woff、woff2、eot、ttf、otf格式
       */
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        /**
         * 使用asset模块类型，Webpack会根据文件大小自动选择是将文件打包成单独的文件还是内联为DataURL
         */
        type: "asset",
        parser: {
          dataUrlCondition: {
            /**
             * 当文件大小小于等于10KB时，将文件内联为DataURL
             */
            maxSize: 10 * 1024,
          },
        },
        generator: {
          /**
           * 生成的字体文件命名规则，将字体文件输出到static/fonts目录下，文件名包含内容哈希和扩展名
           */
          filename: "static/fonts/[name].[contenthash:6][ext]",
        },
      },
      {
        /**
         * 匹配音频和视频文件的正则表达式，支持mp4、webm、ogg、mp3、wav、flac、aac等格式
         */
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        /**
         * 使用asset模块类型，Webpack会根据文件大小自动选择是将文件打包成单独的文件还是内联为DataURL
         */
        type: "asset",
        parser: {
          dataUrlCondition: {
            /**
             * 当文件大小小于等于10KB时，将文件内联为DataURL
             */
            maxSize: 10 * 1024,
          },
        },
        generator: {
          /**
           * 生成的文件命名规则，将文件输出到static/media目录下，文件名包含内容哈希和扩展名
           */
          filename: "static/media/[name].[contenthash:6][ext]",
        },
      },
    ],
  },
  plugins: [
    /**
     * 创建MiniCssExtractPlugin实例，用于将CSS提取到单独的文件中
     * @param {Object} options - 插件选项
     * @param {string} options.filename - 提取后的CSS文件命名规则
     * @param {string} options.chunkFilename - 提取后的CSS代码块文件命名规则
     */
    new MiniCssExtractPlugin({
      // 提取后的CSS文件命名规则，使用contenthash保证文件名的唯一性
      filename: "static/css/[name].[contenthash:8].css",
      /**
       * 提取后的CSS代码块文件命名规则，使用contenthash保证文件名的唯一性
       */
      chunkFilename: "static/css/[name].[contenthash:8].css",
    }),
    /**
     * 创建HtmlWebpackPlugin实例，用于生成HTML文件并自动注入打包后的资源
     * @param {Object} options - 插件选项
     * @param {string} options.template - HTML模板文件的路径
     * @param {boolean} options.inject - 是否自动注入打包后的资源
     */
    new HtmlWebpackPlugin({
      /**
       * HTML模板文件的路径，Webpack会根据该模板生成最终的HTML文件
       */
      template: path.join(__dirname, "../public/index.html"),
      /**
       * 是否自动注入打包后的资源，设置为true表示自动注入
       */
      inject: true,
    }),
    /**
     * 创建DllReferencePlugin实例，用于引用预编译的动态链接库（DLL）
     * DLL可以提高打包速度，避免重复打包一些常用的库
     * @param {Object} options - 插件选项
     * @param {string} options.context - 上下文路径，用于解析manifest文件
     * @param {Object} options.manifest - 动态链接库的清单文件，描述了DLL中包含的模块
     */
    new DllReferencePlugin({
      // 上下文路径，通常设置为当前文件所在的目录，用于确定manifest文件的相对位置
      context: __dirname,
      // 引入预编译的react库的清单文件，Webpack会根据这个清单文件来引用DLL中的模块
      manifest: require("../dll/react.manifest.json"),
    }),
    /**
     * 创建另一个DllReferencePlugin实例，用于引用预编译的antd动态链接库（DLL）
     * @param {Object} options - 插件选项
     * @param {string} options.context - 上下文路径，用于解析manifest文件
     * @param {Object} options.manifest - 动态链接库的清单文件，描述了DLL中包含的模块
     */
    new DllReferencePlugin({
      // 上下文路径，同样设置为当前文件所在的目录
      context: __dirname,
      // 引入预编译的antd库的清单文件，Webpack会根据这个清单文件来引用DLL中的模块
      manifest: require("../dll/antd.manifest.json"),
    }),
  ],
};

// 导出基础的Webpack配置，供其他配置文件合并使用
export default baseConfig;
