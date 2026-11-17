/**
 * 用例 PMSID: 1964017
 * 用例标题: 【文件列表支持分组】分组间距增大
 * 生成时间: 2026-08-06
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '~/Music';

describe('1964017-【文件列表支持分组】分组间距增大', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 调用公共方法创建测试文件');

    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 调用公共方法在音乐目录创建分组测试文件
    console.log('调用公共方法 createGroupedFileListTestFiles 创建分组测试文件');
    await createGroupedFileListTestFiles(system, musicDir);
    console.log('测试文件创建完成');
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到音乐目录
    console.log('准备步骤: 导航到音乐目录');
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });

  });

  test('1964017-【文件列表支持分组】分组间距增大', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：目录内右键进行类型分组
    // ============================================================
    console.log('===== 步骤1：右键设置分组方式为类型 =====');

    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('音乐目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期1：音乐目录按类型分组显示');
    await agent.aiAssert('音乐目录中按类型进行了分组');
    await agent.aiAssert('音乐目录中显示目录分组标题');
    await agent.aiAssert('音乐目录中显示文档分组标题');

    // ============================================================
    // 步骤2：验证两个不同类型的分组之间有空白
    // ============================================================
    console.log('===== 步骤2：验证不同类型分组之间有空白间距 =====');

    console.log('预期2：目录分组和文档分组之间有空白间距');
    await agent.aiAssert('4_子目录和文档分组的标题没有重合，中间有空白间距', { deepThink: true });

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1964017', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理 Music 目录中的测试文件（与公共方法创建的文件对应）
    console.log('删除音乐目录中的测试文件');
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
      `&& rm -f ${musicDir}/J_笔记.txt ${musicDir}/h_草稿.txt`,
      500
    );

    // 关闭文管进程
    console.log('关闭文管进程');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});