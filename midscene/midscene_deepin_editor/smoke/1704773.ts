// @ts-nocheck
/**
 * 用例 PMSID: 1704773
 * 用例标题: 【玲珑】【文本编辑器】检查玲珑应用运行情况
 * 生成时间：2025-12-16 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1704773-【玲珑】【文本编辑器】检查玲珑应用运行情况', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1704773-【玲珑】【文本编辑器】检查玲珑应用运行情况', async ({ device, agent, uos, system}) => {

    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    // 前置条件：启动器打开文本编辑器，并且最大化窗口
    await uos.openApp('文本编辑器', 2000, 2000, true);
    // 前置条件：启动器打开终端，并且最大化窗口
    console.log('执行前置条件：启动器打开终端并最大化窗口');
    
    // 从启动器打开终端
    await uos.openApp('终端', 2000, 2000, true);
    
    // 最大化终端窗口
    await uos.maximizeWindow();
    console.log('终端已打开并最大化');
    
    // 步骤1：在终端输入：ll-cli ps，可查看到org.deepin.editor相关的信息
    console.log('执行步骤1：查看org.deepin.editor相关进程');
    await device.typeText("ll-cli ps | grep org.deepin.editor", true);
    
    // 等待命令执行结果
    await agent.aiWaitFor("命令执行完成");
    
    // 获取终端输出
    const processOutput = await agent.aiQuery("终端的输出内容");
    console.log('ll-cli ps | grep org.deepin.editor 命令输出:', processOutput);
    
    // 关闭终端
    await agent.aiTap("窗口右上角关闭按钮:X");
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1704773', 'level3','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // console.log('执行步骤2：关闭文本编辑器进程');
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});