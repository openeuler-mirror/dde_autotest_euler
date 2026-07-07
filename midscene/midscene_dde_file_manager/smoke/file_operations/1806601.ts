/**
 * 用例 PMSID: 1806601
 * 用例标题: 标记-输入框标记
 * 生成时间: 2025-12-16 10:30:00
 * 用例编写人: UT000211（陈依）
 */


describe('1806601-标记-输入框标记', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    await uos.openApp('文件管理器', 5000, 100000);
    // 1.打开文件管理器，点击文管侧边栏的桌面，进入到桌面目录，并最大化文件管理器窗口，等到文件管理器窗口最大化
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('文件管理器最大化按钮');
    await agent.aiWaitFor('文件管理器窗口最大化');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 2.使用命令在桌面目录创建1234567890文件
    await system.exec('touch ~/Desktop/1234567890');

    await agent.aiWaitFor('1234567890文件创建');
    await agent.aiAssert('桌面存在1234567890文件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理选择状态
    await device.pressKey('esc');
  });

  test('1806601-标记-输入框标记', async ({ uos, agent, device, system }) => {
    // 3.点击1234567890，文件1234567890被选中，打开1234567890的右键菜单，点击标记信息，在输入框里面输入123,点击桌面空白处，标记输入框关闭，文件管理器侧边栏标记下方存在123
    await agent.aiTap('1234567890文件');
    await agent.aiAssert('1234567890文件被选中');
    await agent.aiRightClick('1234567890文件');
    await agent.aiTap('右键菜单中的标记信息');
    await agent.aiTap('标记信息输入框');
    await device.typeText('123', false);
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('标记输入框关闭');
    await agent.aiAssert('文件管理器侧边栏标记下方存在123');
    
    // 4.点击1234567890，文件1234567890被选中，打开1234567890的右键菜单，点击标记信息，在输入框里面输入456,点击桌面空白处，标记输入框关闭，文件管理器侧边栏标记下方存在123和456
    await agent.aiTap('1234567890文件');
    await agent.aiAssert('1234567890文件被选中');
    await agent.aiRightClick('1234567890文件');
    await agent.aiTap('右键菜单中的标记信息');
    await agent.aiTap('标记信息输入框');
    await device.typeText('456', false);
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('标记输入框关闭');
    await agent.aiAssert('文件管理器侧边栏标记下方存在123和456');
    
    // 5.点击文件管理器的设置菜单，点击主题，点击深色，文管页面变为深色
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置菜单中的主题选项');
    await agent.aiTap('主题选项中的深色');
    await agent.aiAssert('文管页面变为深色');
    
    // 6.点击1234567890，文件1234567890被选中，打开1234567890的右键菜单，点击标记信息，在输入框里面输入789,点击桌面空白处，标记输入框关闭，文件管理器侧边栏标记下方存在123和456和789
    await agent.aiTap('1234567890文件');
    await agent.aiAssert('1234567890文件被选中');
    await agent.aiRightClick('1234567890文件');
    await agent.aiTap('右键菜单中的标记信息');
    await agent.aiTap('标记信息输入框');
    await device.typeText('789', false);
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('标记输入框关闭');
    await agent.aiAssert('文件管理器侧边栏标记下方存在123和456和789');

    // 分别点击侧边栏标记中的123，456，789打开右键菜单，点击移除,点击删除，预期侧边栏标记下方不存在123，456，789
    await agent.aiTap('文件管理器侧边栏标记中的123');
    await agent.aiRightClick('文件管理器侧边栏标记中的123');
    await agent.aiTap('右键菜单中的移除');
    await agent.aiTap('移除确认对话框中的删除按钮');
    await agent.aiAssert('侧边栏标记下方不存在123');
    
    await agent.aiTap('文件管理器侧边栏标记中的456');
    await agent.aiRightClick('文件管理器侧边栏标记中的456');
    await agent.aiTap('右键菜单中的移除');
    await agent.aiTap('移除确认对话框中的删除按钮');
    await agent.aiAssert('侧边栏标记下方不存在456');
    
    await agent.aiTap('文件管理器侧边栏标记中的789');
    await agent.aiRightClick('文件管理器侧边栏标记中的789');
    await agent.aiTap('右键菜单中的移除');
    await agent.aiTap('移除确认对话框中的删除按钮');
    await agent.aiAssert('侧边栏标记下方不存在789');
    
  }, { timeout: 700000, tags: ['1806601', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device,agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理操作
    // 删除1234567890文件
    await system.exec('rm -f ~/Desktop/1234567890');
    await agent.aiAssert('桌面不存在1234567890文件');
    
    // 点击文件管理器的设置菜单，点击主题，点击浅色，文管页面变为浅色
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置菜单中的主题选项');
    await agent.aiTap('主题选项中的浅色');
    await agent.aiAssert('文管页面变为浅色');
    

    
    // 关闭文件管理器
     await agent.aiTap('向下还原');
    await agent.aiTap('窗口右上角关闭按钮:X');
    await uos.showDesktop();
  });
});
