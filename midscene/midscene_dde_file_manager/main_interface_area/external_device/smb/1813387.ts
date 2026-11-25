/**
 * 用例 PMSID: 1813387
 * 用例标题: 共享常驻 (不勾选)- 卸载所有smb目录，检查侧边栏
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const testUsername = process.env.TEST_USERNAME;

describe('1813387-共享常驻(不勾选)-卸载所有smb目录检查侧边栏', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('清理步骤：删除文档目录下的3387smb文件夹');
    await system.exec(`rm -rf /home/${testUsername}/Documents/3387smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/3387smb2`, 500);

    console.log('前置条件：利用命令创建3387smb和3387smb2文件夹');
    await system.exec(`mkdir -p /home/${testUsername}/Documents/3387smb`, 500);
    await system.exec(`mkdir -p /home/${testUsername}/Documents/3387smb2`, 500);

    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();

    console.log('前置条件：打开文件管理器，设置页面，取消勾选"Samba共享端常驻显示挂载入口"');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap("设置");
    await agent.aiWaitFor('设置页面已打开');
    await agent.aiScroll('设置页面左侧栏', { direction: 'down', distance: 1000 });
    await system.exec('sleep 1');
    await agent.aiTap("左侧栏的挂载");

    const isChecked = await agent.aiBoolean("Samba共享端常驻显示挂载入口被勾选", { deepthink: true });
    if (isChecked) {
      console.log('已勾选，取消勾选');
      await agent.aiTap("Samba共享端常驻显示挂载入口前面的勾选框", { deepthink: true });
    } else {
      console.log('未勾选，直接关闭');
    }
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813387-共享常驻(不勾选)-卸载所有smb目录检查侧边栏', async ({ device, agent, uos, system, env }) => {
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const localIp = ipResult.stdout.trim();
    console.log(`本机IP: ${localIp}`);

    console.log('步骤1：打开文件管理器，点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    console.log('步骤1完成：文档目录已打开，3387smb和3387smb2文件夹已通过命令创建');

    console.log('步骤2：右键点击3387smb，点击共享文件夹');
    await agent.aiRightClick('3387smb');
    await agent.aiTap('共享文件夹');

    console.log('步骤2：若"共享此文件夹"未勾选，则勾选');
    const isShared1 = await agent.aiBoolean('共享此文件夹前面的勾选框已勾选');
    if (!isShared1) {
      await agent.aiTap('共享此文件夹前面的勾选框');
    }
    await device.pressKey('Escape');

    console.log('步骤2：右键点击3387smb2，点击共享文件夹');
    await agent.aiRightClick('3387smb2');
    await agent.aiTap('共享文件夹');

    console.log('步骤2：若"共享此文件夹"未勾选，则勾选');
    const isShared2 = await agent.aiBoolean('共享此文件夹前面的勾选框已勾选');
    if (!isShared2) {
      await agent.aiTap('共享此文件夹前面的勾选框');
    }
    await device.pressKey('Escape');

    console.log('步骤3：按Ctrl+L，Ctrl+A，输入本机IP地址');
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${localIp}`, true);

    console.log('步骤4：从左到右依次遍历SMB目录下的文件夹，右键检查是否有"卸载"选项');
    let index = 1;
    while (true) {
      await system.exec('sleep 1');
      const hasNth = await agent.aiBoolean(`当前SMB目录下从左到右第${index}个文件夹存在`);
      if (!hasNth) {
        console.log(`第${index}个文件夹不存在，遍历完成`);
        break;
      }
      console.log(`右键第${index}个文件夹`);
      await agent.aiRightClick(`从左到右第${index}个文件夹`);
      await system.exec('sleep 1');
      const hasUnmountOption = await agent.aiBoolean('右键菜单中出现"卸载"选项');
      if (hasUnmountOption) {
        console.log(`第${index}个文件夹有"卸载"选项，点击卸载`);
        await agent.aiTap('卸载');
        await system.exec('sleep 2');
        const hasAuth = await agent.aiBoolean('页面出现需要认证文本');
        if (hasAuth) {
          await device.typeText(env.testPassword, true);
        }
        // 卸载后该文件夹消失，后面的前移，index不变继续检查此位置
      } else {
        console.log(`第${index}个文件夹无"卸载"选项，关闭菜单，处理下一个`);
        await device.pressKey('Escape');
        index++;
      }
    }
    console.log('所有文件夹遍历完毕');

    console.log('断言：所有文件夹全部卸载后，左侧栏不显示smbIP地址');
    const hasSmbIp = await agent.aiBoolean(`左侧栏显示${localIp}`);
    if (!hasSmbIp) {
      console.log('断言通过：左侧栏无smbIP信息');
    } else {
      throw new Error('左侧栏仍有smbIP信息');
    }

    console.log('测试完成');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  }, { timeout: 1200000, tags: ['1813387', 'level3','smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：删除文档目录下的3387smb文件');
    await system.exec(`rm -rf /home/${testUsername}/Documents/3387smb`, 500);
    await system.exec(`rm -rf /home/${testUsername}/Documents/3387smb2`, 500);

    console.log('恢复设置：勾选"Samba共享端常驻显示挂载入口"');
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap("设置");
    await agent.aiWaitFor('设置页面已打开');
    await agent.aiScroll('设置页面左侧栏', { direction: 'down', distance: 1000 });
    await system.exec('sleep 1');
    await agent.aiTap("左侧栏的挂载");

    const isChecked = await agent.aiBoolean("Samba共享端常驻显示挂载入口被勾选", { deepThink: true });
    if (!isChecked) {
      console.log('未勾选，恢复勾选状态');
      await agent.aiTap("Samba共享端常驻显示挂载入口前面的勾选框", { deepThink: true });
    } else {
      console.log('已勾选，无需恢复');
    }
    await device.pressKey('Escape');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});