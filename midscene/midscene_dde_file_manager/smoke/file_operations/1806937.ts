/**
 * 用例 PMSID: 1806937
 * 用例标题: 反选快捷键【Shift+Ctrl+I】- 部分选中
 * 生成时间: 2025-12-16 10:30:00
 * 用例编写人: UT000211（陈依）
 */


describe('1806937-反选快捷键【Shift+Ctrl+I】- 部分选中', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    // 1.使用命令在桌面新建文件夹test
    await system.exec('mkdir -p ~/Desktop/test');
    await uos.openApp('文件管理器', 5000, 100000);
    // 打开文件管理器先进入到桌面目录，再进入test的文件夹
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiDoubleClick('test文件夹');
    await agent.aiAssert('进入到test文件夹');
    // 使用命令在test文件夹内新建testfile1 testfile2
    await system.exec('touch ~/Desktop/test/testfile1 ~/Desktop/test/testfile2');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理选择状态
    await device.pressKey('esc');
    await agent.aiTap('文件夹空白区域');
  });

  test('1806937-反选快捷键【Shift+Ctrl+I】- 部分选中', async ({ uos, agent, device, system }) => {
    // 1.执行ctrl +A 进行全选操作，预期testfile1 testfile2被选中
    await device.pressKey('Ctrl+A');
    await agent.aiAssert('testfile1被选中');
    await agent.aiAssert('testfile2被选中');
    await agent.aiAssert('testfile1和testfile2高亮显示');
   
    
    // 2.再使用命令在test文件夹中新建文件testfile3和testfile4
    await system.exec('touch ~/Desktop/test/testfile3 ~/Desktop/test/testfile4');
    await agent.aiWaitFor('test文件夹存在testfile3 存在testfile4文件')
    await agent.aiAssert('存在testfile3文件');
    await agent.aiAssert('存在testfile4文件');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3.执行快捷键操作Shift+Ctrl+I,预期：testfile3 testfile4被选中
    await device.pressKey('Ctrl+Shift+I');
    await agent.aiAssert('testfile3被选中');
    await agent.aiAssert('testfile4被选中');
    await agent.aiAssert('testfile3和testfile4高亮显示');
 
    
    // 验证testfile1和testfile2未被选中
    await agent.aiAssert('testfile1未被选中');
    await agent.aiAssert('testfile2未被选中');
    
  }, { timeout: 600000, tags: ['1806937', 'level2', 'smoke', 'DITT', 'chenyi'] });

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
