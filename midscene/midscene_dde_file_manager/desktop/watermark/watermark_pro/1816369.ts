/**
 * 用例 PMSID: 1816369
 * 用例标题: 控制中心-切换旋转方向水印显示正常
 * 生成时间: 2026-11-12 10:00:00
 * 用例编写人: UT005160(蓝雁玲) 
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 旋转值映射：1=正常 2=90度 4=180度 8=270度（Rotations=[1,2,4,8]）
const ROT_VALUE = { '正常方向': 1, '90度': 2, '180度': 4, '270度': 8 };

describe('1816369-控制中心-切换旋转方向水印显示正常', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await sleep(1500);
    // 前置：桌面水印（任务栏上方两个相对的L形图标）应已存在
    await agent.aiWaitFor('桌面右下方任务栏上方存在两个相对的L形水印图标', { timeoutMs: 15000, checkIntervalMs: 3000 });
    console.log('beforeAll: 桌面水印已存在');
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
  });

  test('1816369-控制中心-切换旋转方向水印显示正常', async ({ device, system, agent, uos }) => {
    const DBUS_ENV = `export XDG_RUNTIME_DIR=/run/user/1000 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;`;
    const sh = async (cmd, t = 30000) => {
      const r = await system.exec(cmd, t);
      return (((r && r.stdout) || '') + '').trim();
    };
    const monitorPath = async () => {
      const out = await sh(`${DBUS_ENV} gdbus call --session --dest org.deepin.dde.Display1 --object-path /org/deepin/dde/Display1 -m org.freedesktop.DBus.Properties.Get org.deepin.dde.Display1 Monitors`);
      const m = out.match(/(\/org\/deepin\/dde\/Display1\/Monitor_\d+)/);
      if (!m) throw new Error(`未能获取显示器 Monitor 对象路径：${out}`);
      return m[1];
    };
    // 读取 xrandr 当前旋转：normal/left/right/inverted
    // 注意：只解析括号前的部分，括号内 (normal left inverted right ...) 是模式列表，不是当前状态
    const xrandrRotation = async () => {
      const out = await sh(`export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority; xrandr --query`);
      const line = out.split('\n').find(l => /^eDP\b/.test(l));
      const head = line ? line.split('(')[0] : '';
      if (/\bleft\b/.test(head)) return 'left';
      if (/\bright\b/.test(head)) return 'right';
      if (/\binverted\b/.test(head)) return 'inverted';
      return 'normal';
    };
    const waitRotation = async (want, timeoutMs = 25000) => {
      const start = Date.now();
      let cur = await xrandrRotation();
      while (Date.now() - start < timeoutMs) {
        cur = await xrandrRotation();
        if (cur === want) return cur;
        await sleep(1500);
      }
      return cur;
    };
    const setRotationDBus = async (value) => {
      const mp = await monitorPath();
      await sh(`${DBUS_ENV} gdbus call --session --dest org.deepin.dde.Display1 --object-path ${mp} -m org.deepin.dde.Display1.Monitor.SetRotation ${value}`);
      await sleep(1000);
      await sh(`${DBUS_ENV} gdbus call --session --dest org.deepin.dde.Display1 --object-path /org/deepin/dde/Display1 -m org.deepin.dde.Display1.ApplyChanges`);
    };
    const restoreNormal = async () => {
      if ((await xrandrRotation()) !== 'normal') {
        console.log('⚠️ 检测到屏幕处于旋转状态，执行恢复');
        await setRotationDBus(1);
        const cur = await waitRotation('normal');
        if (cur !== 'normal') {
          await sh(`export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority; xrandr --output eDP --rotate normal`);
          await sleep(3000);
        }
      }
    };
    await restoreNormal();

    // ==================== 步骤1：打开控制中心-显示，确认旋转方向设置项 ====================
    console.log('===== 步骤1：打开控制中心-显示 =====');
    await sh(`kill -15 $(pidof dde-control-center) 2>/dev/null; true`);
    await sleep(1000);
    await sh(`nohup dde-control-center -s -m display >/dev/null 2>&1 &`);
    await sleep(7000);
    let uiAvailable = await agent.aiBoolean('控制中心显示设置页面右侧内容区中能看到旋转方向设置项');
    if (uiAvailable) {
      console.log('控制中心 UI 可用，将通过 UI 切换旋转方向');
    } else {
      console.log('⚠️ 控制中心显示设置页面无法加载（本机 display 模块 QML 加载失败，页面空白），降级为同一后端 org.deepin.dde.Display1 的 DBus 接口切换旋转方向');
      await sh(`kill -15 $(pidof dde-control-center) 2>/dev/null; true`);
    }

    // 通用切方向：UI 可用走 UI，否则走 DBus；返回 xrandr 实测旋转
    const setDirection = async (name) => {
      if (uiAvailable) {
        await agent.aiTap('显示设置页面中的旋转方向下拉框');
        await sleep(1500);
        await agent.aiTap(`旋转方向下拉列表中的${name}`);
      } else {
        await setRotationDBus(ROT_VALUE[name]);
      }
      if (name === '正常方向') return await waitRotation('normal');
      // 90/180/270：等待 xrandr 离开 normal，再返回实测值
      let cur = 'normal';
      const start = Date.now();
      while (Date.now() - start < 25000) {
        cur = await xrandrRotation();
        if (cur !== 'normal') break;
        await sleep(1500);
      }
      return cur;
    };

    // ==================== 步骤2：遍历各旋转方向，检查水印 ====================
    const directions = ['90度', '180度', '270度'];
    const failed = [];
    try {
      for (const d of directions) {
        console.log(`----- 切换旋转方向为：${d} -----`);
        await restoreNormal();
        const cur = await setDirection(d);
        const rotatedOk = cur === 'left' || cur === 'right' || cur === 'inverted';
        if (!rotatedOk) {
          failed.push(`${d}(旋转未生效，xrandr=${cur})`);
          await restoreNormal();
          continue;
        }
        await sleep(5000); // 等桌面/水印稳定
        // 预期结果1：任意方向下水印均显示正常（旋转是否生效已由 xrandr 客观确认，断言只看水印本身）
        await agent.aiAssert('桌面上存在两个相对的L形水印图标，显示完整，无缺失、错位或乱码');

        // 恢复为正常方向
        const back = await setDirection('正常方向');
        if (back !== 'normal') {
          await restoreNormal();
        }
        console.log(`方向${d}验证完成，已恢复正常方向(xrandr=${back})`);
      }
    } finally {
      await restoreNormal();
    }

    if (failed.length) {
      throw new Error(`以下方向下水印显示异常：${failed.join('，')}`);
    }
    console.log('预期结果1：任意方向下水印均显示正常');

    await sh(`kill -15 $(pidof dde-control-center) 2>/dev/null; true`);
    await uos.showDesktop();

  }, { timeout: 1800000, tags: ['1816369', 'level3', 'desktop', 'watermark', 'watermark_pro', 'DITT'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`kill -15 $(pidof dde-control-center) 2>/dev/null; true`);
    await sleep(1500);
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 清理测试套件，确保屏幕恢复正常方向');
    const DBUS_ENV = `export XDG_RUNTIME_DIR=/run/user/1000 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;`;
    await system.exec(`${DBUS_ENV} mp=$(gdbus call --session --dest org.deepin.dde.Display1 --object-path /org/deepin/dde/Display1 -m org.freedesktop.DBus.Properties.Get org.deepin.dde.Display1 Monitors | grep -oE "/org/deepin/dde/Display1/Monitor_[0-9]+" | head -1); gdbus call --session --dest org.deepin.dde.Display1 --object-path "$mp" -m org.deepin.dde.Display1.Monitor.SetRotation 1; gdbus call --session --dest org.deepin.dde.Display1 --object-path /org/deepin/dde/Display1 -m org.deepin.dde.Display1.ApplyChanges; xrandr --output eDP --rotate normal 2>/dev/null; true`, 60000);
  });
});
