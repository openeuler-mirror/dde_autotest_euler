/**
 * 用例 PMSID: 1816507
 * 用例标题: 组策略配置自动排序-修改组策略为关闭时，检查桌面图标及右键菜单
 * 生成时间: 2026-11-10
 * 用例编写人：UT000159（游伟）
 */
// 组策略路径: org.deepin.dde.file-manager → org.deepin.dde.file-manager.desktop → Enable auto align on desktop [autoAlign]
// 用例原文要求安装并使用 dde-dconfig-editor；按任务补充说明，统一改用 dde-dconfig 命令行设置/获取。
// 桌面右键菜单的“桌面设置”对话框里，对应项为“自动排列图标”开关；autoAlign > 0 为开启，<= 0（含默认 -1）为关闭。
// 定位策略（无障碍优先、AI 兜底）：桌面右键菜单与“桌面设置”对话框由 dde-shell 绘制，菜单项无可用 AT-SPI 节点，按适配器规则走 AI；
//   autoAlign 的取值与恢复以命令行为准，不依赖视觉截图，保证判定可复验。
// 状态保护：beforeAll 先读取当前值并记录（-1 为默认值，表示从未修改过）；afterAll 恢复测试前状态，
//   先在“桌面设置”窗口把开关拨回，测试前为默认值时执行 dde-dconfig reset 恢复默认值。
// 用例步骤: 1) 修改组策略 autoAlign 为 0（预期：修改成功）；2) 检查桌面（预期：已关闭自动排列，右键菜单中自动排列已取消勾选）。
// 注意：该功能为镜像制作时是否打开自动排列，桌面图标不会立即重新排列；外部命令改写组策略后，已打开的“桌面设置”窗口不会实时刷新，
//   因此需关闭后重新打开“桌面设置”，再检查“自动排列图标”的勾选状态。

describe('1816507-组策略配置自动排序-修改组策略为关闭时，检查桌面图标及右键菜单', () => {
  let originalValue = '';

const DC_APP = 'org.deepin.dde.file-manager';
const DC_RES = 'org.deepin.dde.file-manager.desktop';
const DC_KEY = 'autoAlign';
const DC_ARGS = `-a ${DC_APP} -r ${DC_RES} -k ${DC_KEY}`;
const SWITCH_PROMPT = '“桌面设置”对话框中“自动排列图标”这一行右侧的开关处于开启状态（开关为蓝色高亮）';

/** 读取 autoAlign 当前值（去掉命令行输出的引号） */
async function readAutoAlign(system) {
  const res = await system.exec(`dde-dconfig get ${DC_ARGS}`);
  return String((res && res.stdout) || '').trim().replace(/^["']|["']$/g, '');
}

/** 写入 autoAlign 值（命令行方式，用于前置准备、组策略修改与兜底恢复） */
async function writeAutoAlign(system, value) {
  await system.exec(`dde-dconfig set ${DC_ARGS} -v ${value}`);
}

/** 打开 右击桌面 → 桌面设置 对话框 */
async function openDesktopSettings(agent, uos) {
  await uos.showDesktop();
  await agent.aiRightClick('桌面空白处');
  await agent.aiWaitFor('桌面右键菜单已弹出', { timeoutMs: 30000, checkIntervalMs: 1000 });
  await agent.aiTap('桌面右键菜单中的“桌面设置”', { deepThink: true });
  await agent.aiWaitFor('已弹出“桌面设置”对话框，其中能看到“自动排列图标”选项', { timeoutMs: 30000, checkIntervalMs: 1000 });
}

/** 关闭“桌面设置”对话框并回到桌面 */
async function closeDesktopSettings(device, uos) {
  await device.pressKey('Escape');
  await uos.showDesktop();
}

/** “自动排列图标”右侧开关是否处于开启状态 */
async function autoAlignSwitchOn(agent) {
  return await agent.aiBoolean(SWITCH_PROMPT);
}

/** 判定“自动排列图标”开关状态，最多复核 tryTimes 次（视觉判定偶有抖动，用多次复核稳定结论） */
async function assertAutoAlignSwitch(agent, want, tryTimes) {
  const times = tryTimes || 3;
  let last = null;
  for (let i = 1; i <= times; i++) {
    last = await autoAlignSwitchOn(agent);
    console.log(`第 ${i}/${times} 次复核：“自动排列图标”开关处于${last ? '开启' : '关闭'}状态`);
    if (last === want) {
      return;
    }
  }
  throw new Error(`“桌面设置”中“自动排列图标”开关不是预期的${want ? '开启' : '关闭'}状态`);
}

/** 把“自动排列图标”开关拨到期望状态（已经一致时不再点击） */
async function setAutoAlignSwitch(agent, want) {
  const current = await autoAlignSwitchOn(agent);
  if (current !== want) {
    await agent.aiTap('“桌面设置”对话框中“自动排列图标”这一行右侧的开关', { deepThink: true });
    await agent.aiWaitFor(
      want
        ? '“桌面设置”对话框中“自动排列图标”右侧的开关处于开启状态（蓝色高亮）'
        : '“桌面设置”对话框中“自动排列图标”右侧的开关处于关闭状态（灰色）',
      { timeoutMs: 30000, checkIntervalMs: 1000 },
    );
  }
}

/** 恢复测试前状态：默认值用 dde-dconfig reset；否则先在图形窗口把开关拨回，再用命令行兜底 */
async function restoreAutoAlign(agent, uos, device, system, originalValue) {
  if (originalValue === '' || originalValue === '-1') {
    console.log('测试前 autoAlign 为默认值，执行 dde-dconfig reset 恢复默认值');
    await system.exec(`dde-dconfig reset ${DC_ARGS}`);
    return;
  }
  console.log(`测试前 autoAlign = ${originalValue}，先从“桌面设置”窗口恢复`);
  await openDesktopSettings(agent, uos);
  await setAutoAlignSwitch(agent, Number(originalValue) > 0);
  await closeDesktopSettings(device, uos);
  const restored = await readAutoAlign(system);
  if (restored !== originalValue) {
    console.log(`图形恢复后 autoAlign = ${restored}，与测试前 ${originalValue} 不一致，改用命令行恢复`);
    await writeAutoAlign(system, originalValue);
  }
}

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 读取当前 autoAlign 值并准备前置条件');
    await uos.showDesktop();
    await device.releaseAllKeys();

    originalValue = await readAutoAlign(system);
    console.log(`测试前 autoAlign = ${originalValue}（-1 表示未曾修改过，为默认值）`);

    // 前置条件：组策略 autoAlign = 1，即桌面已在右键菜单开启自动排列
    await writeAutoAlign(system, 1);
    const prepared = await readAutoAlign(system);
    console.log(`前置准备完成 autoAlign = ${prepared}`);
    if (prepared !== '1') {
      throw new Error(`前置条件设置失败：autoAlign 应为 1，实际为 ${prepared}`);
    }
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1816507-组策略配置自动排序-修改组策略为关闭时，检查桌面图标及右键菜单', async ({ device, agent, uos, system }) => {
    // 前置确认：自动排列当前为开启
    console.log('前置确认：打开 桌面设置，确认自动排列当前为开启');
    await openDesktopSettings(agent, uos);
    await assertAutoAlignSwitch(agent, true, 3);
    await closeDesktopSettings(device, uos);

    // 步骤 1：修改组策略 autoAlign 为 0（小于等于 0 的任意数，不包括 -1）——预期：修改成功
    console.log('步骤 1：通过 dde-dconfig 修改组策略 autoAlign 的值为 0');
    await writeAutoAlign(system, 0);
    const modified = await readAutoAlign(system);
    console.log(`修改组策略后 autoAlign = ${modified}`);
    if (modified !== '0') {
      throw new Error(`修改组策略失败：autoAlign 应为 0，实际为 ${modified}`);
    }

    // 步骤 2：检查桌面——已关闭自动排列，桌面右键菜单中自动排列已取消勾选
    console.log('步骤 2：重新打开 桌面设置，检查自动排列已取消勾选');
    await openDesktopSettings(agent, uos);
    await assertAutoAlignSwitch(agent, false, 3);
    await agent.logScreenshot('组策略改为关闭后');

    const valueAfterReopen = await readAutoAlign(system);
    console.log(`重新打开桌面设置后 autoAlign = ${valueAfterReopen}`);
    if (valueAfterReopen !== '0') {
      throw new Error(`重新打开桌面设置后 autoAlign 应为 0，实际为 ${valueAfterReopen}`);
    }

    await closeDesktopSettings(device, uos);
  }, { timeout: 300000, tags: ['1816507', 'level3', 'file_manager', 'youwei'] });

  afterAll(async ({ device, agent, uos, system }) => {
    console.log('3. afterAll: 恢复测试前状态并清理残留');
    await device.pressKey('Escape');
    await uos.showDesktop();

    await restoreAutoAlign(agent, uos, device, system, originalValue);

    const finalValue = await readAutoAlign(system);
    console.log(`恢复后 autoAlign = ${finalValue}`);
    if (finalValue !== originalValue) {
      throw new Error(`环境恢复失败：测试前 autoAlign = ${originalValue}，恢复后为 ${finalValue}`);
    }
    await device.releaseAllKeys();
  });
});

