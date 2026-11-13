/**
 * 用例 PMSID: 1935847
 * 用例标题: 【启动器】【右键菜单】应用右键菜单功能验证---"移至顶部"功能
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1935847-【启动器】【右键菜单】应用右键菜单功能验证---"移至顶部"功能', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const iniFile = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';
  // 默认应用排列（浏览器在顶部、文件管理器第二位），base64 内联，不依赖外部文件
  const masterArrangementB64 = 'W2Z1bGxzY3JlZW5dCnRvcGxldmVsXHBhZ2VDb3VudD0yCnRvcGxldmVsXHBhZ2VJdGVtc1wwPW9yZy5kZWVwaW4uYnJvd3Nlci5kZXNrdG9wLCBkZGUtZmlsZS1tYW5hZ2VyLmRlc2t0b3AsIGRlZXBpbi1hcHAtc3RvcmUuZGVza3RvcCwgZGVlcGluLW11c2ljLmRlc2t0b3AsIGRlZXBpbi1tb3ZpZS5kZXNrdG9wLCBkZWVwaW4tc2NyZWVuLXJlY29yZGVyLmRlc2t0b3AsIGRlZXBpbi1pbWFnZS12aWV3ZXIuZGVza3RvcCwgZGVlcGluLWFsYnVtLmRlc2t0b3AsIGRlZXBpbi1kcmF3LmRlc2t0b3AsIGRlZXBpbi1yZWFkZXIuZGVza3RvcCwgZGVlcGluLWVkaXRvci5kZXNrdG9wLCBkZWVwaW4tbWFpbC5kZXNrdG9wLCBkZWVwaW4tdGVybWluYWwuZGVza3RvcCwgZGVlcGluLXZvaWNlLW5vdGUuZGVza3RvcCwgZG93bmxvYWRlci5kZXNrdG9wLCBkZWVwaW4tbWFudWFsLmRlc2t0b3AsIGRkZS1jb21wdXRlci5kZXNrdG9wLCBkZGUtdHJhc2guZGVza3RvcCwgb3JnLmRlZXBpbi5kZGUuY29udHJvbC1jZW50ZXIuZGVza3RvcCwgZGVlcGluLXN5c3RlbS1tb25pdG9yLmRlc2t0b3AsIGRlZXBpbi1ib290LW1ha2VyLmRlc2t0b3AsIGRlZXBpbi1kZXZpY2VtYW5hZ2VyLmRlc2t0b3AsIGRlZXBpbi1sb2ctdmlld2VyLmRlc2t0b3AsIGRkZS1wcmludGVyLmRlc2t0b3AsIGRlZXBpbi1jYWxjdWxhdG9yLmRlc2t0b3AsIGRlZXBpbi1mb250LW1hbmFnZXIuZGVza3RvcCwgd3BzLW9mZmljZS1ldC5kZXNrdG9wLCB3cHMtb2ZmaWNlLW9mZmljZWFzc2lzdGFudC5kZXNrdG9wLCB3cHMtb2ZmaWNlLXBkZi5kZXNrdG9wLCB3cHMtb2ZmaWNlLXByb21ldGhldXMuZGVza3RvcCwgd3BzLW9mZmljZS13cHAuZGVza3RvcCwgd3BzLW9mZmljZS13cHMuZGVza3RvcAp0b3BsZXZlbFxwYWdlSXRlbXNcMT1kZWVwaW4tY29tcHJlc3Nvci5kZXNrdG9wLCBkZWVwaW4tZGViLWluc3RhbGxlci5kZXNrdG9wLCBkZWVwaW4tZGlza21hbmFnZXIuZGVza3RvcCwgZGRlLWludHJvZHVjdGlvbi5kZXNrdG9wLCBkZWVwaW4tY2FtZXJhLmRlc2t0b3AsIGRkZS1jb29wZXJhdGlvbi5kZXNrdG9wLCBjb20uc29nb3UuaW1lLm5nLmZjaXR4NS51b3MuY29uZmlndXJlci5kZXNrdG9wLCBjb20udW9zLmRyaXZlLmRlc2t0b3AsIGRkZS1jYWxlbmRhci5kZXNrdG9wLCBkZWVwaW4tZGF0YS10cmFuc2Zlci5kZXNrdG9wLCBkZWVwaW4tZGVmZW5kZXIuZGVza3RvcCwgZGVlcGluLXNjYW5uZXIuZGVza3RvcCwgb3JnLnJlbW1pbmEuUmVtbWluYS5kZXNrdG9wLCB1b3MtYWktYXNzaXN0YW50LmRlc2t0b3AsIHVvcy1yZWNvdmVyeS1ndWkuZGVza3RvcCwgdW9zLXJlbW90ZS1hc3Npc3RhbmNlLmRlc2t0b3AsIHVvcy1zZXJ2aWNlLXN1cHBvcnQuZGVza3RvcAo=';

  // ── 工具函数：还原启动器应用排列为默认顺序并重启 dde-shell 生效 ──
  const restoreMasterArrangement = async (system) => {
    const b64 = masterArrangementB64;
    await system.exec(`python3 -c "import base64; f=open('${iniFile}','w'); f.write(base64.b64decode('${b64}').decode()); f.close()"`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  // ── 工具函数：读取启动器排列，判断指定应用是否在顶部第一位 ──
  const isFirstApp = async (system, desktopId) => {
    const result = await system.exec(`cat ${iniFile}`);
    if (!result.success) return false;
    const line = result.stdout.split('\n').find(l => l.startsWith('toplevel') && l.includes('pageItems'));
    if (!line) return false;
    const first = line.split('=')[1].trim().split(',')[0].trim();
    return first === desktopId;
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 还原默认应用顺序 ==========');
    await restoreMasterArrangement(system);
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }
    await device.pressKey('ESC');
  });

  test('1935847-【启动器】【右键菜单】应用右键菜单功能验证---"移至顶部"功能', async ({ device, agent, uos, system }) => {
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/3：打开启动器窗口模式，右键顶部浏览器，检查无"移至顶部"菜单 ──
    console.log('');
    console.log('[步骤 1/3] 打开启动器窗口模式，右键顶部浏览器，检查无"移至顶部"菜单');
    // 重启 dde-shell 后启动器首次打开时列表可能缺少浏览器（浏览器仅出现在"我的常用"），
    // 需 hover 左侧应用区并滚动（先下滚一次、再上滚两次）触发列表重新加载，使浏览器回到列表顶部第一位
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiHover('启动器窗口左侧的应用列表区域');
    await agent.aiScroll('', { direction: 'down', distance: 200 });
    await agent.aiScroll('', { direction: 'up', distance: 200 });
    await agent.aiScroll('', { direction: 'up', distance: 200 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    assertTrue(await isFirstApp(system, 'org.deepin.browser.desktop'), '测试前浏览器应位于启动器列表顶部第一位');
    await agent.aiRightClick("启动器窗口左侧应用列表中的浏览器应用图标");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("右键菜单中不显示移至顶部菜单");
    await new Promise(resolve => setTimeout(resolve, 500));

    // ── 步骤 2/3：右键文件管理器，点击"移至顶部"，使其成为顶部应用 ──
    console.log('[步骤 2/3] 右键文件管理器，点击"移至顶部"使其成为顶部应用');
    await agent.aiRightClick("启动器窗口左侧应用列表中的文件管理器应用图标");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("右键菜单中显示移至顶部菜单");
    await agent.aiTap("移至顶部");
    await new Promise(resolve => setTimeout(resolve, 800));
    assertTrue(await isFirstApp(system, 'dde-file-manager.desktop'), '文件管理器应已移动至启动器列表顶部第一位');
    await agent.aiAssert("启动器窗口左侧应用列表顶部第一位显示文件管理器应用图标");
    console.log('  - 文件管理器已移至顶部');

    // ── 步骤 3/3：右键浏览器（现位于第二位），点击"移至顶部"还原环境 ──
    console.log('[步骤 3/3] 右键浏览器（现位于第二位），点击"移至顶部"还原环境');
    await agent.aiRightClick("启动器窗口左侧应用列表中现在位于第二位的浏览器应用图标");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("移至顶部");
    await new Promise(resolve => setTimeout(resolve, 800));
    assertTrue(await isFirstApp(system, 'org.deepin.browser.desktop'), '浏览器应已移回启动器列表顶部第一位，环境还原');
    await agent.aiAssert("启动器窗口左侧应用列表顶部第一位重新显示浏览器应用图标，环境已还原");
    console.log('  - 浏览器已还原至顶部，环境还原完成');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1935847', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.pressKey("esc");
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 还原默认应用顺序 ==========');
    await restoreMasterArrangement(system);
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
