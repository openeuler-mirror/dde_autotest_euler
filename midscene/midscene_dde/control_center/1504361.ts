/**
 * 用例 PMSID: 1504361
 * 用例标题: 【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改生效
 * 生成时间: 2026-3-18 14:54:10
 * 用例编写人:UT000511(肖海燕)
 */


let ORIGINAL_HOSTNAME = ''; // 在 describe 外部声明，作用域在这个测试文件内

describe('1504361-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改生效', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      // 获取本机名称
      const result = await system.exec('hostname');
      ORIGINAL_HOSTNAME = result.stdout.trim(); // 获取标准输出并去除换行符
      console.log('获取到的主机名为：', ORIGINAL_HOSTNAME);
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504361-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改生效', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化d
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 进入系统--关于本机页面，点击计算机名称后的铅笔图标，修改计算机名为ORIGINAL_HOSTNAME1
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiTap("计算机名称后的铅笔图标");
      //await device.typeText(`${ORIGINAL_HOSTNAME}_1`, true);
      await device.typeText(`${ORIGINAL_HOSTNAME}1`, true);
      
      //提权认证
      await agent.aiAssert('弹出认证窗口')
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);

      // await agent.aiInput(process.env.TEST_PASSWORD, "密码输入框");
      // await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 3000));

      //检查修改计算机名称保存正常
      await agent.aiAssert(`计算机名显示为:${ORIGINAL_HOSTNAME}1`);  
      await new Promise(resolve => setTimeout(resolve, 2000));         //等待2s
      
      //步骤 3: 打开终端，查看输入光标左侧位置的计算机名称
      await device.pressKey('Ctrl', 'Alt', 'T');
      await agent.aiAssert(`终端光标前面的计算机名显示为:${ORIGINAL_HOSTNAME}1`);
      await agent.aiTap("点击终端右上角X,关闭终端窗口");

      //步骤 4: 新建用户，切换用户，进入“控制中心”--“系统信息”--“关于本机”页面，查看计算机名称
      await agent.aiTap("点击控制中心左侧账户菜单");
      await agent.aiTap("右上角：添加新用户");

      //步骤 5: 创建新用户Test1，密码跟当前账户密码一致
      await agent.aiTap("用户名后面必填");
      await device.typeText("Test1");
      await agent.aiTap("新密码后面必填");
      await device.typeText(`${process.env.TEST_PASSWORD}`);
      //await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("重复密码后面必填");
      await device.typeText(`${process.env.TEST_PASSWORD}`);
      await agent.aiTap("点击创建用户");
      await agent.aiWaitFor("出现鉴权窗口");
      await agent.aiTap("密码输入框");
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);
      await agent.aiTap("确认");

      // 检查：创建账户成功，Test账户显示在其他账户下方
      await agent.aiAssert("其他账户下方显示Test1 标准用户");

      //步骤 6: 切换账户
      await device.pressKey('Ctrl', 'Alt', 'Delete');
      await agent.aiTap("点击切换用户菜单");
      await agent.aiTap("点击Test1账户");
      await new Promise(resolve => setTimeout(resolve, 5000));         //等待5s
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);
      await new Promise(resolve => setTimeout(resolve, 10000));        //等待10s

      //进入“控制中心”--“系统信息”--“关于本机”页面，查看计算机名称
      await uos.openApp('控制中心');
      await device.pressKey("win","up");                     
      // await uos.openApp('控制中心', { maximizeWindow: true });    //适配有问题，用快捷键实现
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiAssert(`计算机名显示为:${ORIGINAL_HOSTNAME}1`);

      //关闭控制中心
      await device.pressKey('Alt','F4'); 

      //注销当前账户
      await device.pressKey('Ctrl', 'Alt', 'Delete');
      await agent.aiTap("点击页面注销按钮");
      await new Promise(resolve => setTimeout(resolve, 15000));         //等待15s

      //切换到原始用户
      await agent.aiTap("点击页面右下角两个小人的图标");
      await agent.aiTap(`点击账户${ORIGINAL_HOSTNAME}`);
      //await agent.aiTap("点击账户uos");  //调试用
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);

      //步骤 7: 注销或重启后，进入“控制中心”--“系统信息”--“关于本机”页面，查看计算机名称
      await device.pressKey('Ctrl', 'Alt', 'Delete');
      await agent.aiTap("点击页面注销按钮");
      await new Promise(resolve => setTimeout(resolve, 15000));         //等待15s

      //输入用户名和密码，登录
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);
      await new Promise(resolve => setTimeout(resolve, 15000));         //等待20s

      //打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });

      //进入系统--关于本机页面，查看计算机名
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiAssert(`终端光标前面的计算机名显示为:${ORIGINAL_HOSTNAME}1`);

    }, { timeout: 600000, tags: ["1504361","level3","remote"] });  //增加remote tag
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //删除新创建的账户
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("点击控制中心左侧账户菜单");
      await agent.aiTap("Test");
      await agent.aiScroll('账户/Test下方区域',{direction:'down',distance:10});
      await agent.aiTap("下方删除当前账户按钮");
      await agent.aiTap("弹窗上的：删除");

      //恢复原来计算机名
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiTap("计算机名称后的铅笔图标");
      console.log(ORIGINAL_HOSTNAME);
      await device.typeText(ORIGINAL_HOSTNAME, true);

      // 恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });