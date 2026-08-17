/**
 * 用例 PMSID: 1806147
 * 用例标题: 拖拽主目录下桌面目录到桌面某一个文件夹
 * 生成时间: 2026-02-06
 * 用例编写人: UT000211(陈依)
 */


describe('1806147-拖拽主目录下桌面目录到桌面某一个文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec(`rm -f ~/Desktop/test`);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理选择状态
    await device.pressKey('esc');
  });

  test('1806147-拖拽主目录下桌面目录到桌面某一个文件夹', async ({ uos, agent, device, system, env }) => {
    // 1.打开文件管理器，点击侧边栏的主目录，预期进入到主目录
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器侧边栏的主目录');
    await agent.aiAssert('进入到主目录');
    
    // 2.使用命令在桌面新建一个test文件夹
    await system.exec('mkdir -p ~/Desktop/test');
  
    
    // 3.从打开的文件管理器的桌面目录拖拽文件夹test到桌面上的test文件夹
    await agent.aiTap('主目录下的桌面');
    await agent.aiDrag('文件管理器主目录中的桌面目录', '桌面上的test文件夹', { deepThink: true });
    await agent.aiAssert('主目录下存在桌面目录');
   
    
    // 4.点击管理器的桌面目录，进入到桌面目录，双击test文件夹，进入到test文件夹，test目录里面存在桌面目录
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiDoubleClick('桌面目录中的test文件夹');
    await agent.aiAssert('进入到test文件夹');
    await agent.aiAssert('test目录为空');


    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiDrag('拖拽文件管理器里的桌面目录test文件夹', '电脑桌面上的test文件夹', { deepThink: true });
    await agent.aiAssert('弹窗提示操作失败');
    await agent.aiAssert('目标文件夹位于源文件夹内');
    await agent.aiTap('确定');
    await agent.aiAssert('弹窗关闭');
    
  }, { timeout: 800000, tags: ['1806147', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 删除test文件夹
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec(`rm -rf ~/Desktop/test`);
    // 关闭文件管理器
    await agent.aiTap('文件管理器窗口右上角关闭按钮');
    await uos.showDesktop();
  });
});
