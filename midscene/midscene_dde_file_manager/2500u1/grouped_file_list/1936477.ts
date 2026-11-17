/**
 * 用例 PMSID: 1936477
 * 用例标题: 【文件列表支持分组】分组从无到有/从有到无
 * 生成时间: 2026-08-06
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '~/Music';
const desktopDir = '~/Desktop';

describe('1936477-【文件列表支持分组】分组从无到有/从有到无', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件');

    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 在桌面创建测试文件（供步骤7、8复制到音乐目录使用）
    console.log('在桌面创建测试文件');
    await system.exec(`printf 'image' > ${desktopDir}/测试图片.png`, 500);
    await system.exec(`printf 'text' > ${desktopDir}/测试文本.txt`, 500);
    console.log('桌面测试文件创建完成');
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

  test('1936477-【文件列表支持分组】分组从无到有/从有到无', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：右键空白处，检查分组方式为空
    // ============================================================
    console.log('===== 步骤1：检查分组方式默认无 =====');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式');
    await agent.aiWaitFor('分组方式子菜单已显示');
    console.log('预期1：分组方式默认勾选"无"');
    await agent.aiAssert('分组方式子菜单中选项默认勾选的选项为"无"');
    // 关闭右键菜单
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 500));

    // ============================================================
    // 步骤2：创建目录A，检查是否自动分组（未分组）
    // ============================================================
    console.log('===== 步骤2：创建目录A，检查是否自动分组 =====');
    await system.exec(`mkdir -p ${musicDir}/目录A`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('预期2：未分组');
    await agent.aiAssert('音乐目录中没有分组标题显示，所有文件平铺展示');

    // ============================================================
    // 步骤3：右键空白处，分组方式选择"类型"，检查目录A自动归类到目录分组
    // ============================================================
    console.log('===== 步骤3：设置分组方式为类型，检查目录A归类到目录分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('音乐目录中显示目录分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期3：目录A自动归类到目录分组中，仅有目录分组');
    await agent.aiAssert('目录分组中包含目录A');

    // ============================================================
    // 步骤4：创建文档B，检查文档B自动归类到文档分组
    // ============================================================
    console.log('===== 步骤4：创建文档B，检查自动归类到文档分组 =====');
    await system.exec(`printf '' > ${musicDir}/文档B.txt`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('预期4：文档B自动归类到文档分组中');
    await agent.aiAssert('音乐目录中显示文档分组标题');
    await agent.aiAssert('文档分组中包含文档B.txt');

    // ============================================================
    // 步骤5：分别创建各类型文件，检查自动归类到对应分组
    // ============================================================
    console.log('===== 步骤5：创建各类型文件，检查自动归类 =====');
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/图片C.png`, 500);
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/影片D.mp4`, 500);
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/音乐E.mp3`, 500);
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/压缩F.zip`, 500);
    await system.exec(`head -c 1024 /dev/zero > ${musicDir}/应用G.desktop`, 500);
    await system.exec(`printf '#!/bin/bash\\necho test\\n' > ${musicDir}/脚本H.sh && chmod +x ${musicDir}/脚本H.sh`, 500);
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/思维导图I.xmind`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('预期5：各类型文件自动归类到对应分组');
    await agent.aiAssert('音乐目录中显示图片分组标题');
    await agent.aiAssert('图片分组中包含图片C.png');
    await agent.aiAssert('音乐目录中显示视频分组标题');
    await agent.aiAssert('视频分组中包含影片D.mp4');
    await agent.aiAssert('音乐目录中显示音频分组标题');
    await agent.aiAssert('音频分组中包含音乐E.mp3');

    // 页面下滑，验证后面的分组
    await agent.aiScroll('音乐目录中的音频分组标题', { direction: 'down', distance: 5 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    await agent.aiAssert('音乐目录中显示压缩文件分组标题');
    await agent.aiAssert('压缩文件分组中包含压缩F.zip');
    await agent.aiAssert('音乐目录中显示应用程序分组标题');
    await agent.aiAssert('应用程序分组中包含应用G.desktop');
    await agent.aiAssert('音乐目录中显示可执行程序分组标题');
    await agent.aiAssert('可执行程序分组中包含脚本H.sh');
    await agent.aiAssert('音乐目录中显示未知分组标题');
    await agent.aiAssert('未知分组中包含文件名包含"思维导图"的文件');

    // ============================================================
    // 步骤6：依次删除文件，检查对应的分组自动隐藏
    // ============================================================
    console.log('===== 步骤6：依次删除文件，检查分组自动隐藏 =====');

    // 删除目录A → 目录分组隐藏
    console.log('删除目录A');
    await system.exec(`rm -rf ${musicDir}/目录A`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示名称为‘目录’的分组标题');

    // 删除文档B.txt → 文档分组隐藏
    console.log('删除文档B.txt');
    await system.exec(`rm -f ${musicDir}/文档B.txt`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示文档分组标题');

    // 删除图片C.png → 图片分组隐藏
    console.log('删除图片C.png');
    await system.exec(`rm -f ${musicDir}/图片C.png`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示图片分组标题');

    // 删除影片D.mp4 → 视频分组隐藏
    console.log('删除影片D.mp4');
    await system.exec(`rm -f ${musicDir}/影片D.mp4`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示视频分组标题');

    // 删除音乐E.mp3 → 音频分组隐藏
    console.log('删除音乐E.mp3');
    await system.exec(`rm -f ${musicDir}/*.mp3`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示音频分组标题');

    // 删除压缩F.zip → 压缩文件分组隐藏
    console.log('删除压缩F.zip');
    await system.exec(`rm -f ${musicDir}/压缩F.zip`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示压缩文件分组标题');

    // 删除应用G.desktop → 应用程序分组隐藏
    console.log('删除应用G.desktop');
    await system.exec(`rm -f ${musicDir}/应用G.desktop`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示名称为‘应用程序’的分组标题');

    // 删除脚本H.sh → 可执行程序分组隐藏
    console.log('删除脚本H.sh');
    await system.exec(`rm -f ${musicDir}/脚本H.sh`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示可执行程序分组标题');

    // 删除思维导图I.xmind → 未知分组隐藏
    console.log('删除思维导图I.xmind');
    await system.exec(`rm -f ${musicDir}/思维导图I.xmind`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('音乐目录中不显示未知分组标题');

    // 验证所有分组都不显示
    console.log('所有分组已隐藏');
    await agent.aiAssert('音乐目录中没有任何分组标题显示');

    // ============================================================
    // 步骤7：从桌面复制图片到音乐目录，检查自动归类到图片分组
    // ============================================================
    console.log('===== 步骤7：复制图片到音乐目录，检查自动归类到图片分组 =====');
    await system.exec(`cp ${desktopDir}/测试图片.png ${musicDir}/`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('预期7：自动归类到图片分组中');
    await agent.aiAssert('音乐目录中显示图片分组标题');
    await agent.aiAssert('图片分组中包含测试图片.png');

    // ============================================================
    // 步骤8：从桌面复制文本文件到音乐目录，检查自动归类到文档分组
    // ============================================================
    console.log('===== 步骤8：复制文本文件到音乐目录，检查自动归类到文档分组 =====');
    await system.exec(`cp ${desktopDir}/测试文本.txt ${musicDir}/`, 500);
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('预期8：自动归类到文档分组中');
    await agent.aiAssert('音乐目录中显示文档分组标题');
    await agent.aiAssert('文档分组中包含测试文本.txt');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936477', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理音乐目录中的所有测试文件
    console.log('清理音乐目录中的测试文件');
    await system.exec(
      `rm -rf ${musicDir}/目录A ` +
      `&& rm -f ${musicDir}/文档B.txt ${musicDir}/图片C.png ${musicDir}/影片D.mp4 ${musicDir}/音乐E.mp3 ` +
      `${musicDir}/压缩F.zip ${musicDir}/应用G.desktop ${musicDir}/脚本H.sh ${musicDir}/思维导图I.xmind ` +
      `${musicDir}/测试图片.png ${musicDir}/测试文本.txt`,
      500
    );

    // 关闭文管进程
    console.log('关闭文管进程');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 清理桌面测试文件
    console.log('清理桌面测试文件');
    await system.exec(`rm -f ${desktopDir}/测试图片.png ${desktopDir}/测试文本.txt`, 500);

    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});