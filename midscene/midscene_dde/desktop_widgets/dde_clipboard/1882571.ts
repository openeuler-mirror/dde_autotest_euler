/**
 * 用例 PMSID: 1882571
 * 用例标题: 【桌面】【剪贴板】剪贴板列表记录多页展示
 * 生成时间: 2025-12-23 14:38:48
 * 用例编写人：UT000224(何权)
 */

describe("1882571-【桌面】【剪贴板】剪贴板列表记录多页展示", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1882571-【桌面】【剪贴板】剪贴板列表记录多页展示",
    async ({ device, agent, uos, system}) => {
      // 打开文本编辑器
      console.log("打开文本编辑器");
      system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F");
      await agent.aiWaitFor("文本编辑器界面已显示");
      
      // 生成20条不同的文本记录
      for (let i = 1; i <= 20; i++) {
        const textContent = `这是第${i}条测试文本内容，用于剪贴板多页展示测试`;
        
        // 清空编辑器并输入新内容
        await device.pressKey("Ctrl", "a");
        await device.pressKey("Delete");
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 输入新的文本内容
        await device.typeText(textContent);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 全选并复制文本
        await device.pressKey("Ctrl", "a");
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey("Ctrl", "c");
      }
      
      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
          
      // 滚动到最底部--滚动存在问题，采用方向键模拟
      system.exec(`xdotool key Home`);
      for (let i = 1; i <= 19; i++) {
        system.exec(`xdotool key Down`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // 验证滚动到底部后能看到最后复制的文本
      await agent.aiAssert("剪贴板窗口底部显示：这是第1条测试文本内容，用于剪贴板多页展示测试");
    },
    { timeout: 600000, tags: ["1882571", "level2"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 关闭文本编辑器
    system.exec("killall deepin-editor");
    system.exec(`systemctl --user restart dde-clipboard`);
  });
});