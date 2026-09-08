/**
 * 用例 PMSID: 1807777
 * 用例标题: 文管右键菜单显示快捷键-快捷键显示-文管普通目录右键菜单显示快捷键
 * 生成时间: 2025-12-17 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1807777-文管右键菜单显示快捷键-快捷键显示-文管普通目录右键菜单显示快捷键', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager')
  });
  test('1807777-文管右键菜单显示快捷键-快捷键显示-文管普通目录右键菜单显示快捷键', async ({ system, agent }) => {
    await agent.aiWaitFor("桌面已显示");
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/uos/Documents/测试文件.txt')

    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/uos/Documents/测试文件夹')

    //进入文档目录
    await agent.aiDoubleClick("桌面主目录图标")
    await agent.aiDoubleClick("文档")

    //右键文件查看快捷键显示
    await agent.aiRightClick("测试文件.txt")
    await agent.aiWaitFor("等待右键菜单显示完成")
    await agent.aiAssert("显示选项：打开(O)、剪切(T)、复制(C)、重命名(M)、删除(D)、属性(R)")
    await agent.aiTap("文档空白处")

    //右键文件夹查看快捷键显示
    await agent.aiRightClick("测试文件夹")
    await agent.aiWaitFor("等待右键菜单显示完成")
    await agent.aiAssert("显示选项：打开(O)、剪切(T)、复制(C)、重命名(M)、删除(D)、属性(R)")
    await agent.aiTap("文档空白处")

    //空白处右键查看快捷键显示
    await agent.aiRightClick("文档目录空白处")
    await agent.aiWaitFor("等待右键菜单显示完成")
    await agent.aiAssert("显示选项：粘贴(P)、属性(R)")
    await agent.aiTap("文档空白处")

  }, { timeout: 600000, tags: ['1807777', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除新建的文件和文件夹
    await system.exec('rm -rf /home/uos/Documents/测试文件.txt')
    await system.exec('rm -rf /home/uos/Documents/测试文件夹')

  });
  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager')

  });
});
