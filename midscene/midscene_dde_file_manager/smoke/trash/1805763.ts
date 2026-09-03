// @ts-nocheck
/**
 * 用例 PMSID: 1805763
 * 用例标题: 回收站切换列表模式
 * 生成时间：2025-12-15 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805763-回收站，切换为列表模式_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805763-回收站切换列表模式', async ({ device, agent, uos, system}) => {
    // 前置条件：在桌面空白处新建一个文件夹，选中新建的文件，点击delete
    console.log('执行前置条件：在桌面新建文件夹并删除到回收站');
    await system.exec('killall dde-file-manager', 500);
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
    
    // 在桌面空白处右键新建文件夹
    await agent.aiRightClick("桌面空白处");
    await agent.aiTap("新建文件夹");
    
    // 选中并删除文件夹
    await agent.aiTap("新文件夹");
    await device.pressKey("Delete");
    
    console.log('前置条件完成：新建文件夹已删除到回收站');

    // 步骤1：在桌面空白处，双击桌面回收站图标，可以正常进入回收站页面
    console.log('执行步骤1：双击桌面回收站图标进入页面');
    await agent.aiDoubleClick("桌面回收站图标");
    
    // 等待回收站页面打开
    await agent.aiWaitFor("回收站页面已打开");
    console.log('回收站页面已成功打开');

    // 步骤2：在回收站空白处页面，右键，鼠标悬停在"显示方式"，点击"列表视图"
    console.log('执行步骤2：在回收站空白处右键呼出菜单');
    await agent.aiRightClick("回收站空白区域");
    
    // 鼠标悬停在"显示方式"
    console.log('鼠标悬停在"显示方式"选项');
    await agent.aiHover("显示方式");
    
    // 点击"列表视图"
    console.log('点击"列表视图"选项');
    await agent.aiTap("列表视图");
    
    // 验证回收站文件以列表显示
    console.log('验证回收站文件以列表视图显示');
    await agent.aiAssert("回收站文件以列表视图显示");

    // await agent.aiTap("清空"); 
    // // 在清空弹框中，点击“清空”
    // await agent.aiWaitFor("清空回收站弹框已出现");
    // await agent.aiTap("清空");

    console.log('测试用例执行完成');
    await agent.aiTap("窗口右上角关闭按钮:X");

  },{ timeout: 600000, tags: ['1805763','level1', 'smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager")
    await system.exec("rm -rf ~/.local/share/Trash/*")
  });
});