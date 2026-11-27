/**
 * 用例 PMSID: 1809081
 * 用例标题: 分组折叠-网络分区默认展示
 * 生成时间: 2026-08-19 09:46:58
 * 用例编写人: UT002411（胡戬）
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809081-分组折叠-网络分区默认展示', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);

    const PASSWD = process.env.TEST_PASSWORD;
    const USERNAME = process.env.TEST_USERNAME;
    const smbpwd = '1';

    // 前置条件1: 启动smbd服务并设置samba密码
    console.log('前置条件1: 启动smbd服务并设置samba密码');
    await system.exec(`echo '${PASSWD}' | sudo -S systemctl restart smbd`);
    await system.exec(`echo '${PASSWD}' | sudo -S su -c "printf '${smbpwd}\n${smbpwd}\n' | smbpasswd -a '${USERNAME}' -s"`);

    // 前置条件2: 桌面创建一个"1809081te"文件夹，共享该文件夹
    console.log('前置条件2: 桌面创建测试文件夹并共享');
    await system.exec(`mkdir -p ~/Desktop/1809081te`);

    // 打开文件管理器，通过UI共享文件夹
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });
    await agent.aiTap('文件管理器侧边栏的桌面');
    await agent.aiWaitFor('桌面目录已打开', { timeout: 5000 });
    await agent.aiRightClick('1809081te文件夹');
    await agent.aiWaitFor('右键菜单已显示', { deepThink: true });
    await agent.aiTap('共享文件夹');
    await agent.aiWaitFor('共享文件夹弹框已加载');
    await agent.aiTap('共享此文件夹前面的勾选框', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Escape');

    // 前置条件3: 挂载测试smb文件夹
    console.log('前置条件3: 挂载测试smb文件夹');
    await common.SmbMount(agent, system, device, 1);
    await agent.aiAssert(`文件管理器左侧边栏显示${process.env.SMB_IP}`);

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1809081-分组折叠-网络分区默认展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 最大化窗口打开文件管理器
    console.log('步骤1: 最大化窗口打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 断言: 侧边栏的网络模块，从上往下依次为网络邻居-我的共享-挂载的共享文件夹（显示为ip）
    console.log('断言: 侧边栏网络模块默认展示');
    await agent.aiAssert('文件管理器侧边栏的网络模块从上往下依次显示为网络邻居、我的共享、挂载的共享文件夹（显示为IP地址）', { deepThink: true });
    console.log('断言通过: 网络模块默认展示正确');

  }, { timeout: 600000, tags: ['1809081', 'level2', 'group_collapse', 'hujian'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 后置步骤2: 卸载并移除挂载的smb
    try {
      await common.cleanSmbMounts(agent, system, 1);
      await system.exec('sleep 2');
      const needAuth = await agent.aiBoolean('页面出现卸载文件系统需要认证文本');
      if (needAuth) {
        console.log('触发弹窗认证，输入密码');
        await device.typeText(process.env.TEST_PASSWORD, true);
        await agent.aiTap('确定');
      } else {
        console.log('未触发弹窗认证');
      }
    } catch (err) {
      console.warn('卸载smb失败:', err.message);
    }
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    // 后置步骤1: 删除创建的测试文件夹和共享
    try {
      await system.exec(`echo '${PASSWD}' | sudo -S smbcontrol smbd close-share 1809081te`);
      await system.exec(`echo '${PASSWD}' | sudo -S rm -f /var/lib/samba/usershares/1809081te`);
    } catch (err) {
      console.warn('删除共享失败:', err.message);
    }
    await system.exec(`rm -rf ~/Desktop/1809081te`);

    // 后置步骤3: 清理环境
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
