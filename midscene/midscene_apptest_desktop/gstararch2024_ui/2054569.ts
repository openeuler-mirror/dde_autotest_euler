/**
 * 用例 PMSID: 2054569
 * 用例标题: 【V25】【浩辰CAD建筑 2024】打开墙体工具
 * 生成时间: 2026-10-30 19:30:00
 * 用例编写人：UT003531(钱程)
 */

describe('2054569-【V25】【浩辰CAD建筑 2024】打开墙体工具', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 确保浩辰CAD建筑 2024已安装
    const installCmd = `dpkg -s gstararch2024 >/dev/null 2>&1 || (echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y gstararch2024)`;
    await system.exec(installCmd);
  });

  test('2054569-【V25】【浩辰CAD建筑 2024】打开墙体工具', async ({ device, agent, uos, system }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('浩辰CAD建筑');
    await agent.aiWaitFor('出现"浩辰CAD建筑 2024"图标', {
      timeoutMs: 120000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap('"浩辰CAD建筑 2024"图标');
    try {
      await agent.aiWaitFor('出现"软件试用还剩"的试用对话框', {
        timeoutMs: 60000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('对话框右下角的"试用"按钮');
      console.log('成功处理试用弹窗');
    } catch (e) {
      console.log('未检测到试用弹窗');
    }
    await agent.aiWaitFor('浩辰CAD建筑 2024主界面已显示，顶部出现"常用、插入、注释、视图"等功能选项卡', {
      timeoutMs: 180000,
      checkIntervalMs: 5000,
    });
    // 启动后应用可能自动弹出文件/后台菜单遮挡功能区，按 Esc 收起后再校验界面
    await device.pressKey('Escape');
    await new Promise((r) => setTimeout(r, 1500));
    for (let attempt = 0; attempt < 2; attempt++) {
      await agent.aiTap('左侧"工具箱"面板中"墙体"右侧的下拉箭头', { deepThink: true });
      await new Promise((r) => setTimeout(r, 1500));
      const shown = await agent.aiBoolean(`界面出现'绘制墙体、等分加墙、单线变墙'等墙体功能？`);
      if (shown) {
        break;
      }
      console.log('界面未显示预期内容，按 Esc 后重试一次');
      await device.pressKey('Escape');
      await new Promise((r) => setTimeout(r, 1000));
    }
    await agent.aiAssert("界面出现'绘制墙体、等分加墙、单线变墙'等墙体功能");
    await uos.closeCurrentWindow();
    // 关闭浩辰CAD时可能弹出"是否保存"确认对话框，循环处理直到回到桌面
    for (let i = 0; i < 5; i++) {
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
        await agent.aiWaitFor('出现"退出"确认对话框', {
          timeoutMs: 4000,
          checkIntervalMs: 2000,
        });
        await agent.aiTap('"退出"对话框中的"是"按钮');
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
  }, { timeout: 1200000, tags: ['2054569', 'level2'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
