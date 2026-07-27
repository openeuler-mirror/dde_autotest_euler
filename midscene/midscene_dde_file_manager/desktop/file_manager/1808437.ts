/**
 * 用例 PMSID: 1808437
 * 用例标题: 快捷键-选中文件/文件夹按ctrl+i键调出属性弹窗
 * 生成时间: 2026-02-5 11:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808437-快捷键-选中文件/文件夹按ctrl+i键调出属性弹窗', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await system.exec("mkdir -p ~/Desktop/testYF37 && touch ~/Desktop/1808437.txt");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808437-快捷键-选中文件/文件夹按ctrl+i键调出属性弹窗', async ({ device, agent, uos, system, env }) => {

    //步骤1：测试文件夹
    await agent.aiTap("testYF37");
    await device.pressKey("Ctrl+I");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("弹出窗口：显示标记、基本信息、共享管理、权限管理等内容");
    await device.pressKey("ESC");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec('rm -rf ~/Desktop/testYF37');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //测试文本
    await agent.aiTap("1808437.txt");
    await device.pressKey("Ctrl+I");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("弹出窗口：显示标记、基本信息、打开方式、权限管理等内容");
    await device.pressKey("ESC");


  }, { timeout: 600000, tags: ["1808437", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/testYF37');
    await system.exec('rm -rf ~/Desktop/1808437.txt');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 