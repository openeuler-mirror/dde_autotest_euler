// @ts-nocheck

/**
 * 用例 PMSID: 1978201
 * 用例标题: 【保险箱】忘记密码删除保险箱
 * 生成时间: 2026-04-10
 * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1978201-【保险箱】忘记密码删除保险箱', () => {
 beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });

  test('1978201-【保险箱】忘记密码删除保险箱', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1978201-【保险箱】忘记密码删除保险箱 ===');
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    console.log('步骤1: 右键左侧栏的"保险箱"，等待右键弹框显示正常');
    // await agent.aiTap('计算机文本');
    await agent.aiRightClick('保险箱文本');
    await agent.aiWaitFor('右键菜单已显示');
    console.log('✅ 右键弹框显示正常');

    // 步骤2：点击"删除保险箱"，删除保险箱弹框显示正常
    console.log('步骤2: 点击"删除保险箱"，删除保险箱弹框显示正常');
    await agent.aiTap('删除保险箱选项');
    await agent.aiWaitFor('删除保险箱弹框已显示');
    console.log('✅ 删除保险箱弹框显示正常');

    // 步骤3：在删除保险弹框页面点击"密钥删除"
    console.log('步骤3: 点击"密钥删除"');
    await agent.aiTap('密钥删除按钮');
    await agent.aiWaitFor('密钥删除页面已显示');
    console.log('✅ 密钥删除页面已显示');

    // 步骤4：在删除保险箱弹框中，点击"..."的高亮按钮，选中"recoveryKey.key"文件，点击"打开"
    console.log('步骤4: 点击"..."按钮，选中recoveryKey.key文件，点击打开');
    await agent.aiTap('选择密钥文件的...按钮');
    await agent.aiWaitFor('文件选择对话框已打开');
    await agent.aiWaitFor('recoveryKey.key文件可见');
    await agent.aiTap('recoveryKey.key文件');
    await agent.aiTap('打开按钮');
    console.log('✅ 已选中recoveryKey.key文件并打开');

    // 步骤5：点击"删除"
    console.log('步骤5: 点击"删除"按钮');
    await agent.aiTap('删除按钮');
    console.log('✅ 已点击删除按钮');
    await agent.aiHover('删除文件保险箱须要认证')
    // await agent.aiTap("含有请输入密码文字的输入框");
    await device.typeText(`${process.env.TEST_PASSWORD}`);
    await agent.aiTap("确定");

    // 断言：保险箱删除成功
    console.log('断言: 验证保险箱删除成功');
    await agent.aiWaitFor('保险箱删除成功提示');
    await agent.aiAssert('保险箱已删除');
    console.log('✅ 保险箱删除成功');

    console.log('✅ 1978201用例测试完成');





  }, { timeout: 1200000, tags: ['1978201', 'level2', 'smoke', 'vault', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const TEST_USERNAME = process.env.TEST_USERNAME;
    // 清理密钥文件
    await system.exec(`rm -f /home/${TEST_USERNAME}/recoveryKey.key`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log('关闭文件管理器');
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    const result = await agent.aiBoolean('删除文件保险箱须要认证的弹框');
    if (result) {
      console.log('删除文件保险箱须要认证的弹框已显示，关闭弹框');
      await agent.aiTap('删除文件保险箱须要认证的弹框右上角的X按钮');
    }
    else {
      console.log('删除文件保险箱须要认证的弹框未显示');
    }
    // 双重保险清理文件管理器环境
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager');
  });
});
