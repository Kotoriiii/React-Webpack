/**
 * 导入 webpack 模块中的 Configuration 和 DllPlugin 类型和插件
 * Configuration 用于定义 webpack 的配置对象
 * DllPlugin 用于创建动态链接库
 */
import { Configuration, DllPlugin } from "webpack";
/**
 * 导入 Node.js 的 path 模块，用于处理文件路径
 */
import path from "path";

/**
 * 定义一个 webpack 配置对象，类型为 Configuration
 */
const config: Configuration = {
  /**
   * 设置打包模式为生产模式，此模式下会进行代码压缩和优化
   */
  mode: "production",
  /**
   * 定义入口文件，每个入口会生成一个对应的动态链接库
   * react 入口包含 'react' 和 'react-dom' 库
   * antd 入口包含 'antd' 库
   */
  entry: {
    react: ["react", "react-dom"],
    antd: ["antd"],
  },
  /**
   * 定义输出配置
   */
  output: {
    /**
     * 输出文件的目录，使用 path.resolve 方法将当前目录和 '../dll' 拼接
     */
    path: path.resolve(__dirname, "../dll"),
    /**
     * 输出文件的名称，[name] 会被替换为入口的名称
     */
    filename: "[name].dll.js",
    /**
     * 动态链接库的全局变量名，[name] 会被替换为入口的名称
     */
    library: "[name]_dll",
    /**
     * 每次打包前清空输出目录
     */
    clean: true,
  },
  /**
   * 定义使用的插件
   */
  plugins: [
    /**
     * 创建 DllPlugin 实例，用于生成动态链接库的清单文件
     */
    new DllPlugin({
      /**
       * 清单文件的输出路径，[name] 会被替换为入口的名称
       */
      path: path.join(__dirname, "../dll/[name].manifest.json"),
      /**
       * 动态链接库的全局变量名，和 output.library 保持一致
       */
      name: "[name]_dll",
    }),
  ],
};

/**
 * 导出 webpack 配置对象
 */
export default config;
