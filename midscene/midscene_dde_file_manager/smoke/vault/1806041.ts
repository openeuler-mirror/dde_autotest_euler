/**
 * 用例 PMSID: 1806041
 * 用例标题: 保险箱-未创建保险箱时在计算机页面点击鼠标右键
 * 生成时间: 2025-12-18 20:28:25
 * 用例编写人：UT006252(杨通)
 */
describe('1806041-保险箱-未创建保险箱时在计算机页面点击鼠标右键', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
    console.log('2. 打开文件管理器');
    //打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    //前置进行保险箱删除操作确保环境干净
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
    await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    const result = await system.exec(`fusermount -u /home/${TEST_USERNAME}/.config/Vault/vault_unlocked`);
    console.log(result.stderr);
    if (result.success) {
      console.log('保险箱环境有残留，已强制卸载');
      await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
      await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    } else {
        console.log('保险箱环境无需清理');
      }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });
  
  test('1806041-保险箱-未创建保险箱时在计算机页面点击鼠标右键', async ({ uos, agent, device }) => {
    //右键保险箱图标并验证右键菜单
    console.log('步骤1: 右键保险箱图标');
    await uos.maximizeWindow();
    await agent.aiRightClick('保险箱图标');
    console.log('断言: 出现创建保险箱选项');
    await agent.aiAssert('出现创建保险箱选项');
    await agent.aiTap('页面空白处');
  }, { timeout: 120000, tags: ['1806041', 'level2', 'smoke','yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device,system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    console.log('关闭文件管理器');
    await uos.closeCurrentWindow();
    //双重保险清理文件管理器环境
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');  
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager'); 
  });
});