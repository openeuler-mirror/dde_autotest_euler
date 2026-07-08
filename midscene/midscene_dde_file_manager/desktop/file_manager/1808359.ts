/**
 * 用例 PMSID: 1808359
 * 用例标题: [089]拖拽-拖拽文件到回收站图标
 * 生成时间: 2026-02-4 13:23:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808359-[089]拖拽-拖拽文件到回收站图标', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    //清空回收站
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec('mkdir -p ~/Desktop/yfatest'); //创建测试文件
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808359-[089]拖拽-拖拽文件到回收站图标', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面选中文件，执行拖拽
    await agent.aiDrag("桌面上的yfatest文件夹", "桌面上的回收站");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面不存在：yfatest");
    await agent.aiDoubleClick("回收站");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    await agent.aiAssert("回收站目录存在 yfatest");

  }, { timeout: 90000, tags: ["1808359", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/yfatest');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 