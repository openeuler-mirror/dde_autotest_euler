// @ts-nocheck

/**
 * 用例 PMSID: 1809263
 * 用例标题: [024~028]右键菜单-左侧侧边栏回收站右键菜单检查	
 * 生成时间：2026-01-20 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1809263-[024~028]右键菜单-左侧侧边栏回收站右键菜单检查', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809263-[024~028]右键菜单-左侧侧边栏回收站右键菜单检查', async ({ device, agent, uos, system }) => {
    // 步骤1：双击桌面回收站图标，在左侧侧边栏的回收站处右键，断言弹出右键菜单
    await system.exec('killall dde-file-manager', 500);
    await agent.aiDoubleClick("桌面回收站图标",);
    await agent.aiWaitFor("文件管理器已打开");
    
    await agent.aiRightClick("左侧侧边栏的回收站");
    
    // 断言弹出的右键菜单包含指定选项
    await agent.aiAssert("右键菜单包含选项：在新窗口打开、在新标签中打开、清空回收站、属性");
    
    // 点击快捷键“Escape”关闭右键菜单
    await device.pressKey("Escape");

    // 步骤2：在左侧侧边栏的回收站处右键，点击“新窗口打开”，断言以新窗口形式打开回收站目录
    await agent.aiRightClick("左侧侧边栏的回收站");
    await agent.aiTap("在新窗口打开");
    await agent.aiWaitFor("回收站目录已在新窗口打开");
    
    // 点击“Alt+F4”关闭新窗口
    await device.pressKey("Alt+F4");
    
    // 步骤3：在左侧侧边栏的回收站处右键，点击“新标签中打开”，断言在新标签中打开回收站目录
    await agent.aiRightClick("左侧侧边栏的回收站");
    await agent.aiTap("在新标签中打开");
    await agent.aiWaitFor("回收站目录已在新标签打开");
    
    // 步骤4：在左侧侧边栏的回收站处右键，点击“属性”，断言回收站属性界面已弹出
    await agent.aiRightClick("左侧侧边栏的回收站");
    await agent.aiTap("属性");
    await agent.aiWaitFor("回收站属性界面已弹出");
    
    // 点击“Alt+F4”关闭属性界面
    await device.pressKey("Alt+F4");

    // 步骤5：在左侧侧边栏的回收站处右键，若“清空回收站字体为黑色”，点击“清空回收站”
    await agent.aiRightClick("左侧侧边栏的回收站");
    
    try {
      // 检查清空回收站选项是否可用（字体为黑色）
      const isClearEnabled = await agent.aiQuery("清空回收站选项是否可用");
      
      if (isClearEnabled) {
        await agent.aiTap("清空回收站");
        
        // 在清空回收站弹框中，点击“清空”
        await agent.aiWaitFor("清空回收站弹框已出现");
        await agent.aiTap("清空");
        
        // 等待清空操作完成
        await agent.aiWaitFor("回收站已清空");
      } else {
        // 若清空回收站不可点击，点击“Esc”关闭右键菜单
        await device.pressKey("Escape");
        await device.pressKey("Alt+F4")
      }
    } catch (error) {
      console.log('清空回收站操作未执行或执行失败');
      // 点击“Esc”关闭右键菜单
      await device.pressKey("Escape");
    }
    
    // 关闭文件管理器窗口
     await system.exec('killall dde-file-manager', 500);
    
  }, { timeout: 600000, tags: ['1809263', 'level2', 'smoke', 'trash', 'DITT' , 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async () => {
    console.log('5. afterAll: 清理测试套件');
     await system.exec('killall dde-file-manager', 500);
  });
});