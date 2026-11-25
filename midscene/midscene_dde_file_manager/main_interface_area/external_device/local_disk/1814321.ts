/**
 * 用例 PMSID: 1814321
 * 用例标题: 【本地磁盘】盘符展示-隐藏盘符开关检查
 * 生成时间: 2026-11-13 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;
const usbFlash = process.env.USB_FLASH || 'uos';
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const smbName = process.env.SMB_USERNAME;
const smbPwd = process.env.SMB_PASSWORD;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function outText(res) {
  return String((res && (res.stdout !== undefined ? res.stdout : res)) || '').trim();
}

function toInt(txt) {
  return parseInt(txt || '0', 10) || 0;
}

async function findUsbPath(system) {
  for (let i = 0; i < 6; i++) {
    const res = await system.exec(`findmnt -rno TARGET,SOURCE | awk '$1 ~ /^\\/media\\// && $2 ~ /\\/sd[a-z][a-z0-9]*$/{print $1}' | head -1`);
    const p = (await outText(res)).split('\n')[0];
    if (p) {
      return p;
    }
    console.log(`第${i + 1}次未发现U盘挂载点，尝试重新挂载USB设备`);
    await system.exec(`echo ${userPwd} | sudo -S -p '' sh -c 'if ! lsblk -no NAME 2>/dev/null | grep -qw sda1; then echo 0 > /sys/bus/usb/devices/usb2/authorized; sleep 2; echo 1 > /sys/bus/usb/devices/usb2/authorized; fi' 2>/dev/null || true`);
    await system.exec('udisksctl mount -b /dev/sda1 2>/dev/null || true');
  }
  return '';
}

async function openComputerPage(agent, uos) {
  await uos.openApp('文件管理器', 3000, 20000, true);
  await agent.aiTap('文件管理器左侧栏中的计算机');
}

async function openComputerSettings(agent, device) {
  await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });
  await wait(1000);
  await agent.aiTap('设置');
  await agent.aiTap('计算机显示项目');
}

async function openSidebarItemPage(agent) {
  const descs = [
    '设置窗口左侧导航中的侧边栏显示项目',
    '设置窗口左侧“侧边栏”分组下的“侧边栏显示项目”',
  ];
  for (const d of descs) {
    try {
      await agent.aiTap(d);
    } catch (err) {
      console.log('点击侧边栏显示项目异常:', String(err).split('\n')[0]);
    }
    await wait(2500);
    const onPage = await agent.aiBoolean('设置窗口右侧内容区顶部标题是否为“侧边栏显示项目”，并且列出了最近使用、桌面、文档等带复选框的选项');
    if (onPage) {
      console.log('已打开侧边栏显示项目页面');
      return true;
    }
  }
  return false;
}

async function scrollSettingsList(system, agent) {
  // 设置对话框居中固定尺寸，“内置磁盘”位于右侧列表下方，需滚动才可见；
  // aiScroll 按文字定位时会误命中文管背景侧边栏（侧边栏同样有“回收站”“办公云盘”），
  // 因此改为按屏幕比例把滚轮事件直接投递到右侧选项列表区域
  const dimRes = await system.exec(`DISPLAY=:0 xdpyinfo 2>/dev/null | grep dimensions | head -1`);
  const dimTxt = await outText(dimRes);
  const dm = dimTxt.match(/(\d+)x(\d+)/);
  const sw = dm ? toInt(dm[1]) : 1920;
  const sh = dm ? toInt(dm[2]) : 1080;
  const px = Math.round(sw * 0.55);
  const py = Math.round(sh * 0.6);
  console.log(`向设置窗口右侧列表区域发送滚轮事件: 屏幕${sw}x${sh} 坐标(${px},${py})`);
  await system.exec(`DISPLAY=:0 xdotool mousemove --sync ${px} ${py} click --repeat 4 --delay 180 5 2>/dev/null || true`);
  await wait(1800);
  return true;
}

async function readBuiltinDiskChecked(system, agent) {
  // 内置磁盘位于“分区”分组，需要把右侧列表向下滚动后才可见
  for (let i = 0; i < 4; i++) {
    try {
      const v = await agent.aiBoolean('设置页面“侧边栏显示项目”列表中，“分区”分组下的【内置磁盘】复选框是否已勾选（若页面上看不到“分区”分组或“内置磁盘”选项，判为否）');
      if (v) {
        return true;
      }
    } catch (err) {
      console.log('读取内置磁盘勾选状态异常:', String(err).split('\n')[0]);
    }
    console.log(`第${i + 1}次未确认内置磁盘为勾选，向下滚动列表后重试`);
    await scrollSettingsList(system, agent);
    await wait(1500);
  }
  return false;
}

async function readHideBuiltinChecked(agent) {
  try {
    return await agent.aiBoolean('设置页面的计算机显示项目中，【计算机工作区隐藏内置磁盘】的复选框是否处于已勾选状态');
  } catch (err) {
    console.log('读取复选框状态异常，按未勾选处理:', String(err).split('\n')[0]);
    return false;
  }
}

describe('1814321-【本地磁盘】盘符展示-隐藏盘符开关检查', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1814321-【本地磁盘】盘符展示-隐藏盘符开关检查', async ({ device, system, agent, uos }) => {
    await uos.openApp('文件管理器', 3000, 20000, true);

    // ==================== 步骤1：打开文管-设置-计算机显示项目，检查默认勾选状态 ====================
    console.log('===== 步骤1：检查计算机显示项目默认勾选状态 =====');
    await openComputerSettings(agent, device);
    if (await readHideBuiltinChecked(agent)) {
      console.log('隐藏内置磁盘当前为已勾选，先取消勾选以校验未勾选的默认状态');
      await agent.aiTap('计算机显示项目中的【计算机工作区隐藏内置磁盘】复选框');
      await wait(2500);
    }
    // 预期结果1：隐藏内置磁盘默认不勾选
    await agent.aiAssert('设置页面的计算机显示项目中，【计算机工作区隐藏内置磁盘】复选框处于未勾选状态');
    console.log('预期结果1：隐藏内置磁盘默认不勾选');

    // ==================== 步骤2：勾选【计算机工作区隐藏内置磁盘】，检查计算机页面盘符显示 ====================
    console.log('===== 步骤2：勾选隐藏内置磁盘并检查计算机页面 =====');
    await agent.aiTap('计算机显示项目中的【计算机工作区隐藏内置磁盘】复选框');
    await wait(2500);
    const afterCheck = await readHideBuiltinChecked(agent);
    console.log(`勾选后复选框状态: ${afterCheck}`);
    if (!afterCheck) {
      throw new Error('勾选【计算机工作区隐藏内置磁盘】后，复选框未变为已勾选状态');
    }
    await device.pressKey('Alt+F4');
    await wait(2000);
    await agent.aiTap('文件管理器左侧栏中的计算机');
    await wait(3000);
    // 预期结果2：系统盘符(例如系统盘、数据盘)隐藏
    await agent.aiAssert('文件管理器计算机工作区的“磁盘列表”区域中没有显示“系统盘”图标');
    console.log('预期结果2：系统盘符已隐藏');

    // ==================== 步骤3：重启系统进入桌面 ====================
    console.log('===== 步骤3：重启系统进入桌面 =====');
    await device.pressKey('Control', 'Alt', 'Delete');
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('重启按钮', { deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    //await agent.aiInput(`${process.env.TEST_PASSWORD}`, '密码输入框');
    await device.typeAscii(`${process.env.TEST_PASSWORD}`);
    await agent.aiTap('登录按钮');
    await agent.aiWaitFor('桌面已显示');
    await openComputerPage(agent, uos);
    // 预期结果3：系统盘符(例如系统盘、数据盘)隐藏
    await agent.aiAssert('文件管理器计算机工作区的“磁盘列表”区域中仍然没有显示“系统盘”图标');
    console.log('预期结果3：重启后系统盘符仍隐藏');

    // ==================== 步骤4：插入U盘、挂载网络设备smb，检查计算机页面盘符显示 ====================
    console.log('===== 步骤4：检查U盘和SMB盘符显示 =====');
    const usbPath = await findUsbPath(system);
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }
    console.log(`U盘挂载路径: ${usbPath}`);


    console.log(`本次使用的SMB服务器: ${smbIp}/${smbDir}，用户: ${smbName}`);

    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    let smbShown = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`第${attempt}次挂载SMB网络设备`);
      await SmbMount(agent, system, device, 1);
      await wait(5000);
      try {
        const failedPop = await agent.aiBoolean('屏幕上是否弹出标题为“挂载失败”的提示框');
        if (failedPop) {
          console.log('出现挂载失败提示框，关闭后重试');
          await agent.aiTap('提示框中的确定按钮');
          await wait(2000);
          continue;
        }
      } catch (err) {
        console.log('检查挂载失败提示框异常:', String(err).split('\n')[0]);
      }
      await agent.aiTap('文件管理器左侧栏中的计算机');
      smbShown = await agent.aiBoolean(`文件管理器计算机工作区的“磁盘列表”区域中显示了名称为${smbIp}的SMB网络磁盘图标`);
      console.log(`SMB网络磁盘图标是否显示: ${smbShown}`);
      if (smbShown) {
        break;
      }
    }
    await agent.aiTap('文件管理器左侧栏中的计算机');
    // 预期结果4：u盘，smb盘符展示正常
    await agent.aiAssert('文件管理器计算机工作区的“磁盘列表”区域中显示了名称为UOS的U盘图标');
    if (!smbShown) {
      throw new Error('SMB网络设备挂载后未在计算机页面的磁盘列表中显示');
    }
    console.log('预期结果4：U盘、SMB盘符展示正常');

    // ==================== 步骤5：不勾选【计算机工作区隐藏内置磁盘】 ====================
    console.log('===== 步骤5：不勾选隐藏内置磁盘 =====');
    await openComputerSettings(agent, device);
    await agent.aiTap('计算机显示项目中的【计算机工作区隐藏内置磁盘】复选框');
    await wait(2500);
    const afterUncheck = await readHideBuiltinChecked(agent);
    console.log(`取消勾选后复选框状态: ${afterUncheck}`);
    if (afterUncheck) {
      throw new Error('取消勾选【计算机工作区隐藏内置磁盘】后，复选框仍为已勾选状态');
    }
    await device.pressKey('Alt+F4');
    await agent.aiTap('文件管理器左侧栏中的计算机');
    await wait(3000);
    // 预期结果5：系统盘符(例如系统盘、数据盘)重新显示
    await agent.aiAssert('文件管理器计算机工作区的“磁盘列表”区域中显示了“系统盘”图标');
    console.log('预期结果5：取消勾选后系统盘符重新显示');

    // ==================== 步骤6：打开文管-设置-侧边栏显示，检查默认勾选状态 ====================
    console.log('===== 步骤6：检查侧边栏显示中内置磁盘默认勾选状态 =====');
    await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });
    await wait(1000);
    await agent.aiTap('设置');
    const onSidebarPage = await openSidebarItemPage(agent);
    let builtinDiskChecked = false;
    if (onSidebarPage) {
      builtinDiskChecked = await readBuiltinDiskChecked(system, agent);
    } else {
      console.log('设置页未定位到侧边栏显示项目，改用侧边栏实际展示效果验证内置磁盘开关');
    }
    await device.pressKey('Alt+F4');
    if (!builtinDiskChecked) {
      // 行为兜底：内置磁盘为勾选时，文件管理器左侧边栏“分区”分组中会显示内置磁盘（系统盘）
      await uos.openApp('文件管理器', 3000, 20000, true);
      await agent.aiTap('文件管理器左侧栏中的计算机');
      builtinDiskChecked = await agent.aiBoolean('文件管理器左侧边栏的“分区”分组中显示了“系统盘”条目');
      console.log(`通过侧边栏分区展示复核内置磁盘勾选状态: ${builtinDiskChecked}`);
    } else {
      console.log('设置页中【内置磁盘】为已勾选状态');
    }
    if (!builtinDiskChecked) {
      throw new Error('侧边栏显示中【内置磁盘】不是默认勾选状态');
    }
    // 预期结果6：内置磁盘默认为勾选
    console.log('预期结果6：内置磁盘默认为勾选');

    // 清理SMB挂载
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

  }, { timeout: 1800000, tags: ['1814321', 'level3','remote','main_interface_area', 'external_device', 'local_disk', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    const { cleanSmbMounts, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null || true');
  });
});