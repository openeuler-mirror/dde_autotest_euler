/**
 * 用例 PMSID: 1806625
 * 用例标题: 【 复制】剪切拷贝-桌面文件复制操作
 * 生成时间: 2025-12-16 10:30:00
 * 用例编写人: UT000211（陈依）
 */


describe('1806625-【 复制】剪切拷贝-桌面文件复制操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await device.pressKey('Super+Up')

});
  
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理选择状态
    await device.pressKey('esc');
  });

  test('1806625-【 复制】剪切拷贝-桌面文件复制操作', async ({ uos, agent, device, system }) => {
    // 1.打开文件管理器，进入到桌面目录，点击a.txt文件，打开a.txt右键功能，进行复制操作，桌面空白处点击粘贴，存在a（副本）.txt
    await system.exec('echo "桌面的文件" > ~/Desktop/a.txt');
    await agent.aiWaitFor("创建a.txt文件");
    await agent.aiAssert('桌面存在a.txt文件');
    await agent.aiTap('a.txt文件');
    await agent.aiRightClick('a.txt文件');
    await agent.aiTap('右键菜单中的复制');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiAssert('存在a（副本）.txt文件');
    
    // 2.点击a.txt文件，打开a.txt右键功能，进行剪切操作，剪切时该文件置灰，桌面空白处点击粘贴，文件显示正常
    await agent.aiTap('a.txt文件');
    await agent.aiRightClick('a.txt文件');
    await agent.aiTap('右键菜单中的剪切');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiAssert('a.txt文件名称显示正常');
    
    // 3.点击侧边栏下载目录，进入到下载目录，点击testfile文件，打开testfile的右键菜单，点击复制，点击侧边栏桌面目录，空白处右键，点击粘贴，预计桌面存在testfile文件
    await agent.aiTap('文件管理器侧边栏的下载目录');
    await agent.aiAssert('进入到下载目录');
    await system.exec('touch ~/Downloads/testfile ~/Downloads/testfile1');
    await agent.aiWaitFor("创建testfile和testfile1文件");
    await agent.aiAssert('下载目录存在testfile testfile1文件');
    await agent.aiTap('testfile文件');
    await agent.aiRightClick('testfile文件');
    await agent.aiTap('右键菜单中的复制');
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiAssert('桌面存在testfile文件');
    
    // 4.点击侧边栏下载目录，进入到下载目录，点击testfile1文件，打开testfile的右键菜单，点击剪切，点击侧边栏桌面目录，空白处右键，点击粘贴，预计桌面存在testfile1文件，点击侧边栏下载目录，下载目录不存在testfile1文件
    await agent.aiTap('文件管理器侧边栏的下载目录');
    await agent.aiAssert('进入到下载目录');
    await agent.aiTap('testfile1文件');
    await agent.aiRightClick('testfile1文件');
    await agent.aiTap('右键菜单中的剪切');
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiAssert('桌面存在testfile1文件');
    await agent.aiTap('文件管理器侧边栏的下载目录');
    await agent.aiAssert('进入到下载目录');
    await agent.aiAssert('下载目录不存在testfile1文件');
    
    // 5.点击侧边栏图片目录，进入到图片目录，点击a.txt文件，打开a.txt的右键菜单，点击剪切，点击侧边栏桌面目录，空白处右键，点击粘贴，出现弹框后，点击替换，a.txt的文件内容为图片目录的文件
    await agent.aiTap('文件管理器侧边栏的图片目录');
    await agent.aiAssert('进入到图片目录');
    await system.exec('echo "图片目录的文件" > ~/Pictures/a.txt');
    await agent.aiWaitFor("创建a.txt文件");
    await agent.aiAssert('图片目录存在a.txt文件');
    await agent.aiTap('a.txt文件');
    await agent.aiRightClick('a.txt文件');
    await agent.aiTap('右键菜单中的剪切');
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiAssert('出现替换文件弹框');
    await agent.aiTap('替换按钮');
    await agent.aiRightClick('a.txt')
    await agent.aiAssert('打开a.txt右键菜单');
    await agent.aiTap('打开');
    await agent.aiAssert('文件内容为图片目录的文件');
    await system.exec('pkill -f deepin-editor || true');
    
  }, { timeout: 1200000, tags: ['1806625', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理工作，清理步骤此用例产生的所有文件
    await system.exec('rm -f ~/Desktop/a.txt ~/Desktop/a（副本）.txt ~/Desktop/testfile ~/Desktop/testfile1');
    await system.exec('rm -f ~/Pictures/a.txt ~/Downloads/testfile ~/Downloads/testfile1');
    await agent.aiAssert('桌面不存在a.txt,a（副本）.txt,testfile,testfile1文件');
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await device.pressKey('Super+Down')
    await uos.showDesktop();
  });
});
