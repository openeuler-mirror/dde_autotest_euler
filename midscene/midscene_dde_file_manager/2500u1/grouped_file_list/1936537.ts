/**
 * 用例 PMSID: 1936537
 * 用例标题: 【文件列表支持分组】对SFTP目录进行分组
 * 生成时间: 2026-08-06
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const sftpIp = process.env.SFTP_IP;
const sftpDir = 'sftp/upload';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeExec(system, cmd) {
  console.log('[LOG] shell ->', cmd);
  try {
    const res = await system.exec(cmd);
    if (res && res.stdout) console.log('[LOG] shell stdout ->', res.stdout.trim());
    return res;
  } catch (e) {
    console.error('[ERROR] shell failed ->', cmd, e);
    throw e;
  }
}

describe('1936537-【文件列表支持分组】对SFTP目录进行分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 挂载SFTP并创建测试文件');

    const { clearEnvironment, closeFileManager, cleanSftpMounts, SftpMount, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 清理已有SFTP挂载
    console.log('清理已有SFTP挂载');
    await uos.showDesktop();
    await device.pressKey('Super+E');
    await sleep(3000);
    await uos.maximizeWindow();
    await cleanSftpMounts(agent, system);

    // 挂载SFTP
    console.log('挂载SFTP');
    await SftpMount(agent, system, device);
    await sleep(3000);

    // 获取gvfs挂载路径
    let result = await safeExec(system, `id -u`);
    const uid = result.stdout.trim();
    const gvfsPath = `/run/user/${uid}/gvfs/sftp:host=${sftpIp}/${sftpDir}/1936537`;

    // 创建1936537目录，使用公共方法创建测试文件（确保创建时间、大小等维度覆盖完整）
    console.log('创建1936537目录并使用公共方法创建测试文件');
    await safeExec(system, `mkdir -p ${gvfsPath}`);
    await createGroupedFileListTestFiles(system, gvfsPath);
    console.log('测试文件创建完成');
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 通过侧边栏点击已挂载的SFTP，然后双击1936537文件夹进入
    console.log('准备步骤: 进入SFTP目录');
    await agent.aiTap(`文件管理器侧边栏的${sftpIp}文本`);
    await agent.aiWaitFor('SFTP目录已加载', { timeout: 15000 });
    await agent.aiDoubleClick('1936537文件夹图标', 1000);
    await agent.aiWaitFor('1936537目录已打开', { timeout: 10000 });

  });

  test('1936537-【文件列表支持分组】对SFTP目录进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：检查共享目录默认是否分组
    // ============================================================
    console.log('===== 步骤1：检查SFTP共享目录默认是否分组 =====');
    console.log('预期1：共享目录中的文件未分组显示，所有文件平铺展示');
    await agent.aiAssert('共享目录中的文件未分组显示，所有文件平铺展示');

    // ============================================================
    // 步骤2：通过右键设置分组方式为名称，检查按名称正确分组
    // ============================================================
    console.log('===== 步骤2：设置分组方式为名称，检查按名称分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('共享目录中的文件按名称分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期2：能够按照名称正确分组');
    await agent.aiAssert('共享目录中的文件按名称进行了分组');

    // ============================================================
    // 步骤3：通过右键设置分组方式为创建时间，检查按创建时间正确分组
    // ============================================================
    console.log('===== 步骤3：设置分组方式为创建时间，检查按创建时间分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的创建时间选项', { deepThink: true });
    await agent.aiWaitFor('共享目录中显示"更早"分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期3：能够按照创建时间正确分组');

    // ============================================================
    // 步骤4：通过右键设置分组方式为大小，检查按大小正确分组
    // ============================================================
    console.log('===== 步骤4：设置分组方式为大小，检查按大小分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('共享目录中的文件按大小分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期4：能够按照大小正确分组');
    // ============================================================
    // 步骤5：通过右键设置分组方式为类型，检查按类型正确分组
    // ============================================================
    console.log('===== 步骤5：设置分组方式为类型，检查按类型分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('共享目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期5：能够按照类型正确分组');

    // ============================================================
    // 步骤6：通过右键设置分组方式为修改时间，检查按修改时间正确分组
    // ============================================================
    console.log('===== 步骤6：设置分组方式为修改时间，检查按修改时间分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('共享目录中显示"更早"分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期6：能够按照修改时间正确分组');

    // ============================================================
    // 步骤7：选中所有文件，删除所有文件，检查所有分组隐藏
    // ============================================================
    console.log('===== 步骤7：选中所有文件，删除，检查分组隐藏 =====');

    await agent.aiTap('右侧文件区域中间区域的空白处');
    // 全选所有文件
    await device.pressKey('Ctrl', 'A');

    // 按下 Delete 键触发删除
    await device.pressKey('Delete');
    // SFTP网络路径删除会弹出"彻底删除"确认对话框
    await agent.aiWaitFor('彻底删除', { timeout: 5000 });
    // 点击"删除"按钮确认
    await agent.aiTap('删除');
    // 休眠15s，等待删除完成
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // 按 F5 刷新
    await device.pressKey('F5');
    await sleep(1000);

    console.log('预期7：所有文件删除后，所有分组隐藏');
    await agent.aiAssert('共享目录中所有文件已被删除，不显示更早分组标题');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936537', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理SFTP目录中的测试文件
    console.log('清理SFTP目录中的测试文件');
    let result = await safeExec(system, `id -u`);
    const uid = result.stdout.trim();
    const gvfsPath = `/run/user/${uid}/gvfs/sftp:host=${sftpIp}/${sftpDir}/1936537`;
    await safeExec(system,
      `rm -rf ${gvfsPath}/0_测试目录 ${gvfsPath}/4_子目录 ` +
      `&& rm -f ${gvfsPath}/A_文档.txt ${gvfsPath}/I_报告.docx ${gvfsPath}/a_笔记.txt ${gvfsPath}/3_文档.pdf ` +
      `&& rm -f ${gvfsPath}/Q_图片.png ${gvfsPath}/i_截图.png ${gvfsPath}/L_壁纸.bmp ${gvfsPath}/R_封面.png ${gvfsPath}/S_照片.jpg ` +
      `&& rm -f ${gvfsPath}/啊_影片.mp4 ${gvfsPath}/吧_教程.mp4 ${gvfsPath}/q_演示.avi ${gvfsPath}/测_演示.avi ` +
      `&& rm -f ${gvfsPath}/吃_音乐.mp3 ${gvfsPath}/的_播客.mp3 ${gvfsPath}/发_采样.wav ${gvfsPath}/m_铃声.mp3 ` +
      `&& rm -f ${gvfsPath}/起_压缩.zip ${gvfsPath}/日_资料.tar.gz ${gvfsPath}/世_备份.7z ${gvfsPath}/z_归档.rar ` +
      `&& rm -f ${gvfsPath}/_应用.desktop ${gvfsPath}/2_启动器.desktop ` +
      `&& rm -f ${gvfsPath}/+脚本.sh ${gvfsPath}/C_部署.sh ${gvfsPath}/g_安装.sh ` +
      `&& rm -f ${gvfsPath}/1_思维导图.xmind ${gvfsPath}/K_脑图.xmind ${gvfsPath}/B_表格.et ${gvfsPath}/D_手册.et ${gvfsPath}/p_数据.et ` +
      `&& rm -f ${gvfsPath}/J_笔记.txt ${gvfsPath}/h_草稿.txt`
    );

    // 关闭文管进程
    console.log('关闭文管进程');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment, cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 卸载SFTP
    console.log('卸载SFTP');
    await uos.showDesktop();
    await device.pressKey('Super+E');
    await sleep(2000);
    await uos.maximizeWindow();
    await cleanSftpMounts(agent, system);

    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});