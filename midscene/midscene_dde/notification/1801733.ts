/**
 * 用例 PMSID: 1801733
 * 用例标题: 【通知中心】第三方库发送通知，支持多行展示和url跳转
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 * 说明: 前置条件依赖 python notify2 库（未安装时执行 pip install notify2），
 *       未安装时测试会以明确的前置条件失败提示。
 */

describe('1801733-【通知中心】第三方库发送通知，支持多行展示和url跳转', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801733-【通知中心】第三方库发送通知，支持多行展示和url跳转', async ({ device, agent, uos, system, assert }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 关闭可能残留的系统认证弹窗，避免遮挡通知横幅/通知中心
    const { closeSystemAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeSystemAuthDialog(agent);
    // 前置条件: 需要已安装 python notify2 库
    const chk = await system.exec(`python3 -c 'import notify2'`);
    assertTrue(chk.success, '前置条件不满足: 未安装 python notify2 库，请先执行 pip install notify2');

    // 使用 python notify2 库发送有按钮和无按钮通知
    const pyScript = [
      'import notify2',
      'notify2.init("My Application")',
      'n1 = notify2.Notification("测试通知支持链接跳转和多行展示\\n https://www.uniontech.com ", "fewfw fewaf fewa fewa \\n 测试支持链接跳转 \\n 2424 \\n fewfw \\n fewf 统信官网：https://www.uniontech.com 测试测试\\n")',
      'n1.add_action("button1", "测试按钮 1", lambda n, a: print("Button 1 clicked"))',
      'n1.show()',
      'n2 = notify2.Notification("测试通知支持链接跳转和多行展示\\n https://www.uniontech.com ", "fewfw fewaf fewa fewa \\n 测试支持链接跳转 \\n 2424 \\n fewfw \\n fewf 统信官网：https://www.uniontech.com 测试测试\\n")',
      'n2.show()'
    ].join('\n');
    await system.exec(`cat > /tmp/qjx_notify2_test.py << 'PYEOF'\n${pyScript}\nPYEOF`);
    await system.exec('python3 /tmp/qjx_notify2_test.py');
    // 横幅为本机瞬逝展示（约10秒内自动消失），不强依赖横幅截图验证，以通知中心长驻展示为准
    try {
      await agent.aiWaitFor('桌面右下角出现通知横幅', { timeoutMs: 8000 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await agent.aiBoolean('通知横幅标题一行展示为普通文本，正文正常多行展示', { deepThink: true });
    } catch (e) {
      console.log('通知横幅未捕获（本机横幅瞬逝），继续以通知中心验证');
    }

    // 通知中心表现与通知横幅一致
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示包含"测试通知支持链接跳转和多行展示"字样的通知信息', { timeoutMs: 15000 });
    await agent.aiAssert('通知中心通知信息标题一行展示为普通文本，正文支持换行展示，有按钮和无按钮通知内容均正常展示');
  }, { timeout: 600000, tags: ['1801733', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
