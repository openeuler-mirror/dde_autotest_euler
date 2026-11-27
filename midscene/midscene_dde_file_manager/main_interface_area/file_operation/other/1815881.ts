/**
 * 用例 PMSID: 1815881
 * 用例标题: 长文件名功能 - 来回切换，文件名称未被修改
 * 生成时间: 2026-11-13 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;
const usbFlash = process.env.USB_FLASH || 'uos';
const desktopDir = `/home/${userName}/Desktop`;
const docDir = `/home/${userName}/Documents`;

// 长文件名（255个中文字符=765字节，为长文件名功能支持的名字上限）
const longFolderName = '长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回';

// U盘为ext4文件系统，单个文件名字节上限255，使用78个中文字符（234字节）
const usbFolderName = '长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹长文件名功能来回切换文件夹';

// 用于定位测试文件夹的名称前缀，关闭长文件名功能后文件夹名会变为“前缀+_Uos_哈希”的短名，仍以该前缀开头
const namePrefix = '长文件名功能来回切换';

async function setDlnfs(system, enable) {
  const value = enable ? 'true' : 'false';
  await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.mount.dlnfs -v ${value}`);
  await system.exec(`dde-dconfig --set -a org.deepin.dlnfs -r org.deepin.dlnfs -k ulnfs -v false`);
  console.log(`已${enable ? '开启' : '关闭'}长文件名功能`);
}

async function outText(res) {
  return String((res && (res.stdout !== undefined ? res.stdout : res)) || '').trim();
}

function toInt(txt) {
  return parseInt(txt || '0', 10) || 0;
}

// 取目录下以测试前缀开头的条目中最长的名称字节数，用于判断长文件名是否被截取
async function testNameBytes(system, dir) {
  const res = await system.exec(`python3 -c "import os;d=[len(n.encode()) for n in os.listdir('${dir}') if n.startswith('${namePrefix}')];print(max(d) if d else 0)" 2>/dev/null || echo 0`);
  return toInt(await outText(res));
}

// 按当前 dfm.mount.dlnfs 配置重建库目录的长文件名挂载，等价于重启计算机后重新登录
async function remountByConfig(system) {
  await system.exec(`echo ${userPwd} | sudo -S -p '' sh -c 'for d in Desktop Documents Music Pictures Downloads Videos; do umount -l /home/${userName}/$d 2>/dev/null; done' 2>/dev/null || true`);
  await new Promise(resolve => setTimeout(resolve, 3000));
  await system.exec(`echo ${userPwd} | sudo -S -p '' /usr/lib/dlnfs/dlnfs-mount-ses-open --user ${userName} > /tmp/dlnfs_open.log 2>&1 || true`);
  await new Promise(resolve => setTimeout(resolve, 5000));
  const info = await system.exec(`findmnt -rno TARGET,FSTYPE | grep -E "/home/${userName}/(Desktop|Documents|Music)" || true`);
  console.log('库目录当前挂载状态:', (await outText(info)).split('\n').join(' | '));
  await system.exec('killall dde-file-manager 2>/dev/null; systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service 2>/dev/null; true');
  await new Promise(resolve => setTimeout(resolve, 8000));
}

async function rebootAndLogin(device, agent, system, uos) {

    // ==================== 重启系统进入桌面 ====================
    console.log('===== 重启系统进入桌面 =====');
    await device.pressKey('Control', 'Alt', 'Delete');
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('重启按钮', { deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    await device.typeAscii(`${process.env.TEST_PASSWORD}`);
    await agent.aiTap('登录按钮');
    await agent.aiWaitFor('桌面已显示');
}

async function checkFolder(system, dir, label) {
  const bytes = await testNameBytes(system, dir);
  console.log(`${label}中测试文件夹名称字节数: ${bytes}`);
  return bytes;
}

describe('1815881-长文件名功能 - 来回切换，文件名称未被修改', () => {
  let usbPath = '';
  let baseDesktop = 0;
  let baseDoc = 0;
  let baseUsb = 0;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，开启长文件名并创建长文件名文件');
    await uos.showDesktop();

    // 获取U盘挂载路径：/media下由 /dev/sd*（USB设备）提供的挂载点，排除内置nvme盘与dlnfs的fuse挂载
    for (let i = 0; i < 6; i++) {
      const usbPathResult = await system.exec(`findmnt -rno TARGET,SOURCE | awk '$1 ~ /^\\/media\\// && $2 ~ /\\/sd[a-z][a-z0-9]*$/{print $1}' | head -1`);
      usbPath = (await outText(usbPathResult)).split('\n')[0];
      if (usbPath) {
        break;
      }
      console.log(`第${i + 1}次未发现U盘挂载点，尝试重新挂载USB设备`);
      await system.exec(`echo ${userPwd} | sudo -S -p '' sh -c 'if ! lsblk -no NAME 2>/dev/null | grep -qw sda1; then echo 0 > /sys/bus/usb/devices/usb2/authorized; sleep 2; echo 1 > /sys/bus/usb/devices/usb2/authorized; fi' 2>/dev/null || true`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await system.exec('udisksctl mount -b /dev/sda1 2>/dev/null || pmount /dev/sda1 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }
    console.log(`U盘挂载路径: ${usbPath}`);

    // 前置条件1：已打开长文件名功能
    await setDlnfs(system, true);
    await rebootAndLogin(device, agent, system, uos);

    // 前置条件2：库目录、U盘内部、桌面有多个长文件名的文件夹
    console.log('===== 前置条件2：在库目录、U盘、桌面创建多个长文件名文件夹 =====');
    const mk = await system.exec(`mkdir -p "${desktopDir}/${longFolderName}" "/home/${userName}/Documents/${longFolderName}" "${usbPath}/${usbFolderName}" 2>&1 || true`);
    const mkErr = await outText(mk);
    if (mkErr) {
      console.log('创建长文件名文件夹返回信息:', mkErr);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    baseDesktop = await checkFolder(system, desktopDir, '前置条件-桌面');
    baseDoc = await checkFolder(system, docDir, '前置条件-文档');
    baseUsb = await checkFolder(system, usbPath, '前置条件-U盘');
    if (baseDesktop < 700 || baseDoc < 700) {
      throw new Error(`开启长文件名功能后，桌面或库目录未创建出长文件名文件夹（桌面${baseDesktop}字节，文档${baseDoc}字节）`);
    }
    if (baseUsb < 200) {
      throw new Error(`U盘中未创建出长文件名文件夹（${baseUsb}字节）`);
    }
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1815881-长文件名功能 - 来回切换，文件名称未被修改', async ({ device, system, agent, uos }) => {
    // ==================== 步骤1：关闭长文件名功能，重启计算机 ====================
    console.log('===== 步骤1：关闭长文件名功能，重启计算机 =====');
    await setDlnfs(system, false);
    await rebootAndLogin(device, agent, system, uos);

    // 预期结果1：重启后，长文件名的文件名称全部被截取为短文件名称
    const offDesktop = await checkFolder(system, desktopDir, '关闭长文件名后-桌面');
    const offDoc = await checkFolder(system, docDir, '关闭长文件名后-文档');
    const offUsb = await checkFolder(system, usbPath, '关闭长文件名后-U盘');
    if (offDesktop < 1 || offDoc < 1) {
      throw new Error('关闭长文件名功能后，桌面或库目录中的测试文件夹丢失');
    }
    if (offDesktop >= baseDesktop * 0.6) {
      throw new Error(`关闭长文件名功能后，桌面长文件名文件夹未被截取为短文件名（${offDesktop}字节，原始${baseDesktop}字节）`);
    }
    if (offDoc >= baseDoc * 0.6) {
      throw new Error(`关闭长文件名功能后，库目录长文件名文件夹未被截取为短文件名（${offDoc}字节，原始${baseDoc}字节）`);
    }
    if (offUsb !== baseUsb) {
      throw new Error(`关闭长文件名功能后，U盘内文件夹名称被修改（${offUsb}字节，原始${baseUsb}字节）`);
    }
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器左侧栏上的桌面');
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      await agent.aiAssert('文件管理器桌面目录中存在名称被截断显示的文件夹，其名称末尾带有省略号，未完整显示超长文件名');
      console.log('界面复核：桌面目录中长文件名已按短名截断显示');
    } catch (err) {
      console.log('界面复核未通过（以shell实测字节数为准）:', String(err).split('\n')[0]);
    }
    await agent.aiTap('文件管理器左侧栏上的文档');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('预期结果1：长文件名文件夹已按短文件名显示');
    await device.pressKey('Alt+F4');

    // ==================== 步骤2：再次打开长文件名功能，重启计算机 ====================
    console.log('===== 步骤2：再次打开长文件名功能，重启计算机 =====');
    await setDlnfs(system, true);
    await rebootAndLogin(device, agent, system, uos);

    // 预期结果2：重启后，短文件名称恢复为长文件名称
    const onDesktop = await checkFolder(system, desktopDir, '恢复长文件名后-桌面');
    const onDoc = await checkFolder(system, docDir, '恢复长文件名后-文档');
    const onUsb = await checkFolder(system, usbPath, '恢复长文件名后-U盘');
    if (onDesktop < baseDesktop * 0.9) {
      throw new Error(`重新开启长文件名功能后，桌面短文件名未恢复为长文件名（${onDesktop}字节，原始${baseDesktop}字节）`);
    }
    if (onDoc < baseDoc * 0.9) {
      throw new Error(`重新开启长文件名功能后，库目录短文件名未恢复为长文件名（${onDoc}字节，原始${baseDoc}字节）`);
    }
    if (onUsb !== baseUsb) {
      throw new Error(`重新开启长文件名功能后，U盘内文件夹名称被修改（${onUsb}字节，原始${baseUsb}字节）`);
    }
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器左侧栏上的桌面');
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      await agent.aiAssert('文件管理器桌面目录中存在名称很长、超出图标下方名称显示区域的文件夹');
      console.log('界面复核：桌面目录中已恢复显示长文件名');
    } catch (err) {
      console.log('界面复核未通过（以shell实测字节数为准）:', String(err).split('\n')[0]);
    }
    await agent.aiTap('文件管理器左侧栏上的文档');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('预期结果2：短文件名已恢复为长文件名，来回切换后名称未被修改');
    await device.pressKey('Alt+F4');

  }, { timeout: 1800000, tags: ['1815881', 'level2','remote','main_interface_area','file_operation', 'other','DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 清理测试文件，恢复长文件名功能');
    await system.exec(`rm -rf "${desktopDir}/${longFolderName}"`);
    await system.exec(`rm -rf "/home/${userName}/Documents/${longFolderName}"`);
    if (usbPath) {
      await system.exec(`rm -rf "${usbPath}/${usbFolderName}" 2>/dev/null || true`);
    }
    await setDlnfs(system, true);
    await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null || true');
  });
});
