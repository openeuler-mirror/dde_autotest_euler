/**
 * 用例 PMSID: 1936483
 * 用例标题: 【文件列表支持分组】修改大小后，检查文件是否正确分组
 * 生成时间: 2026-07-20
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '$HOME/Music';

describe('1936483-【文件列表支持分组】修改大小后，检查文件是否正确分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    // 创建测试文件（单独创建，不使用公共方法）
    // 创建空目录（初始在"未知"分组）
    console.log('准备步骤: 创建空目录');
    await system.exec(`mkdir -p ${musicDir}/1936483_测试目录`, 500);

    // 创建0kb文档（初始在"0kb"分组）
    console.log('准备步骤: 创建0kb文档');
    await system.exec(`printf '' > ${musicDir}/1936483_0kb文档.txt`, 500);

    // 创建0-16kb压缩文件（初始在"0-16kb"分组）
    console.log('准备步骤: 创建0-16kb压缩文件');
    await system.exec(`head -c 8192 /dev/zero > ${musicDir}/1936483_0-16kb压缩文件.tar.gz`, 500);

    // 创建16kb-1MB可执行文件（初始在"16kb-1MB"分组）
    console.log('准备步骤: 创建16kb-1MB可执行文件');
    await system.exec(`head -c 524288 /dev/zero > ${musicDir}/1936483_16kb可执行.sh && chmod +x ${musicDir}/1936483_16kb可执行.sh`, 500);

    // 创建1-128MB压缩文件（初始在"1-128MB"分组）
    console.log('准备步骤: 创建1-128MB压缩文件');
    await system.exec(`head -c 67108864 /dev/zero > ${musicDir}/1936483_1-128MB压缩文件.tar.gz`, 500);

    // 创建128MB-1GB压缩文件（初始在"128MB-1GB"分组）
    console.log('准备步骤: 创建128MB-1GB压缩文件');
    await system.exec(`head -c 536870912 /dev/zero > ${musicDir}/1936483_128MB-1GB压缩文件.tar.gz`, 500);

    // 创建1-4GB压缩文件（初始在"1-4GB"分组）
    console.log('准备步骤: 创建1-4GB压缩文件');
    await system.exec(`truncate -s 2G ${musicDir}/1936483_1-4GB压缩文件.tar.gz`, 500);

    // 创建>4GB压缩文件（初始在">4GB"分组）
    console.log('准备步骤: 创建大于4GB压缩文件');
    await system.exec(`truncate -s 5G ${musicDir}/1936483_大于4GB压缩文件.tar.gz`, 500);

    // 创建填充分组的文件（确保所有分组在初始时都可见）
    console.log('准备步骤: 创建填充分组文件');
    await system.exec(`head -c 4096 /dev/zero > ${musicDir}/1936483_填充图片.png`, 500);
    await system.exec(`head -c 32768 /dev/zero > ${musicDir}/1936483_填充影片.mp4`, 500);
    await system.exec(`head -c 16384 /dev/zero > ${musicDir}/1936483_填充音乐.mp3`, 500);
    await system.exec(`head -c 1024 /dev/zero > ${musicDir}/1936483_填充应用.desktop`, 500);

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

    // 设置按大小分组（右键右侧空白区域中间位置）
    console.log('准备步骤: 设置分组方式为大小');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('文件已按大小分组显示', { timeout: 5000 });
  });

  test('1936483-【文件列表支持分组】修改大小后，检查文件是否正确分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：修改空目录大小（添加文件），检查是否仍然在"未知"分组中
    // ============================================================
    console.log('===== 步骤1：在目录中添加文件，检查是否仍然在"未知"分组中 =====');
    await system.exec(`head -c 1024 /dev/zero > ${musicDir}/1936483_测试目录/temp_file.bin`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期1：目录仍然在"未知"分组中');
    await agent.aiAssert('1936483_测试目录显示在未知分组中');

    // ============================================================
    // 步骤2：修改0kb文档大小，检查是否从"0kb"移到"0-16kb"
    // ============================================================
    console.log('===== 步骤2：修改0kb文档为8K，检查是否从0kb移到0-16kb分组 =====');
    await system.exec(`truncate -s 8K ${musicDir}/1936483_0kb文档.txt`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期2：文档从0kb分组移到0-16kb分组中');
    await agent.aiAssert('1936483_0kb文档.txt文件显示在0-16kb分组中');

    // ============================================================
    // 步骤3：修改0-16kb压缩文件大小，检查是否从"0-16kb"移到"16kb-1MB"
    // ============================================================
    console.log('===== 步骤3：修改压缩文件为800K，检查是否从0-16kb移到16kb-1MB分组 =====');
    await system.exec(`truncate -s 800K ${musicDir}/1936483_0-16kb压缩文件.tar.gz`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期3：压缩文件从0-16kb分组移到16kb-1MB分组中');
    await agent.aiAssert('1936483_0-16kb压缩文件.tar.gz文件显示在16kb-1MB分组中');

    // ============================================================
    // 步骤4：修改16kb-1MB可执行文件大小，检查是否从"16kb-1MB"移到"1-128MB"
    // ============================================================
    console.log('===== 步骤4：修改可执行文件为64M，检查是否从16kb-1MB移到1-128MB分组 =====');
    await system.exec(`truncate -s 64M ${musicDir}/1936483_16kb可执行.sh`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期4：可执行文件从16kb-1MB分组移到1-128MB分组中');
    await agent.aiAssert('1936483_16kb可执行.sh文件显示在1-128MB分组中');

    // ============================================================
    // 步骤5：修改1-128MB压缩文件大小，检查是否从"1-128MB"移到"128MB-1GB"
    // ============================================================
    console.log('===== 步骤5：修改压缩文件为512M，检查是否从1-128MB移到128MB-1GB分组 =====');
    await system.exec(`truncate -s 512M ${musicDir}/1936483_1-128MB压缩文件.tar.gz`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // 128MB-1GB为第6个分组，可能需要滚动
    console.log('预期5：压缩文件从1-128MB分组移到128MB-1GB分组中');
    await agent.aiScroll('目录分组', { direction: 'down', distance: 5 });
    await agent.aiAssert('1936483_1-128MB压缩文件.tar.gz文件显示在大(128MB-1GB)分组中');

    // ============================================================
    // 步骤6：修改128MB-1GB压缩文件大小，检查是否从"128MB-1GB"移到"1-4GB"
    // ============================================================
    console.log('===== 步骤6：修改压缩文件为2G，检查是否从128MB-1GB移到1-4GB分组 =====');
    await system.exec(`truncate -s 2G ${musicDir}/1936483_128MB-1GB压缩文件.tar.gz`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // 1-4GB为第7个分组，需要滚动
    console.log('预期6：压缩文件从128MB-1GB分组移到1-4GB分组中');
    await agent.aiScroll('目录分组', { direction: 'down', distance: 5 });
    await agent.aiAssert('1936483_128MB-1GB压缩文件.tar.gz文件显示在1-4GB分组中');

    // ============================================================
    // 步骤7：修改1-4GB压缩文件大小，检查是否从"1-4GB"移到">4GB"
    // ============================================================
    console.log('===== 步骤7：修改压缩文件为5G，检查是否从1-4GB移到>4GB分组 =====');
    await system.exec(`truncate -s 5G ${musicDir}/1936483_1-4GB压缩文件.tar.gz`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // >4GB为第8个分组，需要滚动
    console.log('预期7：压缩文件从1-4GB分组移到>4GB分组中');
    await agent.aiScroll('目录分组', { direction: 'down', distance: 5 });
    await agent.aiAssert('1936483_1-4GB压缩文件.tar.gz文件显示在>4GB分组中');

    // ============================================================
    // 步骤8：修改>4GB压缩文件大小（清空），检查是否从">4GB"移到"0kb"
    // ============================================================
    console.log('===== 步骤8：清空压缩文件为0，检查是否从>4GB移到0kb分组 =====');
    await system.exec(`truncate -s 0 ${musicDir}/1936483_大于4GB压缩文件.tar.gz`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // 0kb为第2个分组，在可见区域
    console.log('预期8：压缩文件从>4GB分组移到0kb分组中');
    await agent.aiAssert('1936483_大于4GB压缩文件.tar.gz文件显示在0kb分组中');

    // ============================================================
    // 步骤9：新建>4GB文件，检查是否自动归到"超大"分组
    // ============================================================
    console.log('===== 步骤9：新建5G文件，检查是否自动归到超大分组 =====');
    await system.exec(`truncate -s 5G ${musicDir}/1936483_超大文件.bin`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    // 超大为第9个分组，需要滚动
    console.log('预期9：新建的大文件自动归到超大分组中');
    await agent.aiScroll('目录分组', { direction: 'down', distance: 5 });
    await agent.aiAssert('1936483_超大文件.bin文件显示在超大分组中');

    // ============================================================
    // 步骤10：删除所有文件，检查所有分组是否隐藏
    // ============================================================
    console.log('===== 步骤10：删除所有文件，检查所有分组是否隐藏 =====');
    await system.exec(`rm -rf ${musicDir}/1936483_*`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));
    console.log('预期10：所有分组隐藏');
    await agent.aiAssert('音乐目录中不显示超大分组标题');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936483', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 清理所有测试文件（通配符删除，覆盖全部初始文件 + 步骤中创建的文件）
    await system.exec(`rm -rf ${musicDir}/1936483_*`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});
