// 从webpack模块中导入Configuration类型，用于定义webpack配置对象
import { Configuration } from "webpack";
// 导入webpack-merge库中的merge函数，用于合并webpack配置
import merge from "webpack-merge";
// 导入Node.js的path模块，用于处理文件路径
import path from "path";
// 导入CompressionPlugin插件，用于对打包后的文件进行压缩
import CompressionPlugin from "compression-webpack-plugin";
// 导入CssMinimizerPlugin插件，用于压缩CSS文件
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
// 导入TerserPlugin插件，用于压缩JavaScript文件
import TerserPlugin from "terser-webpack-plugin";
// 导入PurgeCSSPlugin插件，用于移除未使用的CSS
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";
// 导入glob模块，用于查找匹配的文件路径
import { glob } from "glob";
// 导入基础配置文件
import baseConfig from "./webpack.base";

/**
 * 生产环境的webpack配置对象
 * 通过merge函数将基础配置和生产环境特有的配置合并
 *
 * @type {Configuration}
 */
const proConfig: Configuration = merge(baseConfig, {
  // 设置打包模式为生产模式，此模式下会对代码进行压缩和优化
  mode: "production",
  // 定义插件数组，用于在打包过程中执行特定的任务
  plugins: [
    /**
     * 创建CompressionPlugin实例，用于生成压缩文件
     *
     * @param {Object} options - 插件选项
     * @param {RegExp} options.test - 匹配需要压缩的文件类型
     * @param {string} options.filename - 压缩后文件的命名规则
     * @param {string} options.algorithm - 压缩算法
     * @param {number} options.threshold - 只有大小大于该值的资源会被处理
     * @param {number} options.minRatio - 压缩率阈值
     */
    new CompressionPlugin({
      // 只对.js和.css文件进行压缩
      test: /\.(js|css)$/,
      // 压缩后文件的命名规则，[path]表示原文件路径，[base]表示原文件名
      filename: "[path][base].gz",
      // 压缩算法，使用gzip
      algorithm: "gzip",
      // 只有文件大小大于10240字节（10KB）才会进行压缩
      threshold: 10240,
      // 压缩率小于0.8才会生成压缩文件
      minRatio: 0.8,
    }),
    /**
     * 创建PurgeCSSPlugin实例，用于移除未使用的CSS
     *
     * @param {Object} options - 插件选项
     * @param {Array<string>} options.paths - 需要检查的文件路径
     * @param {Object} options.safelist - 需要保留的CSS类名
     * @param {Array<string|RegExp>} options.safelist.standard - 标准的保留类名列表
     * @param {Array<string|RegExp>} options.blocklist - 需要移除的CSS类名
     */
    new PurgeCSSPlugin({
      // 查找src目录下的所有文件
      paths: glob.sync(`${path.resolve(__dirname, "../src")}/**/*`, {
        nodir: true,
      }),
      // 保留以ant-开头的CSS类名
      safelist: {
        standard: [/^ant-/],
      },
      // 无需要移除的CSS类名
      blocklist: [],
    }),
  ],
  // 优化配置，用于对打包后的文件进行进一步的优化
  optimization: {
    // 定义压缩器数组，用于压缩打包后的文件
    minimizer: [
      // 创建CssMinimizerPlugin实例，用于压缩CSS文件
      new CssMinimizerPlugin(),
      /**
       * 创建TerserPlugin实例，用于压缩JavaScript文件
       *
       * @param {Object} options - 插件选项
       * @param {boolean} options.parallel - 是否开启并行压缩
       * @param {Object} options.terserOptions - Terser的配置选项
       */
      // 使用 TerserPlugin 插件来压缩 JavaScript 代码
      new TerserPlugin({
        // 开启并行压缩，充分利用多核 CPU 提高压缩速度
        parallel: true,
        // Terser 的配置选项，用于自定义压缩行为
        terserOptions: {
          // 压缩相关的配置
          compress: {
            // 移除所有 console.log 函数调用，生产环境通常不需要调试信息输出
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
    /**
     * 配置代码分割规则，用于将代码分割成更小的块，提高加载性能
     */
    splitChunks: {
      // 对所有类型的 chunks 都进行分割，包括异步和同步的 chunks
      chunks: "all",
      // 最小分割文件大小，只有大于 20000 字节的文件才会进行分割
      minSize: 20000,
      // 最大分割文件大小，分割后的文件大小尽量不超过 250000 字节
      maxSize: 250000,
      /**
       * 缓存组配置，用于将符合条件的模块打包到同一个 chunk 中
       */
      cacheGroups: {
        /**
         * react 缓存组，将 react 和 react-dom 相关的模块打包到名为 'react' 的 chunk 中
         */
        react: {
          // 打包后的 chunk 名称
          name: "react",
          // 匹配 node_modules 目录下的 react 或 react-dom 模块
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          // 优先级，值越大优先级越高
          priority: 20,
        },
        /**
         * antd 缓存组，将 antd 相关的模块打包到名为 'antd' 的 chunk 中
         */
        antd: {
          // 匹配 node_modules 目录下的 antd、@ant-design 或 rc- 开头的模块
          test: /[\\/]node_modules[\\/](antd|@ant-design|rc-.*)/,
          // 打包后的 chunk 名称
          name: "antd",
          // 优先级，值越大优先级越高，此配置会优先处理符合条件的模块
          priority: 20,
        },
        /**
         * vendors 缓存组，将 node_modules 目录下的所有模块打包到名为 'vendors' 的 chunk 中
         */
        vendors: {
          // 匹配 node_modules 目录下的所有模块
          test: /[\\/]node_modules[\\/]/,
          // 打包后的 chunk 名称
          name: "vendors",
          // 优先级，值越大优先级越高，相对 antd 缓存组优先级较低
          priority: 10,
        },
        /**
         * commons 缓存组，用于处理被多个模块引用的公共代码
         */
        commons: {
          // 最小被引用次数，当一个模块被引用至少 2 次时，会被打包到 common chunk 中
          minChunks: 2,
          // 打包后的 chunk 名称
          name: "common",
          // 强制分割，忽略其他配置限制进行分割
          enforce: true,
        },
      },
    },
  },
});

/**
 * 导出生产环境的 Webpack 配置对象，该对象合并了基础配置和生产环境特有的配置
 */
export default proConfig;
