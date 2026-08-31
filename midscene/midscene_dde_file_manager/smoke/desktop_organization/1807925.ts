/**
 * 用例 PMSID: 1807925
 * 用例标题: [117]自定义壁纸-图片目录下图片右键设置桌面壁纸
 * 生成时间: 2026-01-21 14:00:00
 * 用例编写人: UT000159（游伟）
 */

let wallpaper = "";
const default_wallpaper = "file:///usr/share/wallpapers/deepin/nirvana-wallpaper-light.jpg";
// 图片中有突袭字样, 用于检查壁纸是否设置成功
const pic_url = "https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/2e5y6x.jpg";
const test_pic = "test.jpg";
const work_dir = "~/Pictures/";

describe('1807925-[117]自定义壁纸-图片目录下图片右键设置桌面壁纸', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 获取当前壁纸
    let result = await system.queryDBus(
      'org.deepin.dde.Appearance1',
      '/org/deepin/dde/Appearance1',
      'org.deepin.dde.Appearance1',
      'GetCurrentWorkspaceBackground',
      [],
      { bus: 'session' }
    );
    if (result.success) {
      // ('file:///usr/share/wallpapers/deepin/desktop.jpg',) 
      wallpaper = result.stdout.replace("('", "").replace("',)", "").trim();
    } else {
      result = await system.exec("grep uri ~/.config/dde-appearance/config.json | head -n 1 | awk '{print $2}' | sed 's/\"//g' | sed 's/,//g'");
      if (result.success) {
        wallpaper = result.stdout;
      } else {
        // 获取壁纸失败, 使用默认壁纸
        wallpaper = default_wallpaper;
      }
    }
    console.log(`壁纸: ${wallpaper}`);

    // 将图片下载到图片目录
    await system.exec(`wget ${pic_url} -O ~/Pictures/${test_pic}`);
  });

  test('1807925-[117]自定义壁纸-图片目录下图片右键设置桌面壁纸', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器图片目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('打开文件管理器图片目录');

    // 步骤 2: 右击${test_pic}图片
    console.log(`步骤 3: 右击${test_pic}图片`);
    await agent.aiRightClick(`右侧窗口中${test_pic}图片`, { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');

    // 步骤 3: 设置桌面壁纸
    console.log('步骤 4: 设置桌面壁纸');
    await agent.aiTap('设置壁纸');
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 预期 3: 桌面壁纸已设置
    console.log('预期 3: 桌面壁纸已设置');
    await agent.aiAssert('桌面壁纸中有"突袭"');

  }, { timeout: 600000, tags: ['1807925', 'level2', 'smoke', 'DITT', 'youwei', 'desktop', 'wallpaper', 'right-click menu'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 恢复壁纸
    await system.queryDBus(
      'org.deepin.dde.Appearance1',
      '/org/deepin/dde/Appearance1',
      'org.deepin.dde.Appearance1',
      'SetCurrentWorkspaceBackground',
      [ wallpaper ],
      { bus: 'session' }
    );
    // await agent.aiAssert('桌面壁纸中心有UOS字符');

    // 删除图片
    await system.exec(`rm -rf ~/Pictures/${test_pic}`);

    // 删除设置并关闭文件管理器
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
