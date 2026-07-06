
/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1806465
 * 用例标题: 文件选择对话框-勾选【总是在新窗口打开文件夹】后检查文件选择对话框进入目录
 * 生成时间: 2026-01-06 17:35:09
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");


describe('1806465-文件选择对话框-勾选【总是在新窗口打开文件夹】后检查文件选择对话框进入目录', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806465-文件选择对话框-勾选【总是在新窗口打开文件夹】后检查文件选择对话框进入目录', async ({ device, agent, uos }) => {
    await uos.openApp("文件管理器");
    await agent.aiTap('文管窗口右上角菜单按钮');
    await agent.aiTap('设置');

// 根据判断结果执行下一步操作
const result = await agent.aiBoolean('未勾选总是在新窗口打开文件夹');
if (result) {
    await agent.aiTap('勾选总是在新窗口打开文件夹');
    console.log('已勾选总是在新窗口打开文件夹');
} else {
    console.log('已勾选，跳过勾选操作');
}

    await uos.openApp("看图");
    await agent.aiTap('打开图片');
    await agent.aiAssert('打开文管窗口，选中图片目录');
    await agent.aiTap('文管左侧音乐');
    await agent.aiAssert('进入音乐目录');
    await agent.aiTap('文管左侧视频');
    await agent.aiAssert('进入视频目录');
    await agent.aiTap('文管左侧桌面');
    await agent.aiAssert('进入桌面目录');
    await uos.closeCurrentWindow();
    
  }, { timeout: 600000, tags: ['1806465', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 还原测试操作
    await uos.openApp("文件管理器");
    await agent.aiTap('文管窗口右上角菜单按钮');
    await agent.aiTap('设置');

// 根据判断结果执行下一步操作
  const isChecked = await agent.aiBoolean('未勾选总是在新窗口打开文件夹');
  if (isChecked) {
      console.log('未勾选，跳过勾选操作');
  } else {
      await agent.aiTap('去勾选总是在新窗口打开文件夹');
      console.log('去勾选，完成还原选操作');
  }
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});
