// @ts-nocheck

/**
 * 用例 PMSID: 1810647
 * 用例标题: 【Bug转用例场景】框选最近使用的多个文件，拖拽到其他目录，中间点取消
 * 生成时间：2026-10-22 20:55:00
 * 用例编写人：UT005045（许琪）
 */

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const HOME = TEST_HOME;
const SRC_DIR = `${HOME}/Pictures`;
const DEST_DIR = `${HOME}/Documents`;
const FILE_PREFIX = '1810647_';
// 单个 4GB，共 16GB，保证复制任务持续足够久，便于"中途点取消"
const FILE_SIZE_MB = 4096;
const SRC_FILES = [
  `${SRC_DIR}/${FILE_PREFIX}1.bin`,
  `${SRC_DIR}/${FILE_PREFIX}2.bin`,
  `${SRC_DIR}/${FILE_PREFIX}3.bin`,
  `${SRC_DIR}/${FILE_PREFIX}4.bin`,
];

function buildXbel(paths) {
  const ts = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  let xbel = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xbel += '<xbel version="1.0" xmlns:bookmark="http://www.freedesktop.org/standards/desktop-bookmarks" xmlns:mime="http://www.freedesktop.org/standards/shared-mime-info">\n';
  for (const path of paths) {
    const name = path.split('/').pop();
    xbel += `  <bookmark href="file://${path}" added="${ts}" modified="${ts}" visited="${ts}">\n`;
    xbel += `    <title>${name}</title>\n`;
    xbel += `    <info><metadata owner="http://freedesktop.org"><mime:mime-type>application/octet-stream</mime:mime-type><bookmark:applications><bookmark:application name="dde-file-manager" exec="dde-file-manager" timestamp="${ts}"/></bookmark:applications></metadata></info>\n`;
    xbel += '  </bookmark>\n';
  }
  xbel += '</xbel>\n';
  return xbel;
}

const SRC_RM = SRC_FILES.join(' ');
const DEST_RM = SRC_FILES.map(p => p.replace(SRC_DIR, DEST_DIR)).join(' ');

describe('1810647-框选最近使用的多个文件拖拽到其他目录并取消', () => {
  beforeAll(async ({ system }) => {
    console.log('1. beforeAll: 关闭文件管理器并准备最近使用数据');

    await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null', 30000);
    await system.exec(`rm -f ${SRC_RM}`, 30000);
    await system.exec(`rm -f ${DEST_RM}`, 30000);

    // 造数：逐个文件使用 dd 写绝对路径（远端 fallocate 不可用）
    for (const path of SRC_FILES) {
      const r = await system.exec(
        `dd if=/dev/zero of=${path} bs=1M count=${FILE_SIZE_MB} conv=fdatasync status=none`,
        170000,
      );
      if (r.exitCode !== 0) {
        throw new Error(`造数失败: ${path}, exitCode=${r.exitCode}, stderr=${r.stderr}`);
      }
    }

    const verify = await system.exec(`ls -1 ${SRC_DIR}/${FILE_PREFIX}*.bin | wc -l`, 30000);
    console.log(`2. 源文件数量: ${verify.stdout.trim()}`);
    if (Number(verify.stdout.trim()) !== SRC_FILES.length) {
      throw new Error(`源文件造数数量不符，期望 ${SRC_FILES.length}，实际 ${verify.stdout.trim()}`);
    }

    // 写入最近使用记录（XBEL）
    const b64 = Buffer.from(buildXbel(SRC_FILES), 'utf8').toString('base64');
    await system.exec(`echo '${b64}' | base64 -d > ${HOME}/.local/share/recently-used.xbel; echo rc=$?`, 60000);
    const check = await system.exec(`grep -c '<bookmark ' ${HOME}/.local/share/recently-used.xbel`, 30000);
    console.log(`3. 最近使用记录条数: ${check.stdout.trim()}`);
    if (Number(check.stdout.trim()) !== SRC_FILES.length) {
      throw new Error(`最近使用记录写入失败，期望 ${SRC_FILES.length}，实际 ${check.stdout.trim()}`);
    }
  });

  beforeEach(async ({ device, system }) => {
    console.log('2. beforeEach: 清理目标目录');
    await device.pressKey('Esc');
    await system.exec(`rm -f ${DEST_RM}`, 60000);
  });

  test('1810647-框选最近使用的多个文件，拖拽到其他目录，中间点取消', async ({ device, uos, agent, system }) => {
    console.log('=== 开始测试：1810647 ===');

    // 客观判据助手：窗口就绪与复制启动改 shell 有界轮询，未命中才回落原视觉等待
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const sh = async (cmd, timeout = 8000) => `${((await system.exec(cmd, timeout)) || {}).stdout || ''}`.trim();
    const waitUntil = async (fn, timeoutMs = 15000, intervalMs = 500) => {
      const t0 = Date.now();
      while (Date.now() - t0 < timeoutMs) {
        try {
          if (await fn()) return true;
        } catch (e) { /* 轮询期忽略单次异常 */ }
        await sleep(intervalMs);
      }
      return false;
    };

    await uos.showDesktop();
    await uos.openApp('文件管理器', { maximizeWindow: true });
    if (!(await waitUntil(async () => parseInt(await sh("wmctrl -lx | grep -ic 'dde-file-manager' || true") || '0', 10) > 0, 20000, 500))) {
      await agent.aiWaitFor('文件管理器界面已显示');
    }

    console.log('步骤1：点击左侧边栏的【最近使用】');
    await agent.aiTap('左侧边栏的最近使用');
    // 最近使用为本地目录刷新，固定短等待替代视觉轮询（未刷新时框选会直接暴露）
    await sleep(1500);

    console.log('步骤2：框选最近使用文件列表中的多个文件');
    await agent.aiDrag('最近使用文件列表中第一个文件的左侧空白区域', '最近使用文件列表中最后一个文件的右下角', { deepThink: true });
    const selectedCount = await agent.aiQuery('当前列表中被选中的文件数量，返回数字');
    console.log(`框选后选中文件数量: ${selectedCount}`);
    if (Number(selectedCount) !== SRC_FILES.length) {
      throw new Error(`框选文件数量不符，期望 ${SRC_FILES.length}，实际 ${selectedCount}`);
    }

    console.log('步骤3：拖拽已选中的文件到左侧边栏的文档目录');
    await agent.aiDrag('已选中的多个文件', '左侧边栏的文档目录', { deepThink: true });
    // 复制已启动的客观判据：目标目录出现 1810647_ 文件（有界轮询），未命中再回落一次视觉等待
    if (!(await waitUntil(async () => parseInt(await sh(`ls -1 ${DEST_DIR}/${FILE_PREFIX}*.bin 2>/dev/null | wc -l`) || '0', 10) > 0, 20000, 500))) {
      await agent.aiWaitFor('界面上显示复制进度窗口，提示有1个任务正在进行', { timeoutMs: 30000 });
    }

    console.log('步骤4：悬停复制任务并点击取消');
    await agent.aiHover('正在复制的任务提示区域');
    await agent.aiTap('复制进度窗口中的取消按钮');

    console.log('步骤5：校验取消结果');
    await agent.aiWaitFor('复制进度窗口已关闭，界面上没有正在复制或正在移动的任务提示', { timeoutMs: 20000 });

    const destRes = await system.exec(`ls -1 ${DEST_DIR}/${FILE_PREFIX}*.bin 2>/dev/null | wc -l`, 30000);
    const copiedCount = Number(destRes.stdout.trim());
    console.log(`取消后目标目录文件数量: ${copiedCount}`);
    if (copiedCount >= SRC_FILES.length) {
      throw new Error(`复制未被取消，目标目录文件数 ${copiedCount}，源文件数 ${SRC_FILES.length}`);
    }

    const srcRes = await system.exec(`ls -1 ${SRC_DIR}/${FILE_PREFIX}*.bin 2>/dev/null | wc -l`, 30000);
    const srcCount = Number(srcRes.stdout.trim());
    console.log(`取消后源文件数量: ${srcCount}`);
    if (srcCount !== SRC_FILES.length) {
      throw new Error(`取消后源文件被影响，期望 ${SRC_FILES.length}，实际 ${srcCount}`);
    }

    const pidRes = await system.exec('pidof dde-file-manager | wc -w', 30000);
    console.log(`文件管理器进程数: ${pidRes.stdout.trim()}`);
    if (Number(pidRes.stdout.trim()) < 1) {
      throw new Error('文件管理器进程已退出');
    }

    await agent.aiAssert('文件管理器窗口正常显示，最近使用文件列表可见');

    console.log('✅ 1810647用例测试完成');
  }, { timeout: 900000, tags: ['1810647', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'xuqi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Esc');
  });

  afterAll(async ({ uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null', 30000);
    await system.exec(`rm -f ${SRC_RM}`, 60000);
    await system.exec(`rm -f ${DEST_RM}`, 60000);
    await system.exec(`echo '<?xml version="1.0" encoding="UTF-8"?><xbel version="1.0"></xbel>' > ${HOME}/.local/share/recently-used.xbel`, 30000);
    await uos.showDesktop();
  });
});
