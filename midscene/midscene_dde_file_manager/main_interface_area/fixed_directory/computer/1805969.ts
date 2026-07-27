/**
 * 用例 PMSID: 1805969
 * 用例标题: [037]我的目录-权限管理复选框置灰检查
 * 生成时间: 2025-12-25 11:26:19
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805969-[037]我的目录-权限管理复选框置灰检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805969-[037]我的目录-权限管理复选框置灰检查', async ({ device, agent, uos, system }) => {
    
    // 步骤一：打开文件管理器，进入计算机页面
    await uos.openApp('文件管理器');
    
    // 步骤三：随机选取一个用户目录，检查权限管理
    console.log('步骤三：随机选取一个用户目录检查权限管理');
    const userDirectories = ["桌面", "视频", "音乐", "图片", "文档", "下载"];
    
    // 随机选择一个目录
    const randomIndex = Math.floor(Math.random() * userDirectories.length);
    const randomDir = userDirectories[randomIndex];
    
    console.log(`随机选择 ${randomDir} 目录进行权限管理检查`);
      
    // 切换到对应目录
    await agent.aiTap(randomDir);
      
    // 在目录空白处右键点击属性
    await agent.aiRightClick(randomDir);
    await agent.aiTap("属性");
      
    // 点击权限管理标签页
    await agent.aiTap("权限管理");
      
    // 检查权限复选框置灰状态
    await agent.aiAssert(`${randomDir}目录-所有者权限下拉框置灰，无法修改`);
    await agent.aiAssert(`${randomDir}目录-群组权限复下拉置灰，无法修改`);
    await agent.aiAssert(`${randomDir}目录-其他权限复下拉置灰，无法修改`);
      
    // 关闭属性对话框
    await agent.aiTap("属性对话框右上角的关闭按钮");
    console.log(`随机选择的 ${randomDir} 目录权限管理检查完成`);

  }, { timeout: 1800000, tags: ["1805969", "level4", "computer", "liqingling"] });

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
