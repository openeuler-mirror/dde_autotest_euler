/**
 * 用例 PMSID: 1807685
 * 用例标题: 检查文管-列表模式-留白处右键菜单
 * 生成时间: 2026-04-24
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1807685-检查文管-列表模式-留白处右键菜单', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);

    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    // 打开设置菜单
    await agent.aiTap("文件管理器右上角有三条横线的设置菜单按钮");
    await agent.aiWaitFor("菜单弹窗已打开", { timeout: 10000 });
    await agent.aiTap("弹窗设置选项");
    await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });
    // 进入 搜索 设置项
    await agent.aiTap("视图");

    // ✅ 使用 aiBoolean 判断 全文搜索 是否已经勾选
    const isFullTextChecked = await agent.aiBoolean("默认视图为列表视图", { timeout: 5000 });

    if (!isFullTextChecked) {
      // 未勾选 → 点击勾选
      await agent.aiTap("默认视图下拉框");
      await agent.aiTap("列表视图");
      await agent.aiWaitFor("默认视图显示为列表视图", { timeout: 5000 });
      console.log("已成功切换默认视图");
    } else {
      // 已勾选 → 不操作
      console.log("默认视图未列表视图，无需操作");
    }

    // 关闭设置窗口
    await agent.aiTap("设置窗口关闭按钮");
  });

  test('1807685-检查文管-列表模式-留白处右键菜单', async ({ device, agent, uos, system }) => {
    console.log('===== 前置条件准备：确保各目录有2个以上文件 =====');

    // ===================== 1. 桌面目录创建测试文件 =====================
    await system.exec('touch ~/Desktop/桌面目录测试文件1.txt');
    await system.exec('touch ~/Desktop/桌面目录测试文件2.txt');
    await system.exec('touch ~/Desktop/桌面目录测试文件3.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    // ===================== 2. 文档目录创建测试文件 =====================
    await system.exec('touch ~/Documents/文档测试文件1.txt');
    await system.exec('touch ~/Documents/文档测试文件2.txt');
    await system.exec('touch ~/Documents/文档测试文件3.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    // ===================== 3. 主目录创建测试文件 =====================
    await system.exec('touch ~/主目录测试文件1.txt');
    await system.exec('touch ~/主目录测试文件2.txt');
    await system.exec('touch ~/主目录测试文件3.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    // ===================== 4. 回收站创建测试文件 =====================
    await system.exec(`touch ~/.local/share/Trash/files/回收站测试文件1.txt`);
    await system.exec(`touch ~/.local/share/Trash/files/回收站测试文件2.txt`);
    await system.exec(`touch ~/.local/share/Trash/files/回收站测试文件3.txt`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    // ===================== 5. 系统盘目录创建测试文件 =====================
    const sudoPwd = process.env.TEST_PASSWORD; // 从环境变量读取
    console.log(sudoPwd);

    await system.exec(`echo '${sudoPwd}' | sudo touch /系统盘测试文件1.txt`);
    await system.exec(`echo '${sudoPwd}' | sudo touch /系统盘测试文件2.txt`);
    await system.exec(`echo '${sudoPwd}' | sudo touch /系统盘测试文件3.txt`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    console.log('===== 步骤1: 最近使用目录，文件留白处右键 =====');
    await agent.aiTap("侧边栏中的主目录");
    await agent.aiWaitFor("主目录已打开", { timeout: 10000 });

    // 在文件留白处右键
    await agent.aiTap("文件列表区域空白处");
    await agent.aiRightClick("列表视图中文件名后的空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiAssert("右键菜单已弹出，包含显示方式、排序方式、全选等选项");
    await device.pressKey("ESC");
    await agent.aiWaitFor("右键菜单已消失", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ 步骤1验证通过：最近使用目录留白处右键菜单功能可用');

    console.log('===== 步骤2: 桌面目录，文件留白处右键 =====');
    await agent.aiTap("侧边栏中的桌面目录");
    await agent.aiWaitFor("桌面目录已打开", { timeout: 10000 });

    // 在文件留白处右键
    await agent.aiTap("文件列表区域空白处");
    await agent.aiRightClick("列表视图中文件名后的空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiAssert("右键菜单已弹出，包含显示方式、排序方式、全选等选项");
    await device.pressKey("ESC");
    await agent.aiWaitFor("右键菜单已消失", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ 步骤2验证通过：主目录留白处右键菜单功能可用');

    console.log('===== 步骤3: 一般目录（文档），文件留白处右键 =====');
    await agent.aiTap("侧边栏中的文档目录");
    await agent.aiWaitFor("文档目录已打开", { timeout: 10000 });

    // 在文件留白处右键
    await agent.aiTap("文件列表区域空白处");
    await agent.aiRightClick("列表视图中文件名后的空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiAssert("右键菜单已弹出，包含显示方式、排序方式、全选等选项");
    await device.pressKey("ESC");
    await agent.aiWaitFor("右键菜单已消失", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ 步骤3验证通过：桌面目录留白处右键菜单功能可用');

    console.log('===== 步骤4: 回收站，文件留白处右键 =====');
    await agent.aiTap("侧边栏中的回收站");
    await agent.aiWaitFor("回收站已打开", { timeout: 10000 });

    // 在文件留白处右键
    await agent.aiTap("文件列表区域空白处");
    await agent.aiRightClick("列表视图中文件名后的空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiAssert("右键菜单已弹出，包含全部还原、显示方式、排序方式等选项");
    await device.pressKey("ESC");
    await agent.aiWaitFor("右键菜单已消失", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ 步骤4验证通过：回收站留白处右键菜单功能可用');

    console.log('===== 步骤5: 系统盘目录，文件留白处右键 =====');
    await agent.aiTap("侧边栏中的系统盘");
    await agent.aiWaitFor("系统盘目录已打开", { timeout: 10000 });

    // 在文件留白处右键
    await agent.aiTap("文件列表区域空白处");
    await agent.aiRightClick("列表视图中文件名后的空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiAssert("右键菜单已弹出，包含显示方式、排序方式、全选等选项");
    await device.pressKey("ESC");
    await agent.aiWaitFor("右键菜单已消失", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('✅ 步骤5验证通过：系统盘目录留白处右键菜单功能可用');

  }, { timeout: 1000000, tags: ['1807685', 'level2', 'smoke', 'view_tab', 'list-view', 'context-menu', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件
    try {
      // ===================== ✅ 最后：统一清理所有测试文件 =====================
      console.log("开始清理所有测试文件...");
      await system.exec('rm -f ~/Desktop/桌面目录测试文件*.txt');
      await system.exec('rm -f ~/Documents/文档测试文件*.txt');
      await system.exec('rm -f ~/主目录测试文件*.txt');
      await system.exec('rm -rf ~/.local/share/Trash/files/回收站测试文件*.txt');
      await system.exec('rm -f ~/回收站测试文件*.txt');
      await system.exec('sudo rm -f /系统盘测试文件*.txt');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("所有测试文件清理完成 ✅");

    } catch (err) {
      console.warn('删除测试文件失败:', err.message);
    }
    // 打开设置菜单
    await agent.aiTap("文件管理器右上角有三条横线的设置菜单按钮");
    await agent.aiWaitFor("菜单弹窗已打开", { timeout: 10000 });
    await agent.aiTap("弹窗设置选项");
    await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });
    // 进入 搜索 设置项
    await agent.aiTap("视图");

    // ✅ 使用 aiBoolean 判断 全文搜索 是否已经勾选
    const isFullTextChecked = await agent.aiBoolean("默认视图为图标视图", { timeout: 5000 });

    if (!isFullTextChecked) {
      // 未勾选 → 点击勾选
      await agent.aiTap("默认视图下拉框");
      await agent.aiTap("图标视图");
      await agent.aiWaitFor("默认视图显示为图标视图", { timeout: 5000 });
      console.log("已成功切换默认视图");
    } else {
      // 已勾选 → 不操作
      console.log("默认视图为图标视图，无需操作");
    }

    // 关闭设置窗口
    await agent.aiTap("设置窗口关闭按钮");
    // 关闭文件管理器窗口
    try {
      await uos.closeCurrentWindow();
    } catch (err) {
      console.warn('关闭文件管理器窗口失败:', err.message);
    }
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
