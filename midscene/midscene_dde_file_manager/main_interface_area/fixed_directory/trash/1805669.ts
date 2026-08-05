/**
 * 用例 PMSID: 1805669
 * 用例标题:  [t]页面检查-回收站勾选/取消勾选表头显示正确
 * 生成时间: 2026-03-09 15:09:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 根据要求重新编写，实现回收站表头显示功能测试
 */

describe('1805669- [t]页面检查-回收站勾选/取消勾选表头显示正确', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805669- [t]页面检查-回收站勾选/取消勾选表头显示正确', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器，点击左侧导航栏回收站目录，在中间空白区域鼠标右键点击显示方式，点击列表视图
    console.log('步骤2：打开文件管理器并切换到回收站列表视图');
    await uos.openApp("文件管理器");

    // 步骤2：通过命令在桌面创建1805669文件夹，并通过键盘del键删除1805669文件夹
    console.log('步骤1：在桌面创建并删除1805669文件夹');
    await system.exec('mkdir -p ~/Desktop/1805669');
    await agent.aiTap('左侧导航栏桌面目录');
    await agent.aiTap('1805669文件夹');
    await device.pressKey("Delete");
    await agent.aiAssert('桌面目录不存在1805669文件夹');
    
    // 点击左侧导航栏回收站目录
    await agent.aiTap('左侧导航栏回收站目录');
    await agent.aiWaitFor('回收站目录显示1805669文件夹');
    
    // 在中间空白区域右键点击显示方式
    await agent.aiTap('1805669文件夹下的中间空白区域');
    await agent.aiRightClick('1805669文件夹下的中间空白区域');
    await agent.aiWaitFor('右键菜单已显示');
    
    // 点击显示方式
    await agent.aiTap('显示方式');
    
    // 点击列表视图
    await agent.aiTap('列表视图');
    await agent.aiAssert('文件管理器右上角第二行第二个图标显示高亮');
    
    // 步骤3：检查列表头显示，默认显示5项：名称、原始路径、删除时间、大小、类型
    console.log('步骤3：检查默认列表头显示');
    await agent.aiAssert('列表头默认显示名称、原始路径、删除时间、大小、类型共5项');
    
    // 步骤4：右键单击表头--取消勾选原始路径/删除时间/大小/类型，全部被取消，只有名称无法被取消
    console.log('步骤4：取消勾选表头项');
    
    // 右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 取消勾选原始路径
    await agent.aiTap('原始路径', 500);
    await agent.aiAssert('列表头显示名称、删除时间、大小、类型共4项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 取消勾选删除时间
    await agent.aiTap('删除时间', 500);
    await agent.aiAssert('列表头显示名称、大小、类型共3项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 取消勾选大小
    await agent.aiTap('大小', 500);
    await agent.aiAssert('列表头显示名称、类型共2项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 取消勾选类型
    await agent.aiTap('类型', 500);
    await agent.aiAssert('列表头仅显示名称');
    
    // 验证只有名称无法被取消
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    await agent.aiAssert('表头右键菜单中不显示名称选项');
    await device.pressKey("Escape");
    
    // 步骤5：右键单击表头，重新勾选原始路径/删除时间/大小/类型，重新显示原始路径、删除时间、大小、类型
    console.log('步骤5：重新勾选表头项');
    
    // 右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 重新勾选原始路径
    await agent.aiTap('原始路径', 500);
    await agent.aiAssert('列表头显示名称、原始路径共2项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 重新勾选删除时间
    await agent.aiTap('删除时间', 500);
    await agent.aiAssert('列表头显示名称、原始路径、删除时间共3项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 重新勾选大小
    await agent.aiTap('大小', 500);
    await agent.aiAssert('列表头显示名称、原始路径、删除时间、大小共4项');
    
    // 再次右键单击表头区域
    await agent.aiRightClick('表头区域');
    await agent.aiWaitFor('表头右键菜单已显示');
    
    // 重新勾选类型
    await agent.aiTap('类型', 500);
    await agent.aiAssert('列表头显示名称、原始路径、删除时间、大小、类型共5项');

  }, { timeout: 1800000, tags: ["1805669", "level2", "trash", "liqingling"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm -rf ~/Desktop/1805669');
    // 清空回收站
    await system.exec('rm -rf ~/.local/share/Trash/*');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    // 恢复文件管理器设置
    await system.cleanupFileManager();

  });
});
