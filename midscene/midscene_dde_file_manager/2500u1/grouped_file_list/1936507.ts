/**
 * 用例 PMSID: 1936507
 * 用例标题: 【文件列表支持分组】树形视图模式下分组后进行搜索
 * 生成时间: 2026-07-16
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '~/Music';

describe('1936507-【文件列表支持分组】树形视图模式下分组后进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    // 创建分组测试文件
    console.log('准备步骤: 创建分组测试文件');
    await createGroupedFileListTestFiles(system, musicDir);

    // 额外创建含关键字的txt文件（文件名关键字和内容关键字分开）
    console.log('准备步骤: 创建含关键字的测试文件');
    // 文件名含关键字 "1936507_fn" 的3个文件
    await system.exec(`echo "test file for filename search" > ${musicDir}/1936507_fn_test_1.txt`, 500);
    await system.exec(`echo "test file for filename search" > ${musicDir}/1936507_fn_test_2.txt`, 500);
    await system.exec(`echo "test file for filename search" > ${musicDir}/1936507_fn_test_3.txt`, 500);
    // 内容含关键字 "1936507_content" 但文件名不含的3个文件
    await system.exec(`echo "1936507_content for fulltext search verification" > ${musicDir}/search_a.txt`, 500);
    await system.exec(`echo "1936507_content for fulltext search verification" > ${musicDir}/search_b.txt`, 500);
    await system.exec(`echo "1936507_content for fulltext search verification" > ${musicDir}/search_c.txt`, 500);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 先导航到音乐目录
    console.log('准备步骤: 导航到音乐目录');
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });

    // 再切换为树状视图
    console.log('准备步骤: 切换为树状视图');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('显示方式');
    await agent.aiWaitFor('显示方式子菜单已显示');
    await agent.aiTap('树形视图');

    // 通过右键设置分组方式为类型（右键右侧空白区域中间位置 → 分组方式 → 类型）
    console.log('准备步骤: 设置分组方式为类型');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文件已按类型分组显示', { timeout: 5000 });

    // 设置全文搜索并更新索引
    console.log('准备步骤: 设置全文搜索并更新索引');
    await agent.aiTap('文件管理器右上角菜单按钮');
    await agent.aiWaitFor('主菜单已打开', { timeout: 3000 });
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置界面已打开', { timeout: 5000 });
    // 点击搜索选项
    await agent.aiScroll('"侧边栏显示项目"选项', { direction: 'down', distance: 10 });
    await agent.aiTap('文管设置界面上的搜索，不是文管窗口右上角的搜索');

    // 确保全文搜索已勾选
    const isChecked = await agent.aiBoolean('全文搜索选项已勾选', { timeout: 5000 });
    if (!isChecked) {
      await agent.aiTap('全文搜索勾选框');
      await agent.aiWaitFor('全文搜索选项已勾选', { timeout: 3000 });
    }

    // 点击立即更新索引
    console.log('准备步骤: 点击立即更新索引');
    await agent.aiTap('全文搜索栏中的立即更新索引按钮');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiWaitFor('设置窗口已关闭', { timeout: 3000 });
  });

  test('1936507-【文件列表支持分组】树形视图模式下分组后进行搜索', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：搜索文件名关键字，验证搜索结果和高亮
    // ============================================================
    console.log('===== 步骤1：搜索文件名关键字 "1936507_fn" =====');
    await agent.aiTap('右上角有放大镜的搜索输入框');
    await agent.aiInput('1936507_fn', '右上角有放大镜的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果已显示', { timeout: 30000 });

    // 预期1：搜索成功，至少3个文件，文件名中的关键字高亮显示
    console.log('预期1：搜索成功，关键字高亮显示');
    await agent.aiAssert('搜索结果中同时包含1936507_fn_test_1.txt、1936507_fn_test_2.txt、1936507_fn_test_3.txt文件');

    // 验证文件名关键字高亮（蓝色字体）
    const fnHighlighted = await agent.aiBoolean(
      "搜索结果中的文件名关键词'1936507_fn'有蓝色字体显示",
      { deepThink: true }
    );
    if (!fnHighlighted) {
      throw new Error('文件名关键字高亮显示失败');
    }
    console.log('✅ 文件名关键字高亮验证通过');

    // 清空搜索
    await agent.aiTap('搜索输入框中的清除按钮');
    await agent.aiWaitFor('搜索已清除', { timeout: 3000 });

    // ============================================================
    // 步骤2：搜索文件内容关键字，验证搜索结果和高亮
    // ============================================================
    console.log('===== 步骤2：搜索文件内容关键字 "1936507_content" =====');
    await agent.aiTap('右上角有放大镜的搜索输入框');
    await agent.aiInput('1936507_content', '右上角有放大镜的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果已显示', { timeout: 30000 });

    // 预期2：搜索成功，至少3个文件，文件内容中的关键字高亮显示
    console.log('预期2：搜索成功，文件内容关键字高亮显示');
    await agent.aiAssert('搜索结果中同时包含search_a.txt、search_b.txt、search_c.txt文件');

    // 验证文件内容关键字高亮
    const contentHighlighted = await agent.aiBoolean(
      "搜索结果中文件内容段的'1936507_content'有蓝色字体显示",
      { deepThink: true }
    );
    if (!contentHighlighted) {
      throw new Error('文件内容关键字高亮显示失败');
    }
    console.log('✅ 文件内容关键字高亮验证通过');

    // 清空搜索
    await agent.aiTap('搜索输入框中的清除按钮');
    await agent.aiWaitFor('搜索已清除', { timeout: 3000 });

    // ============================================================
    // 步骤3：打开新文管窗口，进入计算机界面，搜索文件名关键字
    // ============================================================
    console.log('===== 步骤3：新文管窗口 → 计算机界面 → 搜索文件名关键字 =====');
    // 关闭当前文管进程，打开新文管窗口
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器窗口已打开，显示计算机界面', { timeout: 10000 });

    // 搜索文件名关键字
    await agent.aiTap('右上角有放大镜的搜索输入框');
    await agent.aiInput('1936507_fn', '右上角有放大镜的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果已显示', { timeout: 30000 });

    // 预期3：能搜索出音乐目录中含关键字的文件，文件名高亮
    console.log('预期3：能从计算机界面搜索出音乐目录中的文件，文件名高亮');
    await agent.aiAssert('搜索结果中同时包含1936507_fn_test_1.txt、1936507_fn_test_2.txt、1936507_fn_test_3.txt文件');

    const fnGlobalHighlight = await agent.aiBoolean(
      "搜文件名关键词'1936507_fn'有蓝色字体显示",
      { deepThink: true }
    );
    if (!fnGlobalHighlight) {
      throw new Error('计算机界面搜索文件名高亮显示失败');
    }
    console.log('✅ 计算机界面文件名搜索高亮验证通过');

    // 关闭当前新窗口，为步骤4做准备
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ============================================================
    // 步骤4：打开新文管窗口，进入计算机界面，搜索文件内容关键字
    // ============================================================
    console.log('===== 步骤4：新文管窗口 → 计算机界面 → 搜索文件内容关键字 =====');
    // 关闭当前文管进程，打开新文管窗口
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器窗口已打开，显示计算机界面', { timeout: 10000 });

    // 搜索文件内容关键字
    await agent.aiTap('右上角有放大镜的搜索输入框');
    await agent.aiInput('1936507_content', '右上角有放大镜的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果已显示', { timeout: 30000 });

    // 预期4：能搜索出音乐目录中含关键字的文件，文件内容高亮
    console.log('预期4：能从计算机界面搜索出音乐目录中的文件，内容高亮');
    await agent.aiAssert('搜索结果中同时包含search_a.txt、search_b.txt、search_c.txt文件');

    const contentGlobalHighlight = await agent.aiBoolean(
      "搜索结果中文件内容段的'1936507_content'都是蓝色字体显示",
      { deepThink: true }
    );
    if (!contentGlobalHighlight) {
      throw new Error('计算机界面搜索内容高亮显示失败');
    }
    console.log('✅ 计算机界面内容搜索高亮验证通过');

    // 关闭当前新窗口
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('===== 测试全部通过 =====');
  }, { timeout: 800000, tags: ['1936507', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的设置窗口或右键菜单
    await device.pressKey('Esc');

    // 清理创建的所有测试文件
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
      `&& rm -f ${musicDir}/1936507_fn_test_1.txt ${musicDir}/1936507_fn_test_2.txt ${musicDir}/1936507_fn_test_3.txt ` +
      `${musicDir}/search_a.txt ${musicDir}/search_b.txt ${musicDir}/search_c.txt`,
      500
    );

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});