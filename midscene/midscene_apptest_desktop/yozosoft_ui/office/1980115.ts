
/**
 * 用例 PMSID: 1980115
 * 用例标题:  【V25】【永中文字】开发工具菜单
 * 生成时间: 2026-03-03 17:16:52
 * 用例编写人：UT003531(钱程)
 */

describe('1980115- 【V25】【永中文字】开发工具菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装永中Office软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.yozosoft.yozo-office.s1`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现永中图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await uos.showDesktop();
    await agent.aiRightClick('桌面空白处', { deepThink:true });
    await agent.aiTap("新建文档");
    await agent.aiTap("办公文档");
    await agent.aiTap("桌面右上角空白处");
  });

  test('1980115- 【V25】【永中文字】开发工具菜单', async ({ device, agent, uos }) => {
    await agent.aiRightClick("'新建Word文档.docx'文件图标");
    await agent.aiTap('打开方式');
    await agent.aiTap("'选择默认程序'上面的'永中文字'", { deepThink:true });
    await agent.aiAssert("界面存在'开始'");
    await agent.aiTap("开发工具");
    await agent.aiAssert("界面存在'宏编辑器'字段");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1980115', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiRightClick("'新建Word文档.docx'文件图标");
    await agent.aiTap('删除');
    await agent.aiAssert("界面不存在'新建Word文档.docx'");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("桌面右上角空白处", { deepThink:true });
  });
});
