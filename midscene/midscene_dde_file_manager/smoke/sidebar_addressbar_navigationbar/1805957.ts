/**
 * 用例 PMSID: 1805957
 * 用例标题: 勾选【显示隐藏文件】-在桌面以"."开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-02-27
 * 用例编写人: UT000211(陈依)
 */



async function clearEnvironment(system){
    //测试前还原文管配置到默认值
    //清理桌面配置目录，影响桌面布局和桌面整理布局
    await system.exec("rm -rf ~/.config/deepin/dde-desktop");
    //清理文管配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager.json");
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager.obtusely.json");
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("systemctl --user restart deepin-service-plugin@org.deepin.Filemanager.TextIndex.service");
    await system.exec("systemctl --user restart deepin-anything-daemon.service");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
    await system.exec("systemctl --user restart dde-file-manager.service");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    //清楚文本编辑器
    await system.exec("rm -rf ~/Desktop/*.txt");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
  }

describe('1805957-[026][core]我的目录-右键在新窗口打开', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device,uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
  });

  test('1805957-[026][core]我的目录-右键在新窗口打开', async ({ device, agent, uos, system }) => {
    // 步骤 1: 侧边栏桌面右键，点击在新窗口打开
    console.log('步骤 1: 侧边栏桌面右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的桌面');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为桌面，存在计算机和主目录');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

    // 步骤 2: 侧边栏视频右键，点击在新窗口打开
    console.log('步骤 2: 侧边栏视频右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的视频');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为视频');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

    // 步骤 3: 侧边栏音乐右键，点击在新窗口打开
    console.log('步骤 3: 侧边栏音乐右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的音乐');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为音乐，存在bensound-sunny.mp3');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

    // 步骤 4: 侧边栏图片右键，点击在新窗口打开
    console.log('步骤 4: 侧边栏图片右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的图片');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为图片，存在Wallpapers文件夹');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

    // 步骤 5: 侧边栏文档右键，点击在新窗口打开
    console.log('步骤 5: 侧边栏文档右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的文档');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为文档');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

    // 步骤 6: 侧边栏下载右键，点击在新窗口打开
    console.log('步骤 6: 侧边栏下载右键，点击在新窗口打开');
    await agent.aiRightClick('侧边栏的下载');
    await agent.aiTap('在新窗口打开');
    await agent.aiWaitFor('打开一个新窗口，上方标签显示为下载');
    
    // 关闭新打开的窗口
    await agent.aiTap('新窗口的关闭按钮');
    await agent.aiWaitFor('页面只存在一个文管窗口');

  }, { timeout: 1500000, tags: ['1805957', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
  });
});
