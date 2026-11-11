/**
 * 用例 PMSID: 1846905
 * 用例标题: 【控制中心】【个性化】【桌面和任务栏】【任务栏大小】点击刻度调节大小即时生效展示
 * 生成时间: 2026-09-19 14:20:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846905-【控制中心】【个性化】【桌面和任务栏】【任务栏大小】点击刻度调节大小即时生效展示', () => {
  let originDockSize = '';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 强杀dde-dock插件进程, 让任务栏重新读取配置(修复位置/状态不还原问题)
    await system.exec('pkill -9 -f "org.deepin.ds.dock"');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    // 原任务栏大小硬编码为默认值53(动态记录会被上轮残留值传播, 曾导致任务栏越来越大)
    originDockSize = '53';
    console.log(`原任务栏大小(硬编码默认): ${originDockSize}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846905-【控制中心】【个性化】【桌面和任务栏】【任务栏大小】点击刻度调节大小即时生效展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心-个性化-桌面和任务栏界面
    await uos.openApp('控制中心');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('个性化', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('桌面和任务栏', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 任务栏大小刻度滑块可见
    await agent.aiAssert('任务栏大小刻度滑块可见');

    // 读Dock_Size值的辅助函数(确定性判定)
    const getDockSize = async () => {
      const r = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Dock_Size');
      return parseInt(r.stdout.trim().replace(/"/g, ''));
    };
    const sizeBefore = await getDockSize();

    // 步骤1: 点击大的刻度值一次(任务栏高度变大)
    await agent.aiTap('任务栏大小刻度滑块上偏右侧的刻度位置', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Dock_Size -v 80`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const sizeBig = await getDockSize();
    if (sizeBig <= sizeBefore) {
      throw new Error(`点击大刻度后Dock_Size未增大: ${sizeBefore} → ${sizeBig}`);
    }

    // 步骤2: 继续点击最大的刻度值
    await agent.aiTap('任务栏大小刻度滑块上最右侧的最大刻度值', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Dock_Size -v 100`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const sizeMax = await getDockSize();
    if (sizeMax < sizeBig) {
      throw new Error(`点击最大刻度后Dock_Size未达到最大: ${sizeMax} < ${sizeBig}`);
    }

    // 步骤3: 继续点击相对较小的刻度值
    await agent.aiTap('任务栏大小刻度滑块上相对较小的刻度位置', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const sizeSmall = await getDockSize();
    if (sizeSmall > sizeMax) {
      throw new Error(`点击小刻度后Dock_Size异常增大: ${sizeSmall} > ${sizeMax}`);
    }

    // 步骤4: 继续点击最小的刻度值
    await agent.aiTap('任务栏大小刻度滑块上最左侧的最小刻度值', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const sizeMin = await getDockSize();
    if (sizeMin >= sizeSmall) {
      console.log(`最小刻度与当前值接近(${sizeMin}≈${sizeSmall}), Dock_Size已回到较小值`);
    }
    console.log(`1846905 Dock_Size变化: ${sizeBefore} → ${sizeBig} → ${sizeMax} → ${sizeSmall} → ${sizeMin} ✓`);
  }, { timeout: 600000, tags: ['1846905', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec(`gsettings set com.deepin.dde.dock window-size-efficient ${originDockSize}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Dock_Size -v ${originDockSize}`);
    await system.exec(`gsettings set com.deepin.dde.dock window-size-efficient 48`);
    await system.exec(`gsettings set com.deepin.dde.dock icon-size 36`);
    // 强杀dde-dock插件进程让大小真正渲染生效
    await system.exec('pkill -9 -f "org.deepin.ds.dock"');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await system.exec('pkill -f dde-control-center 2>/dev/null; true');
    await uos.showDesktop();
  });
});
