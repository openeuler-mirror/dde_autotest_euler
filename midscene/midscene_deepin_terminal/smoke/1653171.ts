/**
 
 * 用例 PMSID:1653171
 * 用例标题: 关闭标签页
 * 生成时间: 2026-05-27
 * 用例编写人: UT000211(陈依)
 */

describe('1653171-关闭标签页', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653171-关闭标签页', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端,点击标签页旁边的+号5次，预期新建了多个工作区
    await device.pressKey("Ctrl+Alt+T");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiTap("标签页旁边的+号");
    await agent.aiWaitFor("第2个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await agent.aiWaitFor("第3个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await agent.aiWaitFor("第4个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await agent.aiWaitFor("第5个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await agent.aiWaitFor("第6个标签页已创建");
    await agent.aiAssert("存在6个标签页");

    // 步骤 2: 激活标签页右键，打开右键菜单后，点击重命名，出现重命名弹窗，在标题格式栏输入test，并点击确定，再次点击激活标签页的右键菜单，点击关闭标签页，预期：当前标签页被关闭
    await agent.aiRightClick("当前激活的标签页");
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiAssert("右键菜单中存在重命名选项");
    await agent.aiTap("重命名");
    await agent.aiWaitFor("重命名弹窗已显示");
    await agent.aiAssert("弹窗中存在标题格式输入栏");
    await agent.aiTap("标签标题格式后方的×按钮");
    await device.typeText("test");
    await agent.aiTap("确定按钮");
    await agent.aiWaitFor("重命名弹窗已关闭");
    await agent.aiAssert("当前标签页标题已变为test");
    await agent.aiRightClick("当前激活的标签页");
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiAssert("右键菜单中存在关闭标签页选项");
    await agent.aiTap("关闭标签页");
    await agent.aiWaitFor("test标签页已关闭");
    await agent.aiAssert("剩余5个标签页");

  }, { timeout: 600000, tags: ['1653171', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
