/**
 * 用例 PMSID: 1958049
 * 用例标题: 【保险箱】忘记密码，通过密钥解锁保险箱
 * 生成时间: 2026-05-06 16:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1958049-【保险箱】忘记密码，通过密钥解锁保险箱', () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const encryption_key = 'Uos123!!';
  const encryption_file = 'recoveryKey.key'; // 密钥文件默认为/home/${username}/recoveryKey.key

  const lock_time = 5; // 5分钟, 选项有5分钟、10分钟、20分钟

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
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
  
  test('1958049-【保险箱】忘记密码，通过密钥解锁保险箱', async ({ device, agent, uos, env, system }) => {    
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

    // 预期 2: 右击菜单中有"立即上锁"选项
    console.log('预期 2: 右击菜单中有"立即上锁"选项');
    await agent.aiAssert('右击菜单中有立即上锁选项');

    // 步骤 3: 点击"立即上锁"
    console.log('步骤 3: 点击"立即上锁"');
    await agent.aiTap('立即上锁');

    // 步骤 4: 点击侧边栏保险箱
    console.log('步骤 4: 点击侧边栏保险箱');
    await agent.aiTap('侧边栏保险箱');

    // 预期 4: 弹出解锁保险箱对话框
    console.log('预期 4: 弹出解锁保险箱对话框');
    await agent.aiAssert('弹出解锁保险箱对话框');

    // 步骤 5: 点击忘记密码
    console.log('步骤 5: 点击忘记密码');
    await agent.aiTap('解锁保险箱对话框中的忘记密码');
    await agent.aiWaitFor("跳转到使用密钥解锁保险箱页面",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 6: 点击浏览按钮
    console.log('步骤 6: 点击浏览按钮');
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiWaitFor("弹出文件选择对话框");

    // 步骤 7: 点击文件选择对话框中的${encryption_file}
    console.log(`步骤 7: 点击文件选择对话框中的${encryption_file}`);
    await agent.aiTap("文件选择对话框中的左侧边栏中的主目录选项");
    await agent.aiWaitFor(`文件选择对话框中的右侧内容窗口中有${encryption_file}文件图标`);
    await agent.aiTap(`文件选择对话框中的${encryption_file}`);
    await agent.aiWaitFor("文件选择对话框中的打开按钮变为可用状态");

    // 步骤 8: 点击打开按钮
    console.log('步骤 8: 点击打开按钮');
    await agent.aiTap("文件选择对话框中的打开按钮");
    await agent.aiWaitFor('文件选择对话框关闭');
    await agent.aiWaitFor('密钥解锁按钮变为可用状态');

    // 步骤 9: 点击密钥解锁按钮
    console.log('步骤 9: 点击密钥解锁按钮');
    await agent.aiTap("使用密钥解锁按钮");
    await agent.aiWaitFor("解锁保险箱窗口关闭");

    // 预期 9: 保险箱已解锁
    console.log('预期 9: 保险箱已解锁');
    await agent.aiAssert('文件管理器页面跳转到保险箱目录');

  }, { timeout: 1200000, tags: ['1958049','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'unlock', 'encryption_file'] });
});