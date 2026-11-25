/**
 * 用例 PMSID: 1812539
 * 用例标题: 【FTP】【Bug200759转】连接Linux的FTP服务，字符集编码选择UTF-8
 * 生成时间: 2026-11-03
 * 用例编写人: UT005160(蓝雁玲)
*/
const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const FTP_IP = process.env.FTP_IP;
const FTP_USER = process.env.FTP_USERNAME;
const FTP_PWD = process.env.FTP_PASSWORD;
const CN_DIR = '中文目录测试';
const CN_FILE = '中文名称文件.txt';

describe('1812539-【FTP】【Bug200759转】连接Linux的FTP服务，字符集编码选择UTF-8', () => {
  const sh = async (system, cmd, timeout = 30000) => {
    const r = await system.exec(cmd, timeout);
    const out = ((r && r.stdout) || '').toString();
    return { out, outT: out.trim(), err: ((r && r.stderr) || '').toString() };
  };

  /** 文管主菜单 -> 连接到服务器 */
  const openConnectDialog = async (agent) => {
    await agent.aiTap('文件管理器窗口右上角的三条横线主菜单按钮', { deepThink: true });
    await sleep(800);
    await agent.aiTap('主菜单中的"连接到服务器"');
    await sleep(1500);
  };

  /** 当前已挂载的 ftp 目录（gvfs 视角） */
  const ftpMounts = async (system) => {
    const r = await sh(system, 'ls -1 /run/user/1000/gvfs 2>/dev/null | grep -i "ftp" || true');
    return r.outT ? r.outT.split('\n').filter(Boolean) : [];
  };

  /** 清理本次用例可能残留的 ftp 挂载 */
  const cleanFtp = async (system) => {
    await sh(system, 'for d in /run/user/1000/gvfs/ftp*; do [ -e "$d" ] && gio mount -u "$d" 2>/dev/null; done; true', 30000);
    await sleep(1000);
  };

  /** "重启系统"等价操作：重启桌面插件与文管进程 */
  const restartDesktopEnv = async (system, device, agent) => {
    // ==========重启系统 ==========
    console.log('===== 重启系统 =====');
    await device.pressKey("Control", "Alt", "Delete");
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('重启按钮',{ deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    //await agent.aiInput(`${process.env.TEST_PASSWORD}`, '密码输入框');
    await device.typeAscii(`${process.env.TEST_PASSWORD}`);
    await agent.aiTap('登录按钮');
    await agent.aiWaitFor("桌面已显示", { timeoutMs: 10000,checkIntervalMs: 2000 });

    console.log('系统重启完成，桌面已恢复');
  };

  beforeAll(async ({ system, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, system }) => {
    console.log('2. beforeEach: 回到桌面');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await cleanFtp(system);
    // 准备带中文名称的目录与文件（FTP 服务端 chroot 到家目录）
    await sh(system, `mkdir -p "/home/uos/${CN_DIR}" && echo "内容" > "/home/uos/${CN_DIR}/${CN_FILE}" && echo "根目录中文文件" > "/home/uos/${CN_FILE}"`, 20000);
    const chk = await sh(system, `ls -1 /home/uos | grep -c "^${CN_DIR}$"`);
    console.log('[准备] 服务端中文目录存在性 =', chk.outT);
  });

  test('1812539-【FTP】【Bug200759转】连接Linux的FTP服务，字符集编码选择UTF-8', async ({ agent, device, uos, system }) => {
    // ========== 前置：菜单 -> 连接到服务器，协议 ftp，字符集 UTF-8 ==========
    console.log('===== 前置: 打开文管-菜单-连接到服务器，协议选 ftp，字符集选 UTF-8 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await openConnectDialog(agent);
    // ========== 步骤1: 输入FTP服务器地址，点击连接 ==========
    // 协议选择 ftp
    console.log('===== 步骤1: 输入 Linux 系统的 FTP 服务器地址，点击连接 =====');
    await agent.aiTap('对话框中的协议下拉框', { deepThink: true });
    await sleep(800);
    await agent.aiTap('下拉列表中的"ftp"选项');
    await sleep(800);

    //输入地址
    await device.pressKey('Tab');
    await device.pressKey('Delete');
    await sleep(500);
    await device.typeText(`${FTP_IP}`);
    await sleep(500);

    // 字符集编码选择 UTF-8
    await agent.aiTap('对话框中的字符集编码下拉框', { deepThink: true });
    await sleep(800);
    await agent.aiTap('下拉列表中的"UTF-8"选项');
    await sleep(800);
    const utf8Selected = await agent.aiBoolean('对话框的字符集编码下拉框当前显示为 UTF-8');
    console.log('[检查] 字符集编码已选中 UTF-8 =', utf8Selected);
    if (!utf8Selected) {
      throw new Error('前置失败：字符集编码未能选择为 UTF-8');
    }

    await agent.aiTap('"连接"按钮');
    await sleep(3000);

    // ========== 步骤2: 输入正确的用户名和密码，点击连接 ==========
    console.log('===== 步骤2: 输入正确的用户名和密码，点击连接 =====');
    await agent.aiInput(FTP_USER, '认证窗口中的用户名输入框');
    await sleep(300);
    await agent.aiInput(FTP_PWD, '认证窗口中的密码输入框');
    await sleep(300);
    await agent.aiTap('认证窗口中的"连接"按钮');
    await sleep(3000);

    const opened = await agent.aiBoolean(`文件管理器已打开 ftp 目录，列表中能看到"${CN_DIR}"文件夹`);
    console.log('[检查] FTP 目录已打开 =', opened);
    if (!opened) {
      const m = await ftpMounts(system);
      throw new Error(`预期2失败：认证后未打开 ftp 目录，当前 gvfs ftp 挂载=${JSON.stringify(m)}`);
    }
    console.log('✅ 预期2通过：认证成功，已打开 ftp 目录');

    // ========== 步骤3: 检查FTP目录内部文件名称 ==========
    console.log('===== 步骤3: 检查 FTP 目录内部文件名称 =====');
    const nameOk = await agent.aiBoolean(`列表中"${CN_DIR}"等中文名称完整显示，没有出现乱码（如问号、锟斤拷、方框等）`);
    console.log('[检查] 中文名称显示正常 =', nameOk);
    if (!nameOk) {
      throw new Error('预期3失败：FTP 目录内中文文件名称显示异常（出现乱码）');
    }
    await agent.aiDoubleClick(`文件管理器列表中的"${CN_DIR}"文件夹`);
    await sleep(2500);
    const innerOk = await agent.aiBoolean(`进入目录后列表中能看到"${CN_FILE}"，名称中文显示正常`);
    console.log(`[检查] 目录内 ${CN_FILE} 显示正常 =`, innerOk);
    if (!innerOk) {
      throw new Error(`预期3失败：目录内 ${CN_FILE} 名称显示异常`);
    }
    console.log('✅ 预期3通过：FTP 目录内文件名称中文显示正常，无乱码');

    // ========== 步骤4: 重启系统后重新连接，检查配置与文件名 ==========
    console.log('===== 步骤4: 重启系统后重新连接 FTP，检查配置与文件名 =====');
    await restartDesktopEnv(system, device, agent);
    await uos.openApp('文件管理器', 3000, 20000, true);

    // 重新连接：走"连接到服务器"并再次选择 ftp + UTF-8
    await openConnectDialog(agent);
    await agent.aiWaitFor('"连接到服务器"对话框已弹出');
    const keepFtp = await agent.aiBoolean('对话框中的协议显示为 ftp');
    console.log('[检查] 重启后协议仍为 ftp =', keepFtp);
    await agent.aiTap('对话框中的协议下拉框', { deepThink: true });
    await sleep(700);
    await agent.aiTap('下拉列表中的"ftp"选项');
    await sleep(700);

    await device.pressKey('Tab');
    await device.pressKey('Delete');
    await sleep(500);
    await device.typeText(`${FTP_IP}`);

    await agent.aiTap('对话框中的字符集编码下拉框', { deepThink: true });
    await sleep(700);
    await agent.aiTap('下拉列表中的"UTF-8"选项');
    await sleep(700);

    await agent.aiTap('对话框右下角的"连接"按钮');
    await sleep(3000);
    if (await agent.aiBoolean('弹出了需要输入用户名和密码的认证窗口')) {
      await agent.aiInput(FTP_USER, '认证窗口中的用户名输入框');
      await sleep(300);
      await agent.aiInput(FTP_PWD, '认证窗口中的密码输入框');
      await sleep(300);
      await agent.aiTap('认证窗口中的"连接"按钮');
      await sleep(3500);
    }
    const reOk = await agent.aiBoolean(`文件管理器已打开 ftp 目录，列表中能看到"${CN_DIR}"文件夹且名称中文显示正常`);
    console.log('[检查] 重启后重连 FTP 显示正常 =', reOk);
    if (!reOk) {
      throw new Error('预期4失败：重启系统后重新连接 FTP，目录或中文文件名显示异常');
    }
    console.log('✅ 预期4通过：重启后重新连接 FTP，配置一致且文件名称中文显示正常');
    console.log('===== 用例执行完成 =====');
  }, { timeout: 1800000, tags: ['1812539', 'level3', 'main_interface_area', 'external_device','ftp', 'DITT', 'lanyanling'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 关闭弹窗');
    await device.pressKey('Escape');
  });

  afterAll(async ({ system, uos }) => {
    console.log('4. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanFtp(system);
    await sh(system, `rm -rf "/home/uos/${CN_DIR}" "/home/uos/${CN_FILE}"`, 20000);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
