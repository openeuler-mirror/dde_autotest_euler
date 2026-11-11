/**
 * 用例 PMSID: 1503179
 * 用例标题: 【任务栏】【显示桌面区域】"显示桌面区域"点击时显示桌面（隐藏所有窗口）
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1503179-【任务栏】【显示桌面区域】"显示桌面区域"点击时显示桌面（隐藏所有窗口）', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1503179-【任务栏】【显示桌面区域】"显示桌面区域"点击时显示桌面（隐藏所有窗口）', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 前置: 打开两个应用窗口
    console.log('前置: 打开两个应用窗口');
    await uos.openApp('控制中心', 3000);
    await uos.openApp('文本编辑器', 3000);
    console.log('已打开控制中心和文本编辑器');

    // 步骤 1: 第一次点击"显示桌面空白区域"，隐藏所有窗口
    console.log('步骤 1: 第一次点击显示桌面区域，隐藏所有窗口');
    await agent.aiTap('任务栏最右侧的显示桌面空白区域（右下角最边缘的小块区域）', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已第一次点击显示桌面区域');

    // 验证桌面可见，所有应用窗口隐藏
    await agent.aiAssert('桌面已显示，之前打开的终端和文本编辑器窗口已隐藏不可见');
    console.log('步骤1验证完成：桌面显示，窗口已隐藏');

    // 步骤 2: 第二次点击"显示桌面空白区域"，还原所有窗口
    console.log('步骤 2: 第二次点击显示桌面区域，还原所有窗口');
    await agent.aiTap('任务栏最右侧的显示桌面空白区域（右下角最边缘的小块区域）', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已第二次点击显示桌面区域');

    // 验证应用窗口还原
    await agent.aiAssert('之前隐藏的终端和文本编辑器窗口已重新显示在桌面上');
    console.log('步骤2验证完成：窗口已还原');

    // 步骤 3: 第三次点击"显示桌面空白区域"，再次隐藏所有窗口
    console.log('步骤 3: 第三次点击显示桌面区域，再次隐藏所有窗口');
    await agent.aiTap('任务栏最右侧的显示桌面空白区域（右下角最边缘的小块区域）', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已第三次点击显示桌面区域');

    // 验证桌面可见，所有应用窗口再次隐藏
    await agent.aiAssert('桌面已再次显示，终端和文本编辑器窗口已再次隐藏不可见');
    console.log('步骤3验证完成：窗口已再次隐藏');

  }, { timeout: 300000, tags: ['1503179', 'level2', 'smoke', 'dock'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await system.exec('killall dde-control-center deepin-editor 2>/dev/null || true');
    await new Promise(r => setTimeout(r, 1000));
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
