/**
 * 用例 PMSID: 1805085
 * 用例标题: [t]历史导航-面包屑切换浏览目录
 * 生成时间: 2026-02-06 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805085-[t]历史导航-面包屑切换浏览目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1805085-[t]历史导航-面包屑切换浏览目录', async ({ device, agent, uos, system, env }) => {
    // 步骤1：桌面文件夹下存在多个目录
    await system.exec(`mkdir -p ~/1805085/1805085_1/1805085_2/1805085_3}`);

    // 步骤2：打开文件管理器进入“主目录”-“1805085”，查看浏览路径
    await uos.openApp("文件管理器");
    await agent.aiTap('左侧导航栏主目录');
    await agent.aiDoubleClick('主目录右侧的1805085文件夹');
    await agent.aiAssert('地址栏路径显示1805085');
    await agent.aiDoubleClick('1805085_1文件夹');
    await agent.aiAssert('地址栏路径显示1805085_1');
    await agent.aiDoubleClick('1805085_2文件夹');
    await agent.aiAssert('地址栏路径显示1805085_2');
    await agent.aiDoubleClick('1805085_3文件夹');
    await agent.aiAssert('地址栏路径显示1805085_3');
    
    // 步骤3：点击面包屑上的任意目录
    await agent.aiTap('1805085_1文件夹');
    await agent.aiAssert('地址栏路径显示1805085_1');
    
    // 再次随意键入其他目录
    const directories = ["主目录", "桌面", "视频", "音乐", "图片", "文档"];
    const randomDir = directories[Math.floor(Math.random() * directories.length)];
    await agent.aiTap(`左侧导航栏${randomDir}`);
    await agent.aiAssert(`地址栏路径显示${randomDir}`);
    
  }, { timeout: 1800000, tags: ["1805085", "level3", "history_navigation", "liqingling"] });
  
  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
    
    // 清理测试目录
    await system.exec(`rm -rf ~/1805085*`);
  });
});
