/**
 * 用例 PMSID: 1502675
 * 用例标题: 【控制中心】【个性化】【壁纸】多屏扩展模式下，壁纸界面-更新展现屏幕TAB项
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
let originSecondaryIsClone = true;

describe('1502675-【控制中心】【个性化】【壁纸】多屏扩展模式下，壁纸界面-更新展现屏幕TAB项', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 通过 xrandr 检测双屏连接（克隆模式下 device.monitors() 仅返回1个，故先用 xrandr 判断）
    const r = await system.exec('xrandr --query');
    const connectedOutputs = r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (connectedOutputs.length < 2) {
      throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    }
    if (!connectedOutputs.some(l => l.startsWith(SECONDARY_MONITOR))) {
      throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);
    }

    const secMatch = r.stdout.match(new RegExp(`${SECONDARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    const priMatch = r.stdout.match(new RegExp(`${PRIMARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    originSecondaryIsClone = secMatch && priMatch ? (secMatch[2] === priMatch[2] && secMatch[3] === priMatch[3]) : true;

    // 扩展模式
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 验证扩展模式已生效
    const monitors = await device.monitors();
    if (monitors.length < 2) {
      throw new Error('设置扩展模式后仍未检测到双屏');
    }
    console.log('已设置扩展模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1502675-【控制中心】【个性化】【壁纸】多屏扩展模式下，壁纸界面-更新展现屏幕TAB项', async ({ device, agent, uos, system }) => {
    // 步骤1: 接入外接屏幕，并且当前为扩展模式，打开壁纸界面
    await uos.openApp('控制中心', { maximizeWindow: false });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/wallpaper"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期1: 界面内，更新显示各屏幕名称的TAB项，默认焦点选项为"主屏"（主屏名称为eDP）
    await agent.aiAssert('壁纸界面顶部显示各屏幕名称的TAB项（包含eDP和HDMI-A-0），默认焦点选中主屏对应的TAB项（eDP）');

    // 步骤2: 拔掉外接屏幕（用 xrandr --disable 模拟拔掉）
    // 关闭控制中心，禁用副屏，再重新打开壁纸界面
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('步骤2: 模拟拔掉外接屏幕');
    await system.exec(`xrandr --output ${SECONDARY_MONITOR} --off`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await uos.openApp('控制中心', { maximizeWindow: false });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/wallpaper"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期2: 界面内，更新不展示屏幕名称的TAB项
    await agent.aiAssert('壁纸界面顶部不展示屏幕名称的TAB项（只剩单屏，无多屏TAB切换项）');
  }, { timeout: 600000, tags: ['1502675', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try { await uos.closeCurrentWindow(); } catch (e) {}
    // 还原副屏 + 显示模式
    try {
      await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 ${originSecondaryIsClone ? `--same-as ${PRIMARY_MONITOR}` : `--pos 1920x0`}`);
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {}
    console.log('afterAll 完成');
  });
});
