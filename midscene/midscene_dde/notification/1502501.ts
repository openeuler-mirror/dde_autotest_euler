/**
 * 用例 PMSID: 1502501
 * 用例标题: 【系统通知】【通知中心】通知中心在纯白和纯黑背景折叠时，描边效果明显
 * 生成时间: 2026-09-10 12:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1502501-【系统通知】【通知中心】通知中心在纯白和纯黑背景折叠时，描边效果明显', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const WHITE_WP = 'file:///home/uos/.local/share/wallpapers/pure_white.png';
  const BLACK_WP = 'file:///home/uos/.local/share/wallpapers/pure_black.png';

  // 获取当前壁纸uri(用于还原)
  let originalWallpaper = '';
  // 发送多条同类通知(折叠产生的前提)
  const sendBatchNotify = async (system) => {
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a "描边验证应用" "描边效果测试${i}" "同类通知用于折叠展示" -t 30000`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 勿扰模式判断: 若开启则关闭, 未开启则不做任何设置
    const dndCheck = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode');
    if (dndCheck.stdout.includes('true')) {
      await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode -v false');
      console.log('勿扰模式已开启, 已自动关闭');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
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
    // 记录原壁纸用于还原(dde-appearance的uri, 带'引号'需去除)
    // 原壁纸硬编码(动态记录会被上轮污染值传播, 曾导致桌面变黑)
    originalWallpaper = 'file:///usr/share/wallpapers/deepin/nirvana-wallpaper-light.jpg';
    console.log(`原壁纸: ${originalWallpaper}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1502501-【系统通知】【通知中心】通知中心在纯白和纯黑背景折叠时，描边效果明显', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 发送5条同类通知(进入通知中心, 形成折叠展示)
    await sendBatchNotify(system);

    // ── 步骤1: 纯白背景下查看折叠描边 ──
    for (let i = 0; i < 3; i++) {
      await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'${WHITE_WP}'"`);
      await new Promise(resolve => setTimeout(resolve, 4000));
      await system.exec('ffmpeg -y -loglevel error -f x11grab -framerate 2 -video_size 200x200 -i :0+860,440 -frames:v 2 /tmp/opencode/wp_check_%02d.png');
      const p = await system.exec(`ffmpeg -loglevel error -framerate 2 -i /tmp/opencode/wp_check_%02d.png -f rawvideo -pix_fmt gray - 2>/dev/null | python3 -c "
import sys
d = sys.stdin.buffer.read()
n = len(d)//40000
t = 0
for i in range(n):
    fr = d[i*40000:(i+1)*40000]
    t += sum(fr)//40000
print(t//n if n else 0)
"`);
      if (parseFloat(p.stdout.trim()) > 230) break;
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 确认壁纸已变白(像素校验: 抓屏幕中央, 纯白≈255)
    await system.exec('ffmpeg -y -loglevel error -f x11grab -framerate 2 -video_size 200x200 -i :0+860,440 -frames:v 2 /tmp/opencode/wp_check_%02d.png');
    const wpProbe = await system.exec(`ffmpeg -loglevel error -framerate 2 -i /tmp/opencode/wp_check_%02d.png -f rawvideo -pix_fmt gray - 2>/dev/null | python3 -c "
import sys
d = sys.stdin.buffer.read()
tot = 0
n = len(d)//40000
for i in range(n):
    fr = d[i*40000:(i+1)*40000]
    tot += sum(fr)//40000
print(tot//n if n else 0)
"`);
    const whiteLuma = parseFloat(wpProbe.stdout.trim());
    console.log(`白色壁纸校验: 亮度=${whiteLuma} (应>230)`);
    if (!(whiteLuma > 230)) {
      throw new Error(`壁纸未切换为纯白: 亮度${whiteLuma}`);
    }

    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const whiteEdge = await agent.aiBoolean('纯白桌面背景下，通知中心里折叠展示的通知卡片是否有描边效果（卡片边界与白色背景有区分，不是完全融为一体）', { deepThink: true });
    if (!whiteEdge) {
      throw new Error('纯白背景下折叠通知的描边效果不明显');
    }
    console.log('纯白背景: 描边效果确认 ✓');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤2: 纯黑背景下查看折叠描边 ──
    for (let i = 0; i < 3; i++) {
      await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'${BLACK_WP}'"`);
      await new Promise(resolve => setTimeout(resolve, 4000));
      await system.exec('ffmpeg -y -loglevel error -f x11grab -framerate 2 -video_size 200x200 -i :0+860,440 -frames:v 2 /tmp/opencode/wp_check2_%02d.png');
      const p = await system.exec(`ffmpeg -loglevel error -framerate 2 -i /tmp/opencode/wp_check2_%02d.png -f rawvideo -pix_fmt gray - 2>/dev/null | python3 -c "
import sys
d = sys.stdin.buffer.read()
n = len(d)//40000
t = 0
for i in range(n):
    fr = d[i*40000:(i+1)*40000]
    t += sum(fr)//40000
print(t//n if n else 0)
"`);
      if (parseFloat(p.stdout.trim()) < 30) break;
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec('ffmpeg -y -loglevel error -f x11grab -framerate 2 -video_size 200x200 -i :0+860,440 -frames:v 2 /tmp/opencode/wp_check2_%02d.png');
    const wpProbe2 = await system.exec(`ffmpeg -loglevel error -framerate 2 -i /tmp/opencode/wp_check2_%02d.png -f rawvideo -pix_fmt gray - 2>/dev/null | python3 -c "
import sys
d = sys.stdin.buffer.read()
tot = 0
n = len(d)//40000
for i in range(n):
    fr = d[i*40000:(i+1)*40000]
    tot += sum(fr)//40000
print(tot//n if n else 0)
"`);
    const blackLuma = parseFloat(wpProbe2.stdout.trim());
    console.log(`黑色壁纸校验: 亮度=${blackLuma} (应<30)`);
    if (!(blackLuma < 30)) {
      throw new Error(`壁纸未切换为纯黑: 亮度${blackLuma}`);
    }

    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2500));
    // 壁纸切换可能关闭了面板, 循环检测并重新打开(最多4次)
    for (let i = 0; i < 4; i++) {
      const open2 = await agent.aiBoolean('屏幕右侧的通知中心面板是否处于打开状态', { deepThink: true });
      if (open2) break;
      await system.exec('xdotool key super+m');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    const blackEdge = await agent.aiBoolean('纯黑桌面背景下，通知中心里折叠展示的通知卡片是否有描边效果（卡片边界与黑色背景有区分，不是完全融为一体）', { deepThink: true });
    if (!blackEdge) {
      throw new Error('纯黑背景下折叠通知的描边效果不明显');
    }
    console.log('纯黑背景: 描边效果确认 ✓');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, { timeout: 600000, tags: ['1502501', 'level4'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec('xdotool key Escape');
    await system.exec('rm -f /tmp/opencode/wp_check*.png');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
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
    // 还原原壁纸(SetCurrentWorkspaceBackground + gsettings双保险)
    if (originalWallpaper) {
      await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'${originalWallpaper}'"`);
      await system.exec(`gsettings set org.gnome.desktop.background picture-uri ${originalWallpaper}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`壁纸已还原: ${originalWallpaper}`);
    }
    await uos.showDesktop();
  });
});
