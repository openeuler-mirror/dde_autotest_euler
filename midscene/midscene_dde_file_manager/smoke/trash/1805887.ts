// @ts-nocheck

/**
 * 用例 PMSID: 1805887
 * 用例标题: 右键菜单-回收站内选中多个文件夹呼出右键菜单正常
 * 生成时间：2026-01-15 17:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805887-右键菜单-回收站内选中多个文件夹呼出右键菜单正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805887-右键菜单-回收站内选中多个文件夹呼出右键菜单正常', async ({ device, agent, uos, system }) => {
   // 前置条件：在回收站图标右键，若清空回收站可点击，请点击“清空回收站”，在清空回收站的弹框中点击“enter”
    try {
      await agent.aiRightClick("桌面回收站图标");
      
      // 检查右键菜单中是否有"清空回收站"选项
      const menuItems = await agent.aiQuery("右键菜单中的所有选项");
      
      if (menuItems && menuItems.toString().includes('清空回收站')) {
        console.log('检测到"清空回收站"选项可点击，执行清空操作');
        await agent.aiTap("清空回收站");
        
        // 等待确认弹框出现
        await agent.aiWaitFor("确认清空回收站");
        
        // 使用Enter快捷键确认
        await agent.aiTap("清空")
        
        // 直接执行用例内容
        console.log('回收站清空操作已触发，执行用例内容');
      } else {
        console.log('"清空回收站"选项不可点击或不存在，直接执行用例内容');
        await device.pressKey("Escape"); // 关闭右键菜单
      }
      
    } catch (error) {
      console.log('清空回收站操作失败或异常，直接执行用例内容');
      await device.pressKey("Escape"); // 关闭右键菜单
    }
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器',3000,20000,true)
    await agent.aiTap("侧边栏的文档目录") 
    // 使用for循环创建两个文件夹
    for (let i = 0; i < 2; i++) {
        await device.pressKey("ctrl+shift+N")
    }
    //删除新建的文件夹
    await agent.aiTap("文档目录右下角空白处")
    await device.pressKey("Ctrl+A")
    await device.pressKey("Delete")

    await agent.aiTap("侧边栏的回收站目录")
    await agent.aiWaitFor("回收站已打开");
    await agent.aiTap("新建文件夹");
    await agent.aiWaitFor("新建文件夹已选中");
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("多个文件夹已选中");
    
    // 右键点击选中的多个文件夹
    await agent.aiRightClick("新建文件夹");
    
    // 验证右键菜单包含预期选项
    await agent.aiAssert("右键菜单中包含：还原、删除、剪切、复制、属性");
    console.log('【调试】已验证右键菜单包含所有预期选项：还原、删除、剪切、复制、属性');
    //清空新建的数据
    await agent.aiTap("删除(D)")
    await agent.aiWaitFor("删除弹框已加载完成")
    await agent.aiTap("在删除弹框中点击删除按钮")
    
    console.log('【调试】测试用例执行完成');
  }, { timeout: 600000, tags: ['1805887','level2','smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});