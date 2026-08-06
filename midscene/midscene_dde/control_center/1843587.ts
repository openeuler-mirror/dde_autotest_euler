/**
 * 用例 PMSID: 1843587
 * 用例标题: 【控制中心】【系统】【声音】声音模块文案概述检查
 * 生成时间: 2025-12-12 13:35:40
 * 用例编写人:ut003072
 */

describe('1843587-【控制中心】【系统】【声音】声音模块文案概述检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1843587-【控制中心】【系统】【声音】声音模块文案概述检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心");

      //检查: 声音模块文案概述:输入、输出、系统音效、设备管理
      await agent.aiAssert("声音概述文案：输入、输出、系统音效、设备管理");
  
    }, { timeout: 1200000, tags: ['1843587', 'level1', 'smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });