// @ts-nocheck
/**
 * 用例 PMSID: 1593089
 * 用例标题: 打开.md文本类型格式文件 12:00:00
 * 生成时间：2025-12-16 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1593089-打开.md文本类型格式文件', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 将测试文件复制到桌面
    console.log('3: 将测试文件复制到桌面');
    const sourFile = process.env.TESTCASE_DIR ? `${process.env.TESTCASE_DIR}midscene_deepin_editor/resource_editor/1593089.md` : (() => { throw new Error('环境变量 TESTCASE_DIR 未配置'); })();
    await system.exec(`cp "${sourFile}" ~/Desktop/`);
    console.log('4. 测试文件已复制到桌面');
  });

  test('1593089-打开.md文本类型格式文件', async ({ device, agent, uos, system }) => {
    // 步骤1：在桌面上直接双击打开测试文档
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500)
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：在桌面上直接双击打开测试文档');
    
    // 确保在桌面视图
    await uos.showDesktop();
    
    // 双击桌面上的1593089.md文件
    await agent.aiDoubleClick("桌面上的1593089.md文件图标");

    await agent.aiAssert('1593089.md文件已正常打开');
    
    // 步骤2：点击“ctrl+f”，在查找框中输入“搜索日程”，断言可以搜索到文件
    console.log('执行步骤2：打开查找框并搜索"搜索日程"');
    
    // 按下ctrl+f打开查找框
    await device.pressKey('Ctrl+F');
    
    // 断言查找框已打开
    await agent.aiAssert('查找框已成功打开');
    
    // 输入"搜索日程"
    await device.typeText('搜索日程', false);
    await device.pressKey("enter")
    
    // 断言可以搜索到该文本
    await agent.aiAssert('搜索结果中包含"搜索日程"');
    
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593089', 'level2','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
afterAll(async ({ uos, agent, device, system }) => {
  console.log('5. afterAll: 清理测试套件');
  // 关闭文本编辑器
  await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
  // 清理测试文件
  await system.exec(`rm -rf ~/Desktop/1593089.md`);
  await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500)
});

});