
/**
 * 用例 PMSID: 1805327
 * 用例标题: 【搜索】搜索地址前缀补全-IP地址检测
 * 生成时间: 2026-02-26 16:55:38
 * 用例编写人: UT000193（郑豪）
 */

describe('1805327-【搜索】搜索地址前缀补全-IP地址检测', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805327-【搜索】搜索地址前缀补全-IP地址检测', async ({ device, agent, uos }) => {
    // 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");

    // 步骤1：搜索输入框输入" . . . "
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言1：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤2：搜索输入框输入"-1.-1.-1.-1"
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("-1.-1.-1.-1");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言2：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤3：搜索输入框输入"256:256:256:256"
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("256:256:256:256");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言3：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤4：搜索输入框输入"0.0.0"
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("0.0.0");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言4：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤5：搜索输入框输入"255.255.255"
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("255.255.255");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言5：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤6：搜索输入框输入完整ip“0.0.0.0”
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("0.0.0.0");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言6：下拉框按顺序显示smb://0.0.0.0、ftp://0.0.0.0、sftp://0.0.0.0
    await agent.aiAssert("下拉框按顺序显示smb://0.0.0.0、ftp://0.0.0.0、sftp://0.0.0.0");

    // 步骤7：搜索输入框输入完整ip“255.255.255.255”
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("255.255.255.255");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言7：下拉框按顺序显示smb://255.255.255、ftp://255.255.255、sftp://255.255.255
    await agent.aiAssert("下拉框按顺序显示smb://255.255.255.255、ftp://255.255.255.255、sftp://255.255.255.255");

    // 步骤8：搜索输入框输入完整ip"10.8.13.125"
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("10.8.13.125");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言8：下拉框按顺序显示smb://10.8.13.125、ftp://10.8.13.125、sftp://10.8.13.125
    await agent.aiAssert("下拉框按顺序显示smb://10.8.13.125、ftp://10.8.13.125、sftp://10.8.13.125");

    // 步骤9：搜索输入框输入完整ip“10.8.13.125.123”
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Backspace");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("10.8.13.125.123");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言9：下拉框无显示
    await agent.aiAssert("下拉框无显示");

    // 步骤10：搜索输入框输入“tag.gz.zip.rar ”
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("tag.gz.zip.rar");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言10：下拉框无显示
    await agent.aiAssert("下拉框无显示");

  }, { timeout: 600000, tags: ['1805327', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});