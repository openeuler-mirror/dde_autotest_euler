/**
 * 用例 PMSID: 2015075
 * 用例标题: 【锁屏】【登录】【密码】密文状态下输入正确密码登录，再次锁屏后Ctrl+Z撤消
 * 生成时间: 2026-09-11
 * 用例编写人: UT002485（卢燕）
 */

describe('2015075-【锁屏】【登录】【密码】密文状态下输入正确密码登录，再次锁屏后Ctrl+Z撤消', () => {

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const passWord = env?.testPassword || process.env.TEST_PASSWORD || '';
    // 重置PAM失败计数器，清除之前测试残留的锁定状态
    await system.exec(`echo '${passWord}' | sudo faillog --reset --user uos 2>/dev/null || true`);
    await system.exec(`echo '${passWord}' | sudo pam_tally --reset --user uos 2>/dev/null || true`);
    await system.exec(`echo '${passWord}' | sudo pam_tally2 --reset --user uos 2>/dev/null || true`);
    // 如果停留在锁屏或登录界面，先解锁回到桌面
    const isAtDesktop = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
    if (!isAtDesktop) {
      console.log('当前不在桌面，尝试解锁');
      await system.exec('loginctl unlock-sessions 2>/dev/null || true');
      await system.exec('killall dde-lock 2>/dev/null || true');
      await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const isAtDesktopNow = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
      if (!isAtDesktopNow) {
        const hasPasswordInput = await agent.aiBoolean('界面显示密码输入框');
        if (!hasPasswordInput) {
          try {
            await agent.aiTap('用户头像或解锁按钮');
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (e) {}
        }
        await device.typeAscii(passWord);
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 8000));
      }
    }
    await uos.showDesktop();
    console.log('beforeAll 完成：已回到桌面环境');
  });

  beforeEach(async ({ device, uos, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('2015075-密文状态下输入正确密码登录，再次锁屏后Ctrl+Z撤消', async ({ device, agent, uos, system, env }) => {
    const passWord = env?.testPassword || process.env.TEST_PASSWORD || '';

    // 确保在桌面环境
    await agent.aiWaitFor('显示桌面，有任务栏或桌面图标', { timeoutMs: 30000 });

    // ========== 步骤1：进入锁屏界面，默认密文状态下输入正确的密码登录 ==========
    console.log('步骤1：进入锁屏界面，输入正确密码登录');
    await device.pressKey('Super', 'L');
    await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });
    await agent.logScreenshot('锁屏界面已显示', { content: '已进入锁屏界面，密码框处于默认密文状态' });

    // 输入正确密码并回车登录
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 预期1：解锁成功，登录到系统桌面
    await agent.aiWaitFor('显示桌面，有任务栏或桌面图标', { timeoutMs: 30000 });
    await agent.aiAssert('已成功解锁，登录到系统桌面');
    await agent.logScreenshot('解锁成功', { content: '输入正确密码后已解锁，回到系统桌面' });

    // ========== 步骤2：再次进入锁屏界面，使用Ctrl+Z进行撤消 ==========
    console.log('步骤2：再次进入锁屏界面，使用Ctrl+Z进行撤消');
    await device.pressKey('Super', 'L');
    await agent.aiWaitFor('锁屏界面已显示', { timeoutMs: 30000 });

    // 确认密码框当前为空（密文状态下没有圆点）
    await agent.aiAssert('锁屏密码框为空，没有显示任何密码圆点');

    // 在空密码框上执行 Ctrl+Z 撤消操作
    await device.pressKey('Ctrl', 'Z');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 预期2：，Ctrl+Z撤消操作无反应，密码框保持当前为空状态，无字符变化
    await agent.aiAssert('锁屏密码框仍为空，没有显示任何密码圆点');
    await agent.logScreenshot('Ctrl+Z撤消后', { content: '执行Ctrl+Z撤消后，密码框保持为空状态，无字符变化' });
  }, { timeout: 600000, tags: ['2015075', 'level3', 'smoke', 'remote'] });

  afterEach(async ({ device, uos, agent, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const passWord = env?.testPassword || process.env.TEST_PASSWORD || '';
    await device.releaseAllKeys();
    // 如果停留在锁屏界面，解锁回到桌面
    const isAtDesktop = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
    if (!isAtDesktop) {
      console.log('仍在锁屏界面，尝试解锁回到桌面');
      await system.exec('loginctl unlock-sessions 2>/dev/null || true');
      await system.exec('killall dde-lock 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 3000));
      const isAtDesktopNow = await agent.aiBoolean('显示桌面，有任务栏或桌面图标');
      if (!isAtDesktopNow) {
        const hasPasswordInput = await agent.aiBoolean('界面显示密码输入框');
        if (!hasPasswordInput) {
          try {
            await agent.aiTap('用户头像或解锁按钮');
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (e) {}
        }
        await device.typeAscii(passWord);
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 8000));
      }
    }
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const passWord = env?.testPassword || process.env.TEST_PASSWORD || '';
    // 重置PAM失败计数器
    await system.exec(`echo '${passWord}' | sudo faillog --reset --user uos 2>/dev/null || true`);
    await system.exec(`echo '${passWord}' | sudo pam_tally --reset --user uos 2>/dev/null || true`);
    await system.exec(`echo '${passWord}' | sudo pam_tally2 --reset --user uos 2>/dev/null || true`);
    await system.exec('systemctl restart deepin-authenticate 2>/dev/null || true');
    // 确保回到桌面
    await uos.showDesktop();
    console.log('afterAll 完成：测试环境已恢复');
  });
});
