// @ts-nocheck

/**
 * 用例 PMSID: 1809161
 * 用例标题: 【侧边栏目录显示优化】侧边栏目录hover，检查背景色
 * 生成时间: 2026-2-5 10:56:00
 * 用例编写人: UT000686(李双双)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1809161-侧边栏目录hover，检查背景色', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
   await system.exec('killall dde-file-manager'); 
  });
  
  test('1809161-侧边栏目录hover，检查背景色', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    
    // 打开文件管理器
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiWaitFor("文件管理器主界面已显示");
    
    // 鼠标悬停在侧边栏目录上
    await agent.aiHover("文件管理器侧边桌面");
    
    // 断言hover位置的背景颜色为灰色
    await agent.aiAssert("文件管理器侧边栏桌面目录hover背景颜色为灰色");

  }, { timeout: 600000, tags: ['1809161','level3','main_interface_area','fixed_directory','sidebar','DITT','lishuangshuang'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec('killall dde-file-manager'); 
    });
  });