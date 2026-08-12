/**
 * 用例 PMSID: 1804897
 * 用例标题:  不勾选【显示隐藏文件】-在文管普通目录内以“.”开头批量重命名文件-弹窗提示-点击【隐藏】
 * 生成时间: 2026-4-29 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804897-不勾选【显示隐藏文件】-在文管普通目录内以“.”开头批量重命名文件-弹窗提示-点击【隐藏】', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，恢复文管默认设置');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ uos, device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备，创建测试文件和文件夹');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      // 前置条件1：恢复文管默认设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("默认目录");
      await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");
      // 关闭设置窗口
      await device.pressKey("Alt+F4"); 
      // 前置条件2：不勾选【显示隐藏文件】（默认就不勾选），创建桌面测试文件和文件夹
      await system.exec(`touch ~/Desktop/1804897-1.txt`);
      await system.exec(`touch ~/Desktop/1804897-2.txt`);
      await system.exec(`touch ~/Desktop/1804897-3.txt`);
      await system.exec(`touch ~/Desktop/1804897-5.txt`);
      await system.exec(`touch ~/Desktop/1804897-6.txt`); 
      await system.exec(`mkdir ~/Desktop/1804897-4`);
    });
  
    test('1804897-不勾选【显示隐藏文件】-在文管普通目录内以“.”开头批量重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos }) => {
      await agent.aiWaitFor("桌面已显示");
      
      // 步骤1：在文管普通目录内以“.”开头批量重命名文件/文件夹，弹窗后点击【隐藏】
      //打开文件管理器，批量选中桌面的测试文件和文件夹      
      await agent.aiTap("文件管理器左侧栏的桌面");
      // 按住Ctrl键并依次点击文件/文件夹
      await device.keyDown("ctrl");
      await agent.aiTap("桌面上的1804897-1.txt");
      await agent.aiTap("桌面上的1804897-2.txt");
      await agent.aiTap("桌面上的1804897-3.txt");
      await agent.aiTap("桌面上的1804897-4文件夹");
      await device.keyUp("ctrl");
      await agent.aiAssert("1804897-1.txt、1804897-2.txt、1804897-3.txt文本文件和1804897-4文件夹被选中");

      // 批量重命名
      await agent.aiRightClick("1804897-4文件夹");
      await agent.aiTap("重命名");
      await agent.aiAssert("看到重命名按钮");

      // 重命名操作添加.前缀
      await agent.aiTap("替换文本");
      await agent.aiTap("添加文本");
      await agent.aiInput(".", "含有必填文字的输入框");
      await agent.aiTap("重命名按钮");
      await agent.aiAssert("弹出隐藏此文件确认窗口");

      // 点击隐藏按钮
      await agent.aiTap("隐藏按钮");
      // 文件/文件夹被隐藏
      await agent.aiAssert("看不到1804897-1.txt、1804897-2.txt、1804897-3.txt文本文件和1804897-4文件夹");
      // 勾选【显示隐藏文件】或ctrl+h后文件可见
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");      
      await agent.aiTap("显示隐藏文件");
      await device.pressKey("Alt+F4"); // 关闭设置窗口
      await agent.aiTap("点击文管右上角三个小正方形和三条横线的列表视图按钮");
      await agent.aiAssert("看到.1804897-1.txt、.1804897-2.txt、.1804897-3.txt文本文件和.1804897-4文件夹");
      // 恢复显示隐藏文件默认设置
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");      
      await agent.aiTap("显示隐藏文件");
      await agent.aiAssert("显示隐藏文件未勾选");
      await device.pressKey("Alt+F4"); // 关闭设置窗口

      // 步骤2：再次在文管普通目录内以“.”开头重命名文件/文件夹     
      await device.keyDown("ctrl");
      await agent.aiTap("桌面上的1804897-5.txt");
      await agent.aiTap("桌面上的1804897-6.txt");
      await device.keyUp("ctrl");
      await agent.aiAssert("1804897-5.txt、1804897-6.txt被选中");

      // 批量重命名
      await agent.aiRightClick("1804897-6.txt");
      await agent.aiTap("重命名");
      await agent.aiAssert("看到重命名按钮");

      // 再次执行重命名添加.前缀操作
      await agent.aiTap("替换文本");
      await agent.aiTap("添加文本");
      await agent.aiInput(".", "含有必填文字的输入框");
      await agent.aiTap("重命名按钮");
      // 弹出【隐藏文件提示弹窗】
      await agent.aiAssert("弹出隐藏此文件确认窗口");

      // 关闭隐藏文件确认窗口
      await device.pressKey("Alt+F4");

    }, { timeout: 1200000, tags: ["1804897",'level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');    
      // 删除测试创建的文件和文件夹（包括隐藏后的文件/文件夹）
      await system.exec(`rm -f ~/Desktop/.1804897-1.txt`);
      await system.exec(`rm -f ~/Desktop/.1804897-2.txt`);
      await system.exec(`rm -f ~/Desktop/.1804897-3.txt`);
      await system.exec(`rm -f ~/Desktop/.1804897-5.txt`);
      await system.exec(`rm -f ~/Desktop/.1804897-6.txt`);
      await system.exec(`rm -rf ~/Desktop/.1804897-4`);
      // 清理残留的未隐藏文件/文件夹
      await system.exec(`rm -f ~/Desktop/1804897-1.txt`);
      await system.exec(`rm -f ~/Desktop/1804897-2.txt`);
      await system.exec(`rm -f ~/Desktop/1804897-3.txt`);
      await system.exec(`rm -f ~/Desktop/1804897-5.txt`);
      await system.exec(`rm -f ~/Desktop/1804897-6.txt`);
      await system.exec(`rm -rf ~/Desktop/1804897-4`);
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器左侧栏的桌面");
      await device.pressKey('Ctrl+1');
      await device.pressKey('Alt+F4');
      // 关闭文件管理器进程
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });