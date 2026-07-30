/**
 * 用例 PMSID: 1504367
 * 用例标题: 【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改，输入正常字符，能成功修改 
 * 生成时间: 2026-2-4 10:32:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1504367-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改，输入正常字符，能成功修改', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504367-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改，输入正常字符，能成功修改', async ({ device, agent, uos, system }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp("控制中心", {maximizeWindow: true});
      
      // 步骤 2: 点击系统-关于本机
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiWaitFor("系统/关于本机");

      // 获取本机名称
      const result= await system.exec('hostname');
      console.log('获取到的主机名为：',result.stdout);

      // 检查：默认显示系统安装时，用户新建的计算机名
      await agent.aiAssert(`检查界面显示的计算机名和${result.stdout}一致`);

      // 修改计算机名为test-123，检查修改成功
      await agent.aiTap('点击计算机名称后面的修改按钮');
      await device.typeText('test-123', true);
      await agent.aiAssert('弹出认证窗口')
      await agent.aiInput(process.env.TEST_PASSWORD, "密码输入框");

      //创建 Promise 延迟 1 秒，用于暂停当前异步函数执行
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey('Enter');
      await agent.aiAssert('计算机名修改为test-123');
 
      // 修改计算机名为Test，检查修改成功
      await agent.aiTap('点击计算机名称后面的修改按钮');
      await device.typeText('Test', true);
      await agent.aiAssert('计算机名修改为Test');

    }, { timeout: 600000, tags: ["1504367","level4"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 恢复计算机名为uos-PC
      await agent.aiTap('点击计算机名称后面的修改按钮');
      await device.typeText('uos-PC', true);
      await agent.aiAssert('计算机名修改为uos-PC');
      await agent.aiTap("窗口右上角关闭按钮:X");
      await uos.closeCurrentWindow();
    });
  });
  