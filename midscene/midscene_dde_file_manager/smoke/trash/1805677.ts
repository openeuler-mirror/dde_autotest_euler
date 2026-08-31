/**
 * 用例 PMSID: 1805677
 * 用例标题: [093]页面检查-回收站无内容时
 * 生成时间：2025-12-24 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805677-页面检查-回收站无内容时', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805677-[093]页面检查-回收站无内容时', async ({ device, agent, uos, system}) => {
    // 前置条件：检查是否可以清空回收站
    await system.exec('killall dde-file-manager', 500);
    await agent.aiRightClick("桌面回收站图标");
    
    // 检查右键菜单中是否有"清空回收站"选项
    const menuItems = await agent.aiQuery("右键菜单中的所有选项");
    const canEmpty = menuItems && menuItems.toString().includes('清空回收站');
    
    let emptySuccess = false;
    let recycleBinOpened = false;
    
    if (canEmpty) {
      console.log('检测到回收站有内容，尝试清空操作');
      try {
        // 尝试点击清空回收站
        await agent.aiTap("清空回收站");
        console.log('成功点击清空回收站，等待确认弹框');
        
        // 等待确认弹框出现
        await agent.aiWaitFor("确认清空回收站");
        
        // 使用Enter快捷键确认
        console.log('使用Enter键确认清空回收站');
        await device.pressKey("Enter");
        console.log('已发送Enter键确认');
        
        // 等待清空操作完成
        await agent.aiWaitFor("回收站已清空");
        console.log('回收站清空操作完成');
        emptySuccess = true;
        
      } catch (error) {
        console.log('清空回收站操作失败，可能是点击无响应，继续执行后续步骤');
        // 不抛出错误，继续执行双击打开回收站的步骤
      }
    } else {
      console.log('回收站已为空，跳过清空操作');
    }
    
    // 确保只打开一个回收站窗口
    if (!recycleBinOpened) {
      // 检查是否已经有打开的回收站窗口
      try {
        const hasOpenWindow = await agent.aiQuery("是否有打开的回收站窗口");
        if (hasOpenWindow) {
          console.log('回收站窗口已打开，无需重复打开');
          recycleBinOpened = true;
        } else {
          console.log('未检测到回收站窗口，执行双击打开');
          // 步骤：双击桌面回收站图标-观察回收站页面显示
          await agent.aiDoubleClick("桌面回收站图标");
          recycleBinOpened = true;
        }
      } catch (error) {
        console.log('检测窗口状态失败，直接双击打开回收站');
        // 步骤：双击桌面回收站图标-观察回收站页面显示
        await agent.aiDoubleClick("桌面回收站图标");
        recycleBinOpened = true;
      }
    }

    // 等待回收站页面打开
    await agent.aiWaitFor("回收站页面已打开");

    // 结果：有"文件夹为空"的提示信息，并且页面的右上角没有"清空"按钮
    await agent.aiAssert("文件夹为空");
    await agent.aiAssert("回收站页面右上角无‘清空’按钮");

  }, { timeout: 600000, tags: ['1805677', 'level1','functional', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 检查是否有打开的回收站窗口，如果有则关闭
    try {
      const hasOpenWindow = await agent.aiQuery("是否有打开的回收站窗口");
      if (hasOpenWindow) {
        // 关闭回收站窗口
        await agent.aiDoubleClick("窗口右上角关闭按钮:X");
      }
    } catch (error) {
      console.log('没有需要关闭的窗口，跳过清理步骤');
      await system.exec('killall dde-file-manager', 500);
      await system.exec("rm -rf ~/.local/share/Trash/*")
    }
  });
});