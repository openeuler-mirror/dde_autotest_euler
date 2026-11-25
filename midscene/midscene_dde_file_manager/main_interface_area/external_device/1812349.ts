/**
 * 用例 PMSID: 1812349
 * 用例标题: 文件扩展角标，块设备显示，gio添加角标
 * 生成时间: 2026-08-31
 * 用例编写人: UT006487(王薇)
 */

describe('1812349-文件扩展角标，块设备显示，gio添加角标', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const username = process.env.TEST_USERNAME;
  const usbFlash = process.env.USB_FLASH;
  const testFileName = '1812349.txt';
  const usbMountPath = `/media/${username}/${usbFlash}`;
  const testFilePath = `${usbMountPath}/${testFileName}`;
  const emblemImagePath = `${caseDir}midscene_dde_file_manager/resources/1812349/3.jpg`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`   TEST_USERNAME: ${username}`);
    console.log(`   USB_FLASH: ${usbFlash}`);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();

    console.log('前置条件1: 开启组策略 blockExtEnable');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.emblem -k blockExtEnable -v true`, 5000);

  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    console.log('前置条件2: 删除U盘下所有文件');
    await system.exec(`rm -f ${usbMountPath}/*`);

    console.log('前置条件3: 在U盘下创建1812349.txt文件');
    await system.exec(`touch ${testFilePath}`);
  });

  test('1812349-文件扩展角标，块设备显示，gio添加角标', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 终端gio set设置文件角标 =====');
    console.log(`执行命令: gio set ${testFilePath} -t stringv metadata::emblems "${emblemImagePath};ld"`);
    await system.exec(`gio set ${testFilePath} -t stringv metadata::emblems "${emblemImagePath};ld"`);

    console.log('===== 预期1: 桌面打开文件管理器-单击侧边栏计算机-双击U盘-1812349.txt文件左下角存在小黑框 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器侧边栏的计算机', { deepThink: true });
    await agent.aiWaitFor('计算机目录已加载');
    await agent.aiDoubleClick(`${usbFlash}`);
    await agent.aiWaitFor('U盘目录已加载');
    await agent.aiRightClick('文件管理器空白处');
    await agent.aiTap('文件管理器右键菜单的刷新');
    await agent.aiAction(`${testFileName} 文件图标内左下方存在小黑框`);
    console.log('✅ 预期1验证通过: 1812349.txt文件左下角存在小黑框');

    console.log('✅ 测试用例执行完成');

  }, { timeout: 600000, tags: ['1812349', 'level2', 'external_device', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`gio set ${testFilePath} -t stringv metadata::emblems ""`);
    await system.exec(`rm -f ${usbMountPath}/*`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
