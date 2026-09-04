/**
 * 优化后的测试脚本
 * 用例 PMSID: 1805893
 * 用例标题: [t][core]右键菜单-回收站内空白处右键菜单功能正常
 * 生成时间: 2026-01-27 12:00:00
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1805893-[t][core]右键菜单-回收站内空白处右键菜单功能正常', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);

    //清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);

    // 备份文件管理器视图和排序配置文件
    await system.exec("cp ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak");

  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 新建1-2个文件至回收站
    for (let i = 1; i <= 2; i++) {
      await system.exec(`mkdir -p ~/Desktop/test${i}`);
      await system.exec(`gio trash ~/Desktop/test${i}`);
      await system.exec(`touch ~/Desktop/test${i}.txt`);
      await system.exec(`gio trash ~/Desktop/test${i}.txt`);
    }
  });

  test('1805893-[t][core]右键菜单-回收站内空白处右键菜单功能正常', async ({ device, agent, uos }) => {

    // 步骤1: 在启动器打开回收站，验证右键菜单项
    console.log('步骤1: 打开回收站并验证右键菜');
    await uos.openApp('回收站', 2000, 20000, true);
    await agent.aiWaitFor("回收站窗口已显示", { timeout: 10000 });
    await agent.aiRightClick("回收站窗口空白区域");
    await agent.aiWaitFor("右键菜单已显示", { timeout: 5000 });
    await agent.aiAssert("右键菜单包含全部还原、清空回收站、显示方式、排序方式、分组方式、属性选项");

    // 步骤2: 验证排序方式二级菜单和默认勾选状态
    console.log('步骤2: 验证排序方式二级菜单');
    await agent.aiHover("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式二级菜单已显示", { timeout: 5000 });
    await agent.aiAssert("排序方式二级菜单包含名称、原始路径选项");
    await agent.aiAssert("名称选项为勾选状态");
    await agent.aiTap("排序方式二级菜单中的名称");
    await agent.aiWaitFor("右键菜单关闭", { timeout: 3000 });

    // 步骤3: 验证窗口下拉箭头菜单和默认勾选状态
    console.log('步骤3: 验证窗口下拉箭头菜单');
    // 先悬停增加命中概率，延长悬停等待时间
    //await agent.aiHover("回收站窗口右上角的排序下拉箭头图标(↑↓∨图标)", { timeout: 3000 });
    // await agent.aiWaitFor(1000); // 延长等待时间，确保悬停生效

    // 简化点击描述，使用更通用的关键词
    await agent.aiTap("回收站窗口右上角的排序下拉箭头图标的最右侧位置(∨箭头中间位置)", { timeout: 3000 });

    // 等待下拉菜单出现，替换模糊的等待条件为具体描述
    await agent.aiWaitFor("排序下拉菜单已显示，包含名称、原始路径选项", { timeout: 8000 });

    await agent.aiAssert("排序菜单中名称选项为勾选状态");
    await agent.aiTap("回收站窗口空白区域关闭下拉菜单");

    // 步骤5: 切换到列表视图并验证字段显示
    console.log('步骤5: 切换到列表视图');
    await agent.aiRightClick("回收站窗口空白区域");
    await agent.aiWaitFor("右键菜单已显示", { timeout: 5000 });
    await agent.aiHover("右键菜单中的显示方式");
    await agent.aiWaitFor("显示方式二级菜单已显示", { timeout: 5000 });
    await agent.aiTap("显示方式二级菜单中的列表视图");
    await agent.aiWaitFor("回收站窗口切换为列表视图", { timeout: 5000 });
    await agent.aiAssert("列表视图显示名称、原始路径、删除时间、大小、类型列");

    // 步骤6: 按删除时间排序并验证文件顺序
    console.log('步骤6: 按删除时间排序');
    await agent.aiRightClick("回收站窗口空白区域");
    await agent.aiWaitFor("右键菜单已显示", { timeout: 5000 });
    await agent.aiHover("右键菜单中的排序方式");
    await agent.aiWaitFor("排序方式二级菜单已显示", { timeout: 5000 });
    await agent.aiTap("排序方式二级菜单中的删除时间");
    await agent.aiWaitFor("文件按删除时间排序完成", { timeout: 3000 });
    await agent.aiAssert("test1文件夹显示在列表第一行");

    // 步骤7: 测试文件还原功能
    console.log('步骤7: 测试文件还原功能');
    await agent.aiTap("列表中的test1文件夹");
    await agent.aiRightClick("列表中的test1文件夹", 2000);
    await agent.aiWaitFor("文件右键菜单已显示", { timeout: 5000 });
    await agent.aiTap("文件右键菜单中的还原选项");
    await agent.aiWaitFor("test1文件夹从回收站消失", { timeout: 5000 });
    await agent.aiAssert("回收站中不存在test1文件夹");

    // 步骤8: 测试回收站属性弹窗
    console.log('步骤8: 测试回收站属性弹窗');
    await agent.aiRightClick("回收站窗口空白区域");
    await agent.aiWaitFor("右键菜单已显示", { timeout: 5000 });
    await agent.aiTap("右键菜单中的属性选项");
    await agent.aiWaitFor("回收站属性窗口已打开", { timeout: 5000 });
    await agent.aiAssert("回收站属性弹窗包含'回收站''个项目''KB'关键字", 2000);;
    await agent.aiTap("属性窗口的关闭按钮(X)");

  }, { timeout: 600000, tags: ['1805893', 'level2', 'smoke', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('测试用例清理');
    await uos.closeCurrentWindow();
    console.log('回收站窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);
    // 恢复文件管理器视图和排序配置文件
    await system.exec("mv ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    //清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    await uos.showDesktop();
  });
});