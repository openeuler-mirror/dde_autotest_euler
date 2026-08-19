/**
 * 用例 PMSID: 1805063
 * 用例标题: [081]历史导航-快捷键
 * 生成时间: 2025-12-19 14:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1805063-[081]历史导航-快捷键', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805063-[081]历史导航-快捷键', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器, 并切换到桌面
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 确认侧边栏 桌面目录被选中, 路径为桌面目录
    await agent.aiTap('左侧边栏的桌面目录', { deepThink: true });
    await agent.aiWaitFor('当前目录为桌面目录');

    // 步骤 2: 按下快捷键Ctrl+L编辑路径
    await device.pressKey("Ctrl", "L");

    // 确认路径处于编辑状态
    await agent.aiWaitFor('文件管理器路径窗口被选中');
    await agent.aiAssert('文件管理器路径窗口被选中');

  }, { timeout: 600000, tags: ['1805063', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'path edit', 'shortcut'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
