/**
 * 用例 PMSID: 1832355
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同一类型应用，创建2个相同名称的应用文件夹
 * 生成时间: 2026-08-31
 * 用例编写人: UT005044(王亮)
 */

describe('1832355-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同一类型应用，创建2个相同名称的应用文件夹', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 读取配置文件，检查启动器模式
    const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
    assertTrue(result.success, '读取配置文件失败');
    const content = result.stdout.toString();
    const isFullscreen = content.includes('current_frame=FullscreenFrame');
    const isWindowed = content.includes('current_frame=WindowedFrame');
    if (isFullscreen) {
      console.log('检测到全屏模式，切换到窗口模式...');
      await device.pressKey('ESC');
      await uos.openLauncher();
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
        images: [{
          name: '窗口模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
        }],
        deepThink: true,
      });
    }
    if (isWindowed) {
      console.log('检测到窗口模式，无需操作');
    }
    await device.pressKey('ESC');
  });

  test('1832355-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同一类型应用，创建2个相同名称的应用文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    const pcService = device.getPCService();

    // 获取物理屏幕分辨率用于坐标转换
    const env = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority';
    const geoResult = await system.exec(`${env} xdotool getdisplaygeometry`);
    const geoMatch = geoResult.stdout.toString().trim().match(/(\d+)\s+(\d+)/);
    const physWidth = geoMatch ? parseInt(geoMatch[1]) : 1920;
    const physHeight = geoMatch ? parseInt(geoMatch[2]) : 1080;

    // 封装坐标转换函数
    const convertCoord = (loc: any) => {
      let x = loc.center[0];
      let y = loc.center[1];
      if (x > physWidth || y > physHeight) {
        const scale = Math.max(x > physWidth ? x / physWidth : 1, y > physHeight ? y / physHeight : 1);
        x = Math.round(x / scale);
        y = Math.round(y / scale);
      }
      x = Math.max(0, Math.min(x, physWidth - 1));
      y = Math.max(0, Math.min(y, physHeight - 1));
      return { x, y };
    };

    // 封装拖拽创建文件夹函数
    const dragToCreateFolder = async (srcPrompt, tgtPrompt, label) => {
      console.log(`[${label}] 定位源图标: ${srcPrompt}`);
      const srcLoc = await agent.aiLocate(srcPrompt);
      const src = convertCoord(srcLoc);

      console.log(`[${label}] 定位目标图标: ${tgtPrompt}`);
      const tgtLoc = await agent.aiLocate(tgtPrompt);
      const tgt = convertCoord(tgtLoc);

      console.log(`[${label}] 源坐标: (${src.x}, ${src.y}), 目标坐标: (${tgt.x}, ${tgt.y})`);

      // 移动到源图标并按下鼠标左键
      console.log(`[${label}] 移动到源图标并按下鼠标`);
      await pcService.mouse.move([{ x: src.x, y: src.y }]);
      await new Promise(r => setTimeout(r, 500));
      await pcService.mouse.pressButton(0);
      await new Promise(r => setTimeout(r, 800));

      // 分步拖到目标位置(完全重合，重合度>50%)
      console.log(`[${label}] 拖拽到目标位置（重合度大于一半）`);
      const steps = 10;
      const stepX = (tgt.x - src.x) / steps;
      const stepY = (tgt.y - src.y) / steps;
      for (let i = 1; i <= steps; i++) {
        await pcService.mouse.move([{ x: Math.round(src.x + stepX * i), y: Math.round(src.y + stepY * i) }]);
        await new Promise(r => setTimeout(r, 16));
      }
      // 悬停等待（重合度>50%，应显示文件夹合并特效）
      await new Promise(r => setTimeout(r, 1000));

      // 直接释放鼠标（重合度>50%时释放，应创建文件夹）
      console.log(`[${label}] 释放鼠标`);
      await pcService.mouse.releaseButton(0);
      await new Promise(r => setTimeout(r, 2000));
      console.log(`[${label}] 已拖动 ${srcPrompt} 与 ${tgtPrompt} 重合并释放`);
    };

    // 步骤 2: 第一次拖动，拖动浏览器与应用商店重合，创建第一个文件夹
    console.log('步骤 2: 第一次拖动创建文件夹');
    await dragToCreateFolder(
      '启动器界面左侧区域中的文本编辑器图标',
      '启动器界面左侧区域中的应用商店图标',
      '第一次拖拽'
    );
    // 检查1: 创建了第一个应用文件夹
    await agent.aiAssert('启动器界面左侧区域中创建了第一个应用文件夹:系统管理');
    console.log('第一个应用文件夹已创建');

    // 步骤 3: 第二次拖动，拖动计算机与回收站重合，创建第二个同名文件夹
    console.log('步骤 3: 第二次拖动创建文件夹');
    await dragToCreateFolder(
      '启动器界面左侧区域中的浏览器图标',
      '启动器界面左侧区域中的文件管理器图标',
      '第二次拖拽'
    );
    // 检查2: 创建了第二个应用文件夹
    await agent.aiAssert('启动器界面左侧区域中创建了第二个应用文件夹：系统管理');
    console.log('第二个应用文件夹已创建');

    // 步骤 4: 检查存在两个同名应用文件夹
    console.log('步骤 4: 检查应用文件夹名称是否可重复');
    await agent.aiAssert('启动器界面左侧区域中存在两个名称相同的应用文件夹：系统管理');
    console.log('验证通过：存在两个同名应用文件夹');

  }, { timeout: 600000, tags: ['1832355', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
    // 清理环境：删除相关配置文件，重新加载
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    console.log('item-arrangement.ini 已删除');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    console.log('dde-shell 服务已重启');

    await system.exec('systemctl --user daemon-reload');
    console.log('systemctl --user daemon-reload 已执行');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
