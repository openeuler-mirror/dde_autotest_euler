// @ts-nocheck

/**
 * 用例 PMSID: 1810103
 * 用例标题: 【1071桌面整理】集合内文件操作-设为壁纸
 * 生成时间：2026-01-27 12:50:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810103-集合内文件操作-设为壁纸', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810103-集合内文件操作-设为壁纸', async ({ device, agent, uos, system }) => {
    // 前置条件：确保桌面整理功能已开启
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

    // 步骤1：将/midscene_dde_file_manager/resources/1810103/new.jpg和old.jpg复制到桌面
    const caseDir = process.env.TESTCASE_DIR;
    // // const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1884495`;

    await system.exec(`cp ${caseDir}midscene_dde_file_manager/resources/1810103/new.jpg ~/Desktop/`, 500);
    await system.exec(`cp ${caseDir}midscene_dde_file_manager/resources/1810103/old.jpg ~/Desktop/`, 500);
    await agent.aiWaitFor("图片文件已复制到桌面");

    // 步骤2：选择new.jpg点击右键，点击“设置壁纸”，断言壁纸设置成功
    await agent.aiRightClick("桌面中间位置")
    await agent.aiWaitFor("右键功能已加载完成")
    await agent.aiTap("整理桌面")
    await agent.aiWaitFor("桌面整理开启成功")
    await agent.aiTap("桌面中间位置")
    await agent.aiRightClick("桌面上的new.jpg图片",{ deepThink: true });
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("设置壁纸",{ deepThink: true });
    // 断言壁纸已替换、和上个不一样AI均不识别
    await agent.aiWaitFor("壁纸显示正常");
    await agent.aiAssert("桌面壁纸为金黄色麦田纹理");

    // 步骤3：恢复环境，点击old.jpg，右键点击“设置壁纸”
    await agent.aiRightClick("桌面上的old.jpg图片",{ deepThink: true });
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("设置壁纸",{ deepThink: true });
    // 断言壁纸已替换、和上个不一样AI均不识别
    await agent.aiWaitFor("壁纸显示正常");

    // 步骤4：清理桌面上的测试图片
    await system.exec('rm -f ~/Desktop/new.jpg ~/Desktop/old.jpg', 500);
  }, { timeout: 900000, tags: ['1810103', 'level4', 'interaction-scenario', 'interaction&upgrade', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理桌面上的测试图片
    await system.exec('rm -f ~/Desktop/new.jpg ~/Desktop/old.jpg', 500);
    // 确保桌面整理设置恢复
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
  });
});