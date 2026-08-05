/**
 * 用例 PMSID: 1806849
 * 用例标题: 快捷访问-保存文件到快捷访问_
 * 生成时间: 2025-12-29 17:58:08
 * 用例编写人: UT000193（郑豪）
 */

describe('1806849-快捷访问-保存文件到快捷访问_', () => {
  // 测试套件初始化
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall -15 deepin-editor'); 
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf') 
    await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop(); 
  });

  // 每个测试用例前的准备工作
  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件夹
    await system.exec('mkdir -p ~/test');
  });

  test('1806849-快捷访问-保存文件到快捷访问_', async ({ device, agent, uos, system, env }) => {
    // 前置步骤：将test文件夹添加到快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiRightClick('屏幕上方的test目录图标'); 
    await agent.aiWaitFor('右键菜单加载完成');
    
    // 先判断是否存在"从快捷访问移除"选项，如果存在先点击移除
    try {
        await agent.aiTap("从快捷访问移除");
        await agent.aiRightClick("'屏幕上方的test'文件夹图标"); 
        await agent.aiWaitFor('右键菜单加载完成');
    } catch (error) {
        console.log('"从快捷访问移除"选项不存在，继续添加操作');
    }
      
    await agent.aiTap("右键菜单中的'添加到快捷访问'"); 
    await agent.aiWaitFor('左侧栏显示test快捷访问');
    await system.exec('killall -15 dde-file-manager');
    await system.exec('killall dde-file-dialog');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 步骤1：创建并保存文件到快捷访问的文件夹
    await system.exec('killall -15 deepin-editor'); 
    await new Promise(resolve => setTimeout(resolve, 5000));
    await uos.openApp('文本编辑器', { maximizeWindow: true });
    await agent.aiWaitFor("文本编辑器界面已显示");
    await agent.aiTap("文本编辑器界面顶部的'+'"); 
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+S'); 
    await agent.aiScroll('文件管理器的左侧栏', { direction: 'down', distance: 1 });
    await agent.aiTap("左侧栏的'test'文件夹"); 
    await agent.aiDoubleClick("屏幕中间弹窗的未命名文档"); 
    await device.typeText('测试');
    await agent.aiTap('保存');
    await agent.aiTap("文本编辑器右上角X关闭按钮"); 

    // 断言1：验证文件已成功保存到快捷访问的文件夹
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiDoubleClick("'test'文件夹图标"); 
    await agent.aiAssert('test目库内容中存在"测试.txt"文件') 
  }, { timeout: 600000, tags: ['1806849', 'level4', 'bookmark', 'zhenghao'] });

  // 每个测试用例后的清理工作
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  // 测试套件清理
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("左侧栏中的test");
    await agent.aiTap("从快捷访问移除"); 
    await system.exec('rm -rf ~/test'); 
    await system.exec('killall -15 deepin-editor'); 
   await system.exec('killall dde-file-dialog'); 
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
