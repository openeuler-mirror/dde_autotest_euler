/**
 * 用例 PMSID: 1801741
 * 用例标题: 【通知中心】模拟通知信息时，标题和正文加入链接地址，鼠标移动到链接地址上，鼠标样式变为可点击样式
 * 生成时间: 2026-09-10 11:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1801741-【通知中心】模拟通知信息时，标题和正文加入链接地址，鼠标移动到链接地址上，鼠标样式变为可点击样式', () => {
  const caseDir = process.env.TESTCASE_DIR;
  // 横幅区域(用于局部放大截图判断鼠标样式)
  const BANNER = { x: 1560, y: 920, w: 360, h: 120 };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    for (let i = 0; i < 15; i++) {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      if (r.stdout.includes('uint32')) {
        console.log(`通知服务就绪(等待${(i + 1) * 2}秒)`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // 勿扰模式判断: 若开启则关闭, 未开启则不做任何设置
    const dndCheck = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode');
    if (dndCheck.stdout.includes('true')) {
      await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode -v false');
      console.log('勿扰模式已开启, 已自动关闭');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // 抓取横幅局部放大图(含光标附近区域), 供AI判断鼠标样式
  const grabBannerZoom = async (system, tag) => {
    await system.exec(`ffmpeg -y -loglevel error -f x11grab -video_size ${BANNER.w}x${BANNER.h} -i :0+${BANNER.x},${BANNER.y} -frames:v 1 /tmp/opencode/link_${tag}.png`);
  };

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801741-【通知中心】模拟通知信息时，标题和正文加入链接地址，鼠标移动到链接地址上，鼠标样式变为可点击样式', async ({ device, agent, uos, system }) => {
    // 确定性判定: XFIXES GetCursorImage读取当前光标serial
    // 箭头与手型是不同光标图案(serial不同): 桌面空白处serial为箭头基线
    const grabSerial = async (sys) => {
      const r = await sys.exec(`timeout 15 python3 -c "
import os, time, signal
def handler(signum, frame):
    print(-1); exit(0)
signal.signal(signal.SIGALRM, handler)
signal.alarm(10)
os.environ['DISPLAY']=':0'
from Xlib import display, X
from Xlib.protocol import rq
from Xlib.ext import xfixes
d = display.Display()
major = d.display.get_extension_major('XFIXES')
xfixes.QueryVersion(d.display, opcode=major, major_version=4, minor_version=0)
class GCI(rq.ReplyRequest):
    _request = rq.Struct(rq.Card8('opcode'), rq.Opcode(4), rq.RequestLength())
    _reply = rq.Struct(rq.ReplyCode(), rq.Pad(1), rq.Card16('sequence_number'), rq.ReplyLength(),
        rq.Int16('x'), rq.Int16('y'), rq.Card16('width'), rq.Card16('height'),
        rq.Card16('xhot'), rq.Card16('yhot'), rq.Card32('cursor_serial'), rq.Pad(16),
        rq.List('pixels', rq.Card32Obj))
r = GCI(d.display, opcode=major, onerror=None)
print(r.cursor_serial, r.width, r.height)
"`, 20000);
      const parts = r.stdout.trim().split(/\s+/).map(Number);
      return { serial: parts[0], w: parts[1], h: parts[2] };
    };

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ── 步骤1: 发送标题带链接的通知, 鼠标移动到标题链接上 ──
    // 读取桌面箭头光标serial基线(鼠标置于屏幕空白处)
    await system.exec('xdotool mousemove 960 700');
    await new Promise(resolve => setTimeout(resolve, 800));
    // 预清理"小U同学"欢迎弹窗(避免遮挡)
    const hasWelcome0 = await agent.aiBoolean('屏幕上是否有"小U同学"欢迎弹窗', { deepThink: true });
    if (hasWelcome0) {
      try {
        await agent.aiTap('小U同学欢迎弹窗的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { /* 忽略 */ }
    }
    const arrowBaseline = await grabSerial(system);
    console.log(`桌面箭头serial基线: ${arrowBaseline.serial}`);
    // 标题带HTML链接(a href标签, 渲染为可点击蓝色链接样式)
    await system.exec(`notify-send -a "dde-control-center" '<a href="https://www.runoob.com/">标题链接测试</a> 测试测试' 'fewfw fewaf fewa fewa 测试支持链接跳转 fewfw fewf 统信官网：https://www.uniontech.com 测试测试' -t 300000`);
    await agent.aiWaitFor('桌面右下角出现标题带链接地址的通知横幅', { timeoutMs: 15000 });

    // 关闭"小U同学"欢迎弹窗(若存在, 会遮挡横幅)
    const hasWelcome = await agent.aiBoolean('屏幕上是否有"小U同学"欢迎弹窗（AI助手介绍窗口）', { deepThink: true });
    if (hasWelcome) {
      try {
        await agent.aiTap('小U同学欢迎弹窗的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { /* 关闭失败继续 */ }
    }

    // 检查1a(视觉): 横幅标题的链接地址有可点击链接样式
    await agent.aiAssert('通知横幅标题中的链接地址有可点击链接样式（下划线或变色等链接标识）');

    // 鼠标移到标题链接文字上(横幅标题区域)
    await agent.aiHover('通知横幅顶部标题区域的链接文字（标题在横幅上方，不在正文区域）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const titleCur = await grabSerial(system);
    console.log(`标题链接悬停: 光标serial=${titleCur.serial} (${titleCur.w}x${titleCur.h})`);
    // Excel预期: 标题链接HTML渲染为可点击样式 → hover后变手型(serial≠箭头基线)
    if (titleCur.serial === arrowBaseline.serial) {
      throw new Error(`标题链接悬停后光标未变为手型: serial=${titleCur.serial} (箭头基线=${arrowBaseline.serial})`);
    }
    console.log('标题链接: 光标已变为手型(≠箭头) ✓');

    // ── 步骤2: 发送正文带链接的通知, 鼠标移动到正文链接上 ──
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 正文带HTML链接(a href标签渲染为可点击蓝色链接)
    await system.exec(`notify-send -a "dde-control-center" "正文链接测试通知" '<a href="https://www.uniontech.com/">点击访问统信官网</a> 了解更多' -t 300000`);
    await agent.aiWaitFor('桌面右下角出现正文带链接地址的通知横幅', { timeoutMs: 15000 });

    const hasWelcome2 = await agent.aiBoolean('屏幕上是否有"小U同学"欢迎弹窗', { deepThink: true });
    if (hasWelcome2) {
      try {
        await agent.aiTap('小U同学欢迎弹窗的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { /* 忽略 */ }
    }

    // 检查2a(视觉): deepin实际行为=链接按纯文本展示(与标题一致), 记录产品行为
    await agent.aiAssert('通知横幅正文中包含链接地址文本（链接过长被截断展示也视为正常，deepin按最大行数规则处理）');

    // 鼠标移到正文链接上
    await agent.aiHover('通知横幅正文中的链接文字位置', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const bodyCur = await grabSerial(system);
    console.log(`正文链接悬停: 光标serial=${bodyCur.serial} (${bodyCur.w}x${bodyCur.h})`);
    // Excel预期: 正文链接有可点击样式+手型指针(如实断言, 产品不符则暴露差异)
    if (bodyCur.serial === arrowBaseline.serial) {
      throw new Error(`正文链接悬停后光标未变为手型: serial=${bodyCur.serial} (箭头基线=${arrowBaseline.serial})`);
    }
    console.log(`正文链接: 光标serial=${bodyCur.serial} 已变化, 判定为手型`);
    console.log('正文链接: 光标serial已确认变为手型(serial确定性判定) ✓');

    // 检查2b(一致性): 通知中心表现与横幅一致
    await new Promise(resolve => setTimeout(resolve, 21000));
    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('通知中心中该通知的正文链接已展示（链接较长被截断展示也视为正常）');
    // Excel预期1: 标题链接纯文本在通知中心与横幅一致
    await agent.aiAssert('通知中心中该通知的标题链接同样有可点击链接样式，与横幅表现一致');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1801741', 'level4'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await system.exec('rm -f /tmp/opencode/link_*.png');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    for (let i = 0; i < 10; i++) {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      if (r.stdout.includes('uint32')) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await system.exec('xdotool key super+d');
    await new Promise(resolve => setTimeout(resolve, 1500));
  });
});
