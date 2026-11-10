/**
 * 模块入口: Visual Studio Code 自动化测试模块入口
 * 生成时间: 2026-09-18 15:30:00
 * 用例编写人：UT003531(钱程)
 */

module('Visual Studio Code自动化测试', {
  beforeAll: async ({ uos }) => {
    await uos.showDesktop();
  },
  files: [
    './2023625.ts',
    './2023627.ts',
    './2023629.ts',
    './2023633.ts',
    './2023637.ts',
    './2023639.ts',
    './2023641.ts',
    './2023643.ts',
    './2023645.ts',
    './2023647.ts',
    './2023649.ts',
  ]
});
