/**
 * 用例 PMSID: 1504363
 * 用例标题: 【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改长度限制功能正常
 * 生成时间: 2026-3-17 10:53:10
 * 用例编写人:UT000511(肖海燕)
 */


let ORIGINAL_HOSTNAME = ''; // 在 describe 外部声明，作用域在这个测试文件内

describe('1504363-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改长度限制功能正常', () => {
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
  
    test('1504363-【控制中心】【系统】【辅助信息】"关于本机"计算机名称修改长度限制功能正常', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 进入系统--关于本机页面，点击计算机名称后的铅笔图标
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiAssert("显示系统/关于本机");
      await agent.aiTap("计算机名称后的铅笔图标");
      await agent.aiAssert('进入编辑模式，计算机名称被选中');

      //步骤 3：点击计算机名称后的清除按钮，回车
      await agent.aiTap("计算机名称后的清除按钮");
      await device.pressKey("Enter");

      //检查显示原来的计算机名称
      console.log(`检查显示${ORIGINAL_HOSTNAME}计算机名称`);
      await agent.aiAssert(`显示${ORIGINAL_HOSTNAME}计算机名称`);

      //步骤 4：在输入框内输入1个字符
      console.log('在输入框内输入1个字符');
      await agent.aiTap('点击计算机名称后面的铅笔图标');
      await device.typeText('a',true);
      await agent.aiAssert('弹出认证窗口')
      await agent.aiInput(process.env.TEST_PASSWORD, "密码输入框");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey('Enter');
      await agent.aiAssert('计算机名显示为a');

      //步骤 5：在输入框内输入63个字符
      console.log('输入63个字符');
      await agent.aiTap("计算机名称后的铅笔图标");
      await device.typeText("XPpKJzD8Gx3N7q1LwFyT5vR9cM2sB4hA6nQ0jUeIoZmHdPkSgWrVtXbYfCxLzNq",true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      //检查计算机名显示为:aB3!fG7@kL1#mN4$pQ8%tU2^vW5&xZ9*yC0(zD6)rF+uH=jI[oK]lP;eS:aT>qY<bX?nV'
      await agent.aiAssert('计算机名最右端显示为:XPpKJzD8Gx3N7q1LwFyT5vR9cM2sB4hA6nQ0jUeIoZmHdPkSgWrVtXbYfCxLzNq');

      //步骤 6：在输入框内输入64个字符
      await agent.aiTap("计算机名称后的铅笔图标");
      await device.typeText("XPpKJzD8Gx3N7q1LwFyT5vR9cM2sB4hA6nQ0jUeIoZmHdPkSgWrVtXbYfCxLzNq1");

      //检查输入失败，并提示：计算机名长度必须介于1到63个字符之间
      await agent.aiAssert('输入框下方显示红色提示信息，内容为:计算机名长度必须介于1到63个字符之间');
      await device.pressKey('Enter');
      await agent.aiAssert('计算机名最右端显示为:XPpKJzD8Gx3N7q1LwFyT5vR9cM2sB4hA6nQ0jUeIoZmHdPkSgWrVtXbYfCxLzNq');

    }, { timeout: 600000, tags: ["1504363","level4"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复原来主机名
      await agent.aiTap("计算机名称后的铅笔图标");
      console.log(ORIGINAL_HOSTNAME);
      await device.typeText(ORIGINAL_HOSTNAME, true);

      // 恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });