/**
 * 用例 PMSID: 1816801
 * 用例标题: 1080及以上版本云盘插件会随同云盘客户端卸载
 * 生成时间: 2026-11-12 10:00:00
 * 用例编写人: UT005160(蓝雁玲) 
 */
const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1816801-1080及以上版本云盘插件会随同云盘客户端卸载', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1816801-1080及以上版本云盘插件会随同云盘客户端卸载', async ({ device, system, agent, uos }) => {
    const sh = async (cmd, t = 60000) => {
      const r = await system.exec(cmd, t);
      return (((r && r.stdout) || '') + '').trim();
    };

    // 前置检查：确认云盘客户端已安装
    const installed = await sh('dpkg -l | grep com.uos.drive | grep ii | wc -l');
    if (parseInt(installed, 10) === 0) {
      console.log('云盘客户端未安装，先安装云盘客户端');
      await sh(`echo '${userPwd}' | sudo -S apt install -y com.uos.drive`, 600000);
    } else {
      console.log('云盘客户端已安装');
    }

    // ==================== 步骤1：在启动器中卸载"办公云盘"客户端 ====================
    console.log('===== 步骤1：在启动器中卸载办公云盘客户端 =====');
    await agent.aiTap('任务栏上的第一个图标，也就是启动器');
    await sleep(2500);
    await agent.aiTap('启动器顶部的搜索框');
    await sleep(1500);
    await device.typeText('办公云盘');
    await sleep(3000);
    await agent.aiWaitFor('启动器搜索结果中出现办公云盘应用图标');
    await agent.aiRightClick('启动器搜索结果中的"办公云盘"应用图标');
    await sleep(1500);
    await agent.aiTap('右键菜单中的"卸载"');
    await sleep(3000);
    const isUninstallConfirm = await agent.aiBoolean('是否弹出卸载确认窗口');
    if (isUninstallConfirm === true) {
      await agent.aiTap('卸载确认窗口中的"卸载"按钮');
    }
    // 卸载过程可能需要一段时间，轮询 dpkg 状态
    let gone = false;
    for (let i = 0; i < 12; i++) {
      await sleep(5000);
      const still = await sh('dpkg -l | grep com.uos.drive | grep ii | wc -l');
      if (parseInt(still, 10) === 0) { gone = true; break; }
    }
    if (!gone) {
      const cur = await sh('dpkg -l | grep com.uos.drive | grep ii | wc -l');
      if (parseInt(cur, 10) !== 0) {
        throw new Error('云盘客户端卸载失败，dpkg仍能查到com.uos.drive');
      }
    }
    console.log('预期结果1：云盘客户端卸载成功');
    await device.pressKey('Escape');
    await sleep(1500);

    // ==================== 步骤2：打开文件管理器，查看侧边栏和计算机磁盘 ====================
    console.log('===== 步骤2：打开文件管理器查看侧边栏和计算机磁盘 =====');
    await sh(`kill -15 $(pidof dde-file-manager) 2>/dev/null; true`);
    await sleep(1500);
    await sh(`nohup dde-file-manager >/dev/null 2>&1 &`);
    await sleep(6000);
    const winId = await sh(`xdotool search --class dde-file-manager | tail -1`);
    if (winId) await sh(`xdotool windowactivate ${winId}`);
    await sleep(1500);
    await device.pressKey("Win+Up");
    // 预期结果2：云盘扩展插件被一起卸载，不显示"办公云盘"入口
    const sidebarHas = await agent.aiBoolean('文件管理器左侧边栏中是否存在"办公云盘"或"云盘"相关的入口');
    if (sidebarHas === true) {
      throw new Error('文件管理器侧边栏仍显示办公云盘入口，插件未随客户端卸载');
    }
    await agent.aiTap('文件管理器左侧栏中的"计算机"');
    await sleep(2500);
    const diskHas = await agent.aiBoolean('计算机磁盘页面中是否存在"办公云盘"或"云盘"相关的磁盘入口');
    if (diskHas === true) {
      throw new Error('计算机磁盘页面仍显示办公云盘磁盘入口，插件未随客户端卸载');
    }
    await agent.aiTap('文件管理器窗口右上角的关闭按钮');
    await sleep(1500);
    console.log('预期结果2：云盘扩展插件已随客户端一起卸载');

    // ==================== 步骤3：重新安装云盘客户端 ====================
    console.log('===== 步骤3：重新安装云盘客户端 =====');
    const reinstallResult = await sh(`echo '${userPwd}' | sudo -S apt install -y com.uos.drive`, 600000);
    console.log('重新安装输出：');
    console.log((reinstallResult || '无').slice(0, 300));
    const reinstalled = await sh('dpkg -l | grep com.uos.drive | grep ii | wc -l');
    if (parseInt(reinstalled, 10) === 0) {
      throw new Error('云盘客户端重新安装失败');
    }
    console.log('预期结果3：云盘客户端重新安装成功');

  }, { timeout: 1800000, tags: ['1816801', 'level3', 'com_uos_drive', 'install_uninstall', 'DITT'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await sleep(2000);
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 恢复云盘客户端安装状态');
    await system.exec(`echo '${userPwd}' | sudo -S apt install -y com.uos.drive 2>/dev/null`);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
