/**
 * 用例 PMSID: 1805983
 * 用例标题: [038]系统盘-空白处右键检查属性基本信息
 * 生成时间: 2025-12-25 19:30:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明：检查系统盘空白处右键点击属性，验证基本信息不为空
 */

describe('1805983-[038]系统盘-空白处右键检查属性基本信息', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805983-[038]系统盘-空白处右键检查属性基本信息', async ({ device, agent, uos, system }) => {
    // 步骤一：打开文件管理器
    await uos.openApp('文件管理器');

    // 步骤二：进入系统盘目录，检查属性菜单
    await agent.aiDoubleClick('系统盘');
    await agent.aiRightClick('文件列表空白区域');
    await agent.aiTap('属性');

    // 步骤三：检查基本信息不为空
    // 检查设备类型不为空
    try {
      await agent.aiAssert('设备类型');
    } catch (error) {
      throw new Error('设备类型检查失败');
    }

    // 检查总容量不为空
    try {
      await agent.aiAssert('总容量');
    } catch (error) {
      throw new Error('总容量检查失败');
    }

    // 检查文件系统不为空
    try {
      await agent.aiAssert('文件系统');
    } catch (error) {
      throw new Error('文件系统检查失败');
    }

    // 检查文件个数不为空
    try {
      await agent.aiAssert('文件个数');
    } catch (error) {
      throw new Error('文件个数检查失败');
    }

    // 检查可用空间不为空
    try {
      await agent.aiAssert('可用空间');
    } catch (error) {
      throw new Error('可用空间检查失败');
    }

    // 步骤四：关闭属性弹框
    await agent.aiTap('关闭按钮');
  }, { timeout: 1800000, tags: ["1805983", "level3", "computer", "liqingling"] });

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
