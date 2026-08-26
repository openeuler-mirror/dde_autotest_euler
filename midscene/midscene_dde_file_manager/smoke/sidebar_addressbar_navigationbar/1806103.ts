/**
 * 用例 PMSID: 1806103
 * 用例标题: 侧边栏固定目录，空白处右键，全选
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806103-侧边栏固定目录，空白处右键，全选', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806103-侧边栏固定目录，空白处右键，全选', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择桌面目录
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证页面已跳转到桌面目录
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 在右侧内容区域执行全选操作
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiTap('全选');


    // 验证全选操作已执行
    await agent.aiAssert('文件管理器窗口右边界面所有文件和文件夹均被选中');

  }, { timeout: 600000, tags: ['1806103', 'level2', 'smoke' ,'sidebar', 'file-manager', 'select-all'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
