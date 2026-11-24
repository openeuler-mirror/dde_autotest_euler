// @ts-nocheck

/**
 * 用例 PMSID: 1964085
 * 用例标题: 【桌面整理】桌面整理后编辑集合中的文件
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const DESKTOP = `${TEST_HOME}/Desktop`;
const DOC_FILE = `${DESKTOP}/1964085-edit.txt`;
const RENAMED_FILE = `${DESKTOP}/1964085-renamed.txt`;
const VIDEO_FILE = `${DESKTOP}/1964085-video.mp4`;
const IMAGE_FILE = `${DESKTOP}/1964085-image.jpg`;
const NEW_FOLDER = `${DESKTOP}/新建文件夹`;

const ORG_RES = 'org.deepin.dde.file-manager.desktop.organizer';
const ORG_KEY = 'enableOrganizer';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

async function expectUi(agent, prompt, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await agent.aiBoolean(prompt)) return;
    await sleep(1000);
  }
  throw new Error(`UI 断言失败: ${prompt}`);
}

async function exists(system, path) {
  const res = await system.exec(`test -e ${sq(path)} && echo yes || echo no`, 10000);
  return String(res?.stdout || '').trim() === 'yes';
}

// 通过窗口管理器客观检测文本编辑器窗口（标题包含文件名 + “文本编辑器”），替代不稳定的 AI 视觉断言
async function waitEditorWindow(system, fileName, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let last = '';
  while (Date.now() < deadline) {
    const res = await system.exec('wmctrl -l', 5000);
    last = String(res?.stdout || '');
    const line = last
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .find((item) => item.includes(fileName) && item.includes('文本编辑器'));
    if (line) {
      const wid = line.split(/\s+/)[0];
      // 激活窗口失败不应导致断言失败，窗口已客观存在即可继续
      await system.exec(`wmctrl -i -a ${wid} 2>/dev/null || true`, 5000);
      await sleep(500);
      try {
        await system.exec(`xdotool windowactivate --sync ${wid}`, 5000);
      } catch (error) {
        console.log(`激活文本编辑器窗口失败（忽略）: ${error && error.message ? error.message : error}`);
      }
      return line;
    }
    await sleep(1000);
  }
  const wins = last.split('\n').map((item) => item.trim()).filter(Boolean).join(' | ');
  throw new Error(`文本编辑器窗口未打开或标题未显示 ${fileName}，当前窗口列表: ${wins}`);
}

// 关闭标题包含测试文件的文本编辑器窗口，避免上次残留实例/会话恢复干扰本次运行
async function closeTestEditorWindows(system) {
  const res = await system.exec('wmctrl -l', 5000);
  const lines = String(res?.stdout || '').split('\n').map((item) => item.trim()).filter(Boolean);
  const wins = lines.filter((line) => line.includes('1964085-edit.txt') || line.includes('1964085-renamed.txt'));
  for (const line of wins) {
    await system.exec(`wmctrl -i -c ${line.split(/\s+/)[0]}`, 5000);
  }
  if (wins.length > 0) await sleep(1500);
  return wins.length;
}

// 双击集合中的文件并用窗口标题客观校验编辑器已打开；AI 定位偶发偏移时重试，避免单次误判
async function openFileFromCollection(agent, device, system, fileName, targetLabel, attempts = 4) {
  let lastError = '';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await agent.aiDoubleClick(targetLabel);
    } catch (error) {
      lastError = String(error && error.message ? error.message : error);
      console.log(`第${attempt}次双击“${fileName}”动作异常: ${lastError}`);
    }
    try {
      const win = await waitEditorWindow(system, fileName, 15000);
      console.log(`第${attempt}次双击后检测到文本编辑器窗口: ${win}`);
      return win;
    } catch (error) {
      lastError = String(error && error.message ? error.message : error);
      console.log(`第${attempt}次双击后未检测到文本编辑器窗口: ${lastError}`);
      try { await device.pressKey('Escape'); } catch (e2) { }
      await sleep(1500);
    }
  }
  throw new Error(`双击打开集合中的 ${fileName} 失败（已重试${attempts}次）: ${lastError}`);
}

async function menuItems(agent) {
  try {
    const raw = await agent.aiQuery('当前屏幕上弹出的右键菜单中所有菜单项的文字，按从上到下顺序返回字符串数组；没有菜单时返回空数组');
    return Array.isArray(raw) ? raw.map((s) => String(s)) : [];
  } catch (error) {
    return [];
  }
}

async function organizeDesktop(agent, device, system, attempts = 2) {
  const { showRealDesktop } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  let lastError = '';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await showRealDesktop(system, device);
      await agent.aiRightClick('桌面空白处');
      await agent.aiWaitFor('桌面右键菜单已显示', { timeoutMs: 15000 });
      await agent.aiTap('右键菜单中的整理桌面');
      await sleep(4000);
      await expectUi(agent, '桌面上出现了按文件类型分组的文件集合框，至少包含文档、视频、图片三个集合', 30000);
      // 等待集合布局与图标渲染稳定后再进行后续点击
      await sleep(1500);
      return;
    } catch (error) {
      lastError = String(error && error.message ? error.message : error);
      console.log(`第${attempt}次整理桌面失败: ${lastError}`);
      try { await device.pressKey('Escape'); } catch (e2) { }
      await sleep(1500);
    }
  }
  throw new Error(`桌面整理失败（已重试${attempts}次）: ${lastError}`);
}

describe('1964085-【桌面整理】桌面整理后编辑集合中的文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件并准备桌面文件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await system.exec(`rm -rf ${sq(DOC_FILE)} ${sq(RENAMED_FILE)} ${sq(VIDEO_FILE)} ${sq(IMAGE_FILE)} ${sq(NEW_FOLDER)} 2>/dev/null || true`, 15000);
    // 关闭上次运行残留的测试文件编辑器窗口，避免会话恢复导致窗口标题/焦点干扰
    const closedBefore = await closeTestEditorWindows(system);
    console.log(`beforeAll 关闭残留文本编辑器窗口数量=${closedBefore}`);
    await system.exec(`printf '1964085 original\\n' > ${sq(DOC_FILE)}; printf 'fake video\\n' > ${sq(VIDEO_FILE)}; convert -size 160x120 xc:'#2b7de9' ${sq(IMAGE_FILE)}`, 30000);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r '${ORG_RES}' -k '${ORG_KEY}' -v 0`, 10000);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r '${ORG_RES}' -k '${ORG_KEY}' -v 1`, 10000);
    await system.exec('systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service 2>/dev/null || true', 15000);
    await sleep(6000);
    await organizeDesktop(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { showRealDesktop } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await showRealDesktop(system, device);
    await organizeDesktop(agent, device, system);
  });

  test('1964085-【桌面整理】桌面整理后编辑集合中的文件', async ({ device, agent, system }) => {
    console.log('步骤1：编辑文档集合中的文本文档并保存');
    const editorWin = await openFileFromCollection(
      agent,
      device,
      system,
      '1964085-edit.txt',
      '桌面右侧“文档”集合框内的1964085-edit.txt文件图标（白色文档图标，不是图片或视频）',
    );
    console.log(`文本编辑器窗口已打开: ${editorWin}`);
    await sleep(1500);
    await agent.aiTap('文本编辑器的编辑区域');
    await device.pressKey('ctrl+a');
    await device.typeText('1964085 edited and saved');
    await device.pressKey('ctrl+s');
    await sleep(1500);
    await device.pressKey('alt+F4');
    await sleep(2500);
    const savedText = await system.exec(`cat ${sq(DOC_FILE)} 2>/dev/null || true`, 10000);
    if (!String(savedText?.stdout || '').includes('1964085 edited and saved')) {
      throw new Error(`文档保存失败，文件内容=${JSON.stringify(String(savedText?.stdout || ''))}`);
    }
    await expectUi(agent, '文档集合中仍然显示1964085-edit.txt文件');

    console.log('步骤2：重命名文档集合中的文本文档');
    await agent.aiRightClick('文档集合中的1964085-edit.txt');
    await sleep(1000);
    await agent.aiTap('右键菜单中的重命名');
    await sleep(1000);
    await device.pressKey('ctrl+a');
    await device.typeText('1964085-renamed.txt');
    await device.pressKey('Return');
    await sleep(2500);
    if (!(await exists(system, RENAMED_FILE))) throw new Error('重命名后文件1964085-renamed.txt不存在');
    if (await exists(system, DOC_FILE)) throw new Error('重命名后旧文件1964085-edit.txt仍然存在');
    await expectUi(agent, '文档集合中仍然显示1964085-renamed.txt文件');

    console.log('步骤3：右键视频集合中的视频检查菜单');
    await agent.aiRightClick('视频集合中的1964085-video.mp4');
    await sleep(1200);
    const items = await menuItems(agent);
    console.log(`视频右键菜单: ${items.join(' | ')}`);
    if (!items.some((item) => item.includes('打开')) || !items.some((item) => item.includes('删除'))) {
      throw new Error(`视频右键菜单缺少常用选项: ${items.join(' | ')}`);
    }
    await device.pressKey('Escape');
    await sleep(1000);

    console.log('步骤4：在图片集合中右键新建文件夹');
    await agent.aiRightClick('图片集合框内的空白区域');
    await sleep(1200);
    await agent.aiTap('右键菜单中的新建文件夹');
    await sleep(3000);
    if (!(await exists(system, NEW_FOLDER))) throw new Error('图片集合中新建文件夹后，桌面未出现新建文件夹');
    await expectUi(agent, '桌面上或图片集合中显示新建文件夹');
    console.log('1964085 测试完成');
  }, { timeout: 300000, tags: ['1964085', 'level3', 'desktop', 'desktop_organization', 'DITT', 'huangtian'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理单个用例现场');
    const { showRealDesktop } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    try { await showRealDesktop(system, device); } catch (error) { }
    await sleep(500);
  });

  afterAll(async ({ device, uos, agent, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager, showRealDesktop } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除测试文件前先关闭其编辑器窗口，避免编辑器持有文件或触发会话恢复
    const closedAfter = await closeTestEditorWindows(system);
    console.log(`afterAll 关闭残留文本编辑器窗口数量=${closedAfter}`);
    await system.exec(`rm -rf ${sq(DOC_FILE)} ${sq(RENAMED_FILE)} ${sq(VIDEO_FILE)} ${sq(IMAGE_FILE)} ${sq(NEW_FOLDER)} 2>/dev/null || true`, 15000);
    await resetDconfigDefaults(system);
    await closeFileManager(system);

    // 清理步骤：关闭桌面整理（resetDconfigDefaults 会把 enableOrganizer 恢复为默认 1，需显式关闭）
    let organizerOff = '';
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r '${ORG_RES}' -k '${ORG_KEY}' -v 0`, 10000);
      const res = await system.exec(`dde-dconfig --get -a org.deepin.dde.file-manager -r '${ORG_RES}' -k '${ORG_KEY}'`, 10000);
      organizerOff = String(res?.stdout || '').replace(/["']/g, '').trim();
      console.log(`第${attempt}次关闭桌面整理后 ${ORG_KEY}=${organizerOff}`);
      if (organizerOff === '0') break;
      await sleep(1000);
    }
    if (organizerOff !== '0') throw new Error(`关闭桌面整理失败：${ORG_KEY}=${organizerOff}`);
    await system.exec('systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service 2>/dev/null || true', 15000);
    await sleep(6000);
    console.log('桌面整理已关闭，桌面插件服务已重启');

    await showRealDesktop(system, device);
    await uos.showDesktop();
  });
});
