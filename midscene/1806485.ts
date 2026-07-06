/**
 * AI生成的测试脚本
 * 用例 PMSID: 1806485
 * 用例标题: Bug185973转：选中多个文件删除时，会删除所有
 * 生成时间: 2025-12-16 10:30:00
 * 用例编写人: UT000211（陈依）
 */


describe('1806485-Bug185973转：选中多个文件删除时，会删除所有', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    await uos.openApp('文件管理器', 5000, 100000);
    // 1.打开文件管理器，点击文管侧边栏的桌面，进入到桌面目录，并最大化文件管理器窗口，等到文件管理器窗口最大化
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('文件管理器最大化按钮');
    await agent.aiWaitFor('文件管理器窗口最大化');
 });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理选择状态
    await device.pressKey('esc');
  });

  test('1806485-Bug185973转：选中多个文件删除时，会删除所有', async ({ uos, agent, device, system }) => {
    // 3.双击test文件夹，进入到test文件夹内
    await system.exec('mkdir -p ~/Desktop/test');
    await agent.aiAssert('桌面存在test文件夹');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiDoubleClick('test文件夹');
    await agent.aiAssert('进入到test文件夹内');
    await system.exec('touch ~/Desktop/test/test1 ~/Desktop/test/test2 ~/Desktop/test/test3 ~/Desktop/test/test4');
    await agent.aiWaitFor("test1 test2 test3 test4文件出现")
    await agent.aiAssert('显示test1 test2 test3 test4文件');
    
    // 4.使用快捷键执行全选操作，预期所有文件被选中
    await device.pressKey('Ctrl+A');
    await agent.aiAssert('所有文件高亮显示');
    
    // 5.使用快捷键执行delete操作，test1 test2 test3 test4文件都被删除
    await device.pressKey('Delete');
    await agent.aiAssert('test文件夹内没有文件');
    
  }, { timeout: 600000, tags: ['1806485', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 删除test文件夹
    await system.exec('rm -rf ~/Desktop/test');
    await agent.aiAssert('桌面不存在test文件夹');
    // 关闭文件管理器
    await agent.aiTap('窗口右上角关闭按钮:X');
    await uos.showDesktop();
  });
});
