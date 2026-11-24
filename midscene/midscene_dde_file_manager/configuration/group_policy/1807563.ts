/**
 * 用例 PMSID: 1807563
 * 用例标题: 右键菜单整体隐藏，检查文件管理器保险箱窗口右键菜单情况
 * 生成时间: 2026-08-08 12:26:24
 * 用例编写人: UT002899（胡诗敏）
 */


const caseDir = process.env.TESTCASE_DIR;

describe('1807563-右键菜单整体隐藏，检查文件管理器保险箱窗口右键菜单情况', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });

  test('1807563-右键菜单整体隐藏，检查文件管理器保险箱窗口右键菜单情况', async ({ device, agent, uos, system, env }) => {
    //前置条件：在保险箱中创建文件
    await uos.openApp('文件管理器')
    await agent.aiTap('当前窗口左侧边栏的保险箱')
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Uos123!!","含有至少8位文字的输入框");
    await agent.aiTap("含有再次输入密码文字的输入框");
    await agent.aiInput("Uos123!!","含有再次输入密码文字的输入框");
    await agent.aiTap("下一步");
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("当前窗口左侧边栏的桌面");
    await agent.aiTap("保存");
    await agent.aiTap("下一步");
    await agent.aiTap("有加密保险箱文字的蓝色按钮");
    await agent.aiTap("含有请输入密码文字的输入框");
    await device.typeText(env.testPassword);
    await agent.aiTap("确定");
    try {
      await agent.aiWaitFor("有加密已完成文字",
        {
          timeoutMs: 60000,
          checkIntervalMs: 5000
        }
      );
    } catch (error) {
      console.log("创建保险箱失败");
      throw error;
    }
    await agent.aiTap("确定");
    await agent.aiRightClick('保险箱目录空白区域')
    await agent.aiTap('新建文件夹')
    await device.typeText('测试文件夹A', true)
    await agent.aiWaitFor('保险箱存在测试文件夹A')

    await agent.aiRightClick('保险箱目录空白区域')
    await agent.aiTap('新建文件夹')
    await device.typeText('测试文件夹B', true)
    await agent.aiWaitFor('保险箱存在测试文件夹B')

    await agent.aiRightClick('保险箱目录空白区域')
    await agent.aiTap('新建文档')
    await agent.aiTap('文本文档')
    await device.typeText('aaa', true)
    await agent.aiWaitFor('保险箱存在aaa.txt')

    await agent.aiRightClick('保险箱目录空白区域')
    await agent.aiTap('新建文档')
    await agent.aiTap('文本文档')
    await device.typeText('bbb', true)
    await agent.aiWaitFor('保险箱存在bbb.txt')

    // 前置条件： 设置组策略-隐藏右键菜单
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '["dde-file-manager", "org.deepin.dde-shell","dde-file-dialog","extension-menu"]'`);

    // 步骤 1：在文管保险箱窗口空白区域，单击右键
    console.log('步骤 1：在文管保险箱窗口空白区域，单击右键')
    await agent.aiRightClick('保险箱目录空白区域', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 2：在文管保险箱窗口空白区域，使用alt+m唤起右键菜单
    console.log('步骤 2：在文管保险箱窗口空白区域，使用alt+m唤起右键菜单')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 3：在文管保险箱窗口选中单个文件，单击右键
    console.log('步骤 3：在文管保险箱窗口选中单个文件，单击右键')
    await agent.aiRightClick('aaa.txt', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 4：在文管保险箱窗口选中单个文件，使用alt+m唤起右键菜单
    console.log('步骤 4：在文管保险箱窗口选中单个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('保险箱目录空白区域')
    await agent.aiTap('aaa.txt')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 5：在文管保险箱窗口选中单个文件夹，单击右键
    console.log('步骤 5：在文管保险箱窗口选中单个文件夹，单击右键')
    await agent.aiTap('保险箱目录空白区域')
    await agent.aiRightClick('测试文件夹A', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 6：在文管保险箱窗口选中单个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 6：在文管保险箱窗口选中单个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('保险箱目录空白区域')
    await agent.aiTap('测试文件夹A')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 7：在文管保险箱窗口选中多个文件，单击右键
    console.log('步骤 7：在文管保险箱窗口选中多个文件，单击右键')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await device.keyUp('ctrl')
    await agent.aiRightClick('aaa.txt')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 8：在文管保险箱窗口选中多个文件，使用alt+m唤起右键菜单
    console.log('步骤 8：在文管保险箱窗口选中多个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 9：在文管保险箱窗口选中多个文件夹，单击右键
    console.log('步骤 9：在文管保险箱窗口选中多个文件夹，单击右键')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('测试文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 10：在文管保险箱窗口选中多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 10：在文管保险箱窗口选中多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 11：在文管回保险箱窗口选择对话框内选中多个文件+多个文件夹，单击右键
    console.log('步骤 11：在文管保险箱窗口选中多个文件+多个文件夹，单击右键')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('测试文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 12：在文管保险箱窗口选中多个文件+多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 12：在文管保险箱窗口选中多个文件+多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('保险箱目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    //删除保险箱
    await agent.aiRightClick('当前窗口左侧边栏的保险箱')
    await agent.aiTap('删除保险箱')
    await agent.aiTap("含有密码的输入框");
    await device.typeText('Uos123!!', true)
    await device.typeText(env.testPassword, true);
    await agent.aiWaitFor('存在删除成功的文案')
    await agent.aiTap("确定按钮");
    await system.exec(`killall dde-file-maneger`)

  }, {
    timeout: 1200000, tags: ['1807563', 'level3', 'group_policy', 'hushimin']
  });

  afterEach(async ({ agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理环境
    await system.exec("rm -rf ~/Desktop/recoveryKey.key");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '[]'`);
  });
});