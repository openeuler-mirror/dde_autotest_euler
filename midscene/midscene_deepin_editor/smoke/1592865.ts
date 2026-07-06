// @ts-nocheck
/**
 * 用例 PMSID: 1592865
 * 用例标题: 退出
 * 生成时间：2025-12-16 12:00:00
 * 用例编写人：UT000686(李双双)
 */

// 常量定义
const APP_NAME = '文本编辑器';
const TIMEOUT = 30000; // 30秒超时
const WAIT_INTERVAL = 1000; // 轮询间隔
const QUERY_TIMEOUT = 2000; // 查询超时
const EXIT_WAIT = 3000; // 退出等待时间
const OPEN_APP_TIMEOUT = 2000; // 应用打开超时

// 处理是否保存弹框的函数
const handleSaveDialog = async (agent) => {
  // 直接验证应用是否已退出，不检查保存弹框
  await agent.aiAssert(`文本编辑器应用已关闭`);
  return true;
};
describe('1592865-退出', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1592865-退出', async ({ device, agent, uos, system }) => {
    // 测试通过菜单退出
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp(APP_NAME, OPEN_APP_TIMEOUT, OPEN_APP_TIMEOUT, true);

    console.log('执行步骤2：点击菜单退出');
    await agent.aiTap(`${APP_NAME}右上角菜单按钮`, { deepThink: true });
    await agent.aiTap("退出", { deepThink: true });

    await handleSaveDialog(agent);
    console.log('文本编辑器已通过菜单退出');

    // 测试通过Alt+F4快捷键退出
    console.log('执行步骤3：重新打开文本编辑器');
    await uos.openApp(APP_NAME, OPEN_APP_TIMEOUT, OPEN_APP_TIMEOUT, true);
    console.log('执行步骤4：通过Alt+F4快捷键退出');
    await device.pressKey("Alt+F4");
    await handleSaveDialog(agent);
    console.log('文本编辑器已通过快捷键退出');
  }, { timeout: 600000,  tags: ['1592865', 'level2', 'smoke', 'exit-test', 'lishuangshuang'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    try {
      await agent.aiAssert(`文本编辑器应用已关闭`);
      await uos.showDesktop();
    } catch (err) {
      console.log('清理提示：应用状态验证失败，已恢复桌面', err.message);
      await uos.showDesktop();
    }
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});