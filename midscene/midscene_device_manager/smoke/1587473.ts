/**
 * 用例 PMSID: 1587473
 * 用例标题: 设备信息导出-txt
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/21
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1587473-设备信息导出-txt', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec(`rm -rf /home/$USER/Desktop/1587473.txt`);
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1587473-设备信息导出-txt', async ({ device, agent, uos, system }) => {
    const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
    await openDeviceManager(device, agent, uos);
    await agent.aiWaitFor('展示了设备管理器窗口');
    await device.pressKey('CTRL+E');
    await device.typeText('1587473');
    await device.pressKey('ENTER');
    await uos.closeCurrentWindow();
    await agent.aiAssert('桌面存在1587473.txt');

  }, { timeout: 600000, tags: ["1587473", "level2", "smoke", "xuqi"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await uos.closeCurrentWindow();
    await system.exec(`rm -rf /home/$USER/Desktop/1587473.txt`);
  });
}); 