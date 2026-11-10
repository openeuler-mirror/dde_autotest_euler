/**
 * 用例 PMSID: 1525021
 * 用例标题: 词库-添加本地词库
 * 生成时间: 2026-05-13 10:50:33
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525021-词库-添加本地词库', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
  });

  test('1525021-词库-添加本地词库', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入词库
    console.log('步骤 1: 打开属性设置菜单，进入词库')
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiAssert("显示属性窗口");
    await agent.aiTap("词库");
    await agent.aiAssert("显示词库设置界面");

    // 步骤 2: 从搜狗官网下载词库
    console.log('步骤 2: 从搜狗官网下载词库')
    await agent.aiTap("添加在线细胞词库");
    await agent.aiWaitFor("显示浏览器页面");
    await agent.aiTap("财务专用");
    await agent.aiTap("立即下载");
    await agent.aiWaitFor("新建下载任务弹窗");
    await agent.aiTap("新建下载任务弹窗上的下载");
    await agent.aiTap("窗口右上角关闭按钮:X");

    // 步骤 3: 点击获取本地文件，选择本地词库
    console.log('步骤 3: 点击获取本地文件，选择本地词库')
    await agent.aiTap("获取本地文件");
    await agent.aiWaitFor("显示文件管理器弹窗");
    await agent.aiTap("左侧栏的下载");
    await agent.aiTap("财务专用【官方推荐】.scel");
    await agent.aiTap("打开");
    await agent.aiTap("确定");
    await agent.aiAssert("词库列表显示导入的词库：财务专用");

    //数据清理：删除导入的词库
    await agent.aiTap("财务专用词库右侧的删除图标")
    await agent.aiTap("确定");
    await agent.aiAssert("词库列表显示为空");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");

  }, { timeout: 600000, tags: ["1525021","smoke","hushimin","level2"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
});

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey('ctrl','space')
    //删除测试文件
    await system.exec("rm -rf /home/$USER/Downloads/财务专用*");
  });
});