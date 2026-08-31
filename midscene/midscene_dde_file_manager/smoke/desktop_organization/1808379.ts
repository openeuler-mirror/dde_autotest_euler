/**
 * 用例 PMSID: 1808379
 * 用例标题: [061][core]勾选自动排列-桌面添加文件/文件夹
 * 生成时间: 2026-01-28 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1808379-[061][core]勾选自动排列-桌面添加文件/文件夹', () => {
  let test_folder = "testdir_1808379";
  let test_file = "testfile_1808379.txt";
  const work_dir = "~/Videos/";
  const dest_dir = "~/Desktop/";

  const bak_dir = "~/bak/";

  const desktop_files = [
    "dde-computer.desktop",
    "deepin-tooltips.desktop",
    "uos-service-support.desktop",
    "dde-trash.desktop",
    "dde-home.desktop",
  ];

  const test_auxiliary_files = [
    "test_auxiliary_file_1808379_0.txt",
    "test_auxiliary_file_1808379_1.txt",
    "test_auxiliary_file_1808379_2.txt"
  ]

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 清空回收站
    await system.exec('gio trash --empty');

    // 勾选自动排列
    let result = await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v 1');

    // 重启桌面使设置生效
    await system.exec("ps aux |grep desktop | grep -v grep | grep xdg | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('桌面正常显示');

    // 准备步骤: 隐藏桌面图标
    console.log('准备步骤: 隐藏桌面图标');
    await system.exec(`mkdir -pv ${bak_dir}`);
    for (let i = 0; i < desktop_files.length; i++) {
      let file = desktop_files[i];
      await system.exec(`test -f ~/Desktop/${file} && mv ~/Desktop/${file} ${bak_dir}/${file}`);
    };

    // 准备步骤: 备份桌面其它文件
    console.log('准备步骤: 备份桌面其它文件');
    await system.exec(`mv ~/Desktop/* ${bak_dir}`);
    await agent.aiWaitFor('桌面上没有文件或者文件夹');

    // 准备步骤: 创建辅助文件
    console.log('准备步骤: 创建辅助文件');
    for (let i = 0; i < test_auxiliary_files.length; i++) {
      let file = test_auxiliary_files[i];
      await system.exec(`touch ~/Desktop/${file}`);
    };

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理测试文件
    await system.exec(`test -d ${work_dir}${test_folder} && rm -rf ${work_dir}${test_folder} || true`);
    await system.exec(`test -f ${work_dir}${test_file} && rm -rf ${work_dir}${test_file} || true`);

    await system.exec(`test -d ${dest_dir}${test_folder} && rm -rf ${dest_dir}${test_folder} || true`);
    await system.exec(`test -f ${dest_dir}${test_file} && rm -rf ${dest_dir}${test_file} || true`);
    await system.exec(`test -d ${dest_dir}新建文件夹 && rm -rf ${dest_dir}新建文件夹 || true`);

    // 创建测试文件和测试文件夹
    await system.exec(`mkdir -p ${work_dir}${test_folder}`);
    await system.exec(`touch ${work_dir}${test_file}`);
  });

  test('1808379-[062][core]勾选自动排列-桌面添加文件/文件夹-拖拽文件/文件夹到桌面', async ({ device, agent, uos, system }) => {
    // 步骤 1: 创建测试文件
    console.log(`创建测试文件${test_file}`);
    await system.exec(`touch ${dest_dir}${test_file}`);

    // 步骤 2: 删除测试文件
    console.log(`删除测试文件${test_file}到回收站`);
    await agent.aiRightClick(`桌面上的${test_file}文件`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('删除');
    await agent.aiWaitFor(`桌面上${test_file}文件已删除`);

    // 步骤 3: 以窗口模式打开回收站
    console.log('打开回收站');
    await system.exec("dde-file-manager trash://");
    await agent.aiWaitFor('文件管理器界面已显示, 并跳转到回收站');
    await agent.aiAssert(`回收站窗口有${test_file}文件`);

    // 步骤 4: 拖拽${test_file}文件到桌面
    console.log(`拖拽回收站窗口中${test_file}文件到桌面`);
    await device.pressKey('Super', 'Down');
    await agent.aiAction(`拖拽回收站窗口中的${test_file}文件到桌面空白处`);
    await agent.aiAssert(`回收站窗口没有${test_file}文件`);

    // 步骤 5: 关闭回收站窗口
    console.log('关闭回收站窗口');
    await agent.aiTap('回收站窗口');
    await system.exec("ps aux |grep dde-file-manager | grep -v daemon | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 预期 1: 默认显示在当前桌面图标末尾,对齐网格连续排列
    console.log('预期 1: 默认显示在当前桌面图标末尾,对齐网格连续排列');
    await agent.aiWaitFor(`${test_file}文件自动显示在当前桌面图标的最后`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`${test_file}文件自动显示在当前桌面图标最后`);

  }, { timeout: 600000, tags: ['1808379', 'level2', 'smoke', 'desktop', 'auto-arrange', 'drag'] });

  test('1808379-[061][core]勾选自动排列-桌面添加文件/文件夹-新建文件夹/文件', async ({ device, agent, uos, system }) => {
    // 步骤 1: 进入桌面-任意空白处右键-点击新建文件夹-查看桌面显示
    console.log('步骤 1: 右击桌面空白处, 新建文件夹');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('新建文件夹');

    // 预期 1: 对齐网格连续排列，不管在哪个位置新建，新建的文件/文件夹自动显示在当前桌面图标最后
    console.log('预期 1: 对齐网格连续排列，不管在哪个位置新建，新建的文件/文件夹自动显示在当前桌面图标最后');
    await agent.aiWaitFor('新建文件夹自动显示在当前桌面图标最后一列的最后',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert('新建文件夹自动显示在当前桌面图标最后');

  }, { timeout: 600000, tags: ['1808379', 'level2', 'smoke', 'desktop', 'auto-arrange', 'new folder'] });

  test('1808379-[061][core]勾选自动排列-桌面添加文件/文件夹-复制文件/文件夹到桌面', async ({ device, agent, uos, system }) => {
    // 步骤 1: 从其他目录，如视频-复制文件/文件夹-粘贴到桌面
    // 创建${test_folder}文件夹
    await system.exec(`mkdir -p ${work_dir}${test_folder}`);
    console.log('步骤 2: 从其他目录，如视频-复制文件/文件夹-粘贴到桌面');
    // 打开视频目录
    console.log('打开视频目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    // 最大化
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器跳转到视频目录');

    // 复制${test_folder}文件夹, 并关闭文件管理器
    console.log(`复制${test_folder}文件夹`);
    await agent.aiRightClick(`文件管理器内容窗口中的${test_folder}文件夹`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('复制');
    await system.exec("ps aux |grep dde-file-manager | grep -v daemon | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 粘贴${test_folder}文件夹到桌面
    console.log(`粘贴${test_folder}文件夹到桌面`);
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('粘贴');
    await agent.aiWaitFor(`桌面上出现${test_folder}文件夹`);

    // 预期 1: 默认显示在当前桌面图标末尾,对齐网格连续排列
    console.log('预期 2: 默认显示在当前桌面图标末尾,对齐网格连续排列');
    await agent.aiWaitFor(`${test_folder}文件自动显示在当前桌面图标的最后`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`${test_folder}文件夹自动显示在当前桌面图标最后`);

  }, { timeout: 600000, tags: ['1808379', 'level2', 'smoke', 'desktop', 'auto-arrange', 'copy', 'paste'] });

  test('1808379-[061][core]勾选自动排列-桌面添加文件/文件夹-剪切文件/文件夹到桌面', async ({ device, agent, uos, system }) => {
    // 步骤 1: 创建测试文件
    await system.exec(`touch ${work_dir}${test_file}`);

    // 步骤 2: 从其他目录，如视频-剪切文件/文件夹-粘贴到桌面
    // 打开视频目录
    console.log('打开视频目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    // 最大化
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器跳转到视频目录');

    // 剪切${test_file}文件, 并关闭文件管理器
    console.log(`剪切${test_file}文件`);
    await agent.aiRightClick(`右边窗口中的${test_file}文件`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('剪切');
    await system.exec("ps aux |grep dde-file-manager | grep -v daemon | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 粘贴${test_file}文件到桌面
    console.log(`粘贴${test_file}文件到桌面`);
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('粘贴');

    await agent.aiWaitFor(`桌面上出现${test_file}文件`);

    // 预期 1: 默认显示在当前桌面图标末尾,对齐网格连续排列
    console.log('预期 2: 默认显示在当前桌面图标末尾,对齐网格连续排列');
    await agent.aiWaitFor(`${test_file}文件自动显示在当前桌面图标的最后`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`${test_file}文件自动显示在当前桌面图标最后`);

  }, { timeout: 600000, tags: ['1808379', 'level2', 'smoke', 'desktop', 'auto-arrange', 'cut', 'paste'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除设置并关闭文件管理器
    console.log('清理步骤: 删除设置并关闭文件管理器');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 清理步骤: 清空回收站, 删除${test_file}文件
    console.log('清理步骤: 清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 清理测试文件
    console.log('清理测试文件');
    await system.exec(`test -d ${work_dir}${test_folder} && rm -rf ${work_dir}${test_folder} || true`);
    await system.exec(`test -f ${work_dir}${test_file} && rm -rf ${work_dir}${test_file} || true`);

    await system.exec(`test -d ${dest_dir}${test_folder} && rm -rf ${dest_dir}${test_folder} || true`);
    await system.exec(`test -f ${dest_dir}${test_file} && rm -rf ${dest_dir}${test_file} || true`);
    await system.exec(`test -d ${dest_dir}新建文件夹 && rm -rf ${dest_dir}新建文件夹 || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清空回收站
    await system.exec('gio trash --empty');

    // 删除辅助文件
    console.log('删除辅助文件');
    for (let i = 0; i < test_auxiliary_files.length; i++) {
      let file = test_auxiliary_files[i];
      await system.exec(`test -f ${bak_dir}/${file} && rm -rf ${bak_dir}/${file} || true`);
    };

    // 恢复测试前隐藏的文件
    console.log('恢复测试前隐藏的文件');
    for (const file of desktop_files) {
      await system.exec(`mv ${bak_dir}/${file} ~/Desktop/${file}`);
    };
    // 恢复其它文件
    await system.exec(`mv ${bak_dir}/* ~/Desktop/`)
    await system.exec(`rmdir ${bak_dir}`);

    // 取消勾选自动排列
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v 0");

    // 重启桌面使设置生效
    await system.exec("ps aux |grep desktop | grep -v grep | grep xdg | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('桌面正常显示');

    await uos.showDesktop();
  });
});
