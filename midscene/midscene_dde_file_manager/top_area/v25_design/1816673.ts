/**
 * 用例 PMSID: 1816673
 * 用例标题:  地址栏-选择面包屑子路径跳转
 * 生成时间: 2026-3-26 13:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816673-地址栏-选择面包屑子路径跳转', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 前置条件1：测试环境已有多层级目录测
      await system.exec('mkdir ~/Desktop/1816673', 500);
      await system.exec('mkdir ~/Desktop/1816673/wenjj11', 500);
      await system.exec('mkdir ~/Desktop/1816673/wenjj11/wzuihou', 500);
      await system.exec('mkdir ~/Desktop/1816673/wenjj22', 500);

      // // 前置条件2：文件管理器已开启
      // await uos.openApp('文件管理器', { maximizeWindow: false });

    });
  
    test('1816673-地址栏-选择面包屑子路径跳转', async ({ device, agent, uos, system, env }) => {

      //步骤1：进入多层级目录，鼠标悬停在一个有子目录的面包屑路径上-结果：该面包屑路径右侧显示箭头
      await system.exec('dde-file-manager ~/Desktop/1816673/wenjj11/wzuihou');
      await system.exec('sleep 2');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏显示“wzuihou”');
      await agent.aiHover('文件管理器窗口顶部左侧第二行地址栏中的1816673', {deepThink: true});
      await agent.aiAssert('文件管理器窗口顶部左侧第二行地址栏中的1816673右侧显示向下的箭头', {deepThink: true});

      // 步骤2：点击箭头-结果：弹出下拉列表，列表中显示当前目录下的所有子目录
      await agent.aiTap('1816673右侧的V', {deepThink: true});
      await agent.aiAssert('展示下拉框，下来框分别为wenjj11和wenjj22', {deepThink: true});

      // 步骤3：单击任意一个子目录-结果：跳转到对应目录
      await agent.aiTap('下拉框的中的wenjj11');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行显示标签“wenjj11”');
      
    }, { timeout: 600000, tags: ["1816673", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm -r ~/Desktop/1816673', 500);
      await system.exec('rm -r ~/Desktop/1816673/wenjj11', 500);
      await system.exec('rm -r ~/Desktop/1816673/wenjj11/wzuihou', 500);
      await system.exec('rm -r ~/Desktop/1816673/wenjj22', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
