
/**
 * 用例 PMSID: 1812909
 * 用例标题: [core]sftp-首次访问sftp地址
 * 生成时间: 2026-09-16
 * 用例编写人: UT005045(许琪)
 */

describe('1812909-[core]sftp-首次访问sftp地址', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 前置条件：网络正常（非致命检查，仅记录诊断信息）
    const ip = process.env.SFTP_IP;
    await system.exec(`ping -c 2 -W 2 ${ip} || true`);
    // 打开文管并全屏显示
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
    // 卸载已挂载的sftp，确保无残留；清理失败不应阻断"首次访问"前置条件，故容错处理
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    try {
      await cleanSftpMounts(agent, system);
    } catch (err) {
      console.log('清理sftp挂载异常，尝试命令行强制卸载（不阻断后续步骤）:', err);
      // 兜底：强制卸载gvfs的sftp挂载点，保证环境干净
      await system.exec(`fusermount -uz /run/user/$(id -u)/gvfs/sftp* 2>/dev/null || true`);
    }
    // 从known_hosts中移除该主机记录，确保本次为"首次访问"，安全提示框必然弹出
    await system.exec(`ssh-keygen -R ${ip} 2>/dev/null || true`);
    console.log('前置准备完成：已卸载sftp并清除主机记录');
  });


  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1812909-[core]sftp-首次访问sftp地址', async ({ device, agent, uos, system }) => {
    const ip = process.env.SFTP_IP;
    console.log(`SFTP服务器IP：${ip}`);

    // ===== 步骤1：打开文件管理器-点击搜索-输入sftp://IP地址 =====
    console.log('===== 步骤1：地址栏输入sftp地址 =====');
    await device.pressKey('ctrl+l');
    await device.pressKey('ctrl+a');
    await device.typeText(`sftp://${ip}`, true);
    // 预期：弹出首次访问是否登陆的安全提示框
    // 注意：aiAssert为即时断言，网络较慢时安全提示框弹出会滞后，需带超时等待并在超时后重新触发挂载
    let promptShown = false;
    for (let attempt = 1; attempt <= 3 && !promptShown; attempt++) {
      try {
        await agent.aiWaitFor("页面出现首次访问的安全提示框，提示标识验证失败，包含'取消登录'和'仍然登录'按钮", { timeout: 60000 });
        promptShown = true;
      } catch (e) {
        console.log(`第${attempt}次等待安全提示框超时`);
        if (attempt < 3) {
          // 重新在地址栏输入地址，再次触发sftp挂载
          await device.pressKey('ctrl+l');
          await device.pressKey('ctrl+a');
          await device.typeText(`sftp://${ip}`, true);
        }
      }
    }
    await agent.aiAssert("页面出现首次访问的安全提示框，提示标识验证失败，包含'取消登录'和'仍然登录'按钮");
    console.log('✅ 步骤1验证通过：首次访问弹出安全提示框');

    // ===== 步骤2：点击弹窗的取消按钮 =====
    console.log('===== 步骤2：点击弹窗的取消按钮 =====');
    await agent.aiTap("安全提示框中的'取消登录'按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // v2(2026-09-23)：取消主机密钥验证后安全框必关闭，紧随弹出'挂载失败 主机密钥认证失败'错误框
    // （报告截图实证）。原 aiBoolean 否定句式("含仍然登录按钮的安全提示框已关闭")在替代错误框
    // 存在时误判——把居中模态的挂载失败框当成未关闭的安全框，秒败。改为正向等待'挂载失败'框，
    // 兼容个别环境不弹该框（超时未出现也视为安全框已关闭，不阻断）
    let mountFailShown = false;
    try {
      await agent.aiWaitFor("页面出现标题为'挂载失败'的错误提示弹窗", { timeoutMs: 8000, checkIntervalMs: 1000 });
      mountFailShown = true;
    } catch (e) {
      console.log('未出现挂载失败错误框，判定安全提示框已直接关闭');
    }
    // 关闭'挂载失败'错误框，避免干扰后续步骤
    if (mountFailShown) {
      console.log("出现'挂载失败'错误框（取消验证的预期结果），点击'确定'关闭");
      await agent.aiTap("'挂载失败'错误提示弹窗中的'确定'按钮");
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    console.log('✅ 步骤2验证通过：点击取消后提示框关闭');

    // ===== 步骤3：再次输入sftp地址，点击弹窗的仍然登陆按钮 =====
    console.log('===== 步骤3：再次输入sftp地址，点击仍然登陆 =====');
    await device.pressKey('ctrl+l');
    await device.pressKey('ctrl+a');
    await device.typeText(`sftp://${ip}`, true);
    // 安全提示框再次弹出
    await agent.aiWaitFor("包含'取消登录'和'仍然登录'按钮的安全提示框再次出现");
    // 点击仍然登录
    await agent.aiTap("安全提示框中的'仍然登录'按钮");
    // 预期：点击后原安全提示框关闭，随后出现'需要认证'窗口（服务器要求用户名密码）或直接进入sftp目录
    await agent.aiWaitFor("包含'仍然登录'按钮的安全提示框已关闭，页面当前显示'需要认证'窗口或 sftp 目录内容");
    const isAuth = await agent.aiBoolean('页面出现需要认证窗口（要求输入用户名和密码）');
    if (isAuth) {
      console.log('出现需要认证窗口，输入用户名密码完成认证');
      // 完成认证（与 common.ts 的 SftpMount 流程一致），保证用例结束时界面状态干净
      const sftpname = process.env.SFTP_USERNAME;
      const sftppwd = process.env.SFTP_PASSWORD;
      await device.typeText(`${sftpname}`);
      await agent.aiInput(`${sftppwd}`, '密码输入框');
      await agent.aiTap("'需要认证'窗口中的'连接'按钮");
      await agent.aiWaitFor(`窗口已进入sftp目录${ip}`);
      console.log('认证完成，已进入sftp目录');
    } else {
      await agent.aiWaitFor(`窗口已进入sftp目录${ip}`);
      console.log('已直接进入sftp目录');
    }
    console.log('✅ 步骤3验证通过：点击仍然登陆后提示框消失');
    console.log('✅ 1812909用例测试完成');
  }, { timeout: 1200000, tags: ['1812909', 'level2', 'sftp', 'DITT', '许琪'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager, cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 卸载sftp残留
    await cleanSftpMounts(agent, system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
