/**
 * 用例 PMSID: 1816361
 * 用例标题: 控制中心-切换字体水印不受影响
 * 生成时间: 2026-08-08 10:51:22
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1816361-控制中心-切换字体水印不受影响', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件
    const activateResult1 = await system.exec('uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v');
    const activateResult2 = await system.exec('uos-activator-cmd -s --kms kms.uniontech.com:8900:nqYvXZXdNPKNn335');
    const isActivated1 = (activateResult1.stdout || '').includes('已激活') || (activateResult1.stderr || '').includes('已激活');
    const isActivated2 = (activateResult2.stdout || '').includes('已激活') || (activateResult2.stderr || '').includes('已激活');

    if (!isActivated1 && !isActivated2) {
      throw new Error('系统未激活，测试无法继续');
    }
    console.log('系统已激活，继续测试');
  });

  test('1816361-控制中心-切换字体水印不受影响', async ({ device, agent, uos, system }) => {
    // 步骤 1: 查看第一个工作区桌面右下角水印
    console.log('步骤 1: 查看第一个工作区桌面右下角水印');
    await agent.aiWaitFor('桌面右下方任务栏上方存在两个相对的L形水印图标');

    //步骤 2：进入控制中心-个性化-字体，修改字体
    console.log('步骤 2：进入控制中心-个性化-字体，修改字字体');
    await uos.openApp('控制中心');
    await agent.aiTap('左侧的个性化')
    await agent.aiScroll('右侧详情区域', {direction : 'down', distance: 5})
    await agent.aiTap('字体和字号')
    await agent.aiWaitFor('打开字体和字号界面')
    await agent.aiTap('标准字体右侧的思源黑体')
    await agent.aiTap('思源宋体')
    await agent.aiWaitFor('标准字体右侧显示思源宋体')
    await system.exec('killall dde-control-center')
    await agent.aiAssert('桌面右下方任务栏上方存在两个相对的L形水印图标');

    // 清理环境：恢复字号设置
    console.log('清理环境：恢复字号设');
    await uos.openApp('控制中心');
    await agent.aiTap('左侧的个性化')
    await agent.aiScroll('右侧详情区域', {direction : 'down', distance: 5})
    await agent.aiTap('字体和字号')
    await agent.aiWaitFor('打开字体和字号界面')
    await agent.aiTap('标准字体右侧的思源宋体')
    await agent.aiScroll('当前字体选择区域', {direction : 'up', distance: 1})
    await agent.aiTap('思源黑体')
    await agent.aiWaitFor('标准字体右侧显示思源黑体')
    await system.exec('killall dde-control-center')

  }, { timeout: 900000, tags: ['1816361', 'level3', 'watermark', 'hushimin'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 每个测试后的清理');
    await uos.showDesktop();
  });
});