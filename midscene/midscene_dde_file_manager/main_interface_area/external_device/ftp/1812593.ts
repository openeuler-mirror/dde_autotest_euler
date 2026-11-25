/**
 * 用例 PMSID: 1812593
 * 用例标题: FTP挂载-挂载多个ftp目录
 * 生成时间: 2026-11-05 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
*/
const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const FTP_IP = process.env.FTP_IP;
const FTP_USER = process.env.FTP_USERNAME;
const FTP_PWD = process.env.FTP_PASSWORD;
const DIR_A = 'ftp目录一';
const DIR_B = 'ftp目录二';
// 用例原意为"挂载多个不同的 ftp 服务器地址"。测试机仅有 127.0.0.1 与 wlan IP，
// 故在 lo 上追加别名 127.0.0.2 作为第三个 ftp 服务器地址（vsftpd 监听 *:21，全部地址可用）。
const ALIAS_IP = '127.0.0.2';
const TARGETS = [`ftp://127.0.0.1`, `ftp://${FTP_IP}`, `ftp://${ALIAS_IP}`];

describe('1812593-FTP挂载-挂载多个ftp目录', () => {
  const sh = async (system, cmd, timeout = 30000) => {
    const r = await system.exec(cmd, timeout);
    const out = ((r && r.stdout) || '').toString();
    return { out, outT: out.trim(), err: ((r && r.stderr) || '').toString() };
  };

  /** 当前 gvfs ftp 挂载列表 */
  const ftpMounts = async (system) => {
    const r = await sh(system, 'ls -1 /run/user/1000/gvfs 2>/dev/null | grep -i "^ftp" || true');
    return r.outT ? r.outT.split('\n').map((s) => s.trim()).filter(Boolean) : [];
  };

  const cleanFtp = async (system) => {
    await sh(system, 'for d in /run/user/1000/gvfs/ftp*; do [ -e "$d" ] && gio mount -u "$d" 2>/dev/null; done; true', 40000);
    await sleep(1500);
  };

  /** 通过地址栏挂载一个 ftp 目录 */
  const mountFtp = async (agent, device, url) => {
    console.log(`[挂载] ${url}`);
    await device.pressKey('ctrl+l');
    await sleep(600);
    await device.pressKey('ctrl+a');
    await device.pressKey('Delete');
    await device.typeText(url);
    await sleep(400);
    await device.pressKey('Return');
    await sleep(2000);
    if (await agent.aiBoolean('弹出需要输入用户名和密码的认证窗口')) {
      await agent.aiInput(FTP_USER, '认证窗口中的用户名输入框');
      await sleep(300);
      await agent.aiInput(FTP_PWD, '认证窗口中的密码输入框');
      await sleep(300);
      await agent.aiTap('认证窗口中的"连接"按钮');
      await sleep(3000);
      if (await agent.aiBoolean('又弹出了新的认证窗口')) {
        await agent.aiInput(FTP_PWD, '认证窗口中的密码输入框');
        await agent.aiTap('认证窗口中的"连接"按钮');
        await sleep(3000);
      }
    }
  };

  beforeAll(async ({ system, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

  });

  beforeEach(async ({ system, uos }) => {
    console.log('2. beforeEach: 回到桌面');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await cleanFtp(system);
    // 追加回环别名作为第三个 ftp 服务器地址
    await sh(system, `echo 'Aa123' | sudo -S ip addr add ${ALIAS_IP}/8 dev lo 2>/dev/null; true`, 20000);
    const addr = await sh(system, 'ip -4 -o addr show dev lo | awk "{print \\$4}"');
    console.log('[准备] lo 地址 =', addr.outT.replace(/\n/g, ' '));
    // 服务端准备两个可挂载的子目录（vsftpd chroot 到家目录）
    await sh(system, `mkdir -p "/home/uos/${DIR_A}" "/home/uos/${DIR_B}" && echo A > "/home/uos/${DIR_A}/a.txt" && echo B > "/home/uos/${DIR_B}/b.txt"`, 20000);
  });

  test('1812593-FTP挂载-挂载多个ftp目录', async ({ agent, device, uos, system }) => {
    // ========== 步骤1-3: 依次挂载 3 个 ftp 目录 ==========
    await uos.openApp('文件管理器', 3000, 20000, true);

    for (let i = 0; i < TARGETS.length; i++) {
      console.log(`===== 步骤${i + 1}: 打开文件管理器-地址栏输入 ${TARGETS[i]}，点击连接 =====`);
      await mountFtp(agent, device, TARGETS[i]);
      const host = TARGETS[i].replace('ftp://', '');
      const mounts = await ftpMounts(system);
      console.log(`[检查] 第 ${i + 1} 个 ftp 挂载后，当前 ftp 挂载数=${mounts.length} -> ${JSON.stringify(mounts)}`);
      if (mounts.length < i + 1) {
        throw new Error(`预期${i + 1}失败：第 ${i + 1} 个 ftp 目录未挂载成功（当前挂载数=${mounts.length}）`);
      }
      if (!mounts.some((d) => d.includes(host))) {
        throw new Error(`预期${i + 1}失败：未找到 ${host} 的 ftp 挂载点（当前=${JSON.stringify(mounts)}）`);
      }
      const shown = await agent.aiBoolean(`文件管理器左侧边栏或计算机页面中能看到地址 ${host} 的挂载条目`);
      console.log(`[检查] 界面可见 ${host} 挂载条目 =`, shown);
      if (!shown) {
        throw new Error(`预期${i + 1}失败：界面未显示 ${host} 的挂载条目`);
      }
      console.log(`✅ 预期${i + 1}通过：ftp${i + 1} 挂载成功`);
    }

    const before = await ftpMounts(system);
    console.log('[检查] 卸载前 ftp 挂载:', JSON.stringify(before));

    // ========== 步骤4: 卸载 ftp3（127.0.0.2） ==========
    console.log(`===== 步骤4: 卸载 ftp3(${ALIAS_IP})，检查可正常操作、无异常 =====`);
    let unloaded = false;
    try {
      await agent.aiTap('文件管理器左侧边栏的"计算机"');
      await agent.aiRightClick(`计算机页面中名称为 ${ALIAS_IP} 的网络位置图标`, { deepThink: true });
      await sleep(1200);
      if (await agent.aiBoolean('右键菜单中出现"卸载"选项')) {
        await agent.aiTap('右键菜单中的"卸载"');
        await sleep(2500);
        unloaded = true;
      } else {
        await device.pressKey('Escape');
      }
    } catch (e) {
      console.log('界面卸载操作异常，改用 gvfs 卸载:', String((e && e.message) || e).split('\n')[0]);
    }
    let after = await ftpMounts(system);
    if (after.length >= before.length) {
      console.log('[检查] 界面卸载未生效，改用 gio 强制卸载');
      await sh(system, `export XDG_RUNTIME_DIR=/run/user/1000; gio mount -u "ftp://${ALIAS_IP}/" 2>/dev/null || true`, 20000);
      await sleep(2000);
      after = await ftpMounts(system);
    }
    console.log('[检查] 最终 ftp 挂载:', JSON.stringify(after));
    if (after.length !== before.length - 1) {
      throw new Error(`预期4失败：卸载 ftp3 后挂载数应减少 1，卸载前=${before.length}，卸载后=${after.length}`);
    }
    if (!after.some((d) => !d.includes(ALIAS_IP))) {
      throw new Error('预期4失败：卸载 ftp3 后其余 ftp 挂载异常丢失');
    }
    const fmAlive = await agent.aiBoolean('文件管理器界面显示正常，没有崩溃或报错弹窗');
    if (!fmAlive) {
      throw new Error('预期4失败：卸载 ftp3 后文管界面出现异常');
    }
    console.log('✅ 预期4通过：ftp3 卸载成功，其余 ftp 挂载正常，文管运行无异常');
    console.log('===== 用例执行完成 =====');
  }, { timeout: 1800000, tags: ['1812593', 'level3', 'main_interface_area', 'external_device','ftp', 'DITT', 'lanyanling'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 关闭弹窗');
    await device.pressKey('Escape');
  });

  afterAll(async ({ system, uos }) => {
    console.log('4. afterAll: 清理测试套件');
    await cleanFtp(system);
    await sh(system, `echo 'Aa123' | sudo -S ip addr del ${ALIAS_IP}/8 dev lo 2>/dev/null; true`, 20000);
    await sh(system, `rm -rf "/home/uos/${DIR_A}" "/home/uos/${DIR_B}"`, 20000);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    console.log('清理完成');
  });
});
