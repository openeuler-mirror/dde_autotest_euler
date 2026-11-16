/**
 * 用例 PMSID: 1801667
 * 用例标题: 【通知中心】通知中心长驻区域任一置顶应用折叠通知信息[清除通知]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801667-【通知中心】通知中心长驻区域任一置顶应用折叠通知信息[清除通知]按钮功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801667-【通知中心】通知中心长驻区域任一置顶应用折叠通知信息[清除通知]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 置顶通知（带重试，避免AI点击偏差导致置顶未生效；先检查菜单状态避免重复切换）
    const pinNotification = async (target, verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await agent.aiRightClick(target, { deepThink: true });
        await agent.aiWaitFor("右键菜单已展示");
        const alreadyPinned = await agent.aiBoolean("右键菜单中显示'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
        if (alreadyPinned) {
          await device.pressKey("Escape");
          await sleep(500);
          return;
        }
        await agent.aiTap("右键菜单中的'置顶'按钮", { deepThink: true });
        await sleep(1500);
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await sleep(500);
      }
      throw new Error(`置顶失败: ${target}`);
    };

    // 取消置顶通知（带重试，避免AI点击偏差导致取消置顶未生效；先检查菜单状态避免重复切换）
    const unpinNotification = async (target, verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await agent.aiRightClick(target, { deepThink: true });
        await agent.aiWaitFor("右键菜单已展示");
        const alreadyUnpinned = await agent.aiBoolean("右键菜单中显示'置顶'按钮（表示该通知未置顶）", { deepThink: true });
        if (alreadyUnpinned) {
          await device.pressKey("Escape");
          await sleep(500);
          return;
        }
        await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
        await sleep(1500);
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await sleep(500);
      }
      throw new Error(`取消置顶失败: ${target}`);
    };

    // 是否已成功置顶，用于 finally 中决定是否需要取消置顶恢复初始状态
    let pinned = false;

    try {
      const apps = [
        { name: 'dde-control-center', title: '控制中心通知', prefix: '控制中心' },
        { name: 'org.deepin.browser', title: '浏览器通知', prefix: '浏览器' },
      ];
      for (let a = 0; a < apps.length; a++) {
        const app = apps[a];
        for (let i = 1; i <= 3; i++) {
          await system.exec(`notify-send -a '${app.name}' "${app.title}" "${app.prefix}第${i}条通知"`);
          await sleep(200);
        }
        // 应用之间间隔1分钟，最后一个应用发送后无需等待
        if (a < apps.length - 1) {
          await sleep(60000);
        }
      }
      // 等待最后一条通知横幅出现
      await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
      // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心
      await sleep(6000);
      // 打开通知中心
      await device.pressKey("super", "m");
      await agent.aiWaitFor("通知中心界面已显示");
      await agent.aiAssert("通知中心文案下面(长驻区域)有来自不同应用的通知信息，不同应用通知分开排列折叠展示", { deepThink: true });

      // 前置条件：置顶长驻区域最下方的一类应用(dde-control-center)折叠通知，使其排到最前面
      await pinNotification(
        "通知中心文案下面(长驻区域)最下方的'dde-control-center'折叠通知信息",
        "通知中心文案下面(长驻区域)通知信息显示顺序为'dde-control-center'、'org.deepin.browser'的折叠通知"
      );
      pinned = true;

      // 悬停在置顶应用的折叠通知上，展示【清除通知】按钮
      await agent.aiHover("通知中心文案下面(长驻区域)置顶的'dde-control-center'折叠通知信息", { deepThink: true });
      await sleep(2000);
      // 点击[清除通知]按钮（X图标）
      await agent.aiTap("该折叠通知右上角的x关闭按钮", { deepThink: true });
      // 检查: 清除此应用的所有通知消息，未清除的通知往上补位，通知中心不收起
      await sleep(2000);
      await agent.aiAssert("通知中心文案下面(长驻区域)'dde-control-center'的折叠通知已全部清除", { deepThink: true });
      await agent.aiHover("桌面左侧没有图标的空白区域", { deepThink: true });
      await sleep(500);
      // 检查: 清除置顶应用通知后，其他应用(浏览器)通知补位到最上方
      await agent.aiAssert("通知中心文案下面(长驻区域)最上方显示浏览器的通知信息，浏览器通知已补位到通知中心文案下面(长驻区域)顶端", { deepThink: true });
      await agent.aiAssert("通知中心未关闭", { deepThink: true });
    } finally {
      // 无论断言是否失败，都取消被清理通知的置顶恢复初始状态：
      //（清除置顶通知后，该应用通知已被清除无法操作，需在通知中心重新发送该应用（仍为置顶）的通知后再取消置顶）
      try {
        if (pinned) {
          for (let i = 1; i <= 3; i++) {
            await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知"`);
            await sleep(200);
          }
          await sleep(2000);
          await agent.aiWaitFor("通知中心文案下面(长驻区域)置顶的控制中心通知信息");
          await unpinNotification(
            "通知中心文案下面(长驻区域)置顶的'dde-control-center'折叠通知信息",
            "通知中心文案下面(长驻区域)'dde-control-center'折叠通知已取消置顶，不再排在最前方"
          );
        }
      } catch (e) {
        console.log('finally 恢复置顶状态失败（不影响用例执行）: ' + e.message);
      }
    }
  }, { timeout: 1200000, tags: ['1801667', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});