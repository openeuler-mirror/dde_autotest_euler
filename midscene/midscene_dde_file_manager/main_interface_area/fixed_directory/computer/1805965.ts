/**
 * 用例 PMSID: 1805965
 * 用例标题: [032]我的目录-属性页面勾选隐藏此文件夹
 * 生成时间: 2025-12-25 11:26:19
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805965-[032]我的目录-属性页面勾选隐藏此文件夹', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805965-[032]我的目录-属性页面勾选隐藏此文件夹', async ({ device, agent, uos, system }) => {
    
    // 步骤一：打开文件管理器，进入计算机页面
    await uos.openApp('文件管理器');
    
    // 步骤二：随机选择一个用户目录进行隐藏此文件夹测试
    const userDirectories = ["桌面", "视频", "音乐", "图片", "文档", "下载"];
    const selectedDirectory = userDirectories[Math.floor(Math.random() * userDirectories.length)];
    
    // 步骤三：右键点击属性，勾选隐藏此文件夹
    await agent.aiRightClick(selectedDirectory);
    await agent.aiTap("属性");
    
    // 步骤四：勾选"隐藏此文件夹"选项
    await agent.aiTap("隐藏此文件夹");
    
    // 步骤五：关闭属性对话框
    await agent.aiTap("属性对话框右上角的关闭按钮");
    
    // 步骤七：进入数据盘检查隐藏文件是否显示
    await agent.aiTap("左侧导航栏数据盘");
    
    // 检查数据盘下不显示隐藏的文件
    await agent.aiAssert(`${selectedDirectory}文件夹在数据盘下不显示`);
    
    // 步骤八： 点击左侧导航栏，取消勾选隐藏此文件夹
    await agent.aiTap(selectedDirectory);
    await agent.aiRightClick(selectedDirectory);
    await agent.aiTap("属性");
    
    // 步骤九：取消勾选"隐藏此文件夹"选项
    await agent.aiTap("隐藏此文件夹");
    
    // 步骤十：关闭属性对话框
    await agent.aiTap("属性对话框右上角的关闭按钮");
    
    // 步骤十二：再次进入数据盘检查文件是否显示
    await agent.aiTap("左侧导航栏数据盘");
    
    // 检查数据盘下显示取消隐藏的文件
    await agent.aiAssert(`${selectedDirectory}目录在数据盘下显示`);

  }, { timeout: 1800000, tags: ["1805965", "level4", "computer", "liqingling"] });

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
