/**
 * 用例 PMSID: 1968629
 * 用例标题: 【保险箱】通过旧密码重置密码
 * 生成时间: 2026-05-06 16:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1968629-【保险箱】通过旧密码重置密码', () => {
  const encryption_key = 'Uos123!!';
  const new_encryption_key = 'Aa@12345';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);
  });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 准备步骤: 关闭所有文件管理器窗口
    console.log('准备步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1968629-【保险箱】通过旧密码重置密码', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 创建密钥加密保险箱
    console.log('准备步骤: 创建密钥加密保险箱');
    await createPasswordVault(uos, env, agent, device, system);
    await system.exec('killall dde-file-manager');

    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor("文件管理器窗口已打开");

    // 步骤 2: 右击侧边栏保险箱
    console.log('步骤 2: 右击侧边栏保险箱');
    await agent.aiRightClick('侧边栏保险箱');
    await agent.aiWaitFor("出现右击菜单");

    // 预期 2: 右击菜单中有"重置密码"选项
    console.log('预期 2: 右击菜单中有"重置密码"选项');
    await agent.aiAssert('右击菜单中有重置密码选项');

    // 步骤 3: 点击"重置密码"
    console.log('步骤 3: 点击"重置密码"');
    await agent.aiTap('重置密码');
    await agent.aiWaitFor("弹出重置密码对话框");

    // 步骤 4: 输入旧密码和新密码
    console.log('步骤 4: 输入旧密码和新密码');
    await agent.aiTap('输入旧密码输入框');
    await device.typeText(encryption_key, false);
    await agent.aiTap('输入新密码输入框');
    await device.typeText(new_encryption_key, false);
    await agent.aiTap('重复密码输入框');
    await device.typeText(new_encryption_key, false);
    await agent.aiWaitFor("重置密码对话框中的重置密码按钮可用");

    // 步骤 5: 点击重置密码按钮
    console.log('步骤 5: 点击重置密码按钮');
    await agent.aiTap('重置密码对话框中的重置密码按钮');
    await agent.aiWaitFor("弹出密码重置成功对话框",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 6: 点击"确定"按钮
    console.log('步骤 6: 点击"确定"');
    await agent.aiTap('密码重置成功对话框中的确定按钮');
    await agent.aiWaitFor("密码重置成功对话框和密码重置对话框消失",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 7: 右击侧边栏保险箱
    console.log('步骤 7: 右击侧边栏保险箱');
    await agent.aiRightClick('侧边栏保险箱');
    await agent.aiWaitFor("出现右击菜单");

    // 步骤 8: 点击"立即上锁"
    console.log('步骤 8: 点击"立即上锁"');
    await agent.aiTap('立即上锁');

    // 步骤 9: 点击侧边栏保险箱
    console.log('步骤 9: 点击侧边栏保险箱');
    await agent.aiTap('侧边栏保险箱');

    // 预期 9: 弹出解锁保险箱对话框
    console.log('预期 9: 弹出解锁保险箱对话框');
    await agent.aiAssert('弹出解锁保险箱对话框');

    // 步骤 10: 输入密码
    console.log('步骤 10: 输入密码');
    await agent.aiTap('解锁保险箱对话框中的密码字符');
    await device.typeText(new_encryption_key, false);
    await agent.aiWaitFor("解锁保险箱对话框中的解锁按钮可用");

    // 步骤 11: 点击解锁按钮
    console.log('步骤 11: 点击解锁按钮');
    await agent.aiTap('解锁保险箱对话框中的解锁按钮');
    await agent.aiWaitFor("跳转到保险箱目录",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期 11: 当前目录是保险箱目录
    console.log('预期 11: 当前目录是保险箱目录');
    await agent.aiAssert('当前目录是保险箱目录');

  }, { timeout: 1200000, tags: ['1968629','level3', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'reset password'] });
});