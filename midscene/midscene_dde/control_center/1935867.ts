/**
 * 用例 PMSID: 1935867
 * 用例标题: 【控制中心】【系统信息】关于本机计算机名称修改无法保存的字符，鼠标焦点离开输入框时候需要正常触发异常提醒
 * 生成时间: 2026-3-17 21:54:10
 * 用例编写人:UT000511(肖海燕)
 */


let ORIGINAL_HOSTNAME = ''; // 在 describe 外部声明，作用域在这个测试文件内

describe('1935867-【控制中心】【系统信息】关于本机计算机名称修改无法保存的字符，鼠标焦点离开输入框时候需要正常触发异常提醒', () => {
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
  
    test('1935867-【控制中心】【系统信息】关于本机计算机名称修改无法保存的字符，鼠标焦点离开输入框时候需要正常触发异常提醒', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 进入系统--关于本机页面，点击计算机名称后的铅笔图标
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiAssert("显示系统/关于本机");
      await agent.aiTap("计算机名称后的铅笔图标");
      await agent.aiAssert('进入编辑模式，计算机名称被选中');

      //步骤 3：修改名称为”-test“后，鼠标点击输入框之外的地方,计算机名称修改失败，提示计算机名不能以"-"开头结尾
      await device.typeText('-test',true);
      await agent.aiAssert('提示计算机名不能以-开头结尾');

      await new Promise(resolve => setTimeout(resolve, 5000)); //等待5s
      await agent.aiAssert('界面不存在提示信息“计算机名不能以-开头结尾”');
      await agent.aiTap("点击输入框的X");
      await device.pressKey('Enter');

      //步骤4：修改名称为”test-“后，鼠标点击输入框之外的地方,计算机名称修改失败，提示计算机名不能以"-"开头结尾
      await agent.aiTap("计算机名称后的铅笔图标");
      await device.typeText('test-',true);

      await new Promise(resolve => setTimeout(resolve, 5000)); //等待5s
      await agent.aiAssert('界面不存在提示信息“计算机名不能以-开头结尾”');
      await agent.aiTap("点击输入框的X");
      await device.pressKey('Enter');
     
      //步骤5: 编辑计算机名为主机名1，点击左侧菜单进行模块切换，页面跳转正常
      await agent.aiTap("计算机名称后的铅笔图标");
      await device.typeText(`${ORIGINAL_HOSTNAME}_1`);  //增强脚本健壮性，动态输入修改的计算机名，引用全局常量ORIGINAL_HOSTNAME
      await agent.aiTap("点击左侧菜单系统");
      
      //步骤6：弹出认证窗口
      await agent.aiAssert('弹出认证窗口')
      await agent.aiInput(process.env.TEST_PASSWORD, "密码输入框");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey('Enter');
      await agent.aiAssert("页面跳转到系统界面");

      //步骤7：回到关于本机界面，计算机名称显示为主机名1
      await agent.aiTap("关于本机");
      await agent.aiAssert(`计算机名显示为:${ORIGINAL_HOSTNAME}1`);   //引用反引号

      //步骤8：编辑计算机名为test-，点击左侧菜单进行模块切换,页面跳转正常
      await agent.aiTap("计算机名称后的铅笔图标");
      await device.typeText('test-');
      await agent.aiTap("点击左侧菜单系统");
      await agent.aiAssert('页面跳转到系统界面');

      //步骤9：回到关于本机界面，计算机名称显示为主机名1
      await agent.aiTap("关于本机");
      await agent.aiAssert(`计算机名显示为:${ORIGINAL_HOSTNAME}1`); 

    }, { timeout: 600000, tags: ["1935867","level4"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复原来计算机名
      await agent.aiTap("计算机名称后的铅笔图标");
      console.log(ORIGINAL_HOSTNAME);
      await device.typeText(ORIGINAL_HOSTNAME, true);

      // 恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });