// @ts-nocheck

/**
 * 用例 PMSID: 1809159
 * 用例标题: 【侧边栏目录显示优化】侧边栏目录选中，检查背景色
 * 生成时间: 2026-2-5 11:13:44
 * 用例编写人: UT000686(李双双)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1809159-侧边栏目录选中，检查背景色', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager'); 
  });
  
  test('1809159-侧边栏目录选中，检查背景色', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    
    // 打开文件管理器
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiWaitFor("文件管理器主界面已显示");
    
    // 点击侧边栏的“视频”，断言视频背景色高亮
    await agent.aiTap("文件管理器侧边栏视频目录");
    await agent.aiAssert("文件管理器侧边栏视频目录背景颜色高亮");
    
    // 点击侧边栏的“下载”，断言下载背景色高亮
    await agent.aiTap("文件管理器侧边栏下载目录");
    await agent.aiAssert("文件管理器侧边栏下载目录背景颜色高亮");
    
    // 点击侧边栏的“文档”，点击文档目录中间空白处，断言侧边栏文档背景色高亮
    await agent.aiTap("文件管理器侧边栏文档目录");
    await agent.aiTap("文档页面中间空白处");
    await agent.aiAssert("文件管理器侧边栏文档目录背景颜色高亮");

  }, { timeout: 600000, tags: ['1809159','level3','main_interface_area','fixed_directory','sidebar','DITT','lishuangshuang'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec('killall dde-file-manager'); 
    });
  });