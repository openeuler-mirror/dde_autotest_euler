/**
 
 * 用例 PMSID:1585865
 * 用例标题: 快捷键测试
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585865-快捷键测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册
    await uos.showDesktop();
    await system.exec('ll-cli kill org.deepin.manual');
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585865-快捷键测试', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，执行快捷键Alt+F4，帮助手册关闭
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("展示快速入门，系统，应用模块");
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor("帮助手册窗口已关闭");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 再次打开帮助手册，执行（Super+up）,预期帮助手册最大化，执行快捷键Ctrl+F，搜索框里面有光标闪烁
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("展示快速入门，系统，应用模块");
    await device.pressKey('Super+Up');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor("搜索框已显示");
    await agent.aiAssert("搜索框里面有光标闪烁");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3: 在输入框输入AAA，预期输入框显示AAA，执行Ctrl+A全选操作，AAA蓝色覆盖，执行Ctrl+X，预期输入框不显示AAA内容，执行Ctrl+V进行粘贴操作，输入框展示AAA，快捷键Backspace，预期输入框显示两个A
    await device.typeText("AAA");
    await agent.aiAssert("搜索输入框显示AAA");
    await device.pressKey('Ctrl+A');
    await agent.aiAssert("AAA被蓝色覆盖全选");
    await device.pressKey('Ctrl+X');
    await agent.aiAssert("输入框不显示AAA内容");
    await device.pressKey('Ctrl+V');
    await agent.aiAssert("输入框展示AAA");
    await device.pressKey('Backspace');
    await agent.aiAssert("输入框显示两个A");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 4: 执行Ctrl+A全选操作，执行Ctrl+C复制，点击输入框后面的x按钮，执行快捷键Ctrl+V，预期输入框显示两个A
    await device.pressKey('Ctrl+A');
    await agent.aiAssert("AA被蓝色覆盖全选");
    await device.pressKey('Ctrl+C');
    await agent.aiTap("搜索输入框后面的x按钮");
    await agent.aiAssert("输入框内容已清空");
    await device.pressKey('Ctrl+V');
    await agent.aiAssert("输入框显示两个A");

  }, { timeout: 600000, tags: ['1585865', 'level1','smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 再执行Super+Down,帮助手册被还原，点击右上角的x按钮，帮助手册关闭
    await system.exec('ll-cli kill org.deepin.manual');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("帮助手册窗口已关闭");
  });

});
