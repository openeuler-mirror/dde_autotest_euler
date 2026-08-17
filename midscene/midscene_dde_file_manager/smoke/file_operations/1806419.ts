/**
 * 用例 PMSID: 1806419
 * 用例标题: 【文件选择对话框】文管选择窗-浏览器调用
 * 生成时间: 2026-02-03
 * 用例编写人: UT000211(陈依)
 */


describe('1806419-【文件选择对话框】文管选择窗-浏览器调用', () => {
  beforeAll(async ({ device, uos,system, agent }) => {
    // 清理环境，确保测试开始时没有遗留的test文件夹
    await device.executeCommand('rm -rf ~/Downloads/test');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理状态
    await device.pressKey('esc');
  });

  test('1806419-【文件选择对话框】文管选择窗-浏览器调用', async ({ uos, agent, device, system }) => {
    // 1.打开浏览器，在浏览器输入框输入www.deepin.org，页面展示deepin25
    await uos.openApp('浏览器', 5000, 100000);
    await agent.aiTap('浏览器地址栏');
    await device.typeText('www.deepin.org', false);
    await device.pressKey('Enter');
    await agent.aiWaitFor('页面展示deepin');
    await agent.aiAssert('页面展示deepin');
    
    // 2.在浏览器任何一个位置右键，打开右键菜单，点击图片另存为，弹出另存为对话框
    await agent.aiRightClick('浏览器页面空白区域');
    await agent.aiTap('右键菜单中的另存为');
    await agent.aiAssert('弹出另存为对话框');
    
    // 3.点击下载目录，进入到下载目录，下载目录空白处右键，打开右键菜单，点击新建文件夹，输入名称test，然后enter操作，双击test文件夹，点击保存
    await agent.aiTap('另存为对话框中的下载目录');
    await agent.aiAssert('进入到下载目录');
    await agent.aiRightClick('下载目录空白区域');
    await agent.aiTap('右键菜单中的新建文件夹');
    await device.typeText('test', false);
    await device.pressKey('Enter');
    await agent.aiAssert('创建test文件夹成功');
    await agent.aiDoubleClick('test文件夹');
    await agent.aiAssert('进入到test文件夹内');
    await agent.aiTap('另存为对话框中的保存按钮');
    await agent.aiAssert('文件管理器窗口关闭');
    
    // 4.点击浏览器的顶部右上角的下载，鼠标移动到第一个下载，点击右侧文件夹图标，打开下载下的test目录
    await agent.aiTap('浏览器顶部右上角的下载按钮');
    await agent.aiHover('第一个下载项');
    await agent.aiTap('第一个下载项右侧的文件夹图标');
    await agent.aiAssert('打开下载下的test目录');
    await agent.aiTap('文件管理器窗口右上角关闭按钮');
    await agent.aiAssert('文件管理器关闭');
    
  }, { timeout: 600000, tags: ['1806419', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理操作：删除~/Download下的test文件夹
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec('rm -rf ~/Downloads/test');
    
    // 关闭浏览器
    await agent.aiTap('浏览器窗口右上角关闭按钮');
    });
    
});
