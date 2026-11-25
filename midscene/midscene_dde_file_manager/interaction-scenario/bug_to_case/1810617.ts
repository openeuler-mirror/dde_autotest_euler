// @ts-nocheck

/**
 * 用例 PMSID: 1810617
 * 用例标题: 【Bug转用例场景】关闭文件选择对话框后进程在60秒后正常销毁
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810617-关闭文件选择对话框后进程在60秒后正常销毁', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810617-关闭文件选择对话框后进程在60秒后正常销毁', async ({ device, agent, uos, system}) => {
    console.log('=== 开始测试：1810617 ===');

    console.log('步骤1：启动看图');
    await uos.openApp('看图');
    await agent.aiAssert('桌面存在看图窗口');
    console.log('桌面存在看图窗口已打开');

    console.log('步骤2：点击【打开图片】');
    await agent.aiTap('右上角有3条横线的图标');
    await agent.aiTap('打开图片');
    await agent.aiAssert('唤起文管选择窗');
    console.log('唤起文管选择窗');

    console.log('步骤3：关闭文管选择窗');
    await agent.aiTap('文件选择对话框右上角的关闭按钮:x');
    await agent.aiAssert('桌面无文管选择窗口');
    console.log('文管选择窗关闭成功');  

    console.log('步骤4：等待61S后再次点击【打开图片】');
    await system.exec('sleep 61');
    await agent.aiTap('打开图片');
    await agent.aiAssert('唤起文管选择窗');
    console.log('等待61秒后再次唤起文管选择窗');

    await agent.aiTap('文件选择对话框右上角的关闭按钮:x');
    await uos.closeCurrentWindow();

    console.log('✅ 1810617用例测试完成');
  }, { timeout: 1200000, tags: ['1810617', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-image-viewer', 500);
    await uos.showDesktop();
  });
});