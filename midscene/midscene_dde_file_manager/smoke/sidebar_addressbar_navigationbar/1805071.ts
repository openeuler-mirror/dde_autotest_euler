/**
 * 用例 PMSID: 1805071
 * 用例标题: 【t】历史导航-浏览路径历史被删除，跳转目录
 * 生成时间: 2025-12-17 10:30:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['test1', 'test2', 'test3', 'test4'];

describe('1805071-[t]历史导航-浏览路径历史被删除，跳转目录', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
    // 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 跳转到目标目录 桌面/test1/test2/test3/test4
    await device.pressKey("Ctrl", "L");
    await device.pressKey("Ctrl", "A");
    await device.pressKey("Backspace");
    await agent.aiWaitFor('地址栏内容被清空');
    await device.typeText('~/Desktop/test1/test2/test3/test4', true);
    await agent.aiWaitFor('文件管理器跳转到test4目录');
  });

  test('1805071-[t]历史导航-浏览路径历史被删除，跳转目录--删除test4目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 右击地址栏中的test3，打开新窗口
    await agent.aiRightClick('导航栏中的地址栏中test3部分');
    await agent.aiWaitFor('地址栏右键菜单已弹出');
    await agent.aiTap('地址栏右键菜单中的在新窗口打开');
    await agent.aiWaitFor('新的文件管理器窗口已打开');
    await agent.aiAssert('新的文件管理器窗口目录是test3');

    // 步骤 2: 删除test4目录
    await agent.aiRightClick('文件列表中的test4文件夹');
    await agent.aiTap('右键菜单中的删除选项');
    await agent.aiWaitFor('当前目录下没有test4文件夹');

    // 步骤 3: 关闭当前窗口，回到第一个文件管理器窗口
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });

    // 确认当前目录为test3目录
    await agent.aiAssert('当前目录为test3目录');

    // 确认地址蓝中从右到左依次有 test3 test2 test1 桌面
    await agent.aiAssert('地址栏中从右到左依次是 test3 test2 test1 桌面, 忽略字符中间的/和空格');

  }, { timeout: 600000, tags: ['1805071', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'path jump', 'test4'] });

  test('1805071-[t]历史导航-浏览路径历史被删除，跳转目录--删除test1目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 右击地址栏中的桌面，打开新窗口
    await agent.aiRightClick('导航栏中的地址栏中桌面部分');
    await agent.aiWaitFor('地址栏右键菜单已弹出');
    await agent.aiTap('地址栏右键菜单中的在新窗口打开');
    await agent.aiWaitFor('新的文件管理器窗口已打开');
    await agent.aiAssert('新的文件管理器窗口目录是桌面');

    // 步骤 2: 删除test1目录
    await agent.aiRightClick('文件列表中的test1文件夹');
    await agent.aiTap('右键菜单中的删除选项');
    await agent.aiWaitFor('当前目录下没有test1文件夹');

    // 步骤 3: 关闭当前窗口，回到第一个文件管理器窗口
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });

    // 确认当前目录为桌面目录
    await agent.aiAssert('当前目录为桌面目录');

    // 确认地址蓝中从右到左依次有 桌面
    await agent.aiAssert('地址栏中从右到左依次是 桌面, 忽略字符中间的/和空格');

  }, { timeout: 600000, tags: ['1805071', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'path jump', 'test1'] });

  test('1805071-[t]历史导航-浏览路径历史被删除，跳转目录--删除test2目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 右击地址栏中的test1，打开新窗口
    await agent.aiRightClick('导航栏中的地址栏中test1部分');
    await agent.aiWaitFor('地址栏右键菜单已弹出');
    await agent.aiTap('地址栏右键菜单中的在新窗口打开');
    await agent.aiWaitFor('新的文件管理器窗口已打开');
    await agent.aiAssert('新的文件管理器窗口目录是test1');

    // 步骤 2: 删除test2目录
    await agent.aiRightClick('文件列表中的test2文件夹');
    await agent.aiTap('右键菜单中的删除选项');
    await agent.aiWaitFor('当前目录下没有test2文件夹');

    // 步骤 3: 关闭当前窗口，回到第一个文件管理器窗口
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });

    // 确认当前目录为test1目录
    await agent.aiAssert('当前目录为test1目录');

    // 确认地址蓝中从右到左依次有 test1 桌面
    await agent.aiAssert('地址栏中从右到左依次是 test1 桌面, 忽略字符中间的/和空格');
  }, { timeout: 600000, tags: ['1805071', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'path jump', 'test2'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('窗口右上角关闭按钮:X');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
