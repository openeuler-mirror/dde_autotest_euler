/**
 * 用例 PMSID: 1807683
 * 用例标题: 【文件右键】文件/文件夹-右键打开
 * 生成时间: 2025-12-17 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1807683-【文件右键】文件/文件夹-右键打开', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager')
  });
  test('1807683-【文件右键】文件/文件夹-右键打开', async ({ device, agent, system }) => {
    await agent.aiWaitFor("桌面已显示");
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/uos/Desktop/1807683.txt')

    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/uos/Desktop/文件夹1807683')

    //打开文件
    await agent.aiRightClick("1807683.txt")
    await agent.aiWaitFor("等待右键菜单显示完成")
    await agent.aiTap("打开按钮")
    await agent.aiAssert("打开文件，标题显示为：1807683.txt")

    //打开文件夹
    await agent.aiRightClick("文件夹1807683")
    await agent.aiWaitFor("等待右键菜单显示完成")
    await agent.aiTap("打开按钮")
    await agent.aiAssert("打开文件夹，路径显示为桌面/文件夹1807683")

  }, { timeout: 600000, tags: ['1807683', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除桌面的测试文档
    await system.exec('rm -rf /home/uos/Desktop/1807683.txt')
    await system.exec('rm -rf /home/uos/Desktop/文件夹1807683')

    //打开文件管理器，进入最近使用目录，清除最近访问记录
    await agent.aiDoubleClick("桌面主目录图标")
    await agent.aiTap("最近使用")
    await agent.aiRightClick("最近使用")
    await agent.aiTap("清除最近访问")

  });
  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager')
    //关闭所有文本编辑器窗口
    await system.exec('killall deepin-editor')
    //清除文本编辑器的打开文本记录
    await system.exec('rm -rf ~/.config/deepin/deepin-editor/*')

  });
});
