// @ts-nocheck

/**
 * 用例 PMSID: 1936553
 * 用例标题: 【文件列表支持分组】三方应用支持分组
 * 生成时间: 2026-11-10
 * 用例编写人: UT000649（黄甜）
 *
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const DOWNLOADS = `${TEST_HOME}/Downloads`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 单引号安全包裹（用于 shell 命令中的路径/文件名）
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// 测试文件清单（9 文件 + 1 目录带子目录 = 11 个 1936553-* 条目）
// 类型分布覆盖 xlsx 前置条件要求的全部类型
const TEST_DIR = `${DOWNLOADS}/1936553-目录`;
const TEST_SUBDIR = `${TEST_DIR}/1936553-子目录`;
const TEST_FILES = [
  `${DOWNLOADS}/1936553-文档.txt`,
  `${DOWNLOADS}/1936553-图片.png`,
  `${DOWNLOADS}/1936553-影片.mp4`,
  `${DOWNLOADS}/1936553-音乐.mp3`,
  `${DOWNLOADS}/1936553-压缩.zip`,
  `${DOWNLOADS}/1936553-应用.desktop`,
  `${DOWNLOADS}/1936553-脚本.sh`,
  `${DOWNLOADS}/1936553-思维导图.xmind`,
  `${DOWNLOADS}/1936553-表格.et`,
];
const TEST_ENTRIES = [TEST_DIR, TEST_SUBDIR, ...TEST_FILES];

// 自创建测试文件（1964035/1940085 已实证 system.exec 可直接写 /home/<user>）
// 每个文件写入对应大小的数据，保证按类型分组时图标可正常渲染
async function verifyFilesReady(system) {
  console.log('检查/创建 1936553 测试文件（目录 + 9 文件）');
  const r = await system.exec(
    `mkdir -p ${sq(TEST_SUBDIR)} && ` +
    `head -c 4096 /dev/zero > ${sq(`${DOWNLOADS}/1936553-文档.txt`)} && ` +
    `head -c 8192 /dev/zero > ${sq(`${DOWNLOADS}/1936553-图片.png`)} && ` +
    `head -c 16384 /dev/zero > ${sq(`${DOWNLOADS}/1936553-影片.mp4`)} && ` +
    `head -c 24576 /dev/zero > ${sq(`${DOWNLOADS}/1936553-音乐.mp3`)} && ` +
    `head -c 32768 /dev/zero > ${sq(`${DOWNLOADS}/1936553-压缩.zip`)} && ` +
    `head -c 1024 /dev/zero > ${sq(`${DOWNLOADS}/1936553-应用.desktop`)} && ` +
    `printf '#!/bin/bash\\necho 1936553\\n' > ${sq(`${DOWNLOADS}/1936553-脚本.sh`)} && chmod +x ${sq(`${DOWNLOADS}/1936553-脚本.sh`)} && ` +
    `head -c 10240 /dev/zero > ${sq(`${DOWNLOADS}/1936553-思维导图.xmind`)} && ` +
    `head -c 2048 /dev/zero > ${sq(`${DOWNLOADS}/1936553-表格.et`)} && echo CREATED_OK`,
    20000
  );
  if (!String(r?.stdout || '').includes('CREATED_OK')) {
    throw new Error(`测试文件创建失败（请检查 system.exec 写权限）: ${String(r?.stderr || r?.stdout || '').substring(0, 200)}`);
  }
  // 客观复核：find 统计不受文件名特殊字符影响
  const findRes = await system.exec(`find ${DOWNLOADS} -maxdepth 2 -name '1936553-*' 2>/dev/null | wc -l`, 10000);
  const count = parseInt(String(findRes?.stdout || '0').trim(), 10) || 0;
  console.log(`Downloads 中 1936553-* 测试条目: ${count} (期望 ${TEST_ENTRIES.length})`);
  if (count < TEST_ENTRIES.length) {
    throw new Error(`测试文件复核不完整（${count}/${TEST_ENTRIES.length}）`);
  }
}

describe('1936553-【文件列表支持分组】三方应用支持分组', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    // 不调用 clearEnvironment — 它会 systemctl restart 服务，1964035 实证会杀掉测试进程
    await uos.showDesktop();
  });

  beforeEach(async ({ agent, system, uos }) => {
    console.log('2. beforeEach: 清理残留进程 + 检查测试文件');
    await system.exec(
      `kill -9 $(pidof dde-file-manager 2>/dev/null | tr ' ' '\n' | sort -u | tr '\n' ' ') 2>/dev/null || true`,
      10000
    );
    await sleep(2000);
    await verifyFilesReady(system);
    await uos.showDesktop();
  });

  test('1936553-【文件列表支持分组】三方应用支持分组', async ({ device, system, agent, uos }) => {
    // ========== 步骤 1：打开文管 → 地址栏导航到下载目录 ==========
    // 地址栏导航消除"下载目录"/"Downloads"语言差异风险
    // 必须先 Ctrl+A → Delete 清空（v4 实证不清空会导致路径拼接错误）
    console.log('===== 步骤1：打开文件管理器 → 地址栏导航到 Downloads =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 8000 });

    await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
    await sleep(500);
    await device.pressKey('Ctrl', 'L');
    await sleep(400);
    await device.pressKey('Ctrl', 'A');
    await sleep(200);
    await device.pressKey('Delete');
    await sleep(300);
    await system.exec(`xdotool type --delay 30 '${DOWNLOADS}'`, 5000);
    await sleep(500);
    await device.pressKey('Return');
    await sleep(2500);

    // 预期1：已打开下载目录 — deepThink 视觉确认测试文件可见
    console.log('检查预期1：下载目录中能看到 1936553 测试文件');
    await agent.aiAssert(
      '文件管理器右侧主区域中至少能看到多个以"1936553-"开头的文件和文件夹',
      { deepThink: true }
    );
    console.log('预期1 ✅：已打开下载目录，测试文件可见');

    // ========== 步骤 2：右键空白处 → 分组方式 → 按类型分组 ==========
    // deepThink 策略：aiRightClick 需要（定位偏差大），aiTap 不需要（文字标签匹配）
    console.log('===== 步骤2：右键空白处 → 分组方式 → 类型 =====');

    // 切图标视图（Ctrl+1），分组标题在图标视图更明显
    await device.pressKey('Ctrl', '1');
    await sleep(300);

    // 右键空白处 — 保留 deepThink（非 deepThink 右键位置偏差大，v4 实证）
    await agent.aiRightClick(
      '文件管理器右侧主区域没有文件图标的空白处（右下角的灰色背景区域）',
      { deepThink: true }
    );
    await agent.aiWaitFor('右键菜单已弹出，菜单选项可见', { timeoutMs: 5000 });

    // 分组方式 → 类型 — 去掉 deepThink（文字标签匹配足够，v5 实证）
    await agent.aiTap('右键菜单中的"分组方式"选项', {});
    await agent.aiWaitFor('分组方式子菜单已展开', { timeoutMs: 4000 });
    await agent.aiTap('分组方式子菜单中的"类型"选项', {});
    await sleep(1500);

    // 预期2：正确分组 — 保留 deepThink（需要视觉推理识别分组标题）
    console.log('检查预期2：文件已按类型分组显示');
    await agent.aiAssert(
      '文件管理器右侧文件列表已经按"类型"分组显示：每一组文件上方有分组标题（如"文档"、"图片"、"视频"、"音乐"等），不同类型的文件分别归在不同的分组标题下',
      { deepThink: true }
    );
    console.log('预期2 ✅：已按类型正确分组');

    console.log('✅ 1936553 测试全部通过');
  }, { timeout: 1800000, tags: ['1936553', 'level3', '2500u1', 'grouped_file_list', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 清理文管进程');
    await system.exec(
      `kill -9 $(pidof dde-file-manager 2>/dev/null | tr ' ' '\n' | sort -u | tr '\n' ' ') 2>/dev/null || true`,
      10000
    );
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log('5. afterAll: 清理测试环境');
    await system.exec(`rm -rf ${DOWNLOADS}/1936553-* 2>/dev/null || true`, 10000);
    await uos.showDesktop();
  });
});
