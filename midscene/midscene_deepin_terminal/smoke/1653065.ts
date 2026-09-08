/**
 
 * 用例 PMSID:1653065
 * 用例标题: [011]新建工作区
 * 生成时间: 2026-05-27
 * 用例编写人: UT000211(陈依)
 */

describe('1653065-[011]新建工作区', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653065-[011]新建工作区', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击标签栏旁边的+号，添加新的标签页
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiTap("标签栏旁边的+号按钮", { deepThink: true });
    await agent.aiWaitFor("新的标签页已添加");
    await agent.aiAssert("标签栏显示两个标签页");

    // 步骤 2: 快捷键ctrl+shift+t，打开新的终端窗口
    await device.pressKey("Ctrl+Shift+T");
    await agent.aiWaitFor("新的终端窗口已打开");
    await agent.aiAssert("标签栏显示三个标签页");

  }, { timeout: 300000, tags: ['1653065', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
