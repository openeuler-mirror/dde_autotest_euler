/**
 * 用例 PMSID: 1936487
 * 用例标题: 【文件列表支持分组】分组按照类型后，"文件和文件夹混合排序"失效
 * 生成时间: 2026-07-29
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '~/Music';

describe('1936487-【文件列表支持分组】分组按照类型后，"文件和文件夹混合排序"失效', () => {
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

    // 额外创建几个目录，用于验证混合排序（目录名与已有文件名称交错，使用中文首字符）
    console.log('创建额外目录用于混合排序验证');
    await system.exec(`mkdir -p ${musicDir}/啊_项目`, 500);
    await system.exec(`mkdir -p ${musicDir}/吧_工具`, 500);
    await system.exec(`mkdir -p ${musicDir}/的_文档`, 500);
    await system.exec(`mkdir -p ${musicDir}/发_资料`, 500);
    await system.exec(`mkdir -p ${musicDir}/起_备份`, 500);
    console.log('额外目录创建完成');
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

    // 前置条件：切换为按类型分组
    console.log('前置条件: 设置分组方式为类型');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('音乐目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 前置条件：勾选"文件和文件夹混合排序"
    console.log('前置条件: 打开设置，勾选文件和文件夹混合排序');
    await agent.aiTap('文件管理器右上角主菜单',{deepThink:true});
    await agent.aiWaitFor('主菜单已打开', { timeout: 3000 });
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置界面已打开', { timeout: 5000 });
    await agent.aiTap('文件和目录选项');
    await agent.aiWaitFor('文件和目录设置已打开', { timeout: 3000 });
    // 勾选混合排序（若已勾选，再点一次不会取消，确保生效）
    await agent.aiTap('文件和文件夹混合排序');
    await agent.aiAssert('文件和文件夹混合排序已勾选');
    // 关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiWaitFor('设置窗口已关闭', { timeout: 3000 });

    
  });

  test('1936487-【文件列表支持分组】分组按照类型后，"文件和文件夹混合排序"失效', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：分组方式设为"无"，按名称排序，验证混合排序
    // ============================================================
    console.log('===== 步骤1：分组方式设为无，按名称排序，检查混合排序 =====');

    // 设置分组方式为"无"
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的无选项', { deepThink: true });

    // 设置排序方式为"名称"（混合排序模式下，文件和文件夹应该混合在一起）
    await agent.aiTap('标题栏中的排序方式右侧的下拉菜单',{deepThink:true});
    await agent.aiWaitFor('排序方式下拉菜单已显示', { timeout: 3000 });
    await agent.aiTap('菜单中的名称选项');

    console.log('预期1：文件和文件夹混合排序（文件夹不单独聚合在一起）');
    await agent.aiAssert('音乐目录中的文件和文件夹混合排序，文件夹不单独聚合在一起');
    console.log('步骤1验证通过：文件和文件夹混合排序');

    // ============================================================
    // 步骤2：分组方式设为"类型"，按名称排序，验证正常按类型分组
    // ============================================================
    console.log('===== 步骤2：分组方式设为类型，按名称排序，检查是否按类型分组 =====');

    // 设置分组方式为"类型"
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('音乐目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 设置排序方式为"名称"
    await agent.aiTap('标题栏中的排序方式右侧的下拉菜单',{deepThink:true});
    await agent.aiWaitFor('排序方式下拉菜单已显示', { timeout: 3000 });
    await agent.aiTap('菜单中的名称选项');
    await agent.aiWaitFor('文件已按名称排序', { timeout: 5000 });

    console.log('预期2：正常按照类型分组（目录分组、文档分组等）');
    // 验证存在类型分组标题
    await agent.aiAssert('音乐目录中显示目录分组标题');
    await agent.aiAssert('音乐目录中显示文档分组标题');

    // 验证分组内文件按名称排序（非混合排序）
    await agent.aiAssert('目录分组内文件按名称排序');

    console.log('步骤2验证通过：按类型分组且分组内按名称排序');
    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936487', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理 Music 目录中的测试文件（与公共方法创建的文件对应）
    console.log('删除音乐目录中的测试文件');
    await system.exec(
      `rm -rf ${musicDir}/0_测试目录 ${musicDir}/4_子目录 ` +
      `&& rm -rf ${musicDir}/啊_项目 ${musicDir}/吧_工具 ${musicDir}/的_文档 ${musicDir}/发_资料 ${musicDir}/起_备份 ` +
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