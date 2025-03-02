// 导入 webpack-merge 库，用于合并多个 webpack 配置
import merge from "webpack-merge";
// 导入 SpeedMeasurePlugin 插件，用于测量 webpack 各个插件和 loader 的执行时间
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
// 导入 BundleAnalyzerPlugin 插件，用于分析打包后的文件大小和模块组成
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
// 导入生产环境的 webpack 配置
import proConfig from "./webpack.prod";

// 创建 SpeedMeasurePlugin 实例
const smp = new SpeedMeasurePlugin();

/**
 * 导出一个经过 SpeedMeasurePlugin 包装的合并后的 webpack 配置
 * 该配置在生产环境配置的基础上添加了 BundleAnalyzerPlugin 插件，用于分析打包结果
 * @returns {any} 经过包装和合并后的 webpack 配置
 */
export default smp.wrap(
  // 使用 webpack-merge 合并生产环境配置和当前配置
  merge(proConfig, {
    // 配置 webpack 插件
    plugins: [
      // 添加 BundleAnalyzerPlugin 插件，用于生成打包分析报告
      new BundleAnalyzerPlugin(),
    ],
  }) as any
);
