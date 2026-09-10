/**
 * 用例 PMSID: 1881195
 * 用例标题: 【桌面】【剪贴板】源文件被删除的剪贴板文件记录展示效果
 * 生成时间: 2025-12-18 15:14:09
 * 用例编写人：UT000224(何权)
 */

describe("1881195-【桌面】【剪贴板】源文件被删除的剪贴板文件记录展示效果", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1881195-【桌面】【剪贴板】源文件被删除的剪贴板文件记录展示效果",
    async ({ device, agent, uos, system}) => {
      system.exec(`mkdir -p /home/$USER/Desktop/test1`);
      await agent.aiWaitFor("test1在桌面显示");
      await agent.aiRightClick("点击test1");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap('点击复制')
      await agent.aiRightClick("点击test1");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap('点击删除')
      await system.exec(`xdotool key Super+v`);
      await agent.aiDoubleClick('剪贴板中的test1文件夹');
      await agent.aiAssert("剪贴板记录中添加‘源文件已被删除’提示");
      // 提示弹窗，AI会认为失败和重复尝试，补充不尝试，不报错。
      await agent.aiAction('拖拽剪贴板中的test1文件夹到桌面中间,只尝试一次，失败不要报错，也不要做任何后续动作');
      await agent.aiAssert("弹出提示框，提示源文件不存在");
      await agent.aiAction("点击关闭弹出窗口的",{ deepThink: true });
    },
    { timeout: 1200000, tags: ["1881195", "level3"] },
  );

  afterEach(async ({ device , agent}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    await system.exec(`xdotool key Super+v`);
    await agent.aiTap("全部清除");
  });
});
