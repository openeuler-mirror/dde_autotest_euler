/**
 * 用例 PMSID: 1808251
 * 用例标题: 桌面刷新优化-快捷键-桌面空白处点击右键【刷新】按钮刷新桌面
 * 生成时间: 2026-01-21 16:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1808251-桌面刷新优化-快捷键-桌面空白处点击右键【刷新】按钮刷新桌面', () => {
  const count = 3;

  const test_file_pre = "testfile_";
  const test_file_count = 10;
  const test_file_suffix = '.txt';
  const work_dir = "~/Desktop/";

  const bak_dir = "~/bak";

  const desktop_files = [
    "dde-computer.desktop",
    "deepin-tooltips.desktop",
    "uos-service-support.desktop",
    "dde-trash.desktop",
    "dde-home.desktop",
  ];

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 隐藏桌面图标
    console.log('隐藏桌面图标');
    await system.exec(`mkdir -pv ${bak_dir}`);
    for (let i = 0; i < desktop_files.length; i++) {
      let file = desktop_files[i];
      await system.exec(`mv ~/Desktop/${file} ${bak_dir}/${file}`);
    };
    // 备份桌面其它文件
    await system.exec(`mv ~/Desktop/* ${bak_dir}`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备工作: 创建测试文件${test_pre}1~${file_count}文件
    console.log('准备工作: 创建测试文件');
    for (let i = 0; i < test_file_count; i++) {
      await system.exec(`yes "Hello World!!!" | head -n 10 > ${work_dir}${test_file_pre}${i}${test_file_suffix}`);
    }
    await agent.aiWaitFor(`桌面上有${test_file_count}个文件`);

    // 准备工作: 关闭可能有的右键菜单
    console.log('准备工作: 关闭可能有的右键菜单');
    await agent.aiTap("桌面任意空白处");
    await agent.aiWaitFor("没有选中桌面上任何文件或文件夹", 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
  });

  test('1808251-桌面刷新优化-快捷键-桌面空白处点击右键【刷新】按钮刷新桌面', async ({ device, agent, uos, system }) => {
    // 步骤 1: 右击桌面空白处, 点击刷新
    console.log('步骤 1: 右击桌面空白处, 点击刷新');
    await agent.aiRightClick('桌面空白处');
    await agent.aiTap('刷新');

    // 预期 1: 桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常
    console.log('预期 1: 桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');
    await agent.aiAssert('桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');

    // 步骤 2: 选中文件/文件夹后, 右击桌面空白处, 点击刷新
    console.log('步骤 2: 选中文件/文件夹后, 右击桌面空白处, 点击刷新');
    await device.pressKey('Ctrl', 'A');
    await agent.aiWaitFor(`桌面上所有文件被选中`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 1000
      }
    );
    await agent.aiRightClick('桌面空白处');
    await agent.aiTap('刷新');

    // 预期 2: 桌面刷新, 没有文件和文件夹被选中, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常
    console.log('预期 2: 桌面刷新, 没有文件和文件夹被选中, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');
    await agent.aiAssert('桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');
    await agent.aiAssert('没有文件和文件夹被选中');

    // 步骤 3: 多次刷新桌面, 确保刷新无异常
    console.log(`步骤 3: 连续${count}次刷新桌面, 确保刷新无异常`);
    for (let i = 0; i < count; i++) {
      await agent.aiRightClick('桌面空白处');
      await agent.aiTap('刷新');
    }

    // 预期 3: 桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常
    console.log('预期 3: 桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');
    await agent.aiAssert('桌面刷新, 桌面文件/文件夹图标、名称、数量、缩略图均正常刷新无异常');

  }, { timeout: 600000, tags: ['1808251', 'level2', 'smoke', 'DITT', 'youwei', 'desktop', 'refresh'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件
    console.log('删除测试文件');
    for (let i = 0; i < test_file_count; i++) {
      await system.exec(`test -f ${work_dir}${test_file_pre}${i}${test_file_suffix} && rm ${work_dir}${test_file_pre}${i}${test_file_suffix} || true`);
    };

    // 删除设置并关闭文件管理器
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();

    // 恢复测试前隐藏的文件
    console.log('恢复测试前隐藏的文件');
    for (const file of desktop_files) {
      await system.exec(`mv ${bak_dir}/${file} ~/Desktop/${file}`);
    };
    // 恢复其它文件
    await system.exec(`mv ${bak_dir}/* ~/Desktop/`)
    await system.exec(`rmdir ${bak_dir}`);

    // 清理可能未关闭的右键菜单
    await agent.aiTap("桌面任意空白处");
    await agent.aiWaitFor("没有选中桌面上任何文件或文件夹");
  });
});
