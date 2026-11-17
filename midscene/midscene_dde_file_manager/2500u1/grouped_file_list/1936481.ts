/**
 * 用例 PMSID: 1936481
 * 用例标题: 【文件列表支持分组】修改名称后，检查文件是否正确分组
 * 生成时间: 2026-07-17
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '$HOME/Music';

describe('1936481-【文件列表支持分组】修改名称后，检查文件是否正确分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    // 创建分组测试文件
    console.log('准备步骤: 创建分组测试文件');
    await createGroupedFileListTestFiles(system, musicDir);

    // 额外创建3个用于重命名的文件（步骤4/6/7需要）
    console.log('准备步骤: 创建额外测试文件');
    await system.exec(`echo "test file for 19364815 step4" > ${musicDir}/Q_音乐测试.mp3`, 500);
    await system.exec(`echo "test file for 19364815 step6" > ${musicDir}/机_压缩测试.zip`, 500);
    await system.exec(`echo "test file for 19364815 step7" > ${musicDir}/起_应用测试.desktop`, 500);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到音乐目录
    console.log('准备步骤: 导航到音乐目录');
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });

    // 切换为列表视图
    console.log('准备步骤: 切换为列表视图');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('显示方式');
    await agent.aiWaitFor('显示方式子菜单已显示');
    await agent.aiTap('列表视图');

    // 设置按名称分组（右键右侧空白区域中间位置）
    console.log('准备步骤: 设置分组方式为名称');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('文件已按名称分组显示', { timeout: 5000 });
  });

  test('1936481-【文件列表支持分组】修改名称后，检查文件是否正确分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：修改目录名0→BC，检查是否从0-9移到"A-H"分组（第2个分组，可见区域）
    // ============================================================
    console.log('===== 步骤1：修改目录名0→BC，检查是否归到A-H分组 =====');
    await system.exec(`mv ${musicDir}/0_测试目录 ${musicDir}/BC_测试目录`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期1：目录从0-9分组中移到A-H分组中');
    await agent.aiAssert('BC_测试目录显示在A-H分组中');

    // ============================================================
    // 步骤2：修改文档名A→J&K，检查是否从A-H移到"I-P"分组（第3个分组，可见区域）
    // ============================================================
    console.log('===== 步骤2：修改文档名A→J&K，检查是否归到I-P分组 =====');
    await system.exec(`mv ${musicDir}/A_文档.txt "${musicDir}/J&K_文档.txt"`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期2：文档从A-H分组中移到I-P分组中');
    await agent.aiAssert('J&K_文档.txt显示在I-P分组中');

    // ============================================================
    // 步骤3：修改音乐名Q→123*测试，检查是否从Q-Z移到"0-9"分组（第1个分组，可见区域）
    // ============================================================
    console.log('===== 步骤3：修改音乐名Q→123*测试，检查是否归到0-9分组 =====');
    await system.exec(`mv ${musicDir}/Q_音乐测试.mp3 "${musicDir}/123*测试_音乐测试.mp3"`, 500);
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期3：音乐从Q-Z分组中移到0-9分组中');
    await agent.aiAssert('123*测试_音乐测试.mp3显示在0-9分组中');

    // ============================================================
    // 步骤4：修改图片名i→Z测试，检查是否从I-P移到"Q-Z"分组（第4个分组，可见区域）
    // ============================================================
    console.log('===== 步骤4：修改图片名i→Z测试，检查是否归到Q-Z分组 =====');
    await system.exec(`mv ${musicDir}/i_截图.png ${musicDir}/Z测试_截图.png`, 500);
    await agent.aiTap('Q_图片.png或者Z测试_截图');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('down');
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log('预期4：图片从I-P分组中移到Q-Z分组中');
    await agent.aiAssert('Z测试_截图.png显示在Q-Z分组中');

    // ============================================================
    // 步骤5：修改脚本名+→A%123测试人员，检查是否从其他移到"拼音A-H"分组（第5个分组，F5后可见）
    // ============================================================
    console.log('===== 步骤5：修改脚本名+→A%123测试人员，检查是否归到拼音A-H分组 =====');
    await system.exec(`mv ${musicDir}/+脚本.sh "${musicDir}/A%123测试人员_脚本.sh"`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // F5刷新后视图回到顶部，拼音A-H为第5个分组，可见区域
    console.log('预期5：可执行文件从其他分组中移到拼音A-H分组中');
    await agent.aiAssert('A%123测试人员_脚本.sh显示在拼音A-H分组中');

    // ============================================================
    // 步骤6：修改视频名啊→咖啡小姐，检查是否从拼音A-H移到"拼音I-P"分组（第6个分组，需滚动）
    // ============================================================
    console.log('===== 步骤6：修改视频名啊→咖啡小姐，检查是否归到拼音I-P分组 =====');
    await system.exec(`mv ${musicDir}/啊_影片.mp4 ${musicDir}/咖啡小姐_影片.mp4`, 500);
    await agent.aiScroll('拼音A-H分组', { direction: 'down', distance: 5 });
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期6：视频从拼音A-H分组中移到拼音I-P分组中');
    await agent.aiAssert('咖啡小姐_影片.mp4显示在拼音I-P分组中');

    // ============================================================
    // 步骤7：修改压缩文件名机→奇怪，检查是否从拼音I-P移到"拼音Q-Z"分组（第7个分组，需滚动）
    // ============================================================
    console.log('===== 步骤7：修改压缩文件名机→奇怪，检查是否归到拼音Q-Z分组 =====');
    await system.exec(`mv ${musicDir}/机_压缩测试.zip ${musicDir}/奇怪_压缩测试.zip`, 500);
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期7：压缩文件从拼音I-P分组中移到拼音Q-Z分组中');
    await agent.aiAssert('奇怪_压缩测试.zip显示在拼音Q-Z分组中');

    // ============================================================
    // 步骤8：修改应用名起→&123，检查是否从拼音Q-Z移到"其他"分组（第8个分组，需滚动）
    // ============================================================
    console.log('===== 步骤8：修改应用名起→&123，检查是否归到其他分组 =====');
    await system.exec(`mv ${musicDir}/起_应用测试.desktop "${musicDir}/&123_应用测试.desktop"`, 500);
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiScroll('拼音Q-Z分组', { direction: 'down', distance: 5 });
    console.log('预期8：应用程序从拼音Q-Z分组中移到其他分组中');
    await agent.aiAssert('&123_应用测试.desktop显示在其他分组中');
    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936481', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 清理所有测试文件（公共方法创建的 + 脚本内创建的原始文件 + 重命名后的文件）
    await system.exec(
      `rm -rf ${musicDir}/0_测试目录 ${musicDir}/4_子目录 ` +
      `&& rm -f ${musicDir}/A_文档.txt ${musicDir}/I_报告.docx ${musicDir}/a_笔记.txt ${musicDir}/3_文档.pdf ` +
      `&& rm -f ${musicDir}/Q_图片.png ${musicDir}/i_截图.png ${musicDir}/L_壁纸.bmp ${musicDir}/R_封面.png ${musicDir}/S_照片.jpg ` +
      `&& rm -f ${musicDir}/啊_影片.mp4 ${musicDir}/吧_教程.mp4 ${musicDir}/q_演示.avi ${musicDir}/测_演示.avi ` +
      `&& rm -f ${musicDir}/吃_音乐.mp3 ${musicDir}/的_播客.mp3 ${musicDir}/发_采样.wav ${musicDir}/m_铃声.mp3 ` +
      `&& rm -f ${musicDir}/起_压缩.zip ${musicDir}/日_资料.tar.gz ${musicDir}/世_备份.7z ${musicDir}/z_归档.rar ` +
      `&& rm -f ${musicDir}/_应用.desktop ${musicDir}/2_启动器.desktop ` +
      `&& rm -f ${musicDir}/+脚本.sh ${musicDir}/C_部署.sh ${musicDir}/g_安装.sh ` +
      `&& rm -f ${musicDir}/1_思维导图.xmind ${musicDir}/K_脑图.xmind ${musicDir}/B_表格.et ${musicDir}/D_手册.et ${musicDir}/p_数据.et ` +
      `&& rm -f ${musicDir}/J_笔记.txt ${musicDir}/h_草稿.txt ${musicDir}/Q测试_截图.txt ` +
      // 脚本内创建的原始文件
      `&& rm -f ${musicDir}/Q_音乐测试.mp3 ${musicDir}/机_压缩测试.zip ${musicDir}/起_应用测试.desktop ` +
      // 重命名后的文件
      `&& rm -rf ${musicDir}/BC_测试目录 ` +
      `&& rm -f "${musicDir}/J&K_文档.txt" "${musicDir}/Z测试_截图.png" "${musicDir}/123*测试_音乐测试.mp3" ` +
      `"${musicDir}/咖啡小姐_影片.mp4" "${musicDir}/奇怪_压缩测试.zip" "${musicDir}/&123_应用测试.desktop" ` +
      `"${musicDir}/A%123测试人员_脚本.sh"`,
      500
    );

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});