/**
 * 用例 PMSID: 1805971
 * 用例标题: 计算机页面-导航栏切换和快捷键操作
 * 生成时间: 2025-12-25 11:26:19
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805971-计算机页面-导航栏切换和快捷键操作', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805971-计算机页面-导航栏切换和快捷键操作', async ({ device, agent, uos, system }) => {

    // 步骤一：按住鼠标左键，切换导航栏所有目录，切换到对应目录
    
    // 定位导航栏并切换目录
    await uos.openApp('文件管理器');
    
    // 简化导航栏切换：测试目录
    const directories = ["最近使用", "主目录", "桌面", "视频", "音乐", "图片", "文档", "下载"];
    
    for (const dir of directories) {
      await agent.aiTap(dir);
      
      // 步骤二：测试空格、delete、shift delete快捷键，检查无响应情况
      console.log('步骤二：测试快捷键操作');
      
      // 测试空格键
      await device.pressKey("Space");
      await agent.aiAssert(`${dir}目录存在`);
      
      // 测试delete键
      await device.pressKey("Delete");
      await agent.aiAssert(`${dir}目录存在`);
      
      // 测试shift+delete组合键
      await device.pressKey("Shift", "Delete");
      await agent.aiAssert(`${dir}目录存在`);
    }

  }, { timeout: 1800000, tags: ["1805971", "level3", "computer", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
