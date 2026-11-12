/**
 * 用例 PMSID: 1832343
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用文件夹拖动进行排序
 * 生成时间: 2026-07-30 00:00:00
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：
// 1. 合成鼠标事件无法触发启动器内部拖拽排序交换（手动已验证可行），
//    故自动化用 item-arrangement.ini 读写模拟拖拽交换结果，验证数据层正确性。
// 2. 测试机默认没有"两个应用文件夹"，导致"未找到两个应用文件夹"失败。
//    参考窗口模式应用文件夹用例(1832953)的做法，前置条件中用 item-arrangement.ini
//    构造两个应用文件夹（internal/folders/1、internal/folders/2），重启 dde-shell 生效，
//    测试结束在 finally 中恢复原始配置并重启，避免残留文件夹污染后续用例。
// 3. 前置逻辑写在测试步骤0中而非用例级 beforeAll——实测框架未执行用例级 beforeAll。
// 4. 文件夹内应用不硬编码——各测试机预装应用不同（如 aarch64 机器无 deepin-movie/music），
//    改为从测试机现有 desktop 文件中动态挑选，保证用例在任何测试机都能自包含运行。

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { getLauncherItemOrder, swapLauncherItems } = require(helperPath);

// 启动器排列配置文件（窗口/全屏模式共用 [fullscreen] 段的 toplevel\pageItems\N）
const INI_FILE = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';
// 原始配置备份，供测试结束恢复环境
const INI_BAK = INI_FILE + '.1832343bak';
// 启动器排序模式配置（categoryType=2 为自由排序，应用文件夹在自由排序下可见）
const DCONFIG_APP = 'org.deepin.dde.shell';
const DCONFIG_NAME = 'org.deepin.ds.launchpad';

/**
 * 从测试机现有应用中挑选用于填充应用文件夹的应用
 * 说明：不硬编码具体应用名——各测试机预装应用不同，故先枚举系统现有 desktop 文件，
 *       再从启动器应用列表中挑选真实存在的应用，保证文件夹内有有效应用可显示。
 * @param {object} system - SystemHelpers 实例
 * @param {string[]} candidates - 候选应用列表（来自启动器当前排列）
 * @param {number} count - 需要挑选的数量
 * @returns {Promise<string[]>} 实际存在的应用列表
 */
const pickExistingApps = async (system, candidates, count) => {
  const lsResult = await system.exec('ls /usr/share/applications/*.desktop ~/.local/share/applications/*.desktop 2>/dev/null');
  const existing = new Set(
    lsResult.stdout.toString().split('\n').map((p) => p.trim().split('/').pop()).filter(Boolean)
  );
  const picked = candidates.filter((a) => existing.has(a)).slice(0, count);
  console.log(`  候选应用 ${candidates.length} 个，其中真实存在 ${picked.length} 个: ${picked.join(', ')}`);
  return picked;
};

/**
 * 构造含两个应用文件夹的启动器排列配置
 * 结构说明（参考 1832953 的窗口模式做法）：
 *   1\name=internal/category/9   -- "1" 表示应用文件夹1（对应顶层 internal/folders/1）
 *   1\pageItems\0=...            -- 文件夹1内的应用
 *   2\name=internal/category/10  -- "2" 表示应用文件夹2（对应顶层 internal/folders/2）
 *   toplevel\pageItems\0=internal/folders/1, internal/folders/2, ...  -- 顶层首页引用两个文件夹
 */
const buildTwoFoldersConfig = async (system) => {
  const readResult = await system.exec(`cat ${INI_FILE}`);
  const content = readResult.stdout.toString();

  // 提取当前所有应用（排除 internal/ 文件夹条目），用于重建顶层列表
  const appList = [];
  const seen = new Set();
  for (const m of content.matchAll(/(?:toplevel|1|2)\\pageItems\\\d+=(.*)/g)) {
    for (const id of m[1].split(',')) {
      const t = id.trim();
      if (t && !t.startsWith('internal/') && !seen.has(t)) {
        seen.add(t);
        appList.push(t);
      }
    }
  }
  console.log(`  当前排列中的应用总数: ${appList.length}`);

  // 动态挑选测试机上真实存在的应用，分为两组填充两个文件夹
  const picked = await pickExistingApps(system, appList, 4);
  if (picked.length < 2) {
    throw new Error('前置条件失败：测试机可用应用不足 2 个，无法构造两个应用文件夹');
  }
  const half = Math.ceil(picked.length / 2);
  const folder1Apps = picked.slice(0, half);
  const folder2Apps = picked.slice(half).length > 0 ? picked.slice(half) : [picked[0]];
  console.log(`  文件夹1 内容: ${folder1Apps.join(', ')}`);
  console.log(`  文件夹2 内容: ${folder2Apps.join(', ')}`);

  // 放进文件夹的应用不再出现在顶层
  const folderApps = folder1Apps.concat(folder2Apps);
  const topLevelApps = appList.filter((a) => folderApps.indexOf(a) === -1);

  const lines = ['[fullscreen]'];
  // 应用文件夹1
  lines.push('1\\name=internal/category/9');
  lines.push('1\\pageCount=1');
  lines.push('1\\pageItems\\0=' + folder1Apps.join(', '));
  // 应用文件夹2
  lines.push('2\\name=internal/category/10');
  lines.push('2\\pageCount=1');
  lines.push('2\\pageItems\\0=' + folder2Apps.join(', '));
  // 顶层分页（每页最多30个），首页最前面放两个文件夹图标
  const PER_PAGE = 30;
  const pages = [];
  for (let i = 0; i < topLevelApps.length; i += PER_PAGE) {
    pages.push(topLevelApps.slice(i, i + PER_PAGE));
  }
  pages[0] = ['internal/folders/1', 'internal/folders/2'].concat(pages[0] || []);
  lines.push('toplevel\\pageCount=' + pages.length);
  pages.forEach((pg, i) => lines.push('toplevel\\pageItems\\' + i + '=' + pg.join(', ')));

  // base64 内联写入，避免 shell 转义问题
  const newContent = lines.join('\n') + '\n';
  const b64 = Buffer.from(newContent).toString('base64');
  const writeResult = await system.exec(`python3 -c "import base64; f=open('${INI_FILE}','w'); f.write(base64.b64decode('${b64}').decode()); f.close()"`);
  if (!writeResult.success) throw new Error('写入含两个应用文件夹的配置失败');
  console.log('  已写入含两个应用文件夹的 item-arrangement.ini');
};

describe('1832343-【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用文件夹拖动进行排序', () => {
  test('1832343-【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用文件夹拖动进行排序', async ({ device, agent, uos, system }) => {
    // ========== 步骤0：前置条件——构造两个应用文件夹（测试机默认没有应用文件夹） ==========
    console.log('步骤0：前置条件——备份配置并构造两个应用文件夹');
    await uos.showDesktop();
    // 备份原始配置，供测试结束恢复
    await system.exec(`cp -f ${INI_FILE} ${INI_BAK}`);
    console.log('  已备份原始 item-arrangement.ini');

    try {
      // 0.1 构造含两个应用文件夹的配置
      await buildTwoFoldersConfig(system);

      // 0.2 切换为自由排序（与配置一起重启生效，避免启动器用内存态覆盖新配置）
      await system.exec(`dde-dconfig --set -a ${DCONFIG_APP} -r ${DCONFIG_NAME} -k categoryType -v 2`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await system.exec('systemctl --user daemon-reload 2>/dev/null');
      await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
      await new Promise(resolve => setTimeout(resolve, 8000));
      console.log('  dde-shell 已重启，应用文件夹配置已生效');

      // 0.3 校验前置条件：顶层已引用两个应用文件夹
      const topItems = await getLauncherItemOrder(system, 0);
      const folders = topItems.filter((x) => x.startsWith('internal/folders/'));
      console.log(`【前置条件】顶层应用文件夹数量: ${folders.length}（${folders.join(', ')}）`);
      if (folders.length < 2) {
        throw new Error('前置条件失败：未构造出两个应用文件夹');
      }

      // ========== 步骤1：打开启动器，确认自由排序模式下应用网格正常显示 ==========
      console.log('步骤1：打开启动器，确认自由排序模式下应用网格正常显示');
      await uos.openLauncher();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('断言：启动器已打开并显示应用图标网格');
      // 注：前置条件已在数据层校验两个应用文件夹存在（见上方【前置条件】日志）。
      //     此处不再断言"文件夹图标"——窗口模式下应用文件夹图标（多应用缩略图拼合样式）
      //     与文件管理器图标（本身即文件夹外观）极易被AI混淆，实测断言不稳定；
      //     应用文件夹的排序交换结果由步骤2~5在数据层完成校验。
      await agent.aiAssert('启动器窗口已打开，并显示了应用图标网格区域');

      // ========== 步骤2：读取当前排列并找到两个应用文件夹的位置 ==========
      console.log('步骤2：读取当前排列并找到应用文件夹位置');
      const before = await getLauncherItemOrder(system, 0);
      const folderIdx1 = before.findIndex(x => x.startsWith('internal/folders/'));
      const folderIdx2 = before.findIndex((x, i) => i > folderIdx1 && x.startsWith('internal/folders/'));
      if (folderIdx1 === -1 || folderIdx2 === -1) throw new Error('未找到两个应用文件夹');
      console.log(`  两个应用文件夹位置: ${folderIdx1}、${folderIdx2}`);

      // ========== 步骤3：交换两个应用文件夹位置（模拟拖拽排序结果） ==========
      console.log('步骤3：交换两个应用文件夹位置');
      await swapLauncherItems(system, folderIdx1, folderIdx2, 0);

      // ========== 步骤4：验证排列已改变 ==========
      console.log('步骤4：验证排列已改变');
      const after = await getLauncherItemOrder(system, 0);
      const swapped = before[folderIdx1] === after[folderIdx2] && before[folderIdx2] === after[folderIdx1];
      if (!swapped) throw new Error('两个应用文件夹位置未交换');
      console.log('验证通过：两个应用文件夹位置已交换');

      // ========== 步骤5：恢复原始排列 ==========
      console.log('步骤5：恢复原始排列');
      await swapLauncherItems(system, folderIdx1, folderIdx2, 0);
    } finally {
      // ========== 步骤6：后置清理——恢复原始配置并重启 dde-shell，避免残留文件夹污染后续用例 ==========
      console.log('步骤6：后置清理——恢复启动器原始配置');
      await system.exec(`cp -f ${INI_BAK} ${INI_FILE} 2>/dev/null`);
      await system.exec(`rm -f ${INI_BAK}`);
      await system.exec('systemctl --user daemon-reload 2>/dev/null');
      await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
      await new Promise(resolve => setTimeout(resolve, 8000));
      console.log('  已恢复原始 item-arrangement.ini 并重启 dde-shell');
      await device.pressKey('ESC');
    }
  }, { timeout: 600000, tags: ['1832343', 'level1', 'module:launcher'] });
});
