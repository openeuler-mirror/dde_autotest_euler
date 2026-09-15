/**
 * 用例 PMSID: 1816717
 * 用例标题: 标签页-新建标签页
 * 生成时间: 2026-01-16 11:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816717-标签页-新建标签页', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816717-标签页-新建标签页', async ({ device, agent, uos }) => {
    // 准备步骤: 打开桌面文件夹
    console.log('准备步骤: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    await agent.aiTap('左侧侧边栏中的桌面', { deepThink: true });
    await agent.aiWaitFor('文件管理器窗口跳转到桌面目录');

    // 步骤 1: 点击新建标签页
    console.log('步骤 1: 点击新建标签页按钮+');
    await agent.aiTap('窗口右侧上方的新建标签页按钮+');

    // 确认打开了新的标签页, 当前目录是桌面
    console.log('预期 1: 确认打开了新的标签页, 当前目录是桌面');
    await agent.aiAssert('文件管理器窗口有两个标签页');
    await agent.aiAssert('当前目录是桌面');

    // 步骤 2: 文件夹菜单中点击“在新标签窗口中打开”
    console.log('步骤 2: 文件夹菜单中点击“在新标签窗口中打开”');
    await agent.aiRightClick('左侧侧边栏中的桌面', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('在新标签页中打开');

    // 确认打开了新的标签页, 当前目录是桌面
    console.log('预期 2: 确认打开了新的标签页, 当前目录是桌面');
    await agent.aiAssert('文件管理器窗口有三个标签页');
    await agent.aiAssert('当前目录是桌面');

    // 步骤 3: 快捷键打开新标签页
    console.log('步骤 3: 快捷键打开新标签页');
    await device.pressKey("Ctrl", "T"); // 自动化中的快捷键可能被执行多次

    // 确认打开了新的标签页, 当前目录是桌面
    console.log('预期 3: 确认打开了新的标签页, 当前目录是桌面');
    await agent.aiAssert('文件管理器窗口至少有四个标签页');
    await agent.aiAssert('当前目录是桌面');

  }, { timeout: 600000, tags: ['1816717', 'level2', 'smoke', 'DITT', 'youwei', 'tab', 'file-manager', 'new tab'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
