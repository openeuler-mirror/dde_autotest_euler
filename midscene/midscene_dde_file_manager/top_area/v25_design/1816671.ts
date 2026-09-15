/**
 * 用例 PMSID: 1816671
 * 用例标题:  地址栏-本地路径跳转
 * 生成时间: 2026-3-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816671- 地址栏-本地路径跳转', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 前置条件1：测试环境已有多层级目录
      await system.exec('mkdir ~/Desktop/1816671/abc/bac/cba', 500);

      // 前置条件2：打开文件管理器
      await system.exec('dde-file-manager ~/Desktop/1816671/abc/bac/cba');
      await system.exec('sleep 2');

      // 前置条件3：设置文件管理器的主题为深色，方便后面颜色变化好识别
      await agent.aiTap('文件管理器右上角的第一个图标：菜单图标');
      await agent.aiWaitFor('主题');
      await agent.aiTap("主题");
      await agent.aiTap('深色');
      await agent.aiAssert('文件管理器的背景为深色');
    });
  
    test('1816671-地址栏-本地路径跳转', async ({ device, agent, uos, system, env }) => {

      //步骤1：进入多层级目录，点击地址栏空白处-结果：激活输入框，同时选中当前完整路径
      await agent.aiTap('文件管理器窗口顶部左侧第二行地址栏右侧的空白区');
      await agent.aiAssert('输入框被激活，且输入框显示完整路径');

      // 步骤2：鼠标悬停在整个面包屑区域-结果：	显示出输入框背景
      await agent.aiTap('文件管理器窗口右下角的空白处'); //退出地址栏的输入框
      await agent.aiHover('文件管理器窗口顶部左侧第二行地址栏右侧的空白区', {deepThink: true});
      await agent.aiAssert('地址栏背景颜色发生轻微变化', {deepThink: true});

      // 步骤3：鼠标悬停在某一级面包屑上-结果：该面包屑目录显示为悬停样式，背景加深
      await agent.aiHover('文件管理器窗口顶部左侧第二行地址栏中的abc', {deepThink: true});
      await agent.aiAssert('abc的背景颜色发生轻微变化', {deepThink: true});
      await agent.aiAssert('文件管理器窗口顶部左侧第二行地址栏中的abc右侧显示向下的箭头', {deepThink: true});

      // 步骤4：单击某一级面包屑路径-结果：	跳转到对应文件目录
      await agent.aiTap('文件管理器窗口顶部左侧第二行地址栏中的abc', {deepThink: true});
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏有abc的标签', {deepThink: true});
      
    }, { timeout: 600000, tags: ["1816671", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 恢复文管主题为浅色
      await agent.aiTap('文件管理器右上角的第一个图标：菜单图标');
      await agent.aiWaitFor('主题');
      await agent.aiTap("主题");
      await agent.aiTap('浅色');
      await agent.aiAssert('文件管理器的背景为浅色');

      // 清楚数据
      await system.exec('rm -r ~/Desktop/1816671', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
