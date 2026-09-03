
/**
 * 用例 PMSID: 1294551
 * 用例标题: 【桌面】【剪贴板】从浏览器的网页页面中复制文本信息，可生成剪贴板文本记录
 * 生成时间: 2025-12-19 14:55:58
 * 用例编写人：UT000224(何权)
 */
describe("1294551-【桌面】【剪贴板】从浏览器的网页页面中复制文本信息，可生成剪贴板文本记录", () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });
  test(
    "1294551-【桌面】【剪贴板】从浏览器的网页页面中复制文本信息，可生成剪贴板文本记录",
    async ({ device, agent, uos, system }) => {
      // 启动浏览器并等待完全加载
      system.exec('/usr/bin/browser "pms.uniontech.com"');
      await new Promise(resolve => setTimeout(resolve, 2000));      
      // 点击页面确保焦点
      await agent.aiTap(`点击界面上的管理系统文字`);
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`xdotool key super+Up`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 执行全选操作
      system.exec(`xdotool key Ctrl+a`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 执行复制操作
      system.exec(`xdotool key Ctrl+c`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F");
      await agent.aiWaitFor("文本编辑器界面已显示");
      // 新开一个页面
      system.exec(`xdotool key Ctrl+t`);
      await device.pressKey("Ctrl", "v");
      await agent.aiAssert(
        "文本编辑器内容包括“统信软件技术有限公司”“项目管理系统”“用户名”“密码”“保持登录”“忘记密码””）",
      );
    },
    { timeout: 1200000, tags: ["1294551", "level2", "smoke" ]},
  );
  afterEach(async ({ device, system, agent }) => {
    console.log("4. afterEach: 每个测试后的清理");
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    await system.exec(`killall deepin-editor && killall browser`);
    await system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    await agent.aiTap("全部清除");
  });
});
