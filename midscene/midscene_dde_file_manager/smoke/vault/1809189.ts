
/**
 * 用例 PMSID: 1809189
 * 用例标题: 透明加解密 - 取消原窗口的【类型】选项，替换为【加密方式】
 * 生成时间: 2026-01-23 15:56:32
 * 用例编写人：UT006252(杨通)
 */

describe('1809189-透明加解密 - 取消原窗口的【类型】选项，替换为【加密方式】', () => {
  beforeAll(async ({ device, uos, agent ,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    console.log('步骤1: 打开文管并全屏显示');
    await uos.showDesktop();
    //打开文件管理器并全屏显示
    await uos.showDesktop();
    console.log('打开文件管理器');
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();

    //前置进行保险箱删除操作确保环境干净
    console.log('步骤2: 双重保险清理保险箱环境');
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
  });

  test('1809189-透明加解密 - 取消原窗口的【类型】选项，替换为【加密方式】', async ({ device, agent, uos }) => {
    await agent.aiDoubleClick('保险箱图标');
    await agent.aiWaitFor('专属于个人的安全空间文本');
    await agent.aiTap('开启按钮');
    await agent.aiWaitFor('设置解锁方式文本');
    await agent.aiAssert('页面出现加密方式文本');
    await agent.aiTap('密匙加密文本');
    await agent.aiAssert('出现密匙加密和透明加密选项');
    await agent.aiAssert('密匙加密选项是被勾选的状态');
  }, { timeout: 1200000, tags: ['1809189', 'level2', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device,system}) => {
    console.log('4. afterEach: 每个测试后的清理');
    console.log('关闭文件管理器');
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); // 恢复桌面状态
  });
});
