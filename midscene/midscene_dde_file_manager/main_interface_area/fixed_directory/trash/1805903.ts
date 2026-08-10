/**
 * 用例 PMSID: 1805903
 * 用例标题: 添加数据到回收站-多次删除同名文件到回收站
 * 生成时间: 2025-12-29 20:08:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 实现在桌面重复创建和删除文件夹A和文本文档A三次的功能
 */

describe('1805903-添加数据到回收站-多次删除同名文件到回收站', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805903-桌面重复创建删除同名文件测试', async ({ device, agent, uos, system }) => { 
    // 循环执行2次
    for (let i = 0; i < 2; i++) {
    console.log(`\n=== 第 ${i + 1} 次循环开始 ===`);
        
    // 步骤一：在桌面新建1805903文件夹和1805903.txt文本文档
    await system.exec('mkdir -p ~/Desktop/1805903');
    await system.exec('echo "测试文件内容" > ~/Desktop/1805903.txt');
        
    // 步骤二：鼠标右键删除1805903文件夹和1805903.txt文本文档
    // 删除1805903文件夹
    await agent.aiTap('1805903文件夹');
    await agent.aiRightClick('1805903文件夹');
    await agent.aiTap('删除');

    // 删除1805903.txt文本文档
    await agent.aiTap('1805903.txt');
    await agent.aiRightClick('1805903.txt');
    await agent.aiTap('删除');
        
    // 步骤三：回收站内显示1805903文件夹和1805903.txt文本文档
    await uos.openApp('文件管理器');
    await agent.aiTap('左侧导航栏回收站目录');
        
    // 断言回收站中存在1805903文件夹和1805903.txt文本文档
    await agent.aiAssert('1805903文件夹在回收站中');
    await agent.aiAssert('1805903.txt在回收站中');

    // 关闭所有文管窗口
    await system.exec('killall dde-file-manager');
    }  
    console.log('测试完成：桌面重复创建删除同名文件测试执行完毕');
    
  }, { timeout: 1800000, tags: ["1805903", "level3", "trash", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理测试文件（如果存在）
    console.log('清理测试文件');
    try {
      // 清空回收站
      await system.exec('rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*');
    } catch (error) {
      console.log('清理过程中出现错误，跳过清理操作');
    }
    
    // 关闭所有文管窗口
    await system.exec('killall dde-file-manager');
    // 删除文件夹及文本文档
    await system.exec('rm -rf ~/Desktop/1805903*');
  });
});
