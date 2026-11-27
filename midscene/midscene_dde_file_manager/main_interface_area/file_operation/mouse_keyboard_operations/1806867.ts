/**
 * 用例 PMSID: 1806867
 * 用例标题: 文件操作-Enter键打开文件或确定
 * 生成时间: 2026-11-14
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

const fs = require('fs');

const COMMON_SUFFIX = 'midscene_dde_file_manager/common/common.ts';

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();

// 放在 /tmp 而非桌面：桌面上新建目录会被 dde-shell 桌面插件与 ulnfs 监听接管，
// 跑测中实测会偶发让文管把该目录误判为“文件已被移动或删除”（0 项）。
const WORK_DIR = `/tmp/1806867Enter验证目录_${Date.now()}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findCommonDir() {
  const candidates = [
    process.env.TESTCASE_DIR,
    process.env.TESTCASE_DIR ? process.env.TESTCASE_DIR.replace(/apps\/?$/, '') : null,
    `${process.cwd()}/`,
  ].filter(Boolean);

  for (const dir of candidates) {
    const base = dir.endsWith('/') ? dir : `${dir}/`;
    if (fs.existsSync(`${base}${COMMON_SUFFIX}`)) {
      return base;
    }
  }
  throw new Error(`无法定位公共方法文件: ${COMMON_SUFFIX}`);
}

// 以桌面用户身份创建素材：midscene-uos 以 root 运行，而文管以桌面用户运行（/home/uos 为 ulnfs），
// root 创建的内容文管看不到，会显示“文件已被移动或删除”、0 项。
async function prepareMaterials(system) {
  await system.exec(`mkdir -p '${WORK_DIR}/1806867_folder' && touch '${WORK_DIR}/1806867_enter.txt'`, 5000);
  await system.exec(`chown -R ${TEST_USER}:${TEST_USER} '${WORK_DIR}' && chmod 755 '${WORK_DIR}'`, 5000);
}

async function openDir(uos, device, agent, system, dirPath) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await system.exec('killall dde-file-manager 2>/dev/null; true', 3000);
    await sleep(1500);

    if (attempt === 1) {
      // 主方案：以桌面用户身份通过命令行直达目录，不依赖窗口焦点与地址栏
      // setsid + nohup 让文管脱离当前命令的进程组，避免 system.exec 结束时被连带回收
      await system.exec(`setsid nohup sudo -u ${TEST_USER} dde-file-manager '${dirPath}' >/dev/null 2>&1 < /dev/null &`, 5000);
      await sleep(4000);
    } else {
      // 兜底方案：启动器打开 + Ctrl+L 地址栏输入
      await uos.openApp('文件管理器', { auth: true });
      await sleep(1000);
      await device.pressKey('Ctrl', 'l');
      await sleep(400);
      await device.pressKey('Ctrl', 'a');
      await device.typeText(dirPath, true);
    }

    await raiseFileManager(system);

    // 打开后等待内容区域就绪；期间按 F5 刷新，抵消文管偶发的“文件已被移动或删除”陈旧视图
    let ready = false;
    for (let i = 0; i < 3 && !ready; i++) {
      try {
        await agent.aiWaitFor('文件管理器内容区域已显示 1806867_enter.txt 和 1806867_folder', { timeoutMs: 10000 });
        ready = true;
      } catch (e) {
        await device.pressKey('F5');
        await sleep(1500);
      }
    }
    if (ready) {
      return;
    }
    console.log(`第 ${attempt} 次进入目录未成功，重试`);
  }
  throw new Error('多次尝试仍无法打开验证目录并展示素材文件');
}

// 确保文管窗口处于前台：跑测命令所在终端/IDE 窗口可能盖住文管，
// 此时 AI 的点击/按键会落到其它窗口，导致 Enter 行为无法真实验证。
async function raiseFileManager(system) {
  // 必须按“目录名”匹配：若用 '1806867' 会误匹配 IDE 打开的 1806867.ts 窗口，反而把 IDE 拉到最前。
  // windowactivate 置顶 + windowfocus 抢键盘焦点，确保后续 Enter 落在文管而不是终端/IDE。
  await system.exec(`xdotool search --name '验证目录' windowactivate --sync windowfocus %@ 2>/dev/null || true`, 5000);
  await sleep(500);
}

async function selectItem(agent, itemDesc) {
  for (let i = 0; i < 3; i++) {
    await agent.aiTap(`文件管理器内容区域中的 ${itemDesc}`, { deepThink: true });
    await sleep(500);
    const selected = await agent.aiBoolean(`文件管理器中 ${itemDesc} 的图标，当前处于选中状态（图标或文字有高亮选中框）`);
    if (selected) return;
  }
  throw new Error(`未能选中 ${itemDesc}`);
}

// 右键弹菜单：文管刚重开时右键偶发不生效，这里重试并显式校验菜单已弹出
async function openContextMenu(agent, system) {
  for (let i = 0; i < 3; i++) {
    await raiseFileManager(system);
    await agent.aiRightClick('文件管理器内容区域右侧的空白处（不要点在文件或文件夹图标上）', { deepThink: true });
    try {
      await agent.aiWaitFor('文件管理器的右键菜单已弹出（可见“新建文件夹”等菜单项）', { timeoutMs: 8000 });
      return;
    } catch (e) {
      console.log(`第 ${i + 1} 次右键未弹出菜单，重试`);
      await sleep(1000);
    }
  }
  throw new Error('多次右键均未弹出文件管理器右键菜单');
}

describe('1806867-文件操作-Enter键打开文件或确定', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const common = await import(`${findCommonDir()}${COMMON_SUFFIX}`);
    await common.closeFileManager(system);
    await prepareMaterials(system);
    await system.exec(`sudo -u ${TEST_USER} ls -la '${WORK_DIR}'`);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 测试前准备');
    await system.exec('killall dde-file-manager 2>/dev/null; true', 3000);
    await system.exec('killall deepin-editor 2>/dev/null; true', 3000);
    await system.exec('killall dde-control-center 2>/dev/null; true', 3000);
    await prepareMaterials(system);
    await system.exec(`sudo -u ${TEST_USER} ls '${WORK_DIR}' | wc -l`);
    await uos.showDesktop();
  });

  test('1806867-Enter键-文件/文件夹/控件/菜单/设置全覆盖', async ({ device, uos, agent, system }) => {
    // ---------- 场景1：文件 — Enter 打开 ----------
    console.log('步骤1：打开验证目录，选中 1806867_enter.txt 并按 Enter');
    await openDir(uos, device, agent, system, WORK_DIR);
    await raiseFileManager(system);
    await selectItem(agent, '1806867_enter.txt 文件');
    await raiseFileManager(system);
    await device.pressKey('Enter');

    // 用进程命令行做客观断言：桌面可能被跑测终端/IDE 遮挡，纯视觉断言会误判
    let fileOpened = false;
    for (let i = 0; i < 12 && !fileOpened; i++) {
      const r = await system.exec(`pgrep -af 'deepin-editor.*1806867_enter' 2>/dev/null || true`, 3000);
      fileOpened = String(r?.stdout || '').trim().length > 0;
      if (!fileOpened) await sleep(1500);
    }
    if (!fileOpened) {
      throw new Error('Enter 未能打开 1806867_enter.txt（未发现 deepin-editor 加载该文件）');
    }
    console.log('✅ 场景1通过：文件 Enter 打开成功');
    await system.exec('killall deepin-editor 2>/dev/null; true', 5000);

    // ---------- 场景2：文件夹 — Enter 打开 ----------
    console.log('步骤2：选中 1806867_folder 并按 Enter');
    await raiseFileManager(system);
    await selectItem(agent, '1806867_folder 文件夹');
    await raiseFileManager(system);
    await device.pressKey('Enter');

    await agent.aiWaitFor('文件管理器已进入 1806867_folder 文件夹内部（地址栏或路径显示该文件夹名）', { timeoutMs: 20000 });
    await agent.aiAssert('当前进入了 1806867_folder 文件夹内部（地址栏或路径已切换到该文件夹，内容区域显示其中条目）');
    console.log('✅ 场景2通过：文件夹 Enter 打开成功');
    await device.pressKey('Escape');

    // ---------- 场景3：控件 — Enter 确认行内重命名 ----------
    console.log('步骤3：右键空白处 → 新建文件夹，输入名称后按 Enter 确认');
    // 场景2 进入过子目录，这里重新打开验证目录，确保后续操作发生在 WORK_DIR 内
    await openDir(uos, device, agent, system, WORK_DIR);
    await openContextMenu(agent, system);
    await agent.aiTap('右键菜单中的“新建文件夹”', { deepThink: true });
    await agent.aiWaitFor('出现了新建文件夹的行内重命名输入框', { timeoutMs: 10000 });

    // 输入唯一名称：这样“Enter 是否确认了控件”可以用磁盘结果客观验证，
    // 不再依赖“重命名输入框是否消失”这种易误判的视觉判断。
    const NEW_FOLDER_NAME = `enter_confirm_${Date.now() % 1000000}`;
    await raiseFileManager(system);
    await device.typeText(NEW_FOLDER_NAME, false);
    await raiseFileManager(system);
    await device.pressKey('Enter');

    let folderCreated = false;
    for (let i = 0; i < 10 && !folderCreated; i++) {
      // 每 3 次未生效则重新抢焦点并按一次 Enter，规避偶发的按键未送达
      if (i > 0 && i % 3 === 0) {
        await raiseFileManager(system);
        await device.pressKey('Enter');
      }
      const r = await system.exec(`ls -d '${WORK_DIR}/${NEW_FOLDER_NAME}' 2>/dev/null | wc -l`, 3000);
      folderCreated = String(r?.stdout || '').trim() === '1';
      if (!folderCreated) await sleep(1000);
    }
    if (!folderCreated) {
      throw new Error(`按 Enter 后未生成名称已被确认的文件夹 ${NEW_FOLDER_NAME}`);
    }
    console.log('✅ 场景3通过：控件 Enter 确认成功');
    await device.pressKey('Escape');

    // ---------- 场景4：菜单选项 — Enter 激活右键菜单项 ----------
    console.log('步骤4：右键空白处，键盘 ↓ 定位到“新建文件夹”，按 Enter 激活');
    await openDir(uos, device, agent, system, WORK_DIR);
    await openContextMenu(agent, system);

    // 菜单项顺序随版本/语言可能变化，逐次按 ↓ 并校验高亮项，避免盲目按键数量导致的误选
    let highlighted = false;
    for (let i = 0; i < 10; i++) {
      // 注意：该 device 的方向键名称是 'Down'/'Up'，'ArrowDown' 会报 Key ArrowDown not found
      await device.pressKey('Down');
      await sleep(250);
      highlighted = await agent.aiBoolean('右键菜单中“新建文件夹”这一项当前处于高亮选中状态');
      if (highlighted) break;
    }
    if (!highlighted) {
      throw new Error('断言失败：方向键未能定位到“新建文件夹”菜单项');
    }

    await raiseFileManager(system);
    await device.pressKey('Enter');

    let menuCreated = false;
    for (let i = 0; i < 10 && !menuCreated; i++) {
      const r = await system.exec(`ls '${WORK_DIR}' | grep -c '^新建文件夹' || true`, 3000);
      menuCreated = parseInt(String(r?.stdout || '0').trim(), 10) > 0;
      if (!menuCreated) await sleep(1000);
    }
    if (!menuCreated) {
      throw new Error('按 Enter 后未激活“新建文件夹”菜单项（目录内未新增新建文件夹）');
    }
    console.log('✅ 场景4通过：菜单 Enter 激活成功');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
    await system.exec('killall dde-file-manager 2>/dev/null; true', 3000);

    // ---------- 场景5：系统设置 — Enter 不破坏当前页面 ----------
    console.log('步骤5：打开控制中心并进入“个性化 / 壁纸”，按 Enter 后页面保持正常');
    // dde-control-center 对 Alt+F4 无响应，统一用 killall 关闭
    // 说明：UOS 25 上 dde-control-center 呈现为“设置”应用（默认停在“系统”页），
    // 因此等待条件不能写“控制中心窗口”，需按“设置窗口 + 左侧导航栏”判断。
    await system.exec('killall dde-control-center 2>/dev/null; true', 3000);
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiWaitFor('系统设置窗口已显示（窗口左侧有一列设置导航项）', { timeoutMs: 20000 });

    // 进入“个性化”，点不准时重试一次并做客观校验
    let personalizationShown = false;
    for (let i = 0; i < 2 && !personalizationShown; i++) {
      await agent.aiTap('左侧导航栏中的“个性化”', { deepThink: true });
      await sleep(1200);
      personalizationShown = await agent.aiBoolean('当前显示的是“个性化”设置页面（能看到主题、壁纸与屏保、图标等个性化选项）');
    }
    if (!personalizationShown) {
      throw new Error('未能进入“个性化”设置页面');
    }

    await agent.aiTap('“壁纸与屏保”入口', { deepThink: true });
    // 实测该入口进入的是“个性化 / 壁纸”页（不一定同时展示屏保内容），等待条件按实际页面写
    await agent.aiWaitFor('已进入个性化下的壁纸设置页面（页面顶部路径显示“个性化 / 壁纸”，可见壁纸预览或壁纸列表）', { timeoutMs: 15000 });

    // 先点空白区域激活窗口，再按 Enter
    await agent.aiTap('壁纸设置页右侧空白区域');
    await device.pressKey('Enter');
    await sleep(1000);

    // Enter 不应让设置页关闭或崩溃；只要窗口仍在就算通过
    await agent.aiAssert('壁纸设置页仍然显示（未因为 Enter 异常关闭或跳转）');
    console.log('✅ 场景5通过：设置页 Enter 行为符合预期');
    await system.exec('killall dde-control-center 2>/dev/null; true', 5000);

    console.log('===1806867-文件操作-Enter键打开文件或确定，执行成功===');
  }, { timeout: 900000, tags: ['1806867', 'level4', 'mouse_keyboard', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 测试后清理');
    try { await device.pressKey('Escape'); } catch (_) {}
    await system.exec('killall dde-file-manager 2>/dev/null; true', 3000);
    await system.exec('killall deepin-editor 2>/dev/null; true', 3000);
    await system.exec('killall dde-control-center 2>/dev/null; true', 3000);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager 2>/dev/null; true', 3000);
    await system.exec(`rm -rf '${WORK_DIR}'`, 5000);
    await uos.showDesktop();
  });
});
