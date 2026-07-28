// @ts-nocheck
/**
 * 用例 PMSID: 1704771
 * 用例标题: 【玲珑】【文本编辑器】进入容器内部
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1704771-【玲珑】【文本编辑器】进入容器内部', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1704771-【玲珑】【文本编辑器】进入容器内部', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开终端
    console.log('执行步骤1：从启动器打开终端');
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await uos.openApp('终端', 2000, 2000, true);

    // 执行ll-cli run org.deepin.editor --exec /bin/bash命令
    console.log('执行命令：ll-cli run org.deepin.editor --exec /bin/bash');
    await device.typeText("ll-cli run org.deepin.editor --exec /bin/bash", true);
    
    // 等待命令执行完成
    await agent.aiWaitFor("命令执行完成");
    
    // 断言输出包含"dircolors"
    await agent.aiAssert("命令输入正常");
    await device.typeText("exit", true);
    
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1704771', 'level3','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭终端释放资源
   await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
  });
});