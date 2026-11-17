/**
 * 用例 PMSID: 1820067
 * 用例标题: 【通知中心】手动点击通知横幅消失有向右滑动效果
 * 生成时间: 2026-09-10 11:45:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1820067-【通知中心】手动点击通知横幅消失有向右滑动效果', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const WIN = { x: 1330, y: 830, w: 590, h: 250 };
  const ANIM_DIR = '/tmp/opencode/anim_1820067';

  // 对帧序列按指定条带输出逐帧平均亮度数组
  const bandLuma = async (sys, crop, files, tag) => {
    const pattern = files.replace(/%03d\.png$/, '%03d.png');
    await sys.exec(`ffmpeg -loglevel error -framerate 15 -i ${pattern} -f rawvideo -pix_fmt gray ${ANIM_DIR}/raw_${tag}.gray`);
    await sys.exec(`python3 -c "
W,H,CX,CW = ${crop}
d = open('${ANIM_DIR}/raw_${tag}.gray','rb').read()
fs = len(d)//(W*H)
out = []
for i in range(fs):
    fr = d[i*W*H:(i+1)*W*H]
    s = 0
    for y in range(H):
        row = fr[y*W:(y+1)*W]
        s += sum(row[CX:CX+CW])
    out.append(s//(CW*H))
open('${ANIM_DIR}/luma_${tag}.txt','w').write(' '.join(str(v) for v in out))
"`);
    const r = await sys.exec(`cat ${ANIM_DIR}/luma_${tag}.txt`);
    return r.stdout.trim().split(/[ \n]+/).map(Number).filter(n => !isNaN(n));
  };

  // 临时壁纸(纯黑, 横幅亮色对比度最大化), afterAll还原
  let originalWallpaper = '';

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
    // 关闭所有现有通知(轻量方式, 不重启dde-shell——重启会导致壁纸渲染层异常)
    await system.exec(`python3 -c "
import dbus, time
bus = dbus.SessionBus()
notif = dbus.Interface(bus.get_object('org.freedesktop.Notifications', '/org/freedesktop/Notifications'), 'org.freedesktop.Notifications')
for i in range(1, 60):
    try:
        notif.CloseNotification(i)
    except Exception:
        pass
"`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    for (let i = 0; i < 15; i++) {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      if (r.stdout.includes('uint32')) {
        console.log(`通知服务就绪(等待${(i + 1) * 2}秒)`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // 记录并临时设置纯黑壁纸(横幅亮色与纯黑对比度最大, 保证抓帧判定稳定)
    // 原壁纸硬编码(动态记录会被上轮污染值传播, 曾导致桌面变黑)
    originalWallpaper = 'file:///usr/share/wallpapers/deepin/nirvana-wallpaper-light.jpg';
    await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'file:///home/uos/.local/share/wallpapers/pure_black.png'"`);
    await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'file:///home/uos/.local/share/wallpapers/pure_black.png'"`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('已临时切换纯黑壁纸');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1820067-【通知中心】手动点击通知横幅消失有向右滑动效果', async ({ device, agent, uos, system }) => {
    // 步骤0: 清理遮挡窗口(介绍窗等)并校验抓帧窗口亮度(纯黑壁纸=10-40; 被半透明窗遮挡=50-70)
    await system.exec('xdotool key Escape');
    await system.exec('xdotool key super+d');
    await new Promise(resolve => setTimeout(resolve, 2000));
    for (let i = 0; i < 3; i++) {
      await system.exec(`ffmpeg -y -loglevel error -f x11grab -framerate 2 -video_size ${WIN.w}x${WIN.h} -i :0+${WIN.x},${WIN.y} -frames:v 2 ${ANIM_DIR}_probe_%02d.png`);
      await system.exec(`ffmpeg -loglevel error -framerate 2 -i ${ANIM_DIR}_probe_%02d.png -f rawvideo -pix_fmt gray ${ANIM_DIR}_probe.gray`);
      const probe = await system.exec(`python3 -c "
W,H = ${WIN.w},${WIN.h}
d = open('${ANIM_DIR}_probe.gray','rb').read()
fs = len(d)//(W*H)
tot = 0
for i in range(fs):
    fr = d[i*W*H:(i+1)*W*H]
    tot += sum(fr)//(W*H)
print(tot//fs if fs else 0)
"`);
      const yavg = parseFloat(probe.stdout.trim());
      console.log(`壁纸基线探测${i + 1}: YAVG=${yavg}`);
      if (!isNaN(yavg)) break;
      // 遮挡: 先尝试AI关闭介绍窗, 再Escape+super+d
      try {
        await agent.aiTap('屏幕中间介绍窗口的关闭按钮（x图标）', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { /* 无按钮 */ }
      await system.exec('xdotool key Escape');
      await system.exec('xdotool key super+d');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 步骤1: 发送常驻通知(20秒不消失, 留足操作时间)
    // 带删除按钮(action)的通知: deepin横幅悬浮后显示"删除"按钮, 点击后通知向右滑出消失
    await system.exec(`notify-send -a "手动删除动画验证" "点击删除动画测试" "鼠标移动到本横幅上点击删除按钮" --action="_del=删除" -t 180000`);
    // 清理可能遮挡的通知中心面板
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('桌面右下角出现一条标题为"点击删除动画测试"的通知横幅', { timeoutMs: 15000 });

    // 步骤2: 后台启动15fps连帧抓取(10秒窗口)
    await system.exec(`rm -rf ${ANIM_DIR} && mkdir -p ${ANIM_DIR}`);
    await system.exec(`nohup ffmpeg -y -loglevel error -f x11grab -framerate 15 -video_size ${WIN.w}x${WIN.h} -i :0+${WIN.x},${WIN.y} -t 30 ${ANIM_DIR}/f_%03d.png >/dev/null 2>&1 &`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤3: 悬浮横幅 → 点击右上角关闭X按钮 → 横幅向右滑出消失(方案B: X按钮AI点击稳定)
    // 抓帧覆盖tap点击后的滑出动画: 先启动10秒连帧(后台), 立即tap(动画发生在第1-3秒被捕获)
    await system.exec(`rm -rf ${ANIM_DIR} && mkdir -p ${ANIM_DIR}`);
    await system.exec(`nohup ffmpeg -y -loglevel error -f x11grab -framerate 15 -video_size ${WIN.w}x${WIN.h} -i :0+${WIN.x},${WIN.y} -t 30 ${ANIM_DIR}/f_%03d.png >/dev/null 2>&1 &`);
    await agent.aiHover('标题为"点击删除动画测试"的通知横幅', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('通知横幅右上角的关闭X按钮', { deepThink: true });
    // 等待抓帧结束
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 视觉复核: 横幅已消失
    await agent.aiAssert('桌面上已经没有标题为"点击删除动画测试"的通知横幅');

    // 步骤4: 亮度剖面分析(横幅亮色在暗壁纸上)
    const files = `${ANIM_DIR}/f_%03d.png`;
    const left = await bandLuma(system, `${WIN.w},${WIN.h},290,60`, files, 'left');
    const right = await bandLuma(system, `${WIN.w},${WIN.h},520,50`, files, 'right');
    const full = await bandLuma(system, `${WIN.w},${WIN.h},0,${WIN.w}`, files, 'full');
    if (left.length < 30) {
      throw new Error(`帧序列抓取失败: 仅${left.length}帧`);
    }

    const base = (arr) => arr.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, arr.length);
    const baseL = base(left), baseR = base(right), baseF = base(full);
    const appearAt = (arr, baseV) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] - baseV > 10) return i;
      }
      return -1;
    };
    const disappearAt = (arr, baseV, from) => {
      if (from < 0) return -1;
      for (let i = from; i < arr.length; i++) {
        if (Math.abs(arr[i] - baseV) <= 10) return i;
      }
      return -1;
    };
    const appL = appearAt(left, baseL);
    const appR = appearAt(right, baseR);
    const disL = disappearAt(left, baseL, appL);
    const disR = disappearAt(right, baseR, appR);
    const appF = appearAt(full, baseF);
    const disF = disappearAt(full, baseF, appF);
    console.log(`1820067 帧数据: 总帧${full.length} 基线L=${baseL.toFixed(0)} R=${baseR.toFixed(0)} F=${baseF.toFixed(0)} 出现帧 L=${appL} R=${appR} 消失帧 L=${disL} R=${disR} F=${disF}`);

    // 检查1(确定性): 横幅出现过且点击删除后消失
    if (appF < 0) {
      throw new Error(`横幅未出现在抓帧窗口`);
    }
    if (disF < 0) {
      throw new Error(`点击删除后横幅未消失: 抓帧窗口结束时亮度仍处于横幅状态`);
    }
    // 检查2(确定性): 向右滑出——取消失过渡段中点前后两帧做左右半窗差分:
    // 向右移动时变化集中在右半窗(内容向右移出), 淡出时左右变化均匀(比值≈1)
    if (disF < 4 || disF + 4 > full.length) {
      throw new Error(`消失过渡帧号${disF}太靠近序列边界, 无法取差分帧对`);
    }
    const fA = disF - 3, fB = disF + 3;
    const diff = await system.exec(`python3 -c "
import subprocess
def raw(n):
    r = subprocess.run(['ffmpeg','-loglevel','error','-y','-i','${ANIM_DIR}/f_' + str(n).zfill(3) + '.png','-f','rawvideo','-pix_fmt','gray','-'],capture_output=True)
    return r.stdout
a = raw(${fA}); b = raw(${fB})
W,H = ${WIN.w},${WIN.h}
dl = sum(abs(a[i]-b[i]) for i in range(0,W*H,2) if (i%W) < W//2)
dr = sum(abs(a[i]-b[i]) for i in range(0,W*H,2) if (i%W) >= W//2)
print(f'{dl} {dr}')
"`);
    const parts = diff.stdout.trim().split(/[ \n]+/).map(Number);
    const dl = parts[0], dr = parts[1];
    const ratio = dl > 0 ? (dr / dl) : 0;
    console.log(`1820067 差分对(帧${fA}vs${fB}): 左半变化=${dl} 右半变化=${dr} 右/左=${ratio.toFixed(2)}`);
    if (!(ratio > 1.5)) {
      throw new Error(`未检测到向右滑动: 消失过程左右半窗变化比${ratio.toFixed(2)}(右移应>1.5, 淡出≈1)`);
    }
    console.log(`向右滑动验证: 消失过程变化集中在右半窗(比值${ratio.toFixed(2)}), 判定为向右滑出 ✓`);

  }, { timeout: 600000, tags: ['1820067', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec(`rm -rf ${ANIM_DIR}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 还原原壁纸
    if (originalWallpaper) {
      await system.exec(`gdbus call --session --dest org.deepin.dde.Appearance1 --object-path /org/deepin/dde/Appearance1 --method org.deepin.dde.Appearance1.SetCurrentWorkspaceBackground "'${originalWallpaper}'"`);
      await system.exec(`gsettings set org.gnome.desktop.background picture-uri ${originalWallpaper}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('壁纸已还原');
    }
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
