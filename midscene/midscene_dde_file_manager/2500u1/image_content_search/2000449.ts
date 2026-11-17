/**
 * 用例 PMSID: 2000449
 * 用例标题: 【文管-图片文本内容搜索】对搜索结果进行操作
 * 生成时间: 2026-08-27
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const desktopDir = '~/Desktop';
const keyword = '等到你啦';        // cat.jpg 的 OCR 文本
const srcImg = 'cat.jpg';           // 仓库资源
const copyName = '2000449';         // 复制到桌面后文件名主体
const renameName = '2000449-new';   // 重命名目标文件名主体

describe('2000449-【文管-图片文本内容搜索】对搜索结果进行操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 复制素材到桌面，更新图片文本内容索引');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 复制 cat.jpg（含 OCR 文本"等到你啦"）到桌面，并重命名为"2000449.jpg"
    console.log('准备步骤: 复制 cat.jpg 到桌面并重命名为2000449.jpg');
    await system.exec(`cp -f ${caseDir}midscene_dde_file_manager/resources/2000319/${srcImg} ${desktopDir}/${copyName}.jpg`, 500);

    // 打开文件管理器（一次）
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 前置条件：调用公共方法更新图片文本内容索引（内部含最长10分钟等待"索引更新完成"）
    console.log('前置条件: 调用公共方法更新图片文本内容索引');
    await updateImageTextSearchIndex(device, agent, system);

    
  });

  test('2000449-【文管-图片文本内容搜索】对搜索结果进行操作', async ({ device, agent, uos, system }) => {
    // 关闭设置窗口，回到文管界面（保留文管打开，供步骤1使用）
    console.log('准备步骤: 关闭设置窗口');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('设置窗口已关闭', { timeoutMs: 3000 });
    // ============================================================
    // 步骤1：点击桌面目录，搜索框输入"等到你啦"，检查能否搜索出桌面上的图片
    // ============================================================
    console.log('===== 步骤1：点击桌面目录，搜索框输入"等到你啦"，检查能否搜索出图片 =====');

    console.log('操作步骤: 点击左侧栏桌面目录');
    await agent.aiTap('左侧栏中的桌面目录');
    await agent.aiWaitFor('桌面目录已打开', { timeoutMs: 5000 });

    // Ctrl+F 打开搜索框
    console.log('操作步骤: 按 Ctrl+F 打开搜索框');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeoutMs: 3000 });

    // 输入搜索内容（无需回车，搜索自动出结果）
    console.log(`操作步骤: 输入搜索内容"${keyword}"`);
    await device.typeText(keyword);
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log(`预期1：能搜索出桌面上的${copyName}.jpg图片`);
    await agent.aiAssert(`搜索结果中能搜索出桌面上的${copyName}.jpg图片`);

    // ============================================================
    // 步骤2：双击搜索结果中的文件，检查能否正常打开
    // ============================================================
    console.log('===== 步骤2：双击搜索结果中的文件，检查能否正常打开 =====');

    console.log(`操作步骤: 双击搜索结果中的${copyName}.jpg文件图标`);
    await agent.aiDoubleClick(`搜索结果中的${copyName}.jpg文件图标`);
    await agent.aiWaitFor('文件已打开', { timeoutMs: 10000 });

    console.log('预期2：图片能够正常打开');
    await agent.aiAssert('图片能够正常打开');

    // 关闭打开的图片查看器，回到文管窗口继续后续操作
    console.log('操作步骤: 关闭图片查看器回到文管');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('图片查看器已关闭', { timeoutMs: 5000 });

    // ============================================================
    // 步骤3：右键搜索结果中的图片，重命名为"2000449-new"
    // ============================================================
    console.log('===== 步骤3：右键搜索结果中的图片，重命名为2000449-new =====');

    console.log(`操作步骤: 右键搜索结果中的${copyName}.jpg图片`);
    await agent.aiRightClick(`搜索结果中的${copyName}.jpg图片`);
    await agent.aiWaitFor('右击菜单已弹出', { timeoutMs: 5000 });

    console.log('操作步骤: 点击重命名');
    await agent.aiTap('右击菜单中的重命名');
    await agent.aiWaitFor('文件进入重命名可编辑状态', { timeoutMs: 5000 });

    console.log(`操作步骤: 输入新文件名${renameName}`);
    await device.typeText(renameName, true);

    console.log(`预期3：文件已重命名为${renameName}.jpg`);
    //点击右上角搜索框输入退格
    await agent.aiTap('页面右上角的搜索框',{ deepThink: true });
    await device.pressKey('Backspace');
    await agent.aiAssert(`搜索结果中的文件已重命名为${renameName}.jpg`);

    // ============================================================
    // 步骤4：点击搜索框中的 x 按钮清空关键词，检查搜索结果是否为空
    // ============================================================
    console.log('===== 步骤4：点击搜索框 x 按钮清空关键词，检查搜索结果为空 =====');

    console.log('操作步骤: 点击搜索框中的清除按钮（x）');
    await agent.aiTap('搜索框中的清除按钮（x）',{ deepThink: true });
    await agent.aiWaitFor('搜索框内容已清空', { timeoutMs: 5000 });

    console.log('预期4：搜索结果为空');
    await agent.aiAssert('页面显示桌面的文件');

    // ============================================================
    // 步骤5：重新触发搜索，有结果后按退格键逐个删除关键词，清空后检查搜索结果为空
    // ============================================================
    console.log('===== 步骤5：重新搜索后用退格键逐个删除关键词，检查搜索结果为空 =====');

    console.log(`操作步骤: 重新输入搜索内容"${keyword}"触发搜索`);
    await agent.aiTap('页面右上角的搜索框',{ deepThink: true });
    await device.typeText(keyword);
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('操作步骤: 按退格键逐个删除关键词');
    for (let i = 0; i < keyword.length; i++) {
      await device.pressKey('Backspace');
    }
    await agent.aiWaitFor('搜索框内容已清空', { timeoutMs: 5000 });

    console.log('预期5：搜索结果为空');
    await agent.aiAssert('页面显示桌面的文件');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000449', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 删除系统内新增的素材副本（重命名后可能只剩 2000449-new.jpg，rm -f 两个名字兜底），仓库 resources 下素材不删除
    console.log('清理步骤: 删除桌面2000449.jpg / 2000449-new.jpg');
    await system.exec(`rm -f ${desktopDir}/${copyName}.jpg ${desktopDir}/${renameName}.jpg`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});