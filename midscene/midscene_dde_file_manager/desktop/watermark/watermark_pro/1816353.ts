/**
 * 用例 PMSID: 1816353
 * 用例标题: 切换工作区-水印显示一致
 * 生成时间: 2026-07-26
 * 用例编写人: UT006487（王薇）
 */

describe('1816353-切换工作区-水印显示一致', () => {
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

  test('1816353-切换工作区-水印显示一致', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 查看第一个工作区桌面右下角水印 =====');
    await agent.aiWaitFor('桌面右下方任务栏上方存在两个相对的L形水印图标');

    console.log('===== 步骤2: 使用快捷键Super+S切换到第二个工作区 =====');
    await device.pressKey('Super+S');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAction('点击最上方小窗口中的左数第二个窗口');
    await device.pressKey('Escape');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面壁纸不包含UOS字样')

    console.log('===== 步骤3: 查看第二个工作区桌面右下角水印 =====');
    await agent.aiWaitFor('桌面右下方任务栏上方存在两个相对的L形水印图标');

    console.log('===== 步骤4: 使用快捷键Super+S切换回第一个工作区 =====');
    await device.pressKey('Super+S');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAction('点击最上方小窗口中的左数第一个窗口');
    await device.pressKey('Escape');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面壁纸包含UOS字样')

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1816353', 'level3', 'desktop', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 检查当前工作区壁纸');
    await agent.aiWaitFor('桌面已显示');
    const hasUOSWallpaper = await agent.aiQuery('当前桌面壁纸是否包含UOS字样');
    
    if (!hasUOSWallpaper) {
      console.log('当前壁纸不包含UOS，切换到第一个工作区');
      await device.pressKey('Super+S');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAction('点击最上方小窗口中的左数第一个窗口');
      await device.pressKey('Escape');
    }
    
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});