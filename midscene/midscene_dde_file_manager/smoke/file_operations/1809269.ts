/**
 * 用例 PMSID: 1809269
 * 用例标题: [t][core]剪切-选中单个文件/文件夹右键-剪切
 * 生成时间: 2025-12-12 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1809269-[t][core]剪切-选中单个文件/文件夹右键-剪切', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

  });
  test('1809269-[t][core]剪切-选中单个文件/文件夹右键-剪切', async ({ device, agent, system }) => {
    await agent.aiWaitFor("桌面已显示");
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/uos/Desktop/测试文件.txt')

    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/uos/Desktop/测试文件夹')

    //删除桌面的测试文件（构造前置条件）
    await agent.aiRightClick("测试文件.txt")
    await agent.aiTap("删除按钮")
    await agent.aiAssert("桌面不存在测试文件.txt")

    //删除桌面的测试文件夹（构造前置条件）
    await agent.aiRightClick("测试文件夹")
    await agent.aiTap("删除按钮")
    await agent.aiAssert("桌面不存在测试文件夹")

    //进入回收站，复制文件
    await agent.aiDoubleClick("桌面回收站图标");
    await agent.aiTap("测试文件.txt")
    await agent.aiRightClick("测试文件.txt")
    await agent.aiTap("剪切按钮")
    //关闭当前回收站窗口
    await system.exec('killall dde-file-manager')
    //回到桌面，粘贴文件
    await agent.aiRightClick("桌面空白处")
    await agent.aiTap("粘贴按钮")
    await agent.aiAssert("桌面存在测试文件.txt")

    //进入回收站，复制文件夹
    await agent.aiDoubleClick("桌面回收站图标");
    await agent.aiTap("测试文件夹")
    await agent.aiRightClick("测试文件夹")
    await agent.aiTap("剪切按钮")
    //关闭当前回收站窗口
    await system.exec('killall dde-file-manager')
    //回到桌面，粘贴文件夹
    await agent.aiRightClick("桌面空白处")
    await agent.aiTap("粘贴按钮")
    await agent.aiAssert("桌面存在测试文件夹")

  }, { timeout: 1200000, tags: ['1809269', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除桌面的测试文档
    await system.exec('rm -rf /home/uos/Desktop/测试文件*')

  });
  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager')

  });
});
