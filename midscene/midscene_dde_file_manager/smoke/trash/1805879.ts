// @ts-nocheck
/**
 * 用例 PMSID: 1805879
 * 用例标题: 右键菜单-回收站为空的时候,右键全部还原不可点击
 * 生成时间：2025-12-11 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805879-全部还原-回收站无内容时不可操作 ', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805879-右键菜单-回收站内选中多个文件夹呼出右键菜单正常', async ({ device, agent, uos, system}) => {
    // 前置条件：检查是否可以清空回收站
    await system.exec('killall dde-file-manager', 500);
    await agent.aiRightClick("桌面回收站图标");
    
    // 检查右键菜单中是否有"清空回收站"选项
    const menuItems = await agent.aiQuery("右键菜单中的所有选项");
    const canEmpty = menuItems && menuItems.toString().includes('清空回收站');
    
    if (canEmpty) {
      console.log('检测到回收站有内容，尝试清空操作');
      try {
        // 尝试点击清空回收站
        await agent.aiTap("清空回收站");
        console.log('成功点击清空回收站，等待确认弹框');
        
        // 等待确认弹框出现
        await agent.aiWaitFor("确认清空回收站");
        await agent.aiTap("清空")
        
        // 等待清空操作完成
        await agent.aiWaitFor("回收站已清空");
        console.log('回收站清空操作完成');
        
      } catch (error) {
        console.log('清空回收站操作失败，可能是点击无响应，继续执行后续步骤');
        // 不抛出错误，继续执行后续步骤
      }
    } else {
      console.log('回收站已为空，跳过清空操作');
    }

    // 步骤1：在桌面空白处，双击桌面回收站图标，可以正常进入回收站页面
    console.log('执行步骤1：双击桌面回收站图标进入页面');
    await agent.aiDoubleClick("桌面回收站图标");
    
    // 等待回收站页面打开
    await agent.aiWaitFor("回收站页面已打开");
    console.log('回收站页面已成功打开');

    // 步骤2：在回收站空白处页面，右键，右键菜单中，"全部还原"和"清空回收站"是不可点击的
    console.log('执行步骤2：在回收站空白处右键呼出菜单');
    await agent.aiRightClick("回收站空白区域");
    
    // 检查菜单选项状态
    console.log('检查右键菜单中"全部还原"选项是否不可点击');
    await agent.aiAssert("右键菜单中'全部还原'点击无效");

    console.log('测试用例执行完成');
    await agent.aiTap("窗口右上角关闭按钮:X");

  },{ timeout: 600000, tags: ['1805879','level2', 'smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});