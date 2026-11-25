/**
 * 用例 PMSID: 1813729
 * 用例标题: 外设和网络路径删除文件，SMB内部删除文件，回收站彻底删除
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const testUsername = process.env.TEST_USERNAME;
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const folderName = '3729smb';

describe('1813729-外设和网络路径删除文件，SMB内部删除文件，回收站彻底删除', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 清理已挂载的SMB
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    // 清空回收站
    console.log('前置条件：清空回收站');
    await system.exec(`rm -rf /home/${testUsername}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${testUsername}/.local/share/Trash/info/*`, 500);

    // 开启删除进回收站的策略
    console.log('前置条件：开启删除进回收站的策略');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.trash.allfiletotrash -v true`, 5000);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813729-外设和网络路径删除文件，SMB内部删除文件，回收站彻底删除', async ({ device, agent, uos, system, env }) => {
    console.log('前置操作：关闭桌面上存在的弹框');
    for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
    
    console.log('步骤1：启动器-文件管理器，点击左侧栏的smbIP');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    // 挂载SMB（使用用户名方式）
    console.log('前置条件：挂载smb');
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    await system.exec('sleep 2');

    // 点击左侧栏的smbIP
    await agent.aiTap(`左侧栏的${smbIp}`);
    await agent.aiWaitFor('smb目录已打开');
    console.log('步骤1完成：已进入smb目录');

    console.log('步骤2：双击一个共享的文件夹，若存在用户鉴权，输入当前用户密码，点击enter');
    await agent.aiDoubleClick(smbDir);
    await system.exec('sleep 1');
    const hasAuth = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth) {
      console.log('检测到用户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    await agent.aiWaitFor('已进入共享文件夹');
    console.log('步骤2完成：已进入共享文件夹');

    console.log('步骤3：点击ctrl+shift+N，创建一个名称3729smb的文件夹');
    await device.pressKey('Control', 'Shift', 'n');
    await system.exec('sleep 1');
    await device.typeText(folderName, true);
    await agent.aiWaitFor(folderName);
    await agent.aiTap('空白处');
    console.log('步骤3完成：3729smb文件夹创建成功');

    console.log('步骤3：点击"3729smb"，点击delete，若有删除弹框，点击"enter"');
    await agent.aiTap(folderName);
    await device.pressKey('Delete');
    await system.exec('sleep 1');
    const hasDeleteDialog = await agent.aiBoolean('出现删除确认弹框');
    if (hasDeleteDialog) {
      console.log('检测到删除弹框，按Enter确认');
      await device.pressKey('Enter');
    }
    await system.exec('sleep 1');
    const has3729 = await agent.aiBoolean(`页面存在${folderName}`);
    if (has3729) {
      throw new Error(`${folderName}文件夹未删除`);
    }
    console.log('步骤3完成：3729smb文件夹已删除');

    console.log('步骤4：点击文件管理器左侧栏的回收站，断言回收站存在"3729smb"文件夹');
    await agent.aiTap('左侧栏的回收站');
    await agent.aiWaitFor('回收站页面已显示');
    await agent.aiAssert(`回收站中存在${folderName}文件夹`);
    console.log('断言通过：回收站存在3729smb文件夹');

    console.log('测试完成');
  }, { timeout: 1200000, tags: ['1813729', 'level2', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理SMB挂载（mode=1强制卸载）
    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);

    // 清空回收站
    console.log('清理步骤：清空回收站');
    await system.exec(`rm -rf /home/${testUsername}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${testUsername}/.local/share/Trash/info/*`, 500);
    console.log('清理步骤：关闭删除进回收站的策略');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.trash.allfiletotrash -v false`, 5000);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
