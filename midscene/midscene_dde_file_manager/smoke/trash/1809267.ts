// @ts-nocheck
/**
 * 用例 PMSID: 1809267
 * 用例标题: [t]打开-回收站内选中单个文件夹右键-打开
 * 生成时间：2025-12-15 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1809267-[t]打开-回收站内选中单个文件夹右键-打开', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809267-[t]打开-回收站内选中单个文件夹右键-打开', async ({ device, agent, uos, system}) => {
    // 前置条件：在回收站图标右键，若清空回收站可点击，请点击“清空回收站”，在清空回收站的弹框中点击“enter”
    await system.exec("rm -rf /home/uos/Documents/新建文件夹*")
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
    await uos.openApp('文件管理器',3000,20000,true)
    await agent.aiTap("侧边栏的文档目录") 
   
    await device.pressKey("ctrl+shift+N")
    //删除新建的文件夹
    await device.pressKey("enter")
    // await agent.aiTap("新建文件夹")
    await device.pressKey("Delete")

    await agent.aiTap("侧边栏的回收站目录")
    await agent.aiWaitFor("回收站已打开");
    await agent.aiTap("新建文件夹");
    await agent.aiWaitFor("新建文件夹已选中");

    // 右键点击选中新建的文件夹
    await agent.aiRightClick("新建文件夹");
    
    // 验证右键菜单包含预期选项
    await agent.aiAssert("右键菜单中包含：打开、在新窗口打开、还原、删除(D)、反选、剪切(T)、复制(C)、病毒查杀、属性(R)");
    await agent.aiTap("打开")
    await agent.aiWaitFor("文件夹打开完成")
    await agent.aiAssert("当前窗口文件夹打开成功")
    await system.exec('killall dde-file-manager', 500);

  }, { timeout: 600000, tags: ['1809267','level2','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await system.exec("rm -rf /home/uos/Documents/新建文件夹*")
    await system.exec("rm -rf ~/.local/share/Trash/*")
  });
});