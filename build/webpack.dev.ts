/**
 * 从 'webpack' 包中导入 Configuration 类型，并将其重命名为 WebpackConfig，用于定义 Webpack 配置对象的类型
 */
import { Configuration as WebpackConfig } from "webpack";
/**
 * 从 'webpack-dev-server' 包中导入 Configuration 类型，并将其重命名为 WebpackDevServerConfig，用于定义 Webpack 开发服务器的配置对象类型
 */
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
/**
 * 导入 Node.js 的 path 模块，用于处理文件路径
 */
import path from "path";
/**
 * 导入 'webpack-merge' 包，用于合并多个 Webpack 配置对象
 */
import merage from "webpack-merge";
/**
 * 导入当前目录下的 webpack.base.ts 文件中导出的基础配置对象
 */
import baseConfig from "./webpack.base";

/**
 * 定义一个新的类型 Configuration，它是 WebpackConfig 类型和一个包含可选 devServer 属性（类型为 WebpackDevServerConfig）的对象的交集
 * 此类型用于扩展 Webpack 配置，使其包含开发服务器的配置选项
 */
type Configuration = WebpackConfig & {
  devServer?: WebpackDevServerConfig;
};

/**
 * 合并基础配置和开发环境配置，生成一个新的配置对象
 * @type {Configuration}
 */
const devConfig: Configuration = merage(baseConfig, {
  /**
   * 设置 Webpack 的构建模式为开发模式，该模式下会启用一些有助于开发的特性，如更详细的错误信息和更快的构建速度
   */
  mode: "development",
  /**
   * 设置源代码映射的类型为 'cheap-module-source-map'，它会生成一个独立的源映射文件，且不包含列信息，适合开发环境使用
   */
  devtool: "cheap-module-source-map",
  /**
   * 配置 Webpack 开发服务器的选项
   */
  devServer: {
    /**
     * 指定开发服务器提供静态文件的目录，这里使用 path.join 方法将当前目录和 '../public' 拼接成完整的路径
     */
    static: path.join(__dirname, "../public"),
    /**
     * 设置开发服务器监听的端口号为 3000
     */
    port: 3000,
    /**
     * 当开发服务器启动时，自动打开浏览器访问开发服务器的地址
     */
    open: true,
    /**
     * 启用 HTML5 History API 的回退功能，当访问的路由不存在时，会返回 index.html 文件
     */
    historyApiFallback: true,
    /**
     * 禁用开发服务器的压缩功能，提高开发环境下的响应速度
     */
    compress: false,
  },
});

/**
 * 导出配置对象，供外部模块使用
 */
export default devConfig;
