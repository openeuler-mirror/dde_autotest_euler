// @ts-nocheck
/**
 * 用例 PMSID: 1805689
 * 用例标题: 回收站】入口-通过桌面回收站图标进入回收站
 * 生成时间：2025-12-11 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805689-【回收站】入口-通过桌面回收站图标进入回收站', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  
  test('1805689-【回收站】入口-通过桌面回收站图标进入回收站', async ({ device, agent, uos, system}) => {
    try {
      // 步骤 1: 双击桌面回收站图标 // 在桌面上找到回收站图标并双击
      await system.exec('killall dde-file-manager', 500);
      await agent.aiDoubleClick("双击桌面回收站图标");

      // 步骤 2: 回收站界面已显示 // 等待回收站界面完全显示
      await agent.aiWaitFor("回收站界面已显示");

      // 步骤 3: 验证 - 侧侧边栏高亮定位在回收站 // 验证左侧侧边栏是否高亮定位在回收站
      await agent.aiAssert("左侧侧边栏高亮定位在回收站");

      // 尝试关闭回收站窗口，如果失败不影响后续测试
      try {
        await agent.aiTap("点击回收站界面右上角x按钮关闭窗口");
      } catch (error) {
        // 不抛出错误，继续执行
      }

      // 步骤 4: 右键单击桌面回收站图标 // 在桌面找到回收站图标并右键单击
      await agent.aiRightClick("右键单击桌面回收站图标");
      
      // 点击打开菜单
      await agent.aiTap("点击打开");

      // 步骤 5: 回收站已打开 // 等待回收站界面打开
      await agent.aiWaitFor("回收站已打开");

      // 步骤 6: 验证 - 侧侧边栏高亮定位在回收站 // 验证左侧侧边栏是否高亮定位在回收站
      await agent.aiAssert("左侧侧边栏高亮定位在回收站");
    } catch (error) {
      throw error;
    }

  }, { timeout: 600000, tags: ['1805689','level1', 'smoke', 'lishuangshuang'] });


  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});
