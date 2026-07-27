/**
 * 用例 PMSID: 1805985
 * 用例标题: [038]系统盘-空白处右键检查新建文件夹和新建文件是否置灰
 * 生成时间: 2025-12-25 19:17:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明：检查系统盘空白处右键菜单中新建文件夹和新建文件是否默认置灰
 */

describe('1805985-[038]系统盘-空白处右键检查新建文件夹和新建文件是否置灰', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805985-[038]系统盘-空白处右键检查新建文件夹和新建文件是否置灰', async ({ device, agent, uos, system }) => {
    // 步骤一：打开文件管理器
    await uos.openApp('文件管理器');

    // 步骤二：进入系统盘目录，检查系统盘目录无法新建文件
    await agent.aiTap('左侧导航栏系统盘目录');
    await agent.aiRightClick('系统盘目录的右侧空白区域');

    // 步骤三：检查新建文件夹是否置灰
    await agent.aiAssert('新建文件夹选项未高亮显示');

    // 步骤四：检查新建文件是否置灰
    await agent.aiAssert('新建文档选项未高亮显示');

    // 步骤五：关闭右键菜单
    await agent.aiTap('右键菜单外区域'); 

  }, { timeout: 1800000, tags: ["1805985", "level3", "computer", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
