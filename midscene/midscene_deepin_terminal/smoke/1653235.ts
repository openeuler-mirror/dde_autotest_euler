/**
 
 * 用例 PMSID:1653235
 * 用例标题: 标签页1~9快捷键功能
 * 生成时间: 2026-05-26
 * 用例编写人: UT000211(陈依)
 */

describe('1653235-标签页1~9快捷键功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：
    await system.exec('pkill -f deepin-terminal|| true');
    const TEST_USERNAME = process.env.TEST_USERNAME || 'uos';
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653235-标签页1~9快捷键功能', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端（Super+Up 最大化）,点击右上角三条横线，点击设置，预计进入到设置页面
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await device.pressKey('Super+Up');
    await agent.aiWaitFor("终端窗口已最大化");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("设置页面已显示");

    // 步骤 2: 点击左边标题栏快捷键，点击复制方框的Shift,预期方框出现文字请输入新的快捷键
    await agent.aiTap("左边标题栏快捷键");
    await agent.aiWaitFor("快捷键设置界面已显示");
    await agent.aiTap("复制方框的Shift");
    await agent.aiAssert("方框出现文字请输入新的快捷键");

    // 步骤 3: 点击左边标题栏的标签页，滚动查看快捷键，预期：存在切换标签页1~9快捷键功能；默认快捷键"Ctrl+Shift+1"、"Ctrl+Shift+2"、"Ctrl+Shift+3" ... "Ctrl+Shift+9
    await agent.aiTap("左边标题栏的标签页");
    await agent.aiWaitFor("标签页设置界面已显示");
    await agent.aiScroll("右边设置窗口区域", { direction: "down", distance: 5 });
    await agent.aiAssert("切换标签页1默认快捷键为Ctrl+Shift+1");
    await agent.aiAssert("切换标签页2默认快捷键为Ctrl+Shift+2");
    await agent.aiAssert("切换标签页3默认快捷键为Ctrl+Shift+3");
    await agent.aiAssert("切换标签页4默认快捷键为Ctrl+Shift+4");
    await agent.aiAssert("切换标签页5默认快捷键为Ctrl+Shift+5");
    await agent.aiAssert("切换标签页6默认快捷键为Ctrl+Shift+6");
    await agent.aiTap("左边标题栏其他")
    await agent.aiScroll("右边设置窗口区域", { direction: "up", distance: 5 });
    await agent.aiAssert("切换标签页7默认快捷键为Ctrl+Shift+7");
    await agent.aiAssert("切换标签页8默认快捷键为Ctrl+Shift+8");
    await agent.aiAssert("切换标签页9默认快捷键为Ctrl+Shift+9");

    // 步骤 4: 点击设置窗口的关闭，设置菜单关闭
    await agent.aiTap("设置窗口的关闭按钮");
    await agent.aiWaitFor("设置菜单已关闭");

    // 步骤 5: 点击中的标签页旁边的+号，点击8次，新建了9个标签页
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第2个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第3个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第4个标签页已创建");
    await agent.aiTap("标签页旁边的+号");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第5个标签页已创建");
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页")
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第6个标签页已创建");
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页")
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第7个标签页已创建");
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页")
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第8个标签页已创建");
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页")
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("第9个标签页已创建");
    await agent.aiAssert("共有9个标签页");

    // 步骤 6: 分别执行"Ctrl+Shift+1"、"Ctrl+Shift+2"、"Ctrl+Shift+3" ... "Ctrl+Shift+9，分别切换到数字对应的标签
    await device.pressKey('ctrl+shift+1');
    await agent.aiAssert("当前激活的是第1个标签页");
    await device.pressKey('ctrl+shift+2');
    await agent.aiAssert("当前激活的是第2个标签页");
    await device.pressKey('ctrl+shift+3');
    await agent.aiAssert("当前激活的是第3个标签页");
    await device.pressKey('ctrl+shift+4');
    await agent.aiAssert("当前激活的是第4个标签页");
    await device.pressKey('ctrl+shift+5');
    await agent.aiAssert("当前激活的是第5个标签页");
    await device.pressKey('ctrl+shift+6');
    await agent.aiAssert("当前激活的是第6个标签页");
    await device.pressKey('ctrl+shift+7');
    await agent.aiAssert("当前激活的是第7个标签页");
    await device.pressKey('ctrl+shift+8');
    await agent.aiAssert("当前激活的是第8个标签页");
    await device.pressKey('ctrl+shift+9');
    await agent.aiAssert("当前激活的是第9个标签页");

    // 步骤 7: 再次点击标签页旁边的+号，新建了第10次标签页，Ctrl+Shift+9，切换到第10个标签页
    await agent.aiRightClick("终端空白处");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("新建标签页");
    await agent.aiWaitFor("第10个标签页已创建");
    await device.pressKey('ctrl+shift+9');
    await agent.aiAssert("当前激活的是第10个标签页");

  }, { timeout: 1500000, tags: ['1653235', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：Super+Down 最小化,然后关闭终端
    await device.pressKey('Super+Down');
    await agent.aiWaitFor("终端窗口已还原");
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
