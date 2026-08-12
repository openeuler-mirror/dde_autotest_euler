/**
 * 用例 PMSID: 1805131
 * 用例标题:  文件和文件夹混合排序-未设置“文件和文件夹混合”，勾选后功能后，文管内混合排序立即生效
 * 生成时间: 2026-4-30 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1805131-文件和文件夹混合排序-未设置“文件和文件夹混合”，勾选后功能后，文管内混合排序立即生效', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，恢复文管默认设置');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ uos, device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备，创建测试文件和文件夹并配置前置条件');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);

      // 前置条件1：文管设置中未勾选【文件和文件夹混合排序】
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");
      // 确保未勾选【文件和文件夹混合排序】（若已勾选则点击取消）
      await agent.aiAssert("文件和文件夹混合排序未勾选");
      await device.pressKey("Alt+F4"); // 关闭设置窗口

      // 前置条件2：文管为图标视图
      await agent.aiTap("文件管理器左侧栏的桌面");
      await agent.aiTap("文件管理器右上角四个小长方形的图标视图按钮");

      // 创建测试文件和文件夹
      await system.exec(`touch ~/Desktop/1805131-1.txt`);
      await system.exec(`touch ~/Desktop/1805131-2.txt`);
      await system.exec(`touch ~/Desktop/1805131-5.txt`);
      await system.exec(`mkdir ~/Desktop/1805131-3`);
      await system.exec(`mkdir ~/Desktop/1804897-4`);
    });
  
    test('1805131-文件和文件夹混合排序-未设置“文件和文件夹混合”，勾选后功能后，文管内混合排序立即生效', async ({ device, agent, uos, system }) => {
      await agent.aiWaitFor("桌面已显示");
      
      // 步骤1：打开文管，打开设置菜单，勾选【文件和文件夹混合排序】
      await agent.aiTap("文管右上角三个小正方形和三条横线的列表视图按钮");
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");
      await agent.aiTap("文件和文件夹混合排序");
      await agent.aiAssert("文件和文件夹混合排序已勾选");
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
      // 检查文本文件和文件夹是否混合排序
      await agent.aiTap("名称");
      await agent.aiAssert("桌面上的1805131-1.txt、1805131-2.txt、1805131-5.txt、1805131-3、1805131-4文本文件和文件夹是混合排序");

      // 步骤2：关闭文管再打开
      await device.pressKey("Alt+F4");
      // 重新打开文件管理器，检查混合排序
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器左侧栏的桌面");
      await agent.aiAssert("桌面上的1805131-1.txt、1805131-2.txt、1805131-5.txt、1805131-3、1805131-4文本文件和文件夹是混合排序");

      // 步骤3：终端kill文管进程，再打开文管
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      // 再次打开文件管理器，检查混合排序
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器左侧栏的桌面");
      await agent.aiTap("名称");
      await agent.aiAssert("桌面上的1805131-1.txt、1805131-2.txt、1805131-5.txt、1805131-3、1805131-4文本文件和文件夹是混合排序");

      // 步骤4：再取消勾选【文件和文件夹混合排序】
      await agent.aiTap("文管右上角三个小正方形和三条横线的列表视图按钮");
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");
      await agent.aiTap("文件和文件夹混合排序");
      await agent.aiAssert("文件和文件夹混合排序未勾选");
      await device.pressKey("Alt+F4"); 
      // 文管立即恢复文件夹在前，文件在后的排序方式
      await agent.aiTap("名称");
      await agent.aiAssert("桌面上的1805131-1.txt、1805131-2.txt、1805131-5.txt、1805131-3、1805131-4文本文件和文件夹没有混合排序，文件夹在前面");
      await device.pressKey('Ctrl+1');

    }, { timeout: 1200000, tags: ["1805131",'level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');
      // 删除测试创建的文件和文件夹
      await system.exec(`rm -f ~/Desktop/1805131-1.txt`);
      await system.exec(`rm -f ~/Desktop/1805131-2.txt`);
      await system.exec(`rm -f ~/Desktop/1805131-5.txt`);
      await system.exec(`rm -rf ~/Desktop/1805131-3`);
      await system.exec(`rm -rf ~/Desktop/1804897-4`);
      // 强制关闭文件管理器进程
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });