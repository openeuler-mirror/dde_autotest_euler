/**
 * 用例 PMSID: 1809621
 * 用例标题: 【文件管理】【桌面自动整理】拖拽移动图标-集合内拖拽
 * 生成时间: 2025-2-26 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

async function clearEnv(system) {
  try {
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
    await system.exec(`rm -rf ~/Desktop/test00*.txt`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1809621-【文件管理】【桌面自动整理】拖拽移动图标-集合内拖拽', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：准备测试文件
        await system.exec(`cd ~/Desktop && touch test001.txt test002.txt test003.txt test004.txt`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1809621-【文件管理】【桌面自动整理】拖拽移动图标-集合内拖拽', async ({ device,agent,uos,system}) => {
        // 步骤1：进入桌面，右键菜单开启桌面整理
        await agent.aiRightClick("桌面空白处");
        await agent.aiTap("右键菜单中的整理桌面");
        await agent.aiTap("桌面空白处");
        await agent.aiAssert("桌面显示集合框");
        // 步骤2：集合内选中文件，拖拽到集合内其他位置，松开鼠标
        await agent.aiDrag("test001.txt", "test004.txt的右侧空白处", { deepThink: true });
        await agent.aiAssert("集合中，test001.txt显示在test004.txt后面");

      }, { timeout: 600000,
       tags: ['1809621', 'level2', 'smoke', 'desktop_organization', 'DITT', 'hujian'] });

    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });