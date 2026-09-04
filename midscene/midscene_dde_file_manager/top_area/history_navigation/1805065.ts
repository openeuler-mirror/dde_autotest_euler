/**
 * 用例 PMSID: 1805065
 * 用例标题: 历史导航-顶部功能区UI检查
 * 生成时间: 2026-01-13 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805065-历史导航-顶部功能区UI检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.cleanupFileManager();
  });
  
  test('1805065-历史导航-顶部功能区UI检查', async ({ device, agent, uos, system, env }) => {
    // 步骤1：点击导航栏左侧主目录、桌面、视频、音乐、图片、文档中的任意一个目录，最近使用和下载目录默认使用列表视图
    await uos.openApp("文件管理器");
    
    // 步骤2：查看顶部功能区元素
    await agent.aiTap('左侧导航栏桌面目录');
    await agent.aiAssert('左侧导航栏顶部显示文件管理器图标');
    await agent.aiAssert('左侧导航栏桌面目录右侧显示桌面页签');
    await agent.aiAssert('地址栏左侧显示后退按钮');
    await agent.aiAssert('地址栏左侧前进按钮显示为灰色');
    await agent.aiAssert('地址栏右侧显示网格视图、列表视图等按钮，最后一个为搜索框按钮');
    await agent.aiAssert('文件管理器窗口右上角显示菜单按钮，最小化按钮，最大化按钮，关闭按钮');
    
    // 步骤3：桌面目录顶部面包屑检查
    await agent.aiHover('地址栏为桌面的后面空白处');
    await agent.aiTap('地址栏为桌面的后面空白处');
    await agent.aiAssert(`地址栏中显示/home/uos/Desktop路径`);
    await agent.aiTap('桌面目录右侧空白处');
    await agent.aiAssert('地址栏上显示桌面/');
    
    // 步骤4：检查系统盘特殊挂载目录面包屑检查
    await agent.aiTap('左侧导航栏系统盘');
    await agent.aiAssert('地址栏上显示为系统盘');
    
  }, { timeout: 1800000, tags: ["1805065", "level3", "history_navigation", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
