/**
 * 用例 PMSID: 1881185
 * 用例标题: 【桌面】【剪贴板】同一文本内容连续多次复制/剪贴，只生成一条剪贴板记录
 * 生成时间: 2025-12-23 10:01:17
 * 用例编写人：UT000224(何权)
 */

describe("1881185-【桌面】【剪贴板】同一文本内容连续多次复制/剪贴，只生成一条剪贴板记录", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`)
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1881185-【桌面】【剪贴板】同一文本内容连续多次复制/剪贴，只生成一条剪贴板记录",
    async ({ device, agent, system}) => {
      // 打开文本编辑器
      system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F");
      await agent.aiWaitFor("文本编辑器界面已显示");
      
      // 生成带时间后缀的测试文本内容A作为变量
      const testContentA = `测试文本内容A_${Date.now()}`;
      await device.typeText(testContentA);
      await agent.aiWaitFor(`文本编辑器中显示“${testContentA}”`);
      
      // 第一次复制内容A
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第二次复制相同内容A
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三次复制相同内容A
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证只有一条记录
      await agent.aiAssert("右侧的剪贴板窗口中只有1条文本记录");
      await agent.aiAssert(`右侧的剪贴板窗口中的文本记录内容为“${testContentA}”`);

    },
    { timeout: 600000, tags: ["1881185", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    system.exec(`systemctl --user restart dde-clipboard`)
    system.exec("killall deepin-editor");
  });
});