/**
 * 用例 PMSID: 1813751
 * 用例标题: 取消共享-取消共享文件到smb
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const testUsername = process.env.TEST_USERNAME;

/**
 * 公共函数：开启共享文件夹
 * 点击共享文件夹后，若弹框中无"共享此文件"，则点击"共享管理"，否则直接点击"共享此文件"前面的勾选框
 * @param agent - 代理对象
 */
async function enableShareFolder(agent) {
  console.log('开启共享文件夹：检查弹框中是否有共享此文件');
  const hasShareFile = await agent.aiBoolean('共享此文件');
  if (hasShareFile) {
    console.log('弹框中无共享此文件，点击共享管理');
    await agent.aiTap("共享管理");
    await agent.aiTap("共享此文件前面的勾选框");
  } else {
    console.log('弹框中有共享此文件，直接点击勾选框');
    await agent.aiTap("共享此文件前面的勾选框");
  }
}

describe('1813751-取消共享-取消共享文件到smb', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('清理步骤：删除文档目录下的3715smb系列文件夹');
    await system.exec(`rm -rf /home/${testUsername}/Documents/13751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/23751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/33751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/43751smb`, 500);

    console.log('前置条件：在文档目录创建13751smb、23751smb、33751smb、43751smb文件夹');
    await system.exec(`mkdir -p /home/${testUsername}/Documents/13751smb`, 500);
    await system.exec(`mkdir -p /home/${testUsername}/Documents/23751smb`, 500);
    await system.exec(`mkdir -p /home/${testUsername}/Documents/33751smb`, 500);
    await system.exec(`mkdir -p /home/${testUsername}/Documents/43751smb`, 500);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813751-取消共享-取消共享文件到smb', async ({ device, agent, uos, system, env }) => {
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

    console.log('步骤1：启动文件管理器，最大化窗口，点击左侧栏的"文档"');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤2：右键"13751smb"，点击"共享文件夹"，勾选"共享此文件夹"');
    await agent.aiRightClick('13751smb');
    await agent.aiTap('共享文件夹');
    await enableShareFolder(agent);
    const hasAuth1 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth1) {
      console.log('检测到账户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    await device.pressKey('Escape');
    await agent.aiAssert('13751smb文件夹上右下角多一个图标');

    console.log('步骤3：右键"23751smb"，点击"共享文件夹"，勾选"共享此文件夹"');
    await agent.aiRightClick('23751smb');
    await agent.aiTap('共享文件夹');
    await enableShareFolder(agent);
    const hasAuth2 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth2) {
      console.log('检测到账户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    await device.pressKey('Escape');
    await agent.aiAssert('23751smb文件夹上有共享图标');

    console.log('步骤4：右键"33751smb"，点击"共享文件夹"，勾选"共享此文件夹"');
    await agent.aiRightClick('33751smb');
    await agent.aiTap('共享文件夹');
    await enableShareFolder(agent);
    const hasAuth3 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth3) {
      console.log('检测到账户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    await device.pressKey('Escape');
    await agent.aiAssert('33751smb文件夹上右下角也多一个图标');

    console.log('步骤5：右键"43751smb"，点击"共享文件夹"，勾选"共享此文件夹"');
    await agent.aiRightClick('43751smb');
    await agent.aiTap('共享文件夹');
    await enableShareFolder(agent);
    const hasAuth4 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth4) {
      console.log('检测到账户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    await device.pressKey('Escape');
    await agent.aiAssert('43751smb文件夹上右下角也多一个图标');

    console.log('步骤5：按Ctrl+L，Ctrl+A，输入当前测试机器的IP');
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const localIp = ipResult.stdout.trim();
    console.log(`本机IP: ${localIp}`);
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${localIp}`, true);
    await system.exec('sleep 2'); 

    console.log('断言：smb目录下有13751smb、23751smb、33751smb、43751smb文件夹');
    await agent.aiAssert('当前目录下存在13751smb文件夹');
    await agent.aiAssert('当前目录下存在23751smb文件夹');
    await agent.aiAssert('当前目录下存在33751smb文件夹');
    await agent.aiAssert('当前目录下存在43751smb文件夹');

    console.log('步骤6：按Ctrl+N新建窗口，最大化，点击左侧栏的"文档"');
    await device.pressKey('Ctrl', 'n');
    await system.exec('sleep 1');
    await uos.maximizeWindow();
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤6：右键"13751smb"，点击"取消共享"');
    await agent.aiRightClick('13751smb');
    await agent.aiTap('取消共享');
    const hasAuth5 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth5) {
      console.log('检测到用户弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }

    console.log('步骤7：点击"23751smb"，按Delete删除');
    await agent.aiTap('23751smb');
    await device.pressKey('Delete');
    const hasDeleteConfirm = await agent.aiBoolean('页面出现删除确认弹框');
    if (hasDeleteConfirm) {
      console.log('检测到删除确认弹框，按Enter确认');
      await device.pressKey('Enter');
    }

    console.log('步骤8：点击左侧栏的"我的共享"，右键"33751smb"，点击"取消共享"');
    await agent.aiTap('左侧栏的我的共享');
    await agent.aiWaitFor('我的共享页面已显示');
    await agent.aiRightClick('33751smb');
    await agent.aiTap('取消共享');
    const hasAuth6 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth6) {
      console.log('检测到用户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    console.log('步骤8：关闭当前窗口');
    await uos.closeCurrentWindow();

    console.log('步骤9：点击左侧栏的"我的共享"，再点击当前机器的IP');     
    await agent.aiTap('左侧栏的我的共享');
    await agent.aiWaitFor('我的共享页面已显示');
    await agent.aiTap(`左侧栏的${localIp}`);
    await system.exec('sleep 2');

    console.log('断言：smb目录无"13751smb"和"23751smb"、"33751smb"文件夹');
    const has13751 = await agent.aiBoolean('当前目录下存在13751smb文件夹');
    if (has13751) {
      throw new Error('断言失败：smb目录仍存在13751smb文件夹');
    }
    const has23751 = await agent.aiBoolean('当前目录下存在23751smb文件夹');
    if (has23751) {
      throw new Error('断言失败：smb目录仍存在23751smb文件夹');
    }
    const has33751 = await agent.aiBoolean('当前目录下存在33751smb文件夹');
    if (has33751) {
      throw new Error('断言失败：smb目录仍存在33751smb文件夹');
    }
    console.log('断言通过：smb目录无13751smb、23751smb、33751smb文件夹');

    console.log('测试完成');
  }, { timeout: 1200000, tags: ['1813751', 'level2', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：取消所有共享');
    try {
      await uos.openApp('文件管理器', 2000, 100000);
      await agent.aiWaitFor('文管窗口显示');
      await agent.aiTap('左侧栏的文档');
      await agent.aiWaitFor('文档目录已打开');

      const folders = ['13751smb', '33751smb', '43751smb'];
      for (const folder of folders) {
        try {
          await agent.aiRightClick(folder);
          const hasUnmount = await agent.aiBoolean('右键菜单中出现"取消共享"选项');
          if (hasUnmount) {
            await agent.aiTap('取消共享');
            const hasAuth = await agent.aiBoolean('页面出现需要认证文本');
            if (hasAuth) {
              await device.typeText(process.env.TEST_PASSWORD);
              await device.pressKey('Enter');
            }
          } else {
            await device.pressKey('Escape');
          }
        } catch (err) {
          console.log(`取消共享${folder}失败，跳过`);
          await device.pressKey('Escape');
        }
      }
    } catch (error) {
      console.log('取消共享失败，跳过');
    }

    console.log('清理步骤：删除文档目录下的3715smb系列文件夹');
    await system.exec(`rm -rf /home/${testUsername}/Documents/13751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/23751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/33751smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/43751smb`, 500);

    console.log('清理步骤：卸载smb连接');
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const localIp = ipResult.stdout.trim();
    try {
      await agent.aiRightClick(`左侧栏的${localIp}`);
      await agent.aiTap('移除');
      const hasAuth = await agent.aiBoolean('页面出现需要认证文本');
      if (hasAuth) {
        await device.typeText(process.env.TEST_PASSWORD);
        await device.pressKey('Enter');
      }
    } catch (error) {
      console.log('卸载smb失败，跳过');
    }

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
