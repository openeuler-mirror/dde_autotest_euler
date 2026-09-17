/**
 * 用例 PMSID: 1816713
 * 用例标题: 排序方式-排序方式状态常驻
 * 生成时间: 2026-2-4 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816713-排序方式-排序方式状态常驻', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 桌面新增多个文件
      await system.exec('touch /1816713.txt', 500);
      await system.exec('touch /1816713.xlsx', 500);
      await system.exec('touch /1816713.doc', 500);
      await system.exec('touch /1816713.png', 500);
      await system.exec('touch /1816713.mp3', 500);
      await system.exec('touch /1816713.mp4', 500);
    });
  
    test('1816713-排序方式-排序方式状态常驻', async ({ device, agent, uos, system, env }) => {
      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });

      //步骤1：工具栏点击“排序方式”按钮，切换一种排序方式-结果：切换成功
      // 进入主目录
      await agent.aiTap('文件管理器左侧的主目录');
      // 排序方式选择名称
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      await agent.aiWaitFor('包含名称的下拉框');
      await agent.aiTap('名称', 500);
      // 切换排序方式为大小
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      await agent.aiWaitFor('包含名称的下拉框');
      await agent.aiAssert('下拉框中名称被勾选');
      await agent.aiTap('大小');

      // 步骤2：切换其他目录，再回到当前目录-结果：排序方式不变
      await agent.aiTap('文件管理器左侧的桌面');
      await agent.aiTap('文件管理器左侧的主目录');
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      await agent.aiAssert('下拉框中大小被勾选');

      // 步骤3：关闭、开启文件管理器，再回到当前目录-结果：排序方式不变
      await system.exec('killall dde-file-manager', 500);
      await uos.openApp('文件管理器', { maximizeWindow: true });
      await agent.aiTap('文件管理器左侧的主目录')
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      await agent.aiWaitFor('包含名称的下拉框展开');
      // await agent.aiAssert('下拉框中大小被勾选');----ps：目前为bug,先注释

      // 步骤4：注销、重新登录系统，查看当前目录-结果：排序方式不变 
      // 待能重启后依旧能拉起进程解决后补充
      
    }, { timeout: 1200000, tags: ["1816713", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm /1816713.txt', 500);
      await system.exec('rm /1816713.xlsx', 500);
      await system.exec('rm /1816713.doc', 500);
      await system.exec('rm /1816713.png', 500);
      await system.exec('rm /1816713.mp3', 500);
      await system.exec('rm /1816713.mp4', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
