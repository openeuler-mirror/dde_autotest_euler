/**
 * 用例 PMSID: 1936551
 * 用例标题: 【文件列表支持分组】文件选择对话框显示分组
 * 生成时间: 2026-07-14
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const docDir = '~/Documents';

describe('1936551-【文件列表支持分组】文件选择对话框显示分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 清理 Documents 中的旧测试文件
    await system.exec(
      `rm -rf ${docDir}/0_测试目录 ${docDir}/4_子目录 ` +
      `&& rm -f ${docDir}/A_文档.txt ${docDir}/I_报告.docx ${docDir}/a_笔记.txt ${docDir}/3_文档.pdf ` +
      `&& rm -f ${docDir}/Q_图片.png ${docDir}/i_截图.png ${docDir}/L_壁纸.bmp ${docDir}/R_封面.png ${docDir}/S_照片.jpg ` +
      `&& rm -f ${docDir}/啊_影片.mp4 ${docDir}/吧_教程.mp4 ${docDir}/q_演示.avi ${docDir}/测_演示.avi ` +
      `&& rm -f ${docDir}/吃_音乐.mp3 ${docDir}/的_播客.mp3 ${docDir}/发_采样.wav ${docDir}/m_铃声.mp3 ` +
      `&& rm -f ${docDir}/起_压缩.zip ${docDir}/日_资料.tar.gz ${docDir}/世_备份.7z ${docDir}/z_归档.rar ` +
      `&& rm -f ${docDir}/_应用.desktop ${docDir}/2_启动器.desktop ` +
      `&& rm -f ${docDir}/+脚本.sh ${docDir}/C_部署.sh ${docDir}/g_安装.sh ` +
      `&& rm -f ${docDir}/1_思维导图.xmind ${docDir}/K_脑图.xmind ${docDir}/B_表格.et ${docDir}/D_手册.et ${docDir}/p_数据.et ` +
      `&& rm -f ${docDir}/J_笔记.txt ${docDir}/h_草稿.txt`,
      500
    );

    // 调用公共方法在文档目录创建分组测试文件
    const { createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createGroupedFileListTestFiles(system, docDir);

    // 打开文件管理器，导航至文档目录，设置分组方式为「类型」
    console.log('前置条件：打开文件管理器，设置文档目录分组方式为类型');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('文件管理器左侧栏的文档目录');
    await agent.aiWaitFor('文档目录已打开', { timeout: 5000 });

    // 通过右键设置分组方式为「类型」
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文档目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 关闭文件管理器
    await system.exec('killall dde-file-manager', 500);
  });

  test('1936551-【文件列表支持分组】文件选择对话框显示分组', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文本编辑器
    console.log('===== 步骤1：打开文本编辑器 =====');
    await uos.openApp('文本编辑器', { maximizeWindow: true });
    await agent.aiWaitFor('文本编辑器界面已显示');

    // 步骤2：点击主菜单，选择"打开文件"
    console.log('===== 步骤2：点击主菜单 → 打开文件 =====');
    await agent.aiTap('文本编辑器右上角的主菜单按钮');
    await agent.aiWaitFor('主菜单已展开');
    await agent.aiTap('打开文件选项');
    await agent.aiWaitFor('文管选择窗口已打开');

    // 步骤3：在文件选择对话框中导航至文档目录
    console.log('===== 步骤3：在文件选择对话框中导航至文档目录 =====');
    await agent.aiTap('文件选择对话框左侧栏的文档目录');
    await agent.aiWaitFor('文档目录已加载', { timeout: 5000 });

    // 预期1：文件选择对话框中正确显示文档目录的分组信息
    console.log('预期1：文件选择对话框中正确显示文档目录的分组信息');
    await agent.aiWaitFor('文档目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    await agent.aiAssert('文档目录中按类型进行了分组');

    // 步骤4：在文件选择对话框空白区域右键
    console.log('===== 步骤4：在文件选择对话框空白区域右键 =====');
    await agent.aiRightClick('文件选择对话框内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');

    // 预期2：右键菜单中包含"分组方式"选项
    console.log('预期2：右键菜单中包含分组方式选项');
    await agent.aiAssert('右键菜单中显示分组方式选项');

    // 关闭文件选择对话框
    await device.pressKey('Escape');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936551', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理 Documents 中的测试文件
    await system.exec(
      `rm -rf ${docDir}/0_测试目录 ${docDir}/4_子目录 ` +
      `&& rm -f ${docDir}/A_文档.txt ${docDir}/I_报告.docx ${docDir}/a_笔记.txt ${docDir}/3_文档.pdf ` +
      `&& rm -f ${docDir}/Q_图片.png ${docDir}/i_截图.png ${docDir}/L_壁纸.bmp ${docDir}/R_封面.png ${docDir}/S_照片.jpg ` +
      `&& rm -f ${docDir}/啊_影片.mp4 ${docDir}/吧_教程.mp4 ${docDir}/q_演示.avi ${docDir}/测_演示.avi ` +
      `&& rm -f ${docDir}/吃_音乐.mp3 ${docDir}/的_播客.mp3 ${docDir}/发_采样.wav ${docDir}/m_铃声.mp3 ` +
      `&& rm -f ${docDir}/起_压缩.zip ${docDir}/日_资料.tar.gz ${docDir}/世_备份.7z ${docDir}/z_归档.rar ` +
      `&& rm -f ${docDir}/_应用.desktop ${docDir}/2_启动器.desktop ` +
      `&& rm -f ${docDir}/+脚本.sh ${docDir}/C_部署.sh ${docDir}/g_安装.sh ` +
      `&& rm -f ${docDir}/1_思维导图.xmind ${docDir}/K_脑图.xmind ${docDir}/B_表格.et ${docDir}/D_手册.et ${docDir}/p_数据.et ` +
      `&& rm -f ${docDir}/J_笔记.txt ${docDir}/h_草稿.txt`,
      500
    );

    // 关闭所有相关进程
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
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