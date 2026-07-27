/**
 * 用例 PMSID: 1816505
 * 用例标题: 组策略配置自动排序-修改组策略为开启时，检查桌面图标及右键菜单
 * 生成时间: 2026-03-26 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1816505-组策略配置自动排序-修改组策略为开启时，检查桌面图标及右键菜单', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
    //设置自动排列关闭    //判断autoAlign默认值为-1；如果值>0 表示开启；其他均为关闭
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v 0");
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816505-组策略配置自动排序-修改组策略为开启时，检查桌面图标及右键菜单', async ({ device, agent, uos, system, env }) => {

    //步骤1： 验证桌面设置
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("自动排列可见");
    await agent.aiAssert("自动排列选项的开关状态是关闭的");

  }, { timeout: 300000, tags: ["1816505", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
        //恢复自动排列的默认状态值    //判断autoAlign默认值为-1；如果值>0 表示开启；其他均为关闭
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v -1");
  });
}); 