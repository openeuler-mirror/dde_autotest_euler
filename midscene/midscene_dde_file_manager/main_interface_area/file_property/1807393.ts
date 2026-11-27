/**
 * 用例 PMSID: 1807393
 * 用例标题: 在计算机视图页面，操作快捷键 Ctrl+I查看属性
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

async function isBaiduDebInstalled(system) {
  const res = await system.exec(`dpkg -l ${baiduPackage} 2>/dev/null | grep -c "^ii" || true`);
  return toInt(await outText(res)) > 0;
}

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

async function uninstallBaidu(system) {
  await system.exec(`echo ${userPwd} | sudo -S -p '' apt remove -y ${baiduPackage} > /tmp/baidu_uninstall.log 2>&1 || true`);
  console.log('已使用 apt 卸载百度网盘（deb 包）');
}

async function openComputerView(uos, agent, device) {
  console.log('使用 uos.openApp 打开文件管理器');
  await uos.openApp('文件管理器', 3000, 20000, true);
  await agent.aiTap('文件管理器窗口左侧边栏“分区”分组下的“计算机”入口');
  await agent.aiAssert('文件管理器左侧边栏的“计算机”入口处于选中状态，右侧内容区显示“磁盘列表”区域，磁盘列表中有系统盘和数据盘的图标');
}

async function closePropertyWindow(device, agent) {
  const hasProp = await agent.aiBoolean('屏幕上是否存在属性窗口');
  if (hasProp) {
    await device.pressKey('Escape');
    const stillProp = await agent.aiBoolean('屏幕上是否仍存在属性窗口');
    if (stillProp) {
      await device.pressKey('Alt+F4');
    }
  }
}

describe('1807393-在计算机视图页面，操作快捷键 Ctrl+I查看属性', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    console.log('===== 前置条件1：调用 common.ts 的 installDeb 安装百度网盘（deb 包） =====');
    await ensureBaiduInstalled(system);

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807393-在计算机视图页面，操作快捷键 Ctrl+I查看属性', async ({ device, system, agent, uos }) => {
    console.log('===== 前置操作：打开文件管理器计算机视图页面 =====');
    await openComputerView(uos, agent, device);

    console.log('===== 步骤1：选中系统盘，操作快捷键 Ctrl+I =====');
    await agent.aiTap('计算机视图“磁盘列表”区域中的系统盘图标');
    await wait(1000);
    await agent.aiAssert('磁盘列表中的系统盘图标处于选中状态');
    await device.pressKey('ctrl+i');
    await wait(3000);

    const systemDiskProp = await agent.aiBoolean('屏幕上是否弹出了一个属性窗口，窗口标题包含“系统盘”，窗口内有名称、设备类型、总容量、文件系统、可用空间等属性项');
    if (!systemDiskProp) {
      throw new Error('步骤1失败：选中系统盘后按 Ctrl+I 未弹出属性窗口');
    }
    await agent.aiAssert('屏幕上已弹出系统盘的属性窗口，窗口中属性项（名称、设备类型、总容量、文件系统、可用空间）均已展示且有值');
    console.log('预期结果1：弹窗展示属性窗口，属性展示正确');
    await closePropertyWindow(device, agent);

    console.log('===== 步骤2：选中数据盘，操作快捷键 Ctrl+I =====');
    await agent.aiTap('计算机视图“磁盘列表”区域中的数据盘图标');
    await wait(1000);
    await agent.aiAssert('磁盘列表中的数据盘图标处于选中状态');
    await device.pressKey('ctrl+i');
    await wait(3000);

    const dataDiskProp = await agent.aiBoolean('屏幕上是否弹出了一个属性窗口，窗口标题包含“数据盘”，窗口内有名称、设备类型、总容量、文件系统、可用空间等属性项');
    if (!dataDiskProp) {
      throw new Error('步骤2失败：选中数据盘后按 Ctrl+I 未弹出属性窗口');
    }
    await agent.aiAssert('屏幕上已弹出数据盘的属性窗口，窗口中属性项（名称、设备类型、总容量、文件系统、可用空间）均已展示且有值');
    console.log('预期结果2：弹窗展示属性窗口，属性展示正确');
    await closePropertyWindow(device, agent);

    console.log('===== 步骤3：选中百度网盘，操作快捷键 Ctrl+I =====');
    const hasAppEntry = await agent.aiBoolean('计算机视图“磁盘列表”区域中是否存在百度网盘图标');
    if (!hasAppEntry) {
      throw new Error('计算机视图页面中未找到百度网盘图标');
    }
    await agent.aiTap('计算机视图“磁盘列表”区域中的百度网盘图标');
    await wait(1000);
    await agent.aiAssert('磁盘列表中的百度网盘图标处于选中状态');
    await device.pressKey('ctrl+i');
    await wait(3000);

    const appEntryProp = await agent.aiBoolean('屏幕上是否存在一个属性窗口，该窗口标题包含“百度网盘”，窗口内有名称、类型、大小、位置等属性项');
    if (appEntryProp) {
      throw new Error('步骤3失败：选中百度网盘后按 Ctrl+I 不应弹出属性窗口，但实际弹出了');
    }
    await agent.aiAssert('当前屏幕上没有出现标题包含“百度网盘”的属性窗口，界面仍是文件管理器的计算机视图页面，磁盘列表中百度网盘图标处于选中状态');
    console.log('预期结果3：无响应，不弹窗属性展示框');

  }, { timeout: 1800000, tags: ['1807393', 'level3', 'main_interface_area','file_property','DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 卸载百度网盘（deb 包）');
    try {
      await uninstallBaidu(system);
    } finally {
      await system.exec("kill -TERM $(pidof dde-file-manager)");
    }
  });
});
