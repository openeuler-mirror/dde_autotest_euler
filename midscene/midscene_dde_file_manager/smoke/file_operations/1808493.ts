/**
 * 用例 PMSID: 1808493
 * 用例标题: 桌面右键菜单-新建文档
 * 生成时间: 2025-12-12 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1808493-桌面右键菜单-新建文档', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager')
  });
  test('1808493-桌面右键菜单-新建文档', async ({ device, agent, system }) => {
    await agent.aiWaitFor("桌面已显示");
    //新建办公文档
    await agent.aiRightClick("桌面右上角空白处")
    await agent.aiTap("新建文档")
    await agent.aiTap("办公文档")
    await device.typeText("测试办公文档")
    await agent.aiTap("桌面空白处")
    await agent.aiAssert("桌面存在文件名字为：测试办公文档.docx")

    //新建电子表格
    await agent.aiRightClick("桌面右下角空白处")
    await agent.aiTap("新建文档")
    await agent.aiTap("电子表格")
    await device.typeText("测试电子表格")
    await agent.aiTap("桌面空白处")
    await agent.aiAssert("桌面存在文件名字为：测试电子表格.xlsx")

    //新建演示文档
    await agent.aiRightClick("桌面左下角空白处")
    await agent.aiTap("新建文档")
    await agent.aiTap("演示文档")
    await device.typeText("测试演示文档")
    await agent.aiTap("桌面空白处")
    await agent.aiAssert("桌面存在文件名字为：测试演示文档.pptx")

    //新建文本文档
    await system.exec('touch /home/uos/Desktop/测试文本文档.txt')
    await agent.aiAssert("桌面存在文件名字为：测试文本文档.txt")

  }, { timeout: 1000000, tags: ['1808493', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除新建的文档
    await system.exec('rm -rf /home/uos/Desktop/测试*')

  });
  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager')

  });
});
