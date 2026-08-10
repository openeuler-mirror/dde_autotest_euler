/**
 * 用例 PMSID: 1805901
 * 用例标题: 添加数据到回收站-删除多层级目录到回收站
 * 生成时间: 2025-12-29 20:08:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 实现在桌面创建4层级目录，右键删除并验证回收站中目录层级一致性的功能
 */

describe('1805901-添加数据到回收站-删除多层级目录到回收站', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805901-添加数据到回收站-删除多层级目录到回收站', async ({ device, agent, uos, system }) => {
    // 前置条件：使用命令行创建4层级目录：test/test1/test2/test3/
    await system.exec('mkdir -p ~/Desktop/1805901/1805901_1/1805901_2/1805901_3/');
    
    // 在每个层级创建测试文件
    await system.exec('echo "level1 file" > ~/Desktop/1805901/1805901.txt');
    await system.exec('echo "level2 file" > ~/Desktop/1805901/1805901_1/1805901_1.txt');
    await system.exec('echo "level3 file" > ~/Desktop/1805901/1805901_1/1805901_2/1805901_2.txt');
    await system.exec('echo "level4 file" > ~/Desktop/1805901/1805901_1/1805901_2/1805901_3/1805901_3.txt');
    
    // 步骤一：鼠标右键删除顶层目录test
    await uos.openApp('文件管理器');
    await agent.aiTap('左侧导航栏桌面目录')
    await agent.aiTap('1805901');
    await agent.aiRightClick('在1805901上右键点击');
    await agent.aiTap('删除');
    
    // 断言：test文件删除成功，并在回收站中可见
    await agent.aiTap('侧边栏回收站图标');
    await agent.aiAssert('1805901在回收站中');
    
    // 步骤二：检查目录层级与删除前保持一致
    // 第一层级验证，进入test目录
    await agent.aiDoubleClick('1805901');
    
    // 断言：第一层级文件和文件夹存在
    await agent.aiAssert('1805901.txt在1805901中');
    await agent.aiAssert('1805901_1在1805901中');
    
    // 第二层级验证，进入1805901_1目录
    await agent.aiDoubleClick('1805901_1');
    
    // 断言：第二层级文件和文件夹存在
    await agent.aiAssert('1805901_1.txt在1805901_1中');
    await agent.aiAssert('1805901_2在1805901_1中');
    
    // 第三层级验证，进入1805901_2目目录
    await agent.aiDoubleClick('1805901_2');
    
    // 断言：第三层级文件和文件夹存在
    await agent.aiAssert('1805901_2.txt在1805901_2中');
    await agent.aiAssert('1805901_3在1805901_2中');
    
    // 第四层级验证：进入1805901_3文件夹
    await agent.aiDoubleClick('1805901_3');
    
    // 断言：第四层级文件存在
    await agent.aiAssert('1805901_3.txt在1805901_3中');
    
  }, { timeout: 1800000, tags: ["1805901", "level3", "trash", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理测试文件（如果存在）
    try {
      // 清空回收站
      await system.exec('rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*');
      
    } catch (error) {
      console.log('清理过程中出现错误，跳过清理操作');
    }
    
    // 关闭所有文管窗口
    await system.exec('killall dde-file-manager');
    // 删除文件
    await system.exec('rm -rf ~/Desktop/1805901*');
  });
});
