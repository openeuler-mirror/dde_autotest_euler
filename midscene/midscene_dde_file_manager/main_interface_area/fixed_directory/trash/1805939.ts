/**
 * 用例 PMSID: 1805939
 * 用例标题: 回收站，文件和文件夹右键属性页面没有标记信息
 * 生成时间: 2026-03-09 09:41:40
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 根据要求重新编写，实现文件和文件夹在回收站中右键属性页面没有标记信息的验证
 */

describe('1805939-回收站，文件和文件夹右键属性页面没有标记信息', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805939-回收站，文件和文件夹右键属性页面没有标记信息', async ({ device, agent, uos, system }) => {
    // 步骤1：通过命令行在文档目录创建1805939_1文件夹
    console.log('步骤1：在文档目录创建文件夹和文件');
    await system.exec('mkdir -p ~/Documents/1805939_1');
    
    // 打开文档目录
    await uos.openApp('文件管理器');
    await agent.aiTap('左侧导航栏文档目录');
    await agent.aiAssert('显示1805939_1文件夹');
    
    // 步骤2：选中1805939_1文件夹，鼠标右键，显示标记信息
    console.log('步骤2：验证文档目录中右键显示标记信息');
    await agent.aiTap('1805939_1文件夹');
    await agent.aiRightClick('1805939_1文件夹', 500);
    await agent.aiAssert('右键菜单中显示标记信息');
    await device.pressKey("Esc");
    
    // 步骤3：通过del键删除1805939_1文件夹
    console.log('步骤3：删除文档目录中的文件');
    await device.pressKey("Delete");
    await agent.aiAssert('文档目录下不存在1805939_1文件夹');
    
    // 步骤4：点击左侧导航栏回收站目录，选中1805939_1文件夹，鼠标右键，不显示标记信息
    console.log('步骤4：验证回收站中右键不显示标记信息');
    await agent.aiTap('左侧导航栏回收站目录', 500);
    await agent.aiTap('1805939_1文件夹');
    await agent.aiRightClick('1805939_1文件夹', 500);
    await agent.aiAssert('右键菜单中不显示标记信息');
    await device.pressKey("Esc");
    
    // 步骤5：最小化文件管理器窗口
    console.log('步骤5：最小化文件管理器窗口');
    await agent.aiTap("文件管理器右上角最小化按钮");
    
    // 步骤6：通过命令在桌面创建1805939_2.txt
    console.log('步骤6：在桌面创建文件夹和文件');
    await system.exec('touch ~/Desktop/1805939_2.txt');
    
    // 显示桌面
    await uos.showDesktop();
    
    // 步骤7：选中1805939_2.txt，鼠标右键，显示标记信息
    console.log('步骤7：验证桌面中右键显示标记信息');
    await agent.aiTap('1805939_2.txt');
    await agent.aiRightClick('1805939_2.txt');
    await agent.aiAssert('右键菜单中显示标记信息');
    await device.pressKey("Esc");
    
    // 步骤8：通过del键删除1805939_2.txt
    console.log('步骤8：删除桌面中的文件');
    await device.pressKey("Delete");
    await agent.aiAssert('桌面不存在1805939_2.txt');
    
    // 步骤9：点击任务栏上的文件管理器窗口
    console.log('步骤9：恢复文件管理器窗口');
    await agent.aiTap('任务栏上的文件管理器');
    await agent.aiWaitFor('文件管理器窗口已恢复');
    
    // 步骤10：点击左侧导航栏回收站目录，选中1805939_2.txt，鼠标右键，不显示标记信息
    console.log('步骤10：验证回收站中右键不显示标记信息');
    await agent.aiTap('左侧导航栏回收站目录', 500);
    await agent.aiTap('1805939_2.txt');
    await agent.aiRightClick('1805939_2.txt', 500);
    await agent.aiAssert('右键菜单中不显示标记信息');
    await device.pressKey("Esc");

  }, { timeout: 1800000, tags: ["1805939", "level3", "trash", "liqingling"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm -rf ~/Documents/1805939_1');
    await system.exec('rm -rf ~/Desktop/1805939_2.txt');
    // 清空回收站
    await system.exec('rm -rf ~/.local/share/Trash/*');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    // 恢复文件管理器设置
    await system.cleanupFileManager();

  });
});
