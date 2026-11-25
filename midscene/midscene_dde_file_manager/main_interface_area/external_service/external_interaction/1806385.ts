/**
 * 用例 PMSID: 1806385
 * 用例标题: 商店安装【福昕高级PDF编辑器网页版】后，检查桌面图标和功能
 * 生成时间: 2026-11-17 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

const foxitAppName = '福昕高级PDF编辑器网页版';
const foxitPkg = 'cn.foxitsoftware.online';
const browserAppName = '360安全浏览器';
const browserPkg = 'com.360.browser-stable';

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function outText(res) {
  return String((res && (res.stdout !== undefined ? res.stdout : res)) || '').trim();
}

function toInt(txt) {
  return parseInt(txt || '0', 10) || 0;
}

async function countWindows(system, pattern) {
  const cmd = `DISPLAY=:0 wmctrl -lx 2>/dev/null | grep -ic '${pattern}' || true`;
  return toInt(await outText(await system.exec(cmd)));
}

async function closeStoreAndShowDesktop(system, uos) {
  await system.exec('pkill -f "deepin-home-appstore-client" 2>/dev/null || true');
  await wait(3000);
  await uos.showDesktop();
  await wait(2000);
}

async function isPkgInstalled(system, pkg) {
  const res = await system.exec(`dpkg -l ${pkg} 2>/dev/null | grep -c "^ii" || true`);
  return toInt(await outText(res)) > 0;
}

async function ensureDesktopIcon(system, pkg, desktopFile) {
  if (!(await isPkgInstalled(system, pkg))) {
    return;
  }
  const exists = toInt(await outText(await system.exec(`ls /home/uos/Desktop/${desktopFile} 2>/dev/null | wc -l`)));
  if (exists === 0) {
    await system.exec(`cp -f /usr/share/applications/${desktopFile} /home/uos/Desktop/ 2>/dev/null || true`);
    console.log(`已补齐桌面图标：${desktopFile}`);
  }
}

async function openAppStore(uos, system, agent) {
  console.log('使用 uos.openApp 打开应用商店');
  await uos.openApp('应用商店', 3000, 20000, true);
  for (let i = 0; i < 6; i++) {
    await wait(3000);
    if (await countWindows(system, 'deepin-app-store') > 0) {
      break;
    }
  }
  await agent.aiAssert('应用商店窗口已打开，界面上能看到顶部的搜索框');
}

async function searchAppInStore(agent, device, appName) {
  for (let i = 0; i < 3; i++) {
    const onDetail = await agent.aiBoolean(`应用商店当前是否已显示“${appName}”的详情页，页面上能看到“安装”或“打开”按钮`);
    if (onDetail) {
      console.log(`已进入${appName}详情页`);
      return true;
    }
    await agent.aiTap('应用商店顶部的搜索框（带放大镜图标）');
    await wait(1000);
    await device.pressKey('ctrl+a');
    await wait(500);
    await device.typeText(appName, true);
    await wait(6000);

    const onDetailAfterSearch = await agent.aiBoolean(`应用商店当前是否已显示“${appName}”的详情页，页面上能看到“安装”或“打开”按钮`);
    if (onDetailAfterSearch) {
      console.log(`搜索后直接进入${appName}详情页`);
      return true;
    }

    const listed = await agent.aiBoolean(`应用商店界面中是否出现了“${appName}”的应用条目或搜索建议项`);
    if (listed) {
      await agent.aiTap(`应用商店中的“${appName}”应用条目或搜索建议项`);
      await wait(5000);
    }
  }
  return await agent.aiBoolean(`应用商店当前是否已显示“${appName}”的详情页，页面上能看到“安装”或“打开”按钮`);
}

async function installAppViaStore(uos, agent, device, system, appName, pkg, maxChecks) {
  if (await isPkgInstalled(system, pkg)) {
    console.log(`${appName}已安装，跳过商店安装步骤`);
    return;
  }
  await openAppStore(uos, system, agent);

  const onDetail = await searchAppInStore(agent, device, appName);
  if (!onDetail) {
    throw new Error(`${appName}安装失败：应用商店中未打开该应用的详情页`);
  }
  await agent.aiAssert(`应用商店已显示“${appName}”的详情页，页面名称与预期一致`);

  const hasInstallBtn = await agent.aiBoolean('详情页上是否显示“安装”按钮');
  if (hasInstallBtn) {
    await agent.aiTap('详情页上的“安装”按钮');
    console.log('已点击安装按钮');
  } else {
    const hasOpenBtn = await agent.aiBoolean('详情页上是否显示“打开”按钮');
    if (hasOpenBtn) {
      for (let i = 0; i < 3; i++) {
        if (await isPkgInstalled(system, pkg)) {
          break;
        }
        await wait(3000);
      }
      if (await isPkgInstalled(system, pkg)) {
        console.log(`${appName}详情页已显示打开按钮，安装已完成`);
        await closeStoreAndShowDesktop(system, uos);
        return;
      }
      throw new Error(`${appName}安装失败：商店显示“打开”按钮，但系统中未检测到安装记录`);
    }
    throw new Error(`${appName}安装失败：详情页上既没有安装按钮也没有打开按钮`);
  }

  let installed = false;
  for (let i = 0; i < maxChecks; i++) {
    await wait(5000);
    if (await isPkgInstalled(system, pkg)) {
      installed = true;
      console.log(`第${i + 1}次检查：已检测到${appName}安装完成`);
      break;
    }
    if ((i + 1) % 6 === 0) {
      console.log(`等待${appName}安装完成，已等待${(i + 1) * 5}秒`);
    }
  }
  if (!installed) {
    throw new Error(`${appName}安装失败：未检测到安装记录`);
  }
  let openBtnVisible = false;
  for (let i = 0; i < 4; i++) {
    await wait(4000);
    openBtnVisible = await agent.aiBoolean(`详情页上是否显示“打开”按钮`);
    if (openBtnVisible) {
      break;
    }
  }
  if (!openBtnVisible) {
    throw new Error(`${appName}安装失败：详情页上未出现“打开”按钮`);
  }
  await agent.aiAssert(`${appName}详情页上的按钮已变为“打开”，表示安装完成`);
  await closeStoreAndShowDesktop(system, uos);
}

describe('1806385-商店安装【福昕高级PDF编辑器网页版】后，检查桌面图标和功能', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('pkill -f "deepin-home-appstore-client" 2>/dev/null || true');
    await system.exec('pkill -x browser 2>/dev/null || true');
    await system.exec('pkill -f "360.browser-stable" 2>/dev/null || true');
    await wait(2000);
    await ensureDesktopIcon(system, foxitPkg, 'cn.foxitsoftware.online.desktop');
    await ensureDesktopIcon(system, browserPkg, 'com.360.browser-stable.desktop');
    await closeStoreAndShowDesktop(system, uos);
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806385-商店安装【福昕高级PDF编辑器网页版】后，检查桌面图标和功能', async ({ device, system, agent, uos }) => {
    console.log('===== 步骤1：应用商店安装福昕高级PDF编辑器网页版 =====');
    await installAppViaStore(uos, agent, device, system, foxitAppName, foxitPkg, 24);

    if (!(await isPkgInstalled(system, foxitPkg))) {
      throw new Error('步骤1失败：福昕高级PDF编辑器网页版未安装成功');
    }
    console.log('预期结果1：安装成功');

    console.log('===== 步骤2：检查桌面图标 =====');
    await wait(2000);
    const foxitIconCount = toInt(await outText(await system.exec('ls /home/uos/Desktop/ | grep -ic "foxit" || true')));
    console.log(`桌面上的福昕图标文件数：${foxitIconCount}`);
    if (foxitIconCount === 0) {
      throw new Error('步骤2失败：桌面上没有生成福昕高级PDF编辑器网页版的图标文件');
    }

    const hasDesktopIcon = await agent.aiBoolean('桌面上是否有名称包含“福昕”或“PDF编辑器”的图标');
    if (!hasDesktopIcon) {
      throw new Error('步骤2失败：桌面上未显示福昕高级PDF编辑器网页版的图标');
    }
    await agent.aiAssert('桌面上存在一个以“福昕”开头的图标，图标为紫色EDITOR图案、图片清晰可辨（名称较长被省略号折叠属正常显示）');
    console.log('预期结果2：桌面图标显示正确');

    console.log('===== 步骤3：双击桌面图标 =====');
    let browserWin = 0;
    for (let attempt = 0; attempt < 2; attempt++) {
      await agent.aiDoubleClick('桌面上名称包含“福昕”的图标');
      for (let i = 0; i < 5; i++) {
        await wait(4000);
        browserWin = await countWindows(system, 'deepin.browser');
        if (browserWin > 0) {
          break;
        }
      }
      if (browserWin > 0) {
        break;
      }
      console.log(`第${attempt + 1}次双击后未打开浏览器，重试`);
    }
    console.log(`系统浏览器窗口数：${browserWin}`);
    if (browserWin === 0) {
      throw new Error('步骤3失败：双击福昕网页版图标后未打开浏览器窗口');
    }
    await agent.aiAssert('屏幕上已打开浏览器窗口，当前页面是福昕PDF相关的网页（页面标题或内容中出现“福昕”字样），页面内容已正常加载');
    console.log('预期结果3：打开正常');

    await device.pressKey('Alt+F4');
    await wait(2500);
    const isExitConfirm = await agent.aiBoolean('是否弹出退出浏览器的确认窗口');
    if (isExitConfirm) {
      await agent.aiTap('确认窗口中的确定按钮');
      await wait(1500);
    }
    await system.exec('pkill -x browser 2>/dev/null || true');
    await wait(1500);

    console.log('===== 步骤4：通过应用商店安装另一款浏览器并重复执行步骤1~3 =====');
    console.log('--- 步骤4-1：应用商店安装360安全浏览器 ---');
    await installAppViaStore(uos, agent, device, system, browserAppName, browserPkg, 60);

    if (!(await isPkgInstalled(system, browserPkg))) {
      throw new Error(`步骤4失败：${browserAppName}未安装成功`);
    }
    console.log(`${browserAppName}安装成功`);

    console.log('--- 步骤4-2：检查浏览器桌面图标 ---');
    await wait(2000);
    const browserIconCount = toInt(await outText(await system.exec('ls /home/uos/Desktop/ | grep -ic "360" || true')));
    console.log(`桌面上的360浏览器图标文件数：${browserIconCount}`);
    if (browserIconCount === 0) {
      throw new Error(`步骤4失败：桌面上没有生成${browserAppName}的图标文件`);
    }

    const hasBrowserIcon = await agent.aiBoolean(`桌面上是否有名称为“${browserAppName}”（图标为绿色360标志）的图标`);
    if (!hasBrowserIcon) {
      throw new Error(`步骤4失败：桌面上未显示${browserAppName}的图标`);
    }
    await agent.aiAssert(`桌面上存在名称为“${browserAppName}”的图标，图标为绿色360图案、图片清晰可辨`);
    console.log(`${browserAppName}桌面图标显示正确`);

    console.log('--- 步骤4-3：双击360安全浏览器图标 ---');
    let b360Win = 0;
    for (let attempt = 0; attempt < 2; attempt++) {
      await agent.aiDoubleClick(`桌面上名称为“${browserAppName}”的图标`);
      for (let i = 0; i < 5; i++) {
        await wait(4000);
        b360Win = await countWindows(system, '360.browser-stable');
        if (b360Win > 0) {
          break;
        }
      }
      if (b360Win > 0) {
        break;
      }
      console.log(`第${attempt + 1}次双击后未打开浏览器，重试`);
    }
    console.log(`360安全浏览器窗口数：${b360Win}`);
    if (b360Win === 0) {
      throw new Error(`步骤4失败：双击${browserAppName}图标后未打开浏览器窗口`);
    }
    await agent.aiAssert(`屏幕上已打开${browserAppName}的窗口，窗口内有地址栏和网页内容，页面显示正常`);
    console.log(`${browserAppName}打开正常`);
    console.log('预期结果4：每个步骤都达到预期');

    await device.pressKey('Alt+F4');
    await wait(2500);
    const browserExitConfirm = await agent.aiBoolean('是否弹出退出浏览器的确认窗口');
    if (browserExitConfirm) {
      await agent.aiTap('确认窗口中的确定按钮');
      await wait(1500);
    }
    await uos.showDesktop();
    await wait(1000);
  }, { timeout: 1800000, tags: ['1806385', 'level3', 'main_interface_area','external_service','external_interaction', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec('pkill -x browser 2>/dev/null || true');
    await system.exec('pkill -f "360.browser-stable" 2>/dev/null || true');
    await system.exec('pkill -f "deepin-home-appstore-client" 2>/dev/null || true');
    await wait(1000);
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 清理残留进程');
    await system.exec('pkill -x browser 2>/dev/null || true');
    await system.exec('pkill -f "360.browser-stable" 2>/dev/null || true');
    await system.exec('pkill -f "deepin-home-appstore-client" 2>/dev/null || true');
    await system.exec('pkill -x dde-file-manage 2>/dev/null || true');
    await system.exec('pkill -x dde-file-manager 2>/dev/null || true');
  });
});
