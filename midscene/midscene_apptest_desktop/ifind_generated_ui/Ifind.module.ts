/**
 * 模块入口: 同花顺iFinD 自动化测试模块入口
 * 生成时间: 2026-09-17 09:25:31
 * 用例编写人：UT003531(钱程)
 */

module('同花顺iFinD自动化测试', {
  beforeAll: async ({ uos }) => {
    await uos.showDesktop();
  },
  files: [
    './2035459.ts',
    './2035455.ts',
    './2035461.ts',
  ]
});
