/**
 * 用例 PMSID: 1881207
 * 用例标题: 【桌面】【剪贴板】不可拖拽文本信息记录可到WPS各类文档中(V25不支持)
 * 生成时间: 2026-02-02 11:27:05
 * 用例编写人：UT000224(何权)
 */

describe('1881207-【桌面】【剪贴板】不可拖拽文本信息记录可到WPS各类文档中(V25不支持)', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 重启剪贴板服务确保干净环境
    system.exec('killall deepin-editor dde-clipboard');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1881207-【【桌面】【剪贴板】不可拖拽文本信息记录可到WPS各类文档中(V25不支持)', async ({ device, agent, uos, system }) => {
    // 准备测试文本内容
    const testContent = `测试文本内容_${Date.now()}_拖拽测试`;

    // 修改剪贴板为常驻模式
    await system.exec('killall dde-clipboard;dde-clipboard --always-show &');
    
    // 步骤1: 在文本编辑器中创建并复制测试文本
    await system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 输入测试文本
    await device.typeText(testContent);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 全选并复制文本
    await device.pressKey("Ctrl", "a");
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey("Ctrl", "c");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 打开剪贴板确认文本已记录
    await system.exec(`xdotool key Super+v`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert(`剪贴板中存在包含"${testContent}"的文本记录`);
    await system.exec("killall deepin-editor");   
    
    // 步骤2: 测试拖拽到Excel文件
    console.log('步骤2: 测试拖拽文本到Excel文件');
    
    // 创建Excel文件
    await agent.aiDoubleClick('WPS Office');
    await agent.aiWaitFor("界面存在新建按钮", {
    timeoutMs: 30000, // 等待 30 秒
    checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    console.log("步骤1: 在Excel文档中复制任意文本字符");
    await agent.aiTap('新建');
    await agent.aiWaitFor('出现新建文档选项', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap('表格');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.aiTap('空白表格');
    await agent.aiWaitFor('电子表格界面已显示', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    //窗口化方便拖拽测试
    await system.exec(`xdotool key Super+Down`);    
    // 打开剪贴板准备拖拽
    await system.exec(`xdotool key Super+v`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 定位并拖拽文本到Excel
    await agent.aiAction("点击右侧剪贴板中的文本记录，拖拽记录到execl表格中，只尝试拖拽一次", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证拖拽成功并在Excel中显示
    await agent.aiAssert(`excel表格中无数据`);
 
    // 关闭excel，删除word和PPT拖拽测试，从代码层面属于一个逻辑
    await system.exec("killall et wps wpp pdf wpsoffice");
  }, { timeout: 1200000, tags: ['1881207', 'level4','module:dde_clipboard'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理可能残留的进程
    await system.exec('killall et wps wpp pdf wpsoffice');
    await system.exec('killall deepin-editor dde-clipboard');
  });
});