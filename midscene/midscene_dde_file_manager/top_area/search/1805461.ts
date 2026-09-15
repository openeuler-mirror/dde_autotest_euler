
/**
 * 用例 PMSID: 1805461
 * 用例标题: 【搜索】搜索-快捷键检查
 * 生成时间: 2026-02-06 15:58:21
 * 用例编写人: UT000193（郑豪）
 */

describe('1805461-【搜索】搜索-快捷键检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805461-【搜索】搜索-快捷键检查', async ({ device, agent, uos }) => {
    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");

    // 步骤 1：按键 ctrl+f
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+F");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('Ctrl+F');

    // 断言 1：进入搜索
    await agent.aiAssert("进入搜索状态，搜索框显示'Ctrl+F'");
    await device.pressKey('Esc');

    // 步骤 2：按键 ctrl+l
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言 2：聚焦到地址栏并进入输入状态
    await agent.aiAssert("地址栏获得焦点并进入输入状态，显示computer:///");

    // 步骤 3：按键 home
    await device.pressKey("HOME");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('A');
    // 断言 3：移动光标到最左边
    await agent.aiAssert("地址栏显示Acomputer:///，不区分大小写");

    // 步骤 4：按键 end
    await device.pressKey("End");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('B');
    // 断言 4：移动光标到最右边
    await agent.aiAssert("地址栏显示Acomputer:///B，不区分大小写");

    // 步骤 5：按键 left
    await device.pressKey("Left");
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.typeText('C');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 断言 5：向左移动一个
    await agent.aiAssert("地址栏显示Acomputer:///CB，不区分大小写");

    // 步骤 6：按键 right
    await device.pressKey("right");
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.typeText('D');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 断言 6：像右移动一个
    await agent.aiAssert("地址栏显示Acomputer:///CBD，不区分大小写");

    // 步骤 7：按键 shift+home
    await device.pressKey("Shift+Home");
    // 断言 7：从当前光标选中到输入栏最左边
    await agent.aiAssert("地址栏'Acomputer:///CBD'被选中");

    // 步骤 8：按键 shift+end
    await device.pressKey("Home");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Shift+End");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言 8：从当前光标选中到输入栏最右边
    await agent.aiAssert("地址栏'Acomputer:///CBD'被选中");

    // 步骤 9：按键 shift+left
    await device.pressKey("Shift+Left");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言 9：从当前光标像左选中
    await agent.aiAssert("地址栏除了字符'D'未被选中，其它字符均为选中");

    // 步骤 10：按键 shift+right
    await device.pressKey("Shift+Right");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言 10：从当前光标像右选中
    await agent.aiAssert("地址栏'Acomputer:///CBD'被选中");

    // 步骤 11：按键 backspace
    await device.typeText('test');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Backspace");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言 11：删除一个
    await agent.aiAssert("地址栏文本为tes，证明删除了最后一个字符");

    // 步骤 12：按键 esc
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Esc");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言 12：退出输入
    await agent.aiAssert("地址栏只显示个电脑图标，不显示地址路径，即为退出地址栏输入状态");
    
  }, { timeout: 600000, tags: ['1805461', 'level4', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
