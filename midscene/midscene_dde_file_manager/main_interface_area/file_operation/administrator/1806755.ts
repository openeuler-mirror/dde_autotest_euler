
// @ts-nocheck
require("dotenv/config");

/**
 * 用例 PMSID: 1806755
 * 用例标题: 右键菜单-以管理员身份打开文本文档
 * 生成时间: 2025-12-18 20:45:04
 * 用例编写人：UT000374 (胡宏杰)
 */

describe('1806755-右键菜单-以管理员身份打开文本文档', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806755-右键菜单-以管理员身份打开文本文档', async ({ device, agent, uos, env, system }) => {
    console.log('开始执行：右键菜单-以管理员身份打开文本文档测试');

    await uos.openApp('文件管理器' , { maximizeWindow: true });
    await system.exec('touch ~/Documents/asd.txt', 500);
    // 进入文档目录
    await agent.aiTap('文件管理器窗口左侧文档目录');
    await agent.aiRightClick('文管窗口内空白处');
    // 选择以管理员身份打开选项
    await agent.aiTap('右键菜单中以管理员身份打开选项');
    // 等待并处理授权弹窗
    await agent.aiAssert('用户授权弹窗已显示');
    await device.typeText(env.testPassword,true)
   
    // 等待新窗口打开
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 验证新窗口以管理员身份打开
    await agent.aiAssert('新窗口顶部路径显示为Documents');

    // 双击打开刚创建的文本文档
    await agent.aiDoubleClick('asd.txt');
    await agent.aiAssert('文本编辑器窗口未打开');

  }, { timeout: 120000, tags: ['1806755', 'level3', 'administrator', 'huhongjie'] });

  afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
   });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      
      await system.exec('rm -rf ~/Documents/asd.txt', 500);
      //关闭所有文管窗口
      await uos.closeCurrentWindow();
      await device.pressKey('Esc');
      await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
      await system.cleanupFileManager();

  });
});
