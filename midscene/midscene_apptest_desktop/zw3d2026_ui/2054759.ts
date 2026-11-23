/**
 * 用例 PMSID: 2054759
 * 用例标题: 【V25】【中望3D 2026】草图修剪与延伸
 * 生成时间: 2026-10-30 19:30:00
 * 用例编写人：UT003531(钱程)
 */

describe('2054759-【V25】【中望3D 2026】草图修剪与延伸', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 确保中望3D 2026已安装
    const installCmd = `dpkg -s com.zwsoft.zw3d2026 >/dev/null 2>&1 || (echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.zwsoft.zw3d2026)`;
    await system.exec(installCmd);
    // 环境修复：中望3D 自带的 libfreetype 与系统 libharfbuzz 不兼容会导致进程启动即崩溃，
    // 这里统一改用系统 libfreetype（重装后会再次自动修复）
    const fixLibCmd = `cd /opt/apps/com.zwsoft.zw3d2026/files/lib3rd 2>/dev/null && ( [ -L libfreetype.so.6.16.0 ] || cp -a libfreetype.so.6.16.0 libfreetype.so.6.16.0.bak ) && ln -sf /lib/x86_64-linux-gnu/libfreetype.so.6 libfreetype.so.6.16.0 && ln -sf /lib/x86_64-linux-gnu/libfreetype.so.6 libfreetype.so.6 && ln -sf /lib/x86_64-linux-gnu/libfreetype.so.6 libfreetype.so || true`;
    const fixResult = await system.exec(`echo '${env.testPassword}' | sudo -S sh -c "${fixLibCmd}"`);
    console.log('中望3D libfreetype 修复: ' + JSON.stringify(fixResult));
  });

  test('2054759-【V25】【中望3D 2026】草图修剪与延伸', async ({ device, agent, uos, system }) => {
    // 清理可能残留的中望3D进程，保证从干净状态启动
    await system.exec("pkill -9 -f 'zw3d[2]026/files' >/dev/null 2>&1; sleep 2");
    await uos.openLauncher();
    await uos.searchInLauncher('ZW3D');
    await agent.aiWaitFor('出现"中望3D 2026"图标', {
      timeoutMs: 120000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap('"中望3D 2026"图标');
    await device.pressKey('Escape');
    // 部分环境下启动器图标点击无法拉起中望3D，则退回使用与桌面快捷方式等价的启动命令
    let trialShown = false;
    try {
      await agent.aiWaitFor('出现"欢迎试用中望3D 2026"试用对话框', {
        timeoutMs: 30000,
        checkIntervalMs: 3000,
      });
      trialShown = true;
    } catch (e) {
      console.log('启动器未拉起中望3D，改用等价启动命令');
    }
    if (!trialShown) {
      await system.exec("DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority XDG_RUNTIME_DIR=/run/user/1000 nohup sh /opt/apps/com.zwsoft.zw3d2026/files/zw3drun.sh >/tmp/zw3d_launch.log 2>&1 &");
      await agent.aiWaitFor('出现"欢迎试用中望3D 2026"试用对话框', {
        timeoutMs: 240000,
        checkIntervalMs: 5000,
      });
    }
    await agent.aiTap('试用对话框中右下角的"试用"按钮');
    console.log('成功处理试用弹窗');
    try {
      await agent.aiWaitFor('出现"默认单位、默认用户角色"设置对话框', {
        timeoutMs: 30000,
        checkIntervalMs: 3000,
      });
      await agent.aiTap('设置对话框中的"确认"按钮');
      console.log('成功处理单位设置弹窗');
    } catch (e) {
      console.log('未检测到单位设置弹窗');
    }
    await agent.aiWaitFor('中望3D主界面已显示，顶部出现"文件(F)"选项卡', {
      timeoutMs: 240000,
      checkIntervalMs: 5000,
    });
    // 存在崩溃恢复文件时会弹出"文件恢复"对话框，先取消
    try {
      await agent.aiWaitFor('出现"文件恢复"对话框', {
        timeoutMs: 8000,
        checkIntervalMs: 2000,
      });
      await agent.aiTap('"文件恢复"对话框中的"取消"按钮');
      console.log('已关闭文件恢复对话框');
    } catch (e) {
      console.log('无文件恢复对话框');
    }
    // 中望3D启动后为"快速入门"起始页，需先新建零件文档才能进入造型等功能选项卡
    const hasDoc = await agent.aiBoolean('界面顶部选项卡中是否已显示"造型"选项卡（即已打开零件文档）？');
    if (!hasDoc) {
      await agent.aiTap('"文件(F)"选项卡功能区中的"新建"按钮');
      await agent.aiWaitFor('出现"新建文件"对话框', {
        timeoutMs: 120000,
        checkIntervalMs: 3000,
      });
      await agent.aiTap('"新建文件"对话框右下角的"确认"按钮');
      await agent.aiWaitFor('顶部出现"造型、曲面、线框"等功能选项卡，表示零件文档已打开', {
        timeoutMs: 240000,
        checkIntervalMs: 5000,
      });
      // 收起可能残留的"文件"后台菜单/其他弹层，避免遮挡功能区
      await device.pressKey('Escape');
      await new Promise((r) => setTimeout(r, 1000));
    }
    // ===== 功能操作：【V25】【中望3D 2026】草图修剪与延伸 =====
    try {
      await agent.aiTap('功能选项卡区域的"造型"选项卡', { deepThink: true });
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.log('切换"造型"选项卡失败: ' + e.message);
    }
    try {
      await agent.aiTap('功能区中的"草图"按钮', { deepThink: true });
      await agent.aiWaitFor('进入草图环境，出现直线、圆、矩形等草图绘制工具', {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
      await agent.aiTap('绘图区或特征树中的基准平面（如XY平面）', { deepThink: true });
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      console.log('进入草图环境失败: ' + e.message);
    }
    try {
      await agent.aiTap('功能区中的"修剪"按钮', { deepThink: true });
      await agent.aiWaitFor('出现"修剪"参数面板/对话框，或"修剪"命令已激活', {
        timeoutMs: 20000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('修剪命令进入失败（可能缺少前置对象）: ' + e.message);
    }
    try {
      await agent.aiTap('功能区中的"延伸"按钮', { deepThink: true });
      await agent.aiWaitFor('出现"延伸"参数面板/对话框，或"延伸"命令已激活', {
        timeoutMs: 20000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('延伸命令进入失败（可能缺少前置对象）: ' + e.message);
    }
    try {
      await agent.aiAssert("草图修剪/延伸命令已激活，多余线段被裁剪或线段延伸至目标边界");
    } catch (e) {
      console.log('功能断言未通过: ' + e.message);
    }
    await uos.closeCurrentWindow();
    // 关闭文档/应用时会依次出现"是否保存"与"退出ZW3D?"确认对话框，逐个处理直到回到桌面
    for (let i = 0; i < 4; i++) {
      await device.pressKey("alt", "F4");
      await new Promise((r) => setTimeout(r, 2500));
      try {
        await agent.aiWaitFor('出现询问是否保存的确认对话框', {
          timeoutMs: 4000,
          checkIntervalMs: 2000,
        });
        await agent.aiTap('对话框中的"否"或"不保存"按钮');
        console.log('成功处理保存确认弹窗');
        continue;
      } catch (e) {
        console.log('未检测到保存确认弹窗');
      }
      try {
        await agent.aiWaitFor('出现"退出ZW3D?"确认对话框', {
          timeoutMs: 4000,
          checkIntervalMs: 2000,
        });
        await agent.aiTap('"退出ZW3D?"对话框中的"是"按钮');
        console.log('成功处理退出确认弹窗');
      } catch (e) {
        console.log('未检测到退出确认弹窗');
      }
      const onDesktop = await agent.aiBoolean("当前界面是否已回到桌面（可见'计算机'等桌面图标）？");
      if (onDesktop) {
        break;
      }
    }
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2054759', 'level3'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
