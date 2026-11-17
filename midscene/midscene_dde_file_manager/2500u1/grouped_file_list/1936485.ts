/**
 * 用例 PMSID: 1936485
 * 用例标题: 【文件列表支持分组】修改类型后，检查文件是否正确分组
 * 生成时间: 2026-07-16
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '~/Music';

describe('1936485-【文件列表支持分组】修改类型后，检查文件是否正确分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    // 创建分组测试文件
    console.log('准备步骤: 创建分组测试文件');
    await createGroupedFileListTestFiles(system, musicDir);

    // 额外创建7个用于重命名的txt文件
    console.log('准备步骤: 创建用于重命名的txt文件');
    const fileNames = Array.from({ length: 7 }, (_, i) => `1936485_${i + 1}.txt`);
    for (const name of fileNames) {
      await system.exec(`echo "test file for 1936485" > ${musicDir}/${name}`, 500);
    }

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

    // 设置按类型分组（右键右侧空白区域中间位置）
    console.log('准备步骤: 设置分组方式为类型');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文件已按类型分组显示', { timeout: 5000 });
  });

  test('1936485-【文件列表支持分组】修改类型后，检查文件是否正确分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：修改txt后缀为png，检查是否归到"图片"分组
    // ============================================================
    console.log('===== 步骤1：修改txt为png，检查是否归到图片分组 =====');
    await system.exec(`mv ${musicDir}/1936485_1.txt ${musicDir}/1936485_1.png`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期1：文本文档自动归类到图片分组中');
    await agent.aiAssert('1936485_1.png文件显示在图片分组中');

    // ============================================================
    // 步骤2：修改txt后缀为mp4，检查是否归到"视频"分组
    // ============================================================
    console.log('===== 步骤2：修改txt为mp4，检查是否归到视频分组 =====');
    await system.exec(`mv ${musicDir}/1936485_2.txt ${musicDir}/1936485_2.mp4`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiTap('R_封面.png');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Down');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('预期2：文本到视频分组中');
    await agent.aiAssert('1936485_2.mp4文件显示在视频分组中');
    await agent.aiScroll('视频分组标题', { direction: 'down', distance: 1 });
    console.log('预期2：文本文档自动归类到视频分组中');


    // ============================================================
    // 步骤3：修改txt后缀为.tar.gz，检查是否归到"压缩文件"分组
    // ============================================================
    console.log('===== 步骤3：修改txt为tar.gz，检查是否归到压缩文件分组 =====');
    await system.exec(`mv ${musicDir}/1936485_3.txt ${musicDir}/1936485_3.tar.gz`, 500);
    await agent.aiScroll('视频分组标题', { direction: 'down', distance: 1 });
    await agent.aiAssert('1936485_3.tar.gz文件显示在压缩文件分组中');

    // ============================================================
    // 步骤4：修改txt后缀为mp3，检查是否归到"音频"分组（第5个分组，可见区域）
    // ============================================================
    console.log('===== 步骤4：修改txt为mp3，检查是否归到音频分组 =====');
    await system.exec(`mv ${musicDir}/1936485_4.txt ${musicDir}/1936485_4.mp3`, 500);
    await new Promise(r => setTimeout(r, 2000));
    // F5刷新后视图回到顶部，音频为第5个分组，在初始可见区域
    console.log('预期4：文本文档自动归类到音频分组中');
    await agent.aiAssert('1936485_4.mp3文件显示在音频分组中');

    // ============================================================
    // 步骤5：修改txt后缀为.desktop，检查是否归到"应用程序"分组
    // ============================================================
    console.log('===== 步骤5：修改txt为desktop，检查是否归到应用程序分组 =====');
    await system.exec(`mv ${musicDir}/1936485_5.txt ${musicDir}/1936485_5.desktop`, 500);
    await new Promise(r => setTimeout(r, 2000));
    // 应用程序为第7个分组，需要向下滚动
    console.log('预期5：文本文档自动归类到应用程序分组中');
    await agent.aiScroll('目录分组', { direction: 'down', distance: 5 });
    await agent.aiAssert('1936485_5.desktop文件显示在应用程序分组中');

    // ============================================================
    // 步骤6：修改txt后缀为.sh，检查是否归到"可执行程序"分组
    // ============================================================
    console.log('===== 步骤6：修改txt为sh，检查是否归到可执行程序分组 =====');
    await system.exec(`mv ${musicDir}/1936485_6.txt ${musicDir}/1936485_6.sh`, 500);
    await new Promise(r => setTimeout(r, 2000));
    // 可执行程序为第8个分组，需要向下滚动
    console.log('预期6：文本文档自动归类到可执行程序分组中');
    await agent.aiAssert('1936485_6.sh文件显示在可执行程序分组中');

    // ============================================================
    // 步骤7：修改txt后缀为.xmind，检查是否归到"未知"分组
    // ============================================================
    console.log('===== 步骤7：修改txt为xmind，检查是否归到未知分组 =====');
    await system.exec(`mv ${musicDir}/1936485_7.txt ${musicDir}/1936485_7.xmind`, 500);
    await new Promise(r => setTimeout(r, 2000));
    // 未知为第9个分组，需要向下滚动
    console.log('预期7：文本文档自动归类到未知分组中');
    await agent.aiAssert('1936485_7.xmind文件显示在未知分组中');
    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936485', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 清理所有测试文件
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
      `&& rm -f ${musicDir}/J_笔记.txt ${musicDir}/h_草稿.txt ` +
      `&& rm -f ${musicDir}/1936485_1.txt ${musicDir}/1936485_2.txt ${musicDir}/1936485_3.txt ` +
      `${musicDir}/1936485_4.txt ${musicDir}/1936485_5.txt ${musicDir}/1936485_6.txt ${musicDir}/1936485_7.txt ` +
      `&& rm -f ${musicDir}/1936485_1.png ${musicDir}/1936485_2.mp4 ${musicDir}/1936485_3.tar.gz ` +
      `${musicDir}/1936485_4.mp3 ${musicDir}/1936485_5.desktop ${musicDir}/1936485_6.sh ${musicDir}/1936485_7.xmind`,
      500
    );

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});