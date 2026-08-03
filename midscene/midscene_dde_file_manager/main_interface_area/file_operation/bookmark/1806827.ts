
/**
 * 用例 PMSID: 1806827
 * 用例标题: 快捷访问-原文件夹名称修改不影响快捷访问_
 * 生成时间: 2025-12-29 17:45:04
 * 用例编写人: UT000193（郑豪）
 * 
 */

describe('1806827-快捷访问-原文件夹名称修改不影响快捷访问_', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('rm -rf ~/test');
    await system.exec('rm -rf ~/test_rename');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/test');
  });

  test('1806827-快捷访问-原文件夹名称修改不影响快捷访问_', async ({ device, agent, uos }) => {
    // 前置1：打开文件管理器，将test文件夹添加到快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiRightClick("'test'文件夹图标");
    await agent.aiWaitFor('右键菜单加载完成');
    
    // 先判断是否存在"从快捷访问移除"选项，如果存在先点击移除
    try {
        await agent.aiTap("从快捷访问移除");
        // 移除后右键菜单会关闭，需要重新右键点击test文件夹
        await agent.aiRightClick("'屏幕上方的test'文件夹图标"); 
        await agent.aiWaitFor('右键菜单加载完成');
    } catch (error) {
        // 如果"从快捷访问移除"选项不存在，继续执行添加操作
        console.log('"从快捷访问移除"选项不存在，继续添加操作');
    }
    
    await agent.aiTap("右键菜单中的'添加到快捷访问'");

    // 步骤1：重命名原文件夹为test_rename
    await agent.aiRightClick("主目录内容区域的'test'文件夹");
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap("右键菜单中的'重命名'");
    await device.typeText('test_rename');
    await device.pressKey('Enter');

    // 步骤2：验证快捷访问中的test文件夹仍可正常访问，显示重命名后的路径
    await agent.aiTap("左侧栏的'test'");
    await agent.aiAssert("可以正常目录，文件管理器显示test_rename的路径")
  }, { timeout: 600000, tags: ['1806827', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("左侧栏中的test");
    await agent.aiTap("从快捷访问移除");
    await system.exec('rm -rf ~/test');
    await system.exec('rm -rf ~/test_rename');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
