/**
 * 用例 PMSID: 1805197
 * 用例标题: 文件和文件夹混合排序-列表视图，勾选"文件和文件夹混合排序"，修改排序方式，检查文件/文件夹排序规则
 * 生成时间: 2026-04-24
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805197-文件和文件夹混合排序-列表视图', () => {
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

    // 在视频目录创建测试文件和文件夹
    await system.exec('mkdir -p ~/Videos/folder1');
    await system.exec('mkdir -p ~/Videos/folder2');
    await system.exec('mkdir -p ~/Videos/测试文件夹B');
    await system.exec('mkdir -p ~/Videos/测试文件夹A');
    await system.exec('mkdir -p ~/Videos/测试文件夹B');
    await system.exec('mkdir -p ~/Videos/测试文件夹C');
    await system.exec('touch ~/Videos/测试文件1.txt');
    await system.exec('touch ~/Videos/测试文件2.mp4');
    await system.exec('touch ~/Videos/测试文件3.pdf');

    // 设置不同的修改时间
    await system.exec('touch -t 202312311809 ~/Videos/测试文件1.txt');
    await system.exec('echo "这是测试文本文件的内容" > ~/Videos/测试文件1.txt');
    await system.exec('touch -t 202501012356 ~/Videos/测试文件2.mp4');
    await system.exec('touch -t 202602052114 ~/Videos/测试文件3.pdf');
    await system.exec('echo "这是测试PDF文件的内容" > ~/Videos/测试文件3.pdf');
    await system.exec('touch -t 202401151200 ~/Videos/测试文件夹A');
    await system.exec('touch -t 202506201500 ~/Videos/测试文件夹B');
    await system.exec('touch -t 202310101000 ~/Videos/测试文件夹C');

    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    // 打开设置，勾选"文件和文件夹混合排序"
    await agent.aiTap("文件管理器右上角设置菜单");
    await agent.aiTap("弹窗设置选项");
    await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });

    // 找到并勾选"文件和文件夹混合排序"选项
    await agent.aiTap("文件和目录");

    // 判断是否已经勾选
    const isChecked = await agent.aiBoolean("文件和文件夹混合排序选项已勾选", { timeout: 5000 });

    if (!isChecked) {
      // 未勾选 → 执行勾选
      await agent.aiTap("文件和文件夹混合排序前的勾选框");
      await agent.aiWaitFor("文件和文件夹混合排序选项已勾选", { timeout: 5000 });
      console.log("已成功勾选 文件和文件夹混合排序选项");
    } else {
      // 已勾选 → 不操作，打印日志
      console.log("文件和文件夹混合排序选项已勾选");
    }

    // 关闭设置
    await agent.aiTap("设置窗口右上角的关闭按钮(X)");

    await agent.aiWaitFor("设置窗口已关闭", { timeout: 5000 });

    console.log('===== 步骤1: 打开文管，点击侧边栏"视频"，按名称排序 =====');
  });

  test('1805197-文件和文件夹混合排序-列表视图', async ({ device, agent, uos, system }) => {
    console.log('===== 前置条件准备：勾选"文件和文件夹混合排序"，切换到列表视图 =====');

    // 点击侧边栏"视频"
    await agent.aiTap("侧边栏中的视频目录");
    await agent.aiWaitFor("视频目录已打开", { timeout: 10000 });

    // 切换到列表视图
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的显示方式");
    await agent.aiWaitFor("显示方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("显示方式子菜单中的列表视图");
    await agent.aiWaitFor("窗口内容已切换为列表视图显示", { timeout: 5000, deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    // 修改排序方式为修改时间
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("排序方式子菜单中的修改时间");
    await agent.aiWaitFor("窗口内容已按修改时间排序，文件列表表头的排序箭头位于修改时间文字右边", { timeout: 5000, deepThink: true });
    await agent.aiTap("文件列表区域空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 预期：文管内按照修改时间顺序，文件和文件夹混合排序
    const timeSortCheck = await agent.aiBoolean("文件列表按修改时间顺序排列，文件和文件夹混合排序", { deepThink: true });
    if (!timeSortCheck) {
      throw new Error('修改时间排序验证失败：文件和文件夹未正确混合排序');
    }
    console.log('✅ 步骤2验证通过：按修改时间顺序，文件和文件夹混合排序');

    console.log('===== 步骤3: 修改排序方式为大小 =====');

    // 修改排序方式为大小
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("排序方式子菜单中的大小");

    await agent.aiWaitFor("窗口内容已按大小排序，文件列表表头的排序箭头位于大小文字右边、类型文字左边", { timeout: 5000, deepThink: true });
    await agent.aiTap("文件列表区域空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 修改排序方式为类型
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("排序方式子菜单中的类型");
    await agent.aiWaitFor("窗口内容已按类型排序，文件列表表头的排序箭头位于类型文字右边", { timeout: 5000, deepThink: true });
    await agent.aiTap("文件列表区域空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 修改排序方式为名称
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("排序方式子菜单中的名称");
    await agent.aiWaitFor("窗口内容已按名称排序，文件列表表头的排序箭头位于名称文字右边", { timeout: 5000, deepThink: true });
    await agent.aiTap("文件列表区域空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 预期：文管内按照名称顺序，文件和文件夹混合排序
    const nameSortCheck = await agent.aiBoolean("文件列表按名称顺序排列，文件和文件夹混合排序", { deepThink: true });
    if (!nameSortCheck) {
      throw new Error('名称排序验证失败：文件和文件夹未正确混合排序');
    }
    console.log('✅ 步骤1验证通过：按名称顺序，文件和文件夹混合排序');

    console.log('===== 步骤2: 修改排序方式为修改时间 =====');

  }, { timeout: 1200000, tags: ['1805197', 'level2', 'smoke', 'view_tab', 'sort', 'mixed-sort', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除视频目录中的测试文件和文件夹
    try {
      await system.exec('rm -rf ~/Videos/folder1'); 
      await system.exec('rm -rf ~/Videos/folder2');
      await system.exec('rm -rf ~/Videos/测试文件夹A');
      await system.exec('rm -rf ~/Videos/测试文件夹B');
      await system.exec('rm -rf ~/Videos/测试文件夹C');
      await system.exec('rm -f ~/Videos/测试文件1.txt');
      await system.exec('rm -f ~/Videos/测试文件2.mp4');
      await system.exec('rm -f ~/Videos/测试文件3.pdf');
    } catch (err) {
      console.warn('删除测试文件失败:', err.message);
    }

    // 关闭文件管理器窗口（如果存在）
    const isFileManagerOpen = await agent.aiBoolean("文件管理器窗口已打开", { deepThink: true });
    if (isFileManagerOpen) {
      // 打开设置，勾选"文件和文件夹混合排序"
      await agent.aiTap("文件管理器右上角设置菜单");
      await agent.aiTap("设置选项");
      await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });

      await agent.aiTap("文件和目录");

      // ✅ 判断是否已经勾选
      const isChecked = await agent.aiBoolean("文件和文件夹混合排序选项已勾选", { timeout: 5000 });

      if (!isChecked) {
        // ❌ 没勾选 → 才去取消勾选（其实就是勾选/切换）
        await agent.aiTap("文件和文件夹混合排序前的勾选框");
        await agent.aiWaitFor("文件和文件夹混合排序选项已取消勾选", { timeout: 5000 });
      }

      // ✅ 无论是否勾选，最后都关闭设置窗口
      await agent.aiTap("设置窗口右上角的关闭按钮(X)");
      await uos.closeCurrentWindow();
    }
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
