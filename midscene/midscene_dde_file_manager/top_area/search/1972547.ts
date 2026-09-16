/**
 * 用例 PMSID: 1972547
 * 用例标题: 【搜索】【黑名单配置】删除已配置的绝对路径黑名单
 * 生成时间: 2026-05-13 14:40:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const homeBlackPath = `/home/${username}/black-path`;
const desktopBlackPath = `/home/${username}/Desktop/black-path`;

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${homeBlackPath}`);
    await system.exec(`rm -rf ${desktopBlackPath}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1972547-【搜索】【黑名单配置】删除已配置的绝对路径黑名单', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec(`mkdir -p ${homeBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${homeBlackPath}/black-path.txt`);
    await system.exec(`mkdir -p ${desktopBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${desktopBlackPath}/black-path.txt`);
  });

  test('1972547-【搜索】【黑名单配置】删除已配置的绝对路径黑名单', async ({ device, agent, uos, system }) => {
    // 步骤1：打开终端，输入命令设置黑名单为["black-path"]
    console.log('步骤1：设置黑名单为["black-path"]');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["black-path"]'`);

    // 步骤2：等待几秒钟，验证设置成功
    console.log('步骤2：验证黑名单设置成功');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result2 = await system.exec(`dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths`);
    
    // 断言1：检查dde-dconfig get的返回值为'["black-path"]'
    console.log('断言1：检查黑名单设置是否为["black-path"]');
    await agent.aiAssert(`黑名单配置返回值为'["black-path"]'，实际返回值: ${result2.stdout}`);
    console.log('断言1通过：成功验证黑名单设置为["black-path"]');

    // 步骤3：删除黑名单配置
    console.log('步骤3：删除黑名单配置，设置为空');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '[ ]'`);

    // 步骤4：等待几秒钟，验证删除成功
    console.log('步骤4：检查黑名单是否清空为默认配置');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result1 = await system.exec(`dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths`);
    
    // 断言2：检查黑名单已被删除为'[ ]'
    console.log('断言2：检查黑名单已被删除');
    const blacklistValue1 = result1.stdout.trim();
    console.log(`黑名单配置返回值: ${blacklistValue1}`);
    const normalizedValue = blacklistValue1.replace(/\s+/g, '').replace(/"/g, '');
    if (normalizedValue !== '[]') {
      throw new Error(`断言2失败：黑名单配置默认值应为空，实际返回值: ${blacklistValue1}`);
    }
    console.log('断言2通过：成功验证黑名单默认值为空');

    // 步骤5：打开文管，搜索black-path
    console.log('步骤5：打开文件管理器，搜索black-path');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('black-path');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言3：可以搜索出文件
    console.log('断言3：验证可以搜索出black-path文件');
    await agent.aiAssert('搜索结果中包含black-path文件夹或black-path.txt文件');
    console.log('断言3通过：成功验证黑名单删除后可以搜索出文件');

  }, { timeout: 600000, tags: ['1972547', 'level3', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
