/**
 * 用例 PMSID: 1805909
 * 用例标题: 回收站-文件权限测试
 * 生成时间: 2025-12-29 17:03:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 实现文件权限和回收站功能测试
 */

describe('1805909-回收站-文件权限测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805909-回收站-文件权限测试', async ({ device, agent, uos, system }) => {
    // 前置条件：添加测试用户
    await system.exec('useradd -m test');

    // 步骤一：通过终端命令在桌面创建文件夹和文本文档
    await system.exec('mkdir -p ~/Desktop/1805909');
    await system.exec('echo "测试文件内容" > ~/Desktop/1805909.txt');

    // 步骤二：通过终端命令chown修改文件夹和文本文档所属用户为test
    await system.exec('chown test:test ~/Desktop/1805909');
    await system.exec('chown test:test ~/Desktop/1805909.txt');

    // 步骤三：通过终端命令chmod 777修改文件夹和文本文档权限
    await system.exec('chmod 777 ~/Desktop/1805909');
    await system.exec('chmod 777 ~/Desktop/1805909.txt');

    // 步骤四：在桌面选中文件夹右键删除
    await agent.aiTap('1805909');
    await agent.aiRightClick('在1805909上右键点击');
    await agent.aiTap('点击删除');

    // 步骤五：在桌面选中文本文档右键删除
    await agent.aiTap('1805909.txt');
    await agent.aiRightClick('在1805909.txt上右键点击');
    await agent.aiTap('点击删除');

    // 步骤六：在回收站中检查文件夹和文本文档，回收站存在文本文档和文件夹
    await device.pressKey("Super+E");
    await agent.aiTap('左侧导航栏回收站目录');

    // 断言回收站中存在文件
    await agent.aiAssert('1805909文件夹在回收站中可见');
    await agent.aiAssert('1805909.txt在回收站中可见');

  }, { timeout: 1800000, tags: ["1805909", "level3", "trash", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理测试文件（如果存在）
    try {
      // 删除桌面测试文件
      await system.exec('rm -rf ~/Desktop/1805909*');
      
      // 清空回收站
      await system.exec('rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*');
      
      // 删除测试用户
      await system.exec('userdel -r test');
      
    } catch (error) {
      console.log('清理过程中出现错误，跳过清理操作');
    }
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');
      
  });
});
