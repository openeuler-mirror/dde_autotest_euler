/**
 * 用例 PMSID: 1881259
 * 用例标题: 【桌面】【剪贴板】剪贴板列表为空展示
 * 生成时间: 2025-12-22 15:16:37
 * 用例编写人：UT000224(何权)
 */

describe('1881259-【桌面】【剪贴板】剪贴板列表为空展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1881259-【桌面】【剪贴板】剪贴板列表为空展示', async ({ device, agent, uos, system }) => {
    // 使用快捷键打开剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`
    );
    
    // 等待剪贴板界面显示
    await agent.aiWaitFor("剪贴板界面已从屏幕右侧边界显示");
    
    // 验证界面左上角展示标题：剪贴板
    await agent.aiAssert("剪贴板窗口上方展示标题：剪贴板");
    
    // 验证无剪贴板记录
    await agent.aiAssert("剪贴板列表仍为空");
    
    // 验证界面中央展示默认图案和说明文案
    await agent.aiAssert("右侧剪贴板界面中央展示图案和说明文案：复制内容进剪贴板");
    
    // 验证说明文案不可点击
    await agent.aiAssert("说明文案'复制内容进剪贴板'为灰色不可点击状态");
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    
    // 再次打开剪贴板验证状态保持一致
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`
    );
    
    // 重新验证空状态展示
    await agent.aiAssert("剪贴板列表仍为空");
    await agent.aiAssert("界面右上角仍展示标题：剪贴板");
    await agent.aiAssert("右侧剪贴板界面中央展示图案和说明文案：复制内容进剪贴板");
    
  }, { timeout: 1200000, tags: ['1881259', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
      // 确保剪贴板被关闭
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
  });
});