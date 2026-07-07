// @ts-nocheck
/**
 * 用例 PMSID: 1593091
 * 用例标题: 打开.crt格式文件
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1593091-打开.crt格式文件', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 将测试文件复制到桌面
    console.log('3: 将测试文件复制到桌面');
    const sourFile = process.env.TESTCASE_DIR ? `${process.env.TESTCASE_DIR}midscene_deepin_editor/resource_editor/1593091.crt` : (() => { throw new Error('环境变量 TESTCASE_DIR 未配置'); })();
    await system.exec(`cp "${sourFile}" ~/Desktop/`);
    console.log('4. 测试文件已复制到桌面');
  });

  test('1593091-打开.crt格式文件', async ({ device, agent, uos, system}) => {
    // 步骤1：在桌面上直接双击打开测试文档
    console.log('执行步骤1：在桌面上直接双击打开测试文档');
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    // 确保在桌面视图
    await uos.showDesktop();
    
    // 双击桌面上的1593091.crt文件
    await agent.aiDoubleClick("桌面上的1593091.crt文件图标");
    
    // 断言页面有证书查看器的文案
    await agent.aiAssert('页面显示证书查看器的文案');
    
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593091', 'level2','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭已打开的文件
    await device.pressKey('Alt+F4');
    // 清理测试文件
    await system.exec(`rm -rf ~/Desktop/1593091.crt`);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});