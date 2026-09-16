/**
 * 用例 PMSID: 1972333
 * 用例标题: 【搜索】【黑名单配置】在黑名单中的绝对路径下修改文件再搜索
 * 生成时间: 2026-04-30 10:00:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const homeBlackPath = `/home/${username}/black-path`;
const desktopBlackPath = `/home/${username}/Desktop/black-path`;
const desktopAbsolutePath = `/home/${username}/Desktop`;

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

describe('1972333-【搜索】【黑名单配置】在黑名单中的绝对路径下修改文件再搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["${desktopAbsolutePath}"]'`);
    // 等待几秒待配置生效
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec(`mkdir -p ${homeBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${homeBlackPath}/black-path.txt`);
    await system.exec(`mkdir -p ${desktopBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${desktopBlackPath}/black-path.txt`);
  });

  test('1972333-【搜索】【黑名单配置】在黑名单中的绝对路径下修改文件再搜索', async ({ device, agent, uos, system }) => {
    // 步骤1：在桌面black-path文件夹下新增black-path-1.txt文件
    console.log('步骤1：在桌面black-path文件夹下新增black-path-1.txt文件');
    await system.exec(`echo "测试搜索黑名单路径" > ${desktopBlackPath}/black-path-1.txt`);

    // 步骤2：等待几秒后打开文件管理器
    console.log('步骤2：等待几秒后打开文件管理器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");

    // 步骤3：在搜索框输入black-path-1.txt搜索
    console.log('步骤3：在搜索框输入black-path-1.txt搜索');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('black-path-1.txt');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言1：验证无法搜索到black-path-1.txt文件
    console.log('断言1：验证无法搜索到black-path-1.txt文件');
    await agent.aiAssert('搜索结果中不包含black-path-1.txt文件，或者有该文件但不是桌面路径');
    console.log('断言1通过：成功验证黑名单路径下的新增文件无法被搜索');

    // 步骤4：修改桌面black-path文件夹里的black-path.txt文件
    console.log('步骤4：修改桌面black-path文件夹里的black-path.txt文件');
    await system.exec(`echo "修改文件内容" > ${desktopBlackPath}/black-path.txt`);

    // 更新一次索引，使得搜索结果更准确（需要文管已开启）
    console.log('打开设置，更新索引');
    try {
      await device.pressKey('Esc');
      await agent.aiTap("文件管理器右上角菜单按钮");
      await agent.aiTap("设置");
      await agent.aiTap("左侧导航栏的搜索选项");
      await agent.aiTap("立即更新索引按钮");
      await agent.aiWaitFor("全文搜索下方提示索引更新完成", { timeoutMs: 60000 });
      await device.pressKey('Alt','F4');
      console.log('索引更新完成');
    } catch (err) {
      console.error('索引更新失败:', err);
    }

    // 步骤5：搜索文件内容"修改文件内容"
    console.log('步骤5：搜索文件内容"修改文件内容"');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.pressKey('Ctrl', 'a');
    await device.typeText('修改文件内容');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言2：验证无法搜索到black-path.txt文件
    console.log('断言2：验证无法搜索到black-path.txt文件');
    await agent.aiAssert('搜索结果中不包含black-path.txt文件，或者有该文件但不是桌面路径');
    console.log('断言2通过：成功验证黑名单路径下修改的文件无法被搜索出来');

  }, { timeout: 600000, tags: ['1972333', 'level3', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
