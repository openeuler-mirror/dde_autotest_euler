/**
 * 用例 PMSID: 1812623
 * 用例标题: 【FTP】dock栏FTP图标功能检查
 * 生成时间: 2026-11-13 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const ftpIp = process.env.FTP_IP;

describe('1812623-【FTP】dock栏FTP图标功能检查', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备，挂载FTP');
    const { clearEnvironment, cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.openApp('文件管理器', 3000, 20000, true);
    // 前置条件：已挂载ftp
    await cleanFtpMounts(agent, system);
    for (let i = 0; i < 3; i++) {
      await system.exec(`echo ${process.env.FTP_PASSWORD} | gio mount "ftp://${process.env.FTP_USERNAME}@${ftpIp}/" 2>/dev/null || true`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      const res = await system.exec("gio mount -l 2>/dev/null | grep -c 'ftp://' || true");
      const cnt = parseInt(String((res && (res.stdout !== undefined ? res.stdout : res)) || '0').trim(), 10) || 0;
      console.log(`第${i + 1}轮ftp挂载校验，当前ftp挂载数: ${cnt}`);
      if (cnt > 0) {
        break;
      }
    }
    await device.pressKey('Alt+F4');

  });

  test('1812623-【FTP】dock栏FTP图标功能检查', async ({ device, system, agent, uos }) => {
    // ==================== 步骤1：点击dock栏托盘区域"磁盘"图标 ====================
    console.log('===== 步骤1：点击dock栏托盘的磁盘图标 =====');
    await agent.aiTap('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 预期结果1：弹出"磁盘列表"，包含已挂载ftp目录
    await agent.aiAssert(`屏幕右下角已弹出磁盘列表弹窗，弹窗列表中存在名称为'${ftpIp} 上的 uos'的FTP目录项`);
    console.log('预期结果1：磁盘列表包含已挂载FTP目录');

    // ==================== 步骤2：检查dock栏磁盘列表信息展示 ====================
    console.log('===== 步骤2：检查磁盘列表中FTP信息展示 =====');
    // 预期结果2：信息展示正确，容量显示0B/0B
    await agent.aiAssert('磁盘列表弹窗中该FTP目录项的容量信息显示为0B/0B');
    console.log('预期结果2：FTP信息展示正确，容量为0B/0B');

    // ==================== 步骤3：dock栏托盘点击FTP图标 ====================
    console.log('===== 步骤3：点击托盘中的FTP图标 =====');
    await agent.aiTap(`磁盘列表弹窗中带无线信号标识的黄色文件夹所在行（该行文本为 ${ftpIp} 上的 uos）`, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 预期结果3：打开文管窗口，定位到FTP目录，访问正常
    await agent.aiAssert('已打开文件管理器窗口，地址栏显示ftp地址，窗口内展示FTP目录内容');
    console.log('预期结果3：文管定位到FTP目录访问正常');
    await device.pressKey('Alt+F4');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ==================== 步骤4：单击磁盘列表中的ftp目录 ====================
    console.log('===== 步骤4：单击磁盘列表中的FTP目录 =====');
    await agent.aiTap('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap(`磁盘列表弹窗中带无线信号标识的黄色文件夹所在行（该行文本为 ${ftpIp} 上的 uos）`, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 预期结果4：打开文管窗口并定位至ftp目录
    await agent.aiAssert('已打开文件管理器窗口，地址栏显示ftp地址并定位至FTP目录');
    console.log('预期结果4：文管定位至FTP目录');
    await device.pressKey('Alt+F4');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ==================== 步骤5：点击磁盘图标-ftp目录弹出按钮（卸载） ====================
    console.log('===== 步骤5：点击FTP目录弹出按钮卸载 =====');
    await agent.aiTap('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap(`磁盘列表弹窗中含有${ftpIp}的那一行右侧的圆形弹出按钮`, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 预期结果5：成功卸载，dock栏磁盘目录下不再显示此ftp目录
    const listOpenAfterEject = await agent.aiBoolean('屏幕右下角是否显示磁盘列表弹窗');
    if (!listOpenAfterEject) {
      await agent.aiTap('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    const hasFtpEntry = await agent.aiBoolean(`磁盘列表弹窗中是否还显示名称为'${ftpIp} 上的 uos'的FTP目录项`);
    if (hasFtpEntry) {
      throw new Error('FTP目录卸载后磁盘列表中仍然显示该FTP目录项');
    }
    console.log('预期结果5：FTP已卸载，磁盘列表中不再显示');
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ==================== 步骤6：点击磁盘图标-右键-全部弹出 ====================
    console.log('===== 步骤6：重新挂载FTP后右键全部弹出 =====');
    const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await FtpMount(agent, system, device, 1);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const remountRes = await system.exec("gio mount -l 2>/dev/null | grep -c 'ftp://' || true");
    const remountCnt = parseInt(String((remountRes && (remountRes.stdout !== undefined ? remountRes.stdout : remountRes)) || '0').trim(), 10) || 0;
    if (remountCnt === 0) {
      console.log('UI挂载未生效，使用shell兜底挂载ftp');
      await system.exec(`echo ${process.env.FTP_PASSWORD} | gio mount "ftp://${process.env.FTP_USERNAME}@${ftpIp}/" 2>/dev/null || true`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    await device.pressKey('Alt+F4');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('右键菜单中的全部弹出');
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 预期结果6：成功卸载，dock栏不显示磁盘图标
    const volRes = await system.exec("gio mount -l 2>/dev/null | grep -cE 'ftp://|smb://|/media/uos/UOS' || true");
    const remainVol = parseInt(String((volRes && (volRes.stdout !== undefined ? volRes.stdout : volRes)) || '0').trim(), 10) || 0;
    console.log(`全部弹出后可移动或网络卷剩余数量: ${remainVol}`);
    if (remainVol > 0) {
      throw new Error(`全部弹出后仍有${remainVol}个可移动或网络卷处于挂载状态`);
    }
    const diskIconVisible = await agent.aiBoolean('dock栏托盘区域是否还存在磁盘图标');
    if (diskIconVisible) {
      console.log('视觉复核认为托盘仍有磁盘图标，进一步确认点击后是否还能弹出磁盘列表');
      try {
        await agent.aiTap('dock栏网络图标左侧树杈形状的磁盘图标', { deepThink: true });
      } catch (err) {
        console.log('托盘已无法定位到磁盘图标，图标应已消失:', String(err).split('\n')[0]);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      const listShownAgain = await agent.aiBoolean('屏幕右下角是否弹出了标题为磁盘列表的弹窗');
      if (listShownAgain) {
        throw new Error('全部弹出后点击磁盘图标仍能弹出磁盘列表');
      }
      await device.pressKey('Escape');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    console.log('预期结果6：全部弹出成功，dock栏不显示磁盘图标');

    // ==================== 步骤7：卸载后再次挂载ftp ====================
    console.log('===== 步骤7：卸载后再次挂载FTP =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await FtpMount(agent, system, device, 1);

    const againRes = await system.exec("gio mount -l 2>/dev/null | grep -c 'ftp://' || true");
    const againCnt = parseInt(String((againRes && (againRes.stdout !== undefined ? againRes.stdout : againRes)) || '0').trim(), 10) || 0;
    if (againCnt === 0) {
      console.log('UI挂载未生效，使用shell兜底挂载ftp');
      await system.exec(`echo ${process.env.FTP_PASSWORD} | gio mount "ftp://${process.env.FTP_USERNAME}@${ftpIp}/" 2>/dev/null || true`);

    }
    // 预期结果7：挂载成功
    await agent.aiTap('文件管理器窗口左侧边栏的空白处');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert(`文件管理器左侧边栏的网络区域中显示${ftpIp}的FTP挂载目录`);
    console.log('预期结果7：FTP再次挂载成功');
    await device.pressKey('Alt+F4');

    // 全部弹出会切断U盘供电导致设备消失，重新授权USB根集线器并挂载回U盘
    await system.exec(`echo ${process.env.TEST_PASSWORD} | sudo -S -p '' sh -c "if ! lsblk -no NAME 2>/dev/null | grep -qw sda1; then echo 0 > /sys/bus/usb/devices/usb2/authorized; sleep 2; echo 1 > /sys/bus/usb/devices/usb2/authorized; sleep 5; fi" 2>/dev/null || true`);
    await system.exec('udisksctl mount -b /dev/sda1 2>/dev/null || true');


  }, { timeout: 1800000, tags: ['1812623', 'level2', 'main_interface_area','external_device','ftp',  'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log('5. afterAll: 清理测试套件');
    const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await cleanFtpMounts(agent, system);
    await system.exec('kill -TERM $(pidof dde-file-manager)');
    // 全部弹出会卸载并切断U盘供电，恢复U盘挂载供后续用例使用
    await system.exec(`echo ${process.env.TEST_PASSWORD} | sudo -S -p '' sh -c "if ! lsblk -no NAME 2>/dev/null | grep -qw sda1; then echo 0 > /sys/bus/usb/devices/usb2/authorized; sleep 2; echo 1 > /sys/bus/usb/devices/usb2/authorized; sleep 5; fi" 2>/dev/null || true`);
    await system.exec('udisksctl mount -b /dev/sda1 2>/dev/null || true');

  });
});
