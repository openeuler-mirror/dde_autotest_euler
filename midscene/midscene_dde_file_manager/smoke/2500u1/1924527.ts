/**
 * 用例 PMSID: 1924527
 * 用例标题: 【文件粉碎】非虚拟目录中文件粉碎
 * 生成时间: 2026-02-05 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1924527-【文件粉碎】非虚拟目录中文件粉碎', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建文件夹和文件作为前置条件，后续测试
    await system.exec('mkdir -p /home/$USER/Desktop/testA')
    await system.exec('touch /home/$USER/Desktop/testvideo.mp4')
    await system.exec('touch /home/$USER/Desktop/test办公文档.docx')
    await system.exec('touch /home/$USER/Desktop/test.txt $$ echo helloUos >> /home/$USER/Desktop/test.txt')
    await system.exec('touch /home/$USER/Desktop/test.sh && echo helloUos >> /home/$USER/Desktop/test.sh')

    });

  test('1924527-【文件粉碎】非虚拟目录中文件粉碎', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-文件粉碎，观察文件粉碎功能开关状态
    console.log('步骤 2: 进入主菜单-设置-打开文件目录，勾选在新标签打开新文件夹');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiScroll('设置左侧边栏',{direction:'down',distance: 20} )
    await agent.aiTap('文件粉碎')
    await agent.aiWaitFor('开启文件粉碎功能选项右侧的开关状态置灰');
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    // 步骤 3: 回到桌面，检查任意文件右键是否显示文件粉碎选项
    console.log('步骤 3： 回到桌面，检查任意文件右键是否显示文件粉碎选项');
    await agent.aiRightClick('test.txt');
    await agent.aiAssert('不显示文件粉碎选项');
    await agent.aiTap('桌面空白处')

    // 步骤 4: 回到文件管理器-设置窗口，打开文件粉碎开关
    console.log('步骤 4: 回到文件管理器-设置窗口，打开文件粉碎开关');
    await uos.openApp('文件管理器');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiScroll('设置左侧边栏',{direction:'down',distance: 20} )
    await agent.aiTap('文件粉碎')
    await agent.aiTap('开启文件粉碎功能选项右侧的开关')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    // 步骤 5: 回到桌面，右键任意文件，粉碎文件
    console.log('步骤 5: 回到桌面，右键任意文件，粉碎文件');
    await agent.aiRightClick('test.txt');
    await agent.aiTap('文件粉碎')
    await agent.aiWaitFor('显示文件粉碎弹窗');
    await agent.aiTap('粉碎窗口里面的test.txt')
    await agent.aiTap('粉碎')
    await agent.aiAssert('test.txt文件从桌面消失');

    //清理环境：文件粉碎开关关闭
    await uos.openApp('文件管理器');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiScroll('设置左侧边栏',{direction:'down',distance: 20} )
    await agent.aiTap('文件粉碎')
    await agent.aiTap('开启文件粉碎功能选项右侧的开关');
    await agent.aiWaitFor('开启文件粉碎功能选项右侧的开关状态置灰');

  }, { timeout: 1200000, tags: ['1924527', 'level1', 'smoke', 'DITT', 'hushimin', '2500u1'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf  /home/$USER/Desktop/test*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭文件管理器
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});
