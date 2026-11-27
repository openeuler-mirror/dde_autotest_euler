/**
 * 用例 PMSID: 1809863
 * 用例标题: 【撤销交互】快捷键面板包含撤销和恢复快捷键
 * 生成时间: 2026-07-10 17:17:53
 * 用例编写人: UT002411（胡戬）
 */

// 功能函数：初始化文管测试环境
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin.dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1809863-【撤销交互】快捷键面板包含撤销和恢复快捷键', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  test('1809863-【撤销交互】快捷键面板包含撤销和恢复快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：在启动器中找到并且启动文件管理器
    console.log('步骤1：在启动器中启动文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 20000 });

    // 步骤2：按住Ctrl+Shift+/键不松开，显示文件管理器的快捷键面板
    console.log('步骤2：长按Ctrl+Shift+/键，显示快捷键面板');
    await device.keyDown("ctrl+shift+slash");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiAssert("看到快捷键面板");

    // 断言2：快捷面板中显示撤销快捷键为Ctrl+Z，恢复快捷键为Ctrl+Y
    console.log('断言2：快捷面板中显示撤销快捷键为Ctrl+Z，恢复快捷键为Ctrl+Y');
    await agent.aiAssert('快捷键面板中显示撤销快捷键为Ctrl+Z');
    await agent.aiAssert('快捷键面板中显示恢复快捷键为Ctrl+Y');
    console.log('断言2通过：快捷键面板包含撤销和恢复快捷键');

    // 释放组合键并关闭快捷键面板
    await device.keyUp('ctrl+shift+slash');
    await device.pressKey('Esc');

  }, {
    timeout: 600000,
    tags: ['1809863', 'level2', 'cancel', 'hujian']
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
