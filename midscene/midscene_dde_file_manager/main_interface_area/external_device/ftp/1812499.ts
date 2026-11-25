/**
 * 用例 PMSID: 1812499
 * 用例标题: 停掉ftp服务
 * 生成时间: 2026-11-05 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
*/

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const FTP_IP = process.env.FTP_IP;
const PWD = process.env.TEST_PASSWORD;

describe('1812499-停掉ftp服务', () => {
  const sh = async (system, cmd, timeout = 30000) => {
    const r = await system.exec(cmd, timeout);
    const out = ((r && r.stdout) || '').toString();
    return { out, outT: out.trim(), err: ((r && r.stderr) || '').toString() };
  };

  const serviceActive = async (system) => {
    const r = await sh(system, 'systemctl is-active vsftpd 2>/dev/null || true');
    return r.outT;
  };


  beforeAll(async ({ system, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, system }) => {
    console.log('2. beforeEach: 回到桌面');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 前置：确保 ftp 服务处于运行状态
    await sh(system, `echo '${PWD}' | sudo -S systemctl start vsftpd 2>/dev/null; true`, 30000);
    await sleep(1500);
    console.log('[前置] vsftpd 状态 =', await serviceActive(system));
  });

  test('1812499-停掉ftp服务', async ({ agent, device, uos, system }) => {
    // ========== 步骤1: 停掉 ftp 服务 ==========
    console.log('===== 步骤1: 停掉 ftp 服务 =====');
    await sh(system, `echo '${PWD}' | sudo -S systemctl stop vsftpd 2>/dev/null; true`, 30000);
    await sleep(2000);
    const active = await serviceActive(system);
    console.log('[检查] 停服务后 vsftpd 状态 =', active);
    if (active === 'active') {
      throw new Error('停掉 ftp 服务失败：vsftpd 仍为 active');
    }
    console.log('✅ ftp 服务已停止（vsftpd =', active, '）');

    // ========== 访问 ftp，检查文管表现 ==========
    console.log('===== 检查1: ftp 服务已停，文管通过"连接到服务器"访问 ftp，应给出错误提示 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);

    // 走文管"菜单-连接到服务器"路径（该路径挂载失败时会弹出"挂载失败"提示框）
    await agent.aiTap('文件管理器窗口右上角的三条横线主菜单按钮', { deepThink: true });
    await sleep(800);
    await agent.aiTap('主菜单中的"连接到服务器"');
    await sleep(2000);
    await agent.aiTap('对话框中的协议下拉框', { deepThink: true });
    await sleep(800);
    await agent.aiTap('下拉列表中的"ftp"选项');
    await sleep(800);
    // 协议已含 ftp://，地址框只填 IP
    await device.pressKey('Tab');
    await device.pressKey('Delete');
    await sleep(500);
    await device.typeText(`${FTP_IP}`);
    await agent.aiTap('连接按钮');
    await sleep(15000);

    let errShown = await agent.aiBoolean('文件管理器界面出现了"挂载失败""无法连接到""连接失败"之类的错误提示（弹窗或页面提示）');
    if (!errShown) {
      // 再等一次（部分环境错误提示延迟出现）
      await sleep(5000);
      errShown = await agent.aiBoolean('文件管理器界面出现了"挂载失败""无法连接到""连接失败"之类的错误提示（弹窗或页面提示）');
    }
    const errText = await agent.aiQuery('当前屏幕上出现过的错误提示文字，返回字符串数组');
    console.log('[检查] 出现错误提示 =', errShown, ' 提示内容 =', JSON.stringify(errText));
    if (!errShown) {
      throw new Error('预期1失败：ftp 服务停止后访问未给出错误提示');
    }
    console.log('✅ 预期1通过：ftp 服务停止后访问给出错误提示');

    // ========== 检查2: 文管本身仍可正常使用 ==========
    console.log('===== 检查2: 关闭错误提示后，文管仍可正常浏览本地目录 =====');
    try {
      if (await agent.aiBoolean('错误提示弹窗中有"确定"按钮')) {
        await agent.aiTap('错误提示弹窗中的"确定"按钮');
      }
    } catch (e) {
      console.log('关闭错误弹窗异常（忽略）:', String((e && e.message) || e).split('\n')[0]);
    }
    await sleep(1000);
    await device.pressKey('Escape');
    await sleep(800);
    await agent.aiTap('文件管理器左侧边栏的桌面目录');
    await sleep(2500);
    const fmOk = await agent.aiBoolean('文件管理器正常显示桌面目录内的文件，界面无崩溃、无卡死');
    if (!fmOk) {
      throw new Error('预期1失败：ftp 服务停止后文管无法正常使用');
    }
    console.log('✅ 预期1通过：文管仍可正常运行，仅对 ftp 访问给出错误提示');
    console.log('===== 用例执行完成 =====');
  }, { timeout: 1200000, tags: ['1812499', 'level3', 'main_interface_area', 'external_device','ftp', 'DITT', 'lanyanling'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 关闭弹窗');
    await device.pressKey('Escape');
  });

  afterAll(async ({ system, uos }) => {
    console.log('4. afterAll: 恢复 ftp 服务并清理环境');
    await sh(system, `echo '${PWD}' | sudo -S systemctl start vsftpd 2>/dev/null; true`, 30000);
    await sleep(1500);
    console.log('[清理] vsftpd 状态 =', await serviceActive(system));
    await system.exec("kill -TERM $(pidof dde-file-manager)");

  });
});
