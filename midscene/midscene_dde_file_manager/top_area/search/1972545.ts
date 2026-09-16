/**
 * 用例 PMSID: 1972545
 * 用例标题: 【搜索】【黑名单配置】删除已配置的关键词黑名单
 * 生成时间: 2026-05-13 14:35:00
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

describe('1972545-【搜索】【黑名单配置】删除已配置的关键词黑名单', () => {
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

  test('1972545-【搜索】【黑名单配置】删除已配置的关键词黑名单', async ({ device, agent, uos, system }) => {
    // 步骤1：打开终端，输入命令设置黑名单为["black-path"]
    console.log('步骤1：设置黑名单为["black-path"]');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["black-path"]'`);

    // 步骤2：等待几秒钟，验证设置成功
    console.log('步骤2：验证黑名单设置成功');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const result1 = await system.exec(`dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths`);
    
    // 断言1：检查dde-dconfig get的返回值为'["black-path"]'
    console.log('断言1：检查黑名单设置是否为["black-path"]');
    await agent.aiAssert(`黑名单配置返回值为'["black-path"]'，实际返回值: ${result1.stdout}`);
    console.log('断言1通过：成功验证黑名单设置为["black-path"]');

    // 步骤3：修改黑名单为["abc-test"]
    console.log('步骤3：修改黑名单为["abc-test"]');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["abc-test"]'`);

    // 步骤4：等待几秒钟，验证修改成功
    console.log('步骤4：验证黑名单修改成功');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const result2 = await system.exec(`dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths`);
    
    // 断言2：检查dde-dconfig get的返回值为'["abc-test"]'
    console.log('断言2：检查黑名单修改是否为["abc-test"]');
    await agent.aiAssert(`黑名单配置返回值为'["abc-test"]'，实际返回值: ${result2.stdout}`);
    console.log('断言2通过：成功验证黑名单修改为["abc-test"]');

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
    console.log('断言3通过：成功验证黑名单修改后可以搜索出文件');

    // 步骤6：在桌面black-path文件夹下新增abc-new.txt文件
    console.log('步骤6：在桌面black-path文件夹下新增abc-new.txt文件');
    await system.exec(`echo "这是新增的文件" > ${desktopBlackPath}/abc-new.txt`);

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

    // 步骤7：搜索"这是新增的文件"
    console.log('步骤8：搜索"这是新增的文件"');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.pressKey('Ctrl', 'a');
    await device.typeText('这是新增的文件');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言3：可以搜索出来
    console.log('断言3：验证可以搜索出abc-new.txt文件');
    await agent.aiAssert('搜索结果中包含abc-new.txt文件');
    console.log('断言3通过：成功验证新增文件可以搜索');

  }, { timeout: 600000, tags: ['1972545', 'level3', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
