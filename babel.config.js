/**
 * 导出 Babel 配置对象，用于配置 Babel 编译时的预设和插件
 * @type {Object}
 */
module.exports = {
  /**
   * Babel预设配置数组。
   * 预设是一组Babel插件的集合，用于定义一组特定的转换规则。
   */
  presets: [
    /**
     * 每个预设可以是一个数组，数组的第一个元素是预设的名称，
     * 第二个元素是该预设的配置选项。
     */
    [
      // 使用 @babel/preset-env 预设，用于根据目标环境自动转换 JavaScript 代码
      "@babel/preset-env",
      {
        // 根据代码中实际使用的 polyfill 来引入，避免引入不必要的 polyfill
        useBuiltIns: "usage",
        // 指定 core-js 的版本为 3
        corejs: 3,
      },
    ],
    // 使用 @babel/preset-react 预设，用于转换 React JSX 代码
    ["@babel/preset-react", { runtime: "automatic" }],
    // 使用 @babel/preset-typescript 预设，用于转换 TypeScript 代码
    "@babel/preset-typescript",
  ],
  // 配置 Babel 插件，这里使用 @babel/plugin-transform-runtime 插件，减少重复的辅助代码
  plugins: ["@babel/plugin-transform-runtime"],
};
