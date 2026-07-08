/**
 * 用例 PMSID: 1808373
 * 用例标题: 拖拽-拖拽文件到不可见区域
 * 生成时间: 2026-02-4 13:23:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808373- 拖拽-拖拽文件到不可见区域', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await uos.showDesktop();
    //await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec('mkdir -p ~/Desktop/yftest'); //创建测试文件
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808373- 拖拽-拖拽文件到不可见区域', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面选中文件，执行拖拽
    //await agent.aiAction("选中yftest，拖拽文件至右侧屏幕之外");
    await agent.aiDrag("yftest", "屏幕右侧最边缘位置");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("文件yftest位置还原，未发生变化");

  }, { timeout: 90000, tags: ["1808373", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/yftest');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 