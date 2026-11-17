/**
 * 用例 PMSID: 1936555
 * 用例标题: 【文件列表支持分组】搜索结果界面支持分组
 * 生成时间: 2026-07-13
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const downloadsDir = '~/Downloads';

describe('1936555-【文件列表支持分组】搜索结果界面支持分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 在下载目录创建分组测试文件');

    // 清理旧测试文件
    await system.exec(
      `rm -rf ${downloadsDir}/分组测试目录 ` +
      `&& rm -f ${downloadsDir}/分组测试文档.txt ${downloadsDir}/分组测试图片.png ` +
      `${downloadsDir}/分组测试影片.mp4 ${downloadsDir}/分组测试音乐.mp3 ` +
      `${downloadsDir}/分组测试压缩.zip ${downloadsDir}/分组测试应用.desktop ` +
      `${downloadsDir}/分组测试脚本.sh ${downloadsDir}/分组测试思维导图.xmind ` +
      `${downloadsDir}/分组测试表格.et`,
      500
    );

    // 创建目录（含子目录）
    await system.exec(`mkdir -p ${downloadsDir}/分组测试目录/分组测试子目录`, 500);

    // 创建文件
    await system.exec(`head -c 4096 /dev/zero > ${downloadsDir}/分组测试文档.txt`, 500);
    await system.exec(`head -c 8192 /dev/zero > ${downloadsDir}/分组测试图片.png`, 500);
    await system.exec(`head -c 16384 /dev/zero > ${downloadsDir}/分组测试影片.mp4`, 500);
    await system.exec(`head -c 24576 /dev/zero > ${downloadsDir}/分组测试音乐.mp3`, 500);
    await system.exec(`head -c 32768 /dev/zero > ${downloadsDir}/分组测试压缩.zip`, 500);
    await system.exec(`head -c 1024 /dev/zero > ${downloadsDir}/分组测试应用.desktop`, 500);
    await system.exec(`printf '#!/bin/bash\\necho test\\n' > ${downloadsDir}/分组测试脚本.sh && chmod +x ${downloadsDir}/分组测试脚本.sh`, 500);
    await system.exec(`head -c 10240 /dev/zero > ${downloadsDir}/分组测试思维导图.xmind`, 500);
    await system.exec(`printf '' > ${downloadsDir}/分组测试表格.et`, 500);

    console.log('分组测试文件创建完成');
  });

  test('1936555-【文件列表支持分组】搜索结果界面支持分组', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器，导航至下载目录，使用 Ctrl+F 激活搜索，输入"分组测试"
    console.log('===== 步骤1：打开文件管理器 → 下载目录 → Ctrl+F 搜索"分组测试" =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航至下载目录
    await agent.aiTap('文件管理器左侧栏的下载目录');
    await agent.aiWaitFor('下载目录已打开', { timeout: 5000 });

    // 使用快捷键 Ctrl+F 激活搜索
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeout: 3000 });

    // 在搜索框中输入"分组测试"
    await agent.aiInput('分组测试', '右上角有放大镜的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果已加载', { timeout: 10000 });

    // 预期1：搜索功能正常激活，搜索结果准确显示所有"分组测试"文件
    console.log('预期1：搜索结果包含所有分组测试文件');
    await agent.aiAssert('搜索结果界面最下方显示搜索到了11项');

    // 步骤2：在搜索结果界面右键空白处，选择按文件类型分组
    console.log('===== 步骤2：右键设置搜索结果按类型分组 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });

    // 预期2：搜索结果按类型分组显示
    console.log('预期2：搜索结果按类型分组显示');
    await agent.aiWaitFor('搜索结果按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    await agent.aiAssert('搜索结果中按类型进行了分组');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936555', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理下载目录中的测试文件
    await system.exec(`rm -rf ${downloadsDir}/分组测试目录`, 500);
    await system.exec(
      `rm -f ${downloadsDir}/分组测试文档.txt ${downloadsDir}/分组测试图片.png ` +
      `${downloadsDir}/分组测试影片.mp4 ${downloadsDir}/分组测试音乐.mp3 ` +
      `${downloadsDir}/分组测试压缩.zip ${downloadsDir}/分组测试应用.desktop ` +
      `${downloadsDir}/分组测试脚本.sh ${downloadsDir}/分组测试思维导图.xmind ` +
      `${downloadsDir}/分组测试表格.et`,
      500
    );
    console.log('测试文件清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});
