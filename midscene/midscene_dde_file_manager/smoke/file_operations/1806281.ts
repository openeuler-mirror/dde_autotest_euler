/**
 * 用例 PMSID: 1806281
 * 用例标题: [004]最近使用文件右键-单个文件右键-打开文件所在位置
 * 生成时间: 2025-12-17 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1806281-[004]最近使用文件右键-单个文件右键-打开文件所在位置', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件，后续测试
    await system.exec('touch /home/$USER/Desktop/aa.txt')
    //打开文件，使测试文件在最近使用目录显示，作为前置条件，后续测试
    await agent.aiDoubleClick("aa.txt")
  });

  test('1806281-[004]最近使用文件右键-单个文件右键-打开文件所在位置', async ({ uos, agent, system }) => {
    //打开文件管理器，进入最近使用目录
    await uos.openApp('文件管理器');
    await agent.aiTap("最近使用")

    //右键测试文件，点击的文件所在位置
    await agent.aiTap("aa.txt")
    await agent.aiRightClick("aa.txt")
    await agent.aiTap("打开文件所在位置按钮")
    await agent.aiAssert("新打开一个文件管理器窗口，aa.txt高亮显示")

  }, { timeout: 600000, tags: ['1806281', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除桌面的测试文档
    await system.exec('rm -rf /home/uos/Desktop/aa.txt')

    //打开文件管理器，进入最近使用目录
    await agent.aiDoubleClick("桌面主目录图标")
    await agent.aiTap("最近使用")
    await agent.aiRightClick("最近使用")
    await agent.aiTap("清除最近访问")

  });
  afterAll(async ({ system, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文本编辑器窗口已关闭');
    //清除文本编辑器的打开文本记录
    await system.exec('rm -rf ~/.config/deepin/deepin-editor/*')

  });
});
