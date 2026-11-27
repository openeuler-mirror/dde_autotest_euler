/**
 * 用例 PMSID: 1806005
 * 用例标题: 【显示第三方程序入口】添加第三方文件到计算机界面
 * 生成时间: 2026-11-17 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

const baiduPackage = 'com.baidu.baidunetdisk';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function outText(res) {
  return String((res && (res.stdout !== undefined ? res.stdout : res)) || '').trim();
}

function toInt(txt) {
  return parseInt(txt || '0', 10) || 0;
}

// 通过 dpkg 检查百度网盘 deb 包是否已安装
async function isBaiduDebInstalled(system) {
  const res = await system.exec(`dpkg -l ${baiduPackage} 2>/dev/null | grep -c "^ii" || true`);
  return toInt(await outText(res)) > 0;
}

// 调用 common.ts 中的 installDeb 安装百度网盘 deb 包
async function ensureBaiduInstalled(system) {
  if (await isBaiduDebInstalled(system)) {
    console.log('百度网盘（deb）已安装');
    return;
  }
  console.log('百度网盘（deb）未安装，调用 common.ts 的 installDeb 安装');
  const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await installDeb(system, baiduPackage);
  if (!(await isBaiduDebInstalled(system))) {
    throw new Error('百度网盘（deb）安装失败');
  }
  console.log('百度网盘（deb）安装完成');
}

// 使用 apt 命令卸载百度网盘 deb 包
async function uninstallBaidu(system) {
  await system.exec(`echo ${userPwd} | sudo -S -p '' apt remove -y ${baiduPackage} > /tmp/baidu_uninstall.log 2>&1 || true`);
  console.log('已使用 apt 卸载百度网盘（deb 包）');
}

// 打开文件管理器并进入计算机视图页面
async function openComputerView(uos, system, agent) {
  const computerOpened = await agent.aiBoolean('当前是否已打开文件管理器的计算机视图页面（能看到系统盘、数据盘、应用入口等图标）');
  if (computerOpened) {
    console.log('文件管理器已处于计算机视图页面');
    return;
  }
  const fmOpened = await agent.aiBoolean('桌面上或任务栏上是否有文件管理器图标');
  if (fmOpened) {
    await agent.aiTap('任务栏或桌面上的文件管理器图标');
  } else {
    await uos.openApp('文件管理器', 3000, 20000, true);
  }

  const hasComputerEntry = await agent.aiBoolean('文件管理器界面左侧边栏是否存在“计算机”入口');
  if (hasComputerEntry) {
    await agent.aiTap('文件管理器左侧边栏的“计算机”入口');
  }
  await wait(3000);
  await agent.aiAssert('文件管理器已进入计算机视图页面，能看到系统盘、数据盘、应用入口等图标');
}

describe('1806005-【显示第三方程序入口】添加第三方文件到计算机界面', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');

  });

  test('1806005-【显示第三方程序入口】添加第三方文件到计算机界面', async ({ device, system, agent, uos }) => {
    // ==================== 步骤1：安装百度网盘，检查计算机界面是否有百度网盘 ====================
    console.log('===== 步骤1：安装百度网盘（deb 包），检查计算机界面是否有百度网盘 =====');
    await ensureBaiduInstalled(system);

    await openComputerView(uos, system, agent);

    // 预期结果1：有百度网盘图标
    const hasBaiduIcon = await agent.aiBoolean('计算机视图页面中是否存在百度网盘图标');
    if (!hasBaiduIcon) {
      throw new Error('步骤1失败：计算机界面中未显示百度网盘图标');
    }
    await agent.aiAssert('计算机界面中已显示百度网盘图标');
    console.log('预期结果1：有百度网盘图标');

    // ==================== 步骤2：双击第三方应用文件 ====================
    console.log('===== 步骤2：双击第三方应用文件 =====');
    await agent.aiDoubleClick('计算机视图页面中的百度网盘图标');
    await wait(12000);

    // 预期结果2：打开第三方应用
    const isBaiduOpen = await agent.aiBoolean('屏幕上是否存在百度网盘应用的窗口');
    if (!isBaiduOpen) {
      throw new Error('步骤2失败：双击百度网盘图标后未打开百度网盘应用');
    }
    await agent.aiAssert('百度网盘应用已打开，界面显示正常');
    console.log('预期结果2：打开第三方应用');
    await device.pressKey('Alt+F4');

    const isExitConfirm = await agent.aiBoolean('是否弹出退出百度网盘的确认窗口');
    if (isExitConfirm) {
      await agent.aiTap('确认窗口中的确定按钮');
    }
    await wait(2000);

    // ==================== 步骤3：选择第三方应用右键 ====================
    console.log('===== 步骤3：选择第三方应用右键 =====');
    await openComputerView(uos, system, agent);
    await agent.aiTap('计算机视图页面中的百度网盘图标');
    await wait(1500);
    await agent.aiRightClick('计算机视图页面中的百度网盘图标');
    await wait(3000);

    // 预期结果3：右键菜单展示【打开】
    const hasOpenMenu = await agent.aiBoolean('右键菜单中是否展示【打开】菜单项');
    if (!hasOpenMenu) {
      throw new Error('步骤3失败：右键菜单中未展示【打开】菜单项');
    }
    await agent.aiAssert('右键菜单中已展示【打开】菜单项');
    console.log('预期结果3：右键菜单展示【打开】');
    await device.pressKey('Escape');


    // ==================== 步骤4：在文件选择对话框，进入到计算机界面，查看第三方应用 ====================
    console.log('===== 步骤4：在文件选择对话框中进入计算机界面，查看第三方应用 =====');
    await uos.openApp('文本编辑器', 3000, 20000, true);
    await device.pressKey('ctrl+o');
    const hasDialog = await agent.aiBoolean('屏幕上是否弹出文件选择对话框');
    if (!hasDialog) {
      throw new Error('步骤4失败：未弹出文件选择对话框');
    }
    const hasComputerEntry = await agent.aiBoolean('文件选择对话框左侧边栏是否存在“计算机”入口');
    if (hasComputerEntry) {
      await agent.aiTap('文件选择对话框左侧边栏的“计算机”入口');
      await wait(3000);
    }
    await agent.aiTap("磁盘列表下方的'系统盘'");
    await agent.aiScroll("磁盘列表下方的'系统盘'", { direction: 'down', distance: 50 });
    // 预期结果4：文件选择和保存的对话框中，不用显示该分类和图标
    const dialogHasBaiduIcon = await agent.aiBoolean('文件选择对话框的计算机界面中是否显示百度网盘图标');
    if (!dialogHasBaiduIcon) {
      throw new Error('步骤4失败：文件选择对话框的计算机界面中应显示百度网盘图标，但实际没显示');
    }
    await agent.aiAssert('文件选择和保存的对话框中显示百度网盘图标');
    console.log('预期结果4：文件选择和保存的对话框中，显示该分类和图标');
    await device.pressKey('Escape');

    // 关闭文本编辑器
    await device.pressKey('Alt+F4');

    // ==================== 步骤5：查看文件管理器侧边栏目录“第三应用” ====================
    console.log('===== 步骤5：查看文件管理器侧边栏目录“第三应用” =====');
    await openComputerView(uos, system, agent);
    await wait(2000);

    // 预期结果5：侧边栏不显示该入口
    const sidebarHasEntry = await agent.aiBoolean('文件管理器侧边栏中是否显示“第三方应用”入口');
    if (sidebarHasEntry) {
      throw new Error('步骤5失败：文件管理器侧边栏中不应显示“第三方应用”入口，但实际显示了');
    }
    await agent.aiAssert('文件管理器侧边栏未显示“第三方应用”入口');
    console.log('预期结果5：侧边栏不显示该入口');

  }, { timeout: 1800000, tags: ['1806005', 'level3', 'main_interface_area','fixed_directory','computer', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec('pkill -f baidunetdisk 2>/dev/null || true');
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 卸载百度网盘（deb 包）');
    await uninstallBaidu(system);
    await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null || true');
  });
});