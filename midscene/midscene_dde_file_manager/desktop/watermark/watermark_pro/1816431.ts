/**
 * 用例 PMSID: 1816431
 * 用例标题: 桌面水印优化-专业版激活水印检查
 * 生成时间: 2026-07-26
 * 用例编写人: UT006487（王薇）
 */

describe('1816431-桌面水印优化-专业版激活水印检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    
    console.log('3. beforeEach: 激活系统');
    const activateResult1 = await system.exec('uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v');
    const activateResult2 = await system.exec('uos-activator-cmd -s --kms kms.uniontech.com:8900:nqYvXZXdNPKNn335');
    
    const isActivated1 = (activateResult1.stdout || '').includes('已激活') || (activateResult1.stderr || '').includes('已激活');
    const isActivated2 = (activateResult2.stdout || '').includes('已激活') || (activateResult2.stderr || '').includes('已激活');
    
    if (!isActivated1 && !isActivated2) {
      throw new Error('系统未激活，测试无法继续');
    }
    console.log('系统已激活，继续测试');
  });

  test('1816431-桌面水印优化-专业版激活水印检查', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1/预期1: 查看桌面右下角水印只展示系统logo =====');
    await agent.aiWaitFor('桌面右下方任务栏上方存在两个相对的L形水印图标，且无未激活或试用期字样');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1816431', 'level3', 'desktop', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});