/**
 * 用例 PMSID: 1801605
 * 用例标题: 【通知中心】最小分辨率+最大字体，通知中心展示正常
 * 生成时间: 2026-08-03 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801605-【通知中心】最小分辨率+最大字体，通知中心展示正常', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const OUTPUT = 'eDP';
  const FALLBACK_RES = '1920x1080';
  const FALLBACK_MIN_RES = '640x480';
  let defaultRes = FALLBACK_RES;
  let minRes = FALLBACK_MIN_RES;

  const parseXrandrResolutions = (xrandrOut) => {
    const resolutions = [];
    const modeLines = xrandrOut.split('\n');
    let inTargetOutput = false;
    for (const line of modeLines) {
      if (new RegExp(OUTPUT.replace('-', '[-\\d]*') + '\\s+connected').test(line)) {
        inTargetOutput = true;
        continue;
      }
      if (inTargetOutput && /^\s+\S/.test(line) && !line.match(/^\s+(\d+x\d+)/)) {
        break;
      }
      if (inTargetOutput) {
        const m = line.match(/^\s+(\d+)x(\d+)\s/);
        if (m) {
          const w = parseInt(m[1]);
          const h = parseInt(m[2]);
          const hasStar = line.includes('*');
          const hasPlus = line.includes('+');
          resolutions.push({ res: m[0].trim(), w, h, pixels: w * h, isCurrent: hasStar, isPreferred: hasPlus });
        }
      }
    }
    return resolutions;
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('确保任务栏在底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const xrandrOut = (await system.exec('xrandr --current')).stdout;
    const resolutions = parseXrandrResolutions(xrandrOut);
    console.log(`可用分辨率: ${resolutions.map(r => r.res).join(', ')}`);

    if (resolutions.length > 0) {
      const current = resolutions.find(r => r.isCurrent);
      const preferred = resolutions.find(r => r.isPreferred);
      console.log(`xrandr 识别 - 带*号(当前)分辨率: ${current ? current.res : '无'}, 带+号(首选)分辨率: ${preferred ? preferred.res : '无'}`);
      defaultRes = current ? current.res : (preferred || resolutions[0]).res;
      const sorted = [...resolutions].sort((a, b) => a.pixels - b.pixels);
      minRes = sorted[0].res;
    } else {
      console.warn('未解析到任何分辨率，使用 fallback');
    }
    console.log(`当前分辨率: ${defaultRes}，最小分辨率: ${minRes}`);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801605-最小分辨率+最大字体通知中心展示正常', async ({ device, agent, uos, system }) => {
    const apps = ['dde-control-center', 'org.deepin.browser', 'deepin-terminal', 'dde-file-manager', 'deepin-music'];
    for (let i = 0; i < apps.length; i++) {
      await system.exec(`notify-send -a '${apps[i]}' "常驻通知${i + 1}" "这是来自${apps[i]}的第${i + 1}条常驻通知内容" -t 0`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`notify-send -a '${apps[i]}' "非常驻通知${i + 1}" "这是来自${apps[i]}的第${i + 1}条非常驻通知内容" -t 60000`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    await uos.showDesktop();

    await system.exec('busctl --user set-property org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 FontSize d 15');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`切换分辨率到最小值: ${minRes}`);
    await system.exec(`xrandr --output ${OUTPUT} --mode ${minRes}`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.aiAssert('通知中心界面已显示');

    await agent.aiAssert('通知中心中通知标题和通知正文文字显示完整，没有出现文字被截断、省略号截断的情况');

    await agent.aiAssert('通知中心中每条通知内容的显示行数没有超过设置的最大展示行数，没有出现内容溢出或文字重叠');

    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 300000, tags: ['1801605', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`恢复分辨率为: ${defaultRes}`);
    await system.exec(`xrandr --output ${OUTPUT} --mode ${defaultRes}`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('恢复字号为默认值14（DBus FontSize=10.5）');
    await system.exec('busctl --user set-property org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 FontSize d 10.5');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
