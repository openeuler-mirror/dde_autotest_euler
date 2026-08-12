/**
 * 用例 PMSID: 1804871
 * 用例标题:  设置--“隐藏文件”
 * 生成时间: 2026-4-29 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804871-设置--“隐藏文件”', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，创建测试文件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      // 前置条件1：创建桌面隐藏文件.1804871.txt
      await system.exec(`touch ~/Desktop/.1804871.txt`);
      // 前置条件2：创建桌面文件1804871-a.txt
      await system.exec(`touch ~/Desktop/1804871-a.txt`);
    });
  
    test('1804871-设置--“隐藏文件”', async ({ device, agent, uos }) => {
      await agent.aiWaitFor("桌面已显示");
      
      // 步骤1：打开文件管理器，设置菜单，“显示隐藏文件”--勾选（快捷键：Ctrl+H）
      await uos.openApp("文件管理器", 3000, 20000, true);

      // 判断预览窗口是否已打开
      await agent.aiTap("文件管理器左侧栏的桌面");
      await agent.aiTap('文件管理器右上角搜索框左侧第4个图标');
      const isOpen = await agent.aiBoolean("显示预览是否勾选");
      if (isOpen) {
          await agent.aiTap('显示预览');
          console.log('显示预览已成功关闭');
      } 
      await agent.aiTap('桌面目录内空白处');  

      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");

      const isHide = await agent.aiBoolean("显示隐藏文件是否勾选");
      if (!isHide) {
          await agent.aiTap("显示隐藏文件");
          await agent.aiAssert("显示隐藏文件勾选成功");
      }  

      // 按Ctrl+F4关闭文件管理器设置窗口
      await device.pressKey("Alt+F4");

      // 步骤2：新打开一个文件管理窗口，查看隐藏文件
      await agent.aiTap("文件管理器左侧栏的桌面");
      await agent.aiTap("文管右上角三个小正方形和三条横线的列表视图按钮");
      await agent.aiAssert("能查看到.1804871.txt隐藏文件");

      // 步骤3：选择一个文件，进行重命名操作，查看扩展名
      await agent.aiRightClick("桌面上的1804871-a.txt");
      await agent.aiTap("右键菜单中的重命名");
      await agent.aiAssert("可以看到文件的扩展名");

      // 步骤4：取消“显示文件扩展名”,在选择文件进行重命名操作，查看扩展名
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");
      //恢复显示隐藏文件默认设置
      await agent.aiTap("显示隐藏文件"); 
      await agent.aiTap("显示文件扩展名");
      await agent.aiAssert("显示文件扩展名处于未勾选状态");
      //按Ctrl+F4关闭文件管理器设置窗口
      await device.pressKey("Alt+F4");

      // 验证重命名时不可见扩展名
      await agent.aiRightClick("桌面上的1804871-a.txt");
      await agent.aiTap("右键菜单中的重命名");
      await agent.aiAssert("重命名输入框中无法看到文件的扩展名");

      // 步骤5：取消勾选“最近使用”，打开一个新的窗口，查看左侧栏目
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("侧边栏显示项目");

      const isRecent = await agent.aiBoolean("最近使用是否勾选");
      if (isRecent) {
          await agent.aiTap("最近使用");
          await device.pressKey("Alt+F4");
      } 
     
      // 打开新窗口
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiAssert("左侧栏目看不到最近使用");

    }, { timeout: 1200000, tags: ["1804871",'level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');
      // 恢复显示扩展名、最近使用等默认设置
      await agent.aiTap("文件管理器左侧栏的桌面");
      await device.pressKey('Ctrl+1');
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");      
      await agent.aiTap("显示文件扩展名"); 
      await agent.aiTap("侧边栏显示项目");
      await agent.aiTap("最近使用");
    
      // 删除测试创建的文件
      await system.exec(`rm -f ~/Desktop/.1804871.txt`);
      await system.exec(`rm -f ~/Desktop/1804871-a.txt`);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });