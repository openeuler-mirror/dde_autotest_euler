
/**
 * 用例 PMSID: 1815565
 * 用例标题: 入口-主机未接入蓝牙外设时检查发送到选项
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT002899 (胡诗敏)
 */

describe('1815565-入口-主机未接入蓝牙外设时检查发送到选项', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件
    await system.exec(`touch /home/$USER/Desktop/test文件.txt`);

  });

  test('1815565-入口-主机未接入蓝牙外设时检查发送到选项', async ({ device, agent, uos, system }) => {
    //选择测试文件，鼠标右键查看发送到列表选项
    await agent.aiRightClick('test文件.txt')
    await agent.aiTap('发送到')
    await agent.aiWaitFor('右侧菜单显示')
    await agent.aiAssert('不显示蓝牙选项')
    await agent.aiTap('桌面空白处')


  }, { timeout: 600000, tags: ['1815565', 'level3', 'external_device', 'DITT', 'hushimin'] });

  afterEach(async ({ system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件
    await system.exec(`rm -rf /home/$USER/Desktop/test文件.txt`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
});
