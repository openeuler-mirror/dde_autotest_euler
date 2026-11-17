/**
 * 用例 PMSID: 1936545
 * 用例标题: 【文件列表支持分组】外设存储目录进行分组
 * 生成时间: 2026-08-06
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH;
const username = process.env.TEST_USERNAME;
const usbPath = `/media/${username}/${usbFlash}`;

describe('1936545-【文件列表支持分组】外设存储目录进行分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 在U盘中使用公共方法创建文件');

    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 直接调用公共方法在U盘创建分组测试文件（无需先打开文管）
    console.log('调用公共方法 createGroupedFileListTestFiles 创建分组测试文件');
    await createGroupedFileListTestFiles(system, usbPath);
    console.log('测试文件创建完成');
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到U盘目录
    console.log('准备步骤: 导航到U盘目录');
    await agent.aiTap(`文件管理器侧边栏的${usbFlash}磁盘`);
    await agent.aiWaitFor(`${usbFlash}磁盘已打开`, { timeout: 10000 });

    // 切换为列表视图
    console.log('准备步骤: 切换为列表视图');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('显示方式');
    await agent.aiWaitFor('显示方式子菜单已显示');
    await agent.aiTap('列表视图');
  });

  test('1936545-【文件列表支持分组】外设存储目录进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：进入U盘，检查默认是否分组
    // ============================================================
    console.log('===== 步骤1：检查U盘目录默认是否分组 =====');
    console.log('预期1：默认不分组');
    await agent.aiAssert('U盘目录中的文件没有分组显示，所有文件平铺展示');

    // ============================================================
    // 步骤2：通过右键设置分组方式为名称，检查按名称正确分组
    // ============================================================
    console.log('===== 步骤2：设置分组方式为名称，检查按名称分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('U盘目录中的文件按名称分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期2：能够按照名称正确分组');
    await agent.aiAssert('U盘目录中的文件按名称进行了分组');

    // ============================================================
    // 步骤3：通过右键设置分组方式为创建时间，检查按创建时间正确分组
    // ============================================================
    console.log('===== 步骤3：设置分组方式为创建时间，检查按创建时间分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的创建时间选项', { deepThink: true });
    console.log('预期3：能够按照创建时间正确分组');
    await agent.aiAssert('U盘目录中显示今天或者昨天等分组标题');

    // ============================================================
    // 步骤4：通过右键设置分组方式为大小，检查按大小正确分组
    // ============================================================
    console.log('===== 步骤4：设置分组方式为大小，检查按大小分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('U盘目录中的文件按大小分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期4：能够按照大小正确分组');
    await agent.aiAssert('U盘目录中的文件按大小进行了分组');

    // ============================================================
    // 步骤5：通过右键设置分组方式为类型，检查按类型正确分组
    // ============================================================
    console.log('===== 步骤5：设置分组方式为类型，检查按类型分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('U盘目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期5：能够按照类型正确分组');
    await agent.aiAssert('U盘目录中的文件按类型进行了分组');

    // ============================================================
    // 步骤6：通过右键设置分组方式为修改时间，检查按修改时间正确分组
    // ============================================================
    console.log('===== 步骤6：设置分组方式为修改时间，检查按修改时间分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('目录中出现今天、昨天的分组标题', { timeout: 10000, checkIntervalMs: 2000 });

    // ============================================================
    // 步骤7：选中所有文件，删除所有文件，检查所有分组隐藏
    // ============================================================
    console.log('===== 步骤7：选中所有文件，删除，检查分组隐藏 =====');

    // 全选所有文件
    await device.pressKey('Ctrl', 'A');

    // 按下 Delete 键触发删除
    await device.pressKey('Delete');
    // U盘删除会弹出"彻底删除"确认对话框
    await agent.aiWaitFor('彻底删除', { timeout: 5000 });
    // 点击"删除"按钮确认
    await agent.aiTap('删除');
    // 等待删除完成
    await new Promise(resolve => setTimeout(resolve, 120000));
    // 按 F5 刷新
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('预期7：所有文件删除后，所有分组隐藏');
    await agent.aiAssert('U盘目录中所有文件已被删除，不显示“今天”标题');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936545', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理U盘中的测试文件
    console.log('清理U盘中的测试文件');
    await system.exec(
      `rm -rf ${usbPath}/0_测试目录 ${usbPath}/4_子目录 ` +
      `&& rm -f ${usbPath}/A_文档.txt ${usbPath}/I_报告.docx ${usbPath}/a_笔记.txt ${usbPath}/3_文档.pdf ` +
      `&& rm -f ${usbPath}/Q_图片.png ${usbPath}/i_截图.png ${usbPath}/L_壁纸.bmp ${usbPath}/R_封面.png ${usbPath}/S_照片.jpg ` +
      `&& rm -f ${usbPath}/啊_影片.mp4 ${usbPath}/吧_教程.mp4 ${usbPath}/q_演示.avi ${usbPath}/测_演示.avi ` +
      `&& rm -f ${usbPath}/吃_音乐.mp3 ${usbPath}/的_播客.mp3 ${usbPath}/发_采样.wav ${usbPath}/m_铃声.mp3 ` +
      `&& rm -f ${usbPath}/起_压缩.zip ${usbPath}/日_资料.tar.gz ${usbPath}/世_备份.7z ${usbPath}/z_归档.rar ` +
      `&& rm -f ${usbPath}/_应用.desktop ${usbPath}/2_启动器.desktop ` +
      `&& rm -f ${usbPath}/+脚本.sh ${usbPath}/C_部署.sh ${usbPath}/g_安装.sh ` +
      `&& rm -f ${usbPath}/1_思维导图.xmind ${usbPath}/K_脑图.xmind ${usbPath}/B_表格.et ${usbPath}/D_手册.et ${usbPath}/p_数据.et ` +
      `&& rm -f ${usbPath}/J_笔记.txt ${usbPath}/h_草稿.txt`,
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