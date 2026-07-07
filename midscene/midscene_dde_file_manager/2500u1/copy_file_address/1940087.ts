/**
 * 用例 PMSID: 1940087
 * 用例标题:  【复制文件地址】复制隐藏文件地址
 * 生成时间: 2026-5-25 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPassword = process.env.TEST_PASSWORD;

describe('1940087-【复制文件地址】复制隐藏文件地址', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，创建测试文件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      await system.exec("ps aux |grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  
    test('1940087-【复制文件地址】复制隐藏文件地址', async ({ device, agent, uos, system }) => {
      await agent.aiWaitFor("桌面已显示");
      const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      //关闭所有已打开的文本文档
      await agent.aiTap("任务栏上的第一个图标，也就是启动器");
      await agent.aiTap("点击启动器里的搜索框");
      await device.typeText('文本编辑器');
      await device.pressKey('Enter');
      await closeAllTxt(agent, device); 
   
      // 前置条件1：已设置显示隐藏文件：文件设置-文件和目录中，勾选显示隐藏文件
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");

      const ifHide = await agent.aiBoolean("显示隐藏文件是否勾选");
      if (!ifHide) {
        await agent.aiTap("显示隐藏文件");
        await agent.aiAssert("显示隐藏文件勾选成功");
      } else {
        console.log('已勾选显示隐藏文件');
      }

      // 按Ctrl+F4关闭文件管理器设置窗口
      await device.pressKey("Alt+F4");

      //在系统盘创建隐藏文件
      await device.pressKey("Ctrl+Alt+T");
      await device.pressKey("Win+Up");
      await agent.aiTap("终端内空白处");    
      
      await agent.aiInput(`sudo touch /.1940087.txt`, "终端");
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const ifPasswd = await agent.aiBoolean("是否看到请输入密码");
      if (ifPasswd) {
        console.log('输入密码');
        await agent.aiInput(`${userPassword}`, "终端");
        await device.pressKey('Enter');
        await agent.aiInput("ls -la / | grep 1940087", "终端");
        await device.pressKey('Enter');
        await agent.aiAssert("终端中看到.1940087.txt");
      } else {
        console.log('不需要输入sudo密码');
      }

      await device.pressKey("Alt+F4");

      // 打开文本编辑器
      await agent.aiTap("任务栏上的第一个图标，也就是启动器");
      await agent.aiTap("启动器里的搜索框");
      await device.typeText('文本编辑器');
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 4000));
      await device.pressKey('Alt', 'Tab');

      // 步骤1：进入系统盘，选择任意一个隐藏文件，按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
      await agent.aiTap("文件管理器左侧栏的系统盘");
      await agent.aiTap("文管右上角三个小正方形和三条横线的列表视图按钮");
      await agent.aiTap(".1940087.txt");
      await device.pressKey('Ctrl', 'Shift', 'c');
      
      // 切换到文本编辑器粘贴
      await device.pressKey('Alt', 'Tab');
      await agent.aiTap("文本编辑器内空白处");
      await device.pressKey('Enter');
      await device.pressKey('Ctrl', 'V');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 预期结果1：文件地址粘贴成功，且路径正确
      await agent.aiAssert(`文本编辑器里看到路径：/.1940087.txt`);    
      // 关闭文本编辑器内容
      await device.pressKey('Ctrl+W');
      await agent.aiTap("不保存");
      // 步骤2：将复制的文件地址粘贴到文管地址栏中，检查是否可打开文件
      
      await device.pressKey('Ctrl', 'L');
      await device.pressKey('Ctrl', 'A');
      await device.pressKey('Delete');
      await device.pressKey('Ctrl', 'V');
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 4000));    
      // 预期结果2：正常打开文件
      await agent.aiAssert(`只读方式打开.1940087.txt`);    
      // 关闭打开的文件
      await device.pressKey('Ctrl+W');

    }, { timeout: 1200000, tags: ['1940087', 'level3', '2500u1', 'copy_file_address', 'DITT', 'lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件'); 
      // 恢复隐藏文件默认状态
      await agent.aiTap("文件管理器右上角主菜单");
      await agent.aiTap("设置");
      await agent.aiTap("文件和目录");
      //恢复显示隐藏文件默认设置
      await agent.aiTap("显示隐藏文件"); 
      await agent.aiAssert("显示隐藏文件处于未勾选状态");
      //按Ctrl+F4关闭文件管理器设置窗口
      await device.pressKey("Alt+F4");
      //await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器左侧栏上的系统盘");
      await device.pressKey('Ctrl+1');
      await device.pressKey('Alt+F4');
      await system.exec(`echo "${userPassword}" | sudo -S rm -f /.1940087.txt`);    
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");

    });
  });