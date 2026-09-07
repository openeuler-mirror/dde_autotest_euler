/**
 * 用例 PMSID: 1804837
 * 用例标题: [core]未设置普通删除提示时检查普通删除单个或多个文件提示
 * 生成时间: 2026-05-13
 * 用例编写人: UT000649（黄甜）
 */

describe('1804837-[core]未设置普通删除提示时检查普通删除单个或多个文件提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`rm -rf ~/.local/share/Trash/files/*`)
  });

  test('1804837-[core]未设置普通删除提示时检查普通删除单个或多个文件提示', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1804837-普通删除提示设置 ===');

    console.log('步骤1: 在文管中创建测试文件');
    await system.exec(`touch ~/Documents/test1.txt`)
    await system.exec(`touch ~/Documents/test2.txt`)
    await system.exec(`touch ~/Documents/test3.txt`)
    console.log('✅ 已创建测试文件');

    console.log('步骤2: 删除单个文件');
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiRightClick('test1.txt');
    await agent.aiTap('删除');
    await agent.aiAssert("文件管理器中不存在test1.txt");
    console.log('✅ 删除单个文件完成：无提示');

    console.log('步骤3: 删除多个文件');
    await device.pressKey('Ctrl+a');
    await agent.aiRightClick('test2');
    await agent.aiTap('删除');
    await agent.aiAssert("文件管理器中不存在test2.txt和test3.txt");
    console.log('✅ 删除多个文件完成：无提示');
    
    await agent.aiTap("侧边栏的回收站目录");
    await agent.aiAssert("回收站目录中存在test1、test2.txt和test3.txt");
    console.log('✅ 验证回收站目录中存在test1、test2.txt和test3.txt');

    console.log('✅ 1804837用例测试完成');
  }, { timeout: 600000, tags: ["1804837", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/Documents/test*');
    await system.exec(`rm -rf ~/.local/share/Trash/files/*`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('文件管理器右上角关闭按钮');
  });
});