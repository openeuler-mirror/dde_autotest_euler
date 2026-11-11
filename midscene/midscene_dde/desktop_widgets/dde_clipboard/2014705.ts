/**
 * 用例 PMSID: 2014705
 * 用例标题: 【桌面】【剪贴板】多屏不同分辨率下，剪贴板保持相对居右展示
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_POS = (p) => `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v '"${p}"'`;
const SET_HIDE = (m) => `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v '"${m}"'`;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
let originPos = '', originHide = '', originSecondaryIsClone = true;
// 保存原始副屏分辨率和位置，afterAll 精确还原
let originSecondaryMode = '1920x1080';
let originSecondaryPos = '0x0';

// 获取剪贴板窗口所在屏幕及X坐标
// 剪贴板窗口关闭后仍会驻留在 wmctrl 列表中（隐藏状态），必须用 xwininfo 的 Map State 判断是否真正可见
async function getClipboardInfo(system) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes('DDE Clipboard') || line.includes('Clipboard')) {
      const id = line.trim().split(/\s+/)[0];
      const xi = await system.exec(`xwininfo -id ${id} 2>/dev/null`);
      if (!xi.stdout.includes('IsViewable')) continue;
      const parts = line.trim().split(/\s+/);
      const x = parseInt(parts[2], 10);
      return { x, screen: x >= SCREEN_W ? 'secondary' : 'primary' };
    }
  }
  return null;
}

describe('2014705-【桌面】【剪贴板】多屏不同分辨率下，剪贴板保持相对居右展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const _r = await system.exec('xrandr --query');
    const _connectedOutputs = _r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (_connectedOutputs.length < 2) throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    if (!_connectedOutputs.some(l => l.startsWith(SECONDARY_MONITOR))) throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);

    originPos = (await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position`)).stdout.trim();
    originHide = (await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode`)).stdout.trim();
    const r = await system.exec('xrandr --query');
    const secMatch = r.stdout.match(new RegExp(`${SECONDARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    const priMatch = r.stdout.match(new RegExp(`${PRIMARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    originSecondaryIsClone = secMatch && priMatch ? (secMatch[2] === priMatch[2] && secMatch[3] === priMatch[3]) : true;
    // 保存原始副屏分辨率和位置
    originSecondaryMode = secMatch ? secMatch[1] : '1920x1080';
    originSecondaryPos = secMatch ? `${secMatch[2]}x${secMatch[3]}` : '0x0';
    console.log(`原始副屏模式: ${originSecondaryMode}, 位置: ${originSecondaryPos}, 是否克隆: ${originSecondaryIsClone}`);

    // 扩展模式 + 不同分辨率：eDP 1920x1080，HDMI 1600x900
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1600x900 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(SET_POS('bottom'));
    await system.exec(SET_HIDE('keep-showing'));
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec('systemctl --user restart dde-clipboard 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('已设置扩展模式不同分辨率，任务栏位置下');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // 打开剪贴板并验证在主屏相对居右
  async function openAndVerifyClipboard(system, scenario) {
    let info = null;
    for (let i = 0; i < 3 && !info; i++) {
      await system.exec('xdotool key Super+v');
      await new Promise(resolve => setTimeout(resolve, 1500));
      info = await getClipboardInfo(system);
    }
    if (!info) {
      throw new Error(`${scenario}：剪贴板界面应已打开`);
    }
    console.log(`${scenario}：剪贴板窗口 x=${info.x}，所在屏=${info.screen}`);
    if (info.screen !== 'primary') {
      throw new Error(`${scenario}：剪贴板应在主屏相对居右展示`);
    }
    if (info.x <= 800) {
      throw new Error(`${scenario}：剪贴板应在主屏相对右侧（x>800）`);
    }
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  test('2014705-【桌面】【剪贴板】多屏不同分辨率下，剪贴板保持相对居右展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开剪贴板（任务栏位置：下）
    console.log('步骤1: 任务栏位置下，打开剪贴板');
    await openAndVerifyClipboard(system, '任务栏位置下');

    // 步骤2: 任务栏位置：右，再打开剪贴板
    console.log('步骤2: 任务栏位置右，打开剪贴板');
    await system.exec(SET_POS('right'));
    await system.exec(SET_HIDE('keep-showing'));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await openAndVerifyClipboard(system, '任务栏位置右');

    // 步骤3: 任务栏位置：右，并设置自动隐藏，再打开剪贴板
    console.log('步骤3: 任务栏位置右+自动隐藏，打开剪贴板');
    await system.exec(SET_POS('right'));
    await system.exec(SET_HIDE('smart-hide'));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await openAndVerifyClipboard(system, '任务栏位置右+自动隐藏');
    // 任务栏保持隐藏
    const dockRes = await system.exec('wmctrl -l -G 2>/dev/null');
    console.log('任务栏窗口:', dockRes.stdout.split('\n').filter(l => l.includes('org.deepin.ds.dock')));

    // 汇总视觉验证：重新打开剪贴板做最终 aiAssert（helper 每次验证后会关闭剪贴板）
    // 使用与 openAndVerifyClipboard 相同的重试逻辑，确保剪贴板真正打开后再做视觉断言
    let cbOpen = false;
    for (let i = 0; i < 3 && !cbOpen; i++) {
      await system.exec('xdotool key Super+v');
      await new Promise(resolve => setTimeout(resolve, 1500));
      cbOpen = !!(await getClipboardInfo(system));
    }
    if (!cbOpen) {
      throw new Error('汇总视觉验证：剪贴板面板应已打开，但 3 次尝试均未成功');
    }
    // 建立可观测证据链：等 AI 确认剪贴板可见后再做断言
    await agent.aiWaitFor('剪贴板面板在主屏上可见，面板内有历史剪贴板记录项或占位提示文字', { timeoutMs: 10000 });
    await agent.aiAssert('多屏不同分辨率扩展模式下（左侧主屏1920x1080 + 右侧副屏1600x900），剪贴板面板在主屏相对居右展示，未出现在副屏侧');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 800));
  }, { timeout: 600000, tags: ['2014705', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try {
      if (originPos) await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v '"${JSON.parse(originPos)}"'`);
      if (originHide) await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v '"${JSON.parse(originHide)}"'`);
      await system.exec(SET_PRIMARY_ONLY);
      // 根据原始状态精确还原显示配置（不再硬编码为克隆模式）
      let restoreCmd;
      if (originSecondaryIsClone) {
        restoreCmd = `xrandr --output ${PRIMARY_MONITOR} --primary --output ${SECONDARY_MONITOR} --same-as ${PRIMARY_MONITOR}`;
      } else {
        restoreCmd = `xrandr --output ${PRIMARY_MONITOR} --primary --output ${SECONDARY_MONITOR} --mode ${originSecondaryMode} --pos ${originSecondaryPos}`;
      }
      console.log(`还原显示配置: ${restoreCmd}`);
      await system.exec(restoreCmd);
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      await new Promise(resolve => setTimeout(resolve, 2000));
      // ApplyChanges 后 showDesktop 触发壁纸重绘
      await uos.showDesktop();
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.log(`afterAll 还原过程出错: ${err.message}`);
    }
    // 确认回到桌面，完成环境恢复
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
