/**
 * 用例 PMSID: 1805067
 * 用例标题: [002][core]历史导航-浏览路径当前目录匹配侧边栏栏目
 * 生成时间: 2025-12-19 10:00:00
 * 用例编写人: UT000159（游伟）
 */

const testdir = "~/Desktop/testdir";

describe('1805067-[002][core]历史导航-浏览路径当前目录匹配侧边栏栏目', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ${testdir}`);
  });

  test('1805067-[002][core]历史导航-浏览路径当前目录匹配侧边栏栏目', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器, 并切换到桌面
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('文件管理器左侧的“桌面”', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证侧边栏和路径一致
    await agent.aiAssert('侧边栏中中桌面选项被选中');
    await agent.aiAssert('文件管理器路径为桌面目录');

    // 步骤 2: 双击打开testdir文件夹
    await agent.aiDoubleClick('文件列表中的testdir文件夹', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到testdir目录');

    // 确认侧边栏 桌面目录没有被选中, 路径变为testdir目录
    await agent.aiAssert('侧边栏中中桌面选项没有被选中');
    await agent.aiAssert('文件管理器路径为testdir目录');

    // 步骤 3: 打开新标签
    await agent.aiTap('文件管理器右侧窗口左上方的+按钮');
    await agent.aiWaitFor('文件管理器右侧窗口显示打开两个标签页');

    // 确认侧边栏 桌面目录没有被选中, 路径变为testdir目录
    await agent.aiAssert('侧边栏中中桌面选项没有被选中');
    await agent.aiAssert('文件管理器路径为testdir目录');

  }, { timeout: 600000, tags: ['1805067', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'sidebar'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    system.exec(`rm -rf ${testdir}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
