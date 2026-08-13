/**
 * 用例 PMSID: 1850157
 * 用例标题: 创建wps文档
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850157-创建wps文档', () => {
  const wps_deb = "cn.wps.wps-office-pro";
  let is_installed = false;

  beforeAll(async ({ uos, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 确保wps已安装
    let result = await system.exec(`dpkg -l | grep ${wps_deb} | grep -E ^ii`);
    if (result.success) {
      console.log('wps已安装');
      is_installed = true;
    } else {
      is_installed = false;
      console.log('wps未安装, 正在安装...');
      result = await system.exec(`echo ${env.testPassword} | sudo -S apt-get update && echo ${env.testPassword} | sudo -S apt-get install ${wps_deb} -y`, 300000); // 超时5分钟
      assertTrue(result.success, '安装wps失败');
    }
    console.log('wps已安装');
    // 准备步骤: 重启桌面, 确保右键菜单刷新
    console.log("准备步骤: 重启桌面, 确保右键菜单刷新");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理步骤: 按esc键退出可能的右键菜单
    console.log('清理步骤: 按esc键退出可能的右键菜单');
    await device.pressKey('Esc');

    // 清理步骤: 恢复wps安装状态
    console.log('清理步骤: 恢复wps安装状态');
    if (!is_installed) {
      console.log('测试前wps未安装, 正在卸载...');
      await system.exec(`echo ${env.testPassword} | sudo -S apt-get remove -y ${wps_deb}`);
    }

    // 清理步骤: 重启桌面, 确保右键菜单刷新
    console.log("清理步骤: 重启桌面, 确保右键菜单刷新");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  });

  test('1850157-创建wps文档', async ({ device, system, agent, uos }) => {
    // 步骤 1: 进入桌面-任意空白处右键
    console.log('步骤 1: 右击桌面空白处');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');

    // 步骤 2: 展开新建菜单
    console.log('步骤 2: 展开新建菜单');
    await agent.aiHover('新建文档');
    await agent.aiWaitFor('新建文档菜单展开完成');

    // 预期 2: 新建菜单中有WPS文字文档, WPS演示文稿, WPS表格工作表选项
    console.log('预期 2: 新建菜单中有WPS文字文档, WPS演示文稿, WPS表格工作表选项');
    await agent.aiAssert('新建菜单中有WPS文字文档, WPS演示文稿, WPS表格工作表选项');

  }, { timeout: 600000, tags: ['1850157', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'wps folder', 'right click'] });

});
