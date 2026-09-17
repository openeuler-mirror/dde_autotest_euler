/**
 * 用例 PMSID: 1973137
 * 用例标题: 【搜索】【黑名单配置】配置黑名单路径后手动重启anything服务
 * 生成时间: 2026-05-13 14:50:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const passwd = process.env.TEST_PASSWORD;
const desktopBlackPath = `/home/${username}/Desktop/black-path`;
const documentsBlackPath = `/home/${username}/Documents/black-path`;

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${desktopBlackPath}`);
    await system.exec(`rm -rf ${documentsBlackPath}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1973137-【搜索】【黑名单配置】配置黑名单路径后手动重启anything服务', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec(`mkdir -p ${desktopBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${desktopBlackPath}/black-path.txt`);
    await system.exec(`mkdir -p ${documentsBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${documentsBlackPath}/black-path.txt`);
  });

  test('1973137-【搜索】【黑名单配置】配置黑名单路径后手动重启anything服务', async ({ device, agent, uos, system }) => {
    // 步骤1：打开终端，输入命令设置黑名单为["black-path"]
    console.log('步骤1：设置黑名单为["black-path"]');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["black-path"]'`);

    // 步骤2：等待几秒后验证黑名单配置
    console.log('步骤2：等待并验证黑名单配置');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const getResult = await system.exec('dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths');
    console.log('黑名单配置:', getResult.stdout);

    // 断言1：检查dde-dconfig get的返回值
    const cleanResult = getResult.stdout.trim().replace(/\s/g, '');
    if (!cleanResult.includes('"black-path"')) {
      console.log('断言1失败：黑名单配置不包含black-path');
      throw new Error(`黑名单配置应包含 "black-path"，实际为: ${getResult.stdout.trim()}`);
    }
    console.log('断言1通过：黑名单配置正确');

    // 步骤3：终端输入命令重启deepin-anything-server服务
    console.log('步骤3：重启deepin-anything-server服务');
    await system.exec(`echo ${passwd} | sudo -S systemctl restart deepin-anything-server.service`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 步骤4：打开文管，搜索black-path
    console.log('步骤4：打开文件管理器，搜索black-path');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('black-path');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言2：无法搜索出文件
    console.log('断言2：验证无法搜索出black-path文件');
    await agent.aiAssert('仅检查文件名称，搜索结果中没有名称为black-path.txt的文件');
    console.log('断言2通过：成功验证重启服务后黑名单生效，无法搜索出文件');

  }, { timeout: 600000, tags: ['1973137', 'level3', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
