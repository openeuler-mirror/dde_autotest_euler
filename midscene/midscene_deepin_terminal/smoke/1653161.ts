/**
 
 * 用例 PMSID:1653161
 * 用例标题: 插入标签标题格式功能
 * 生成时间: 2026-04-24
 * 用例编写人: UT000211(陈依)
 */

describe('1653161-插入标签标题格式功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    let labelTitleFormatValue = '';
    const username = process.env.TEST_USERNAME;
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653161-插入标签标题格式功能', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端的设置菜单，记录标签标题格式的值，并关闭设置页面
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    
    // 打开设置菜单
    await agent.aiTap("终端的设置");
    await agent.aiTap("下拉列表设置");
    await agent.aiWaitFor("设置页面已显示");
    await agent.aiAssert("标签标题格式当前值为%w");
    
    // 关闭设置页面
    await agent.aiTap("设置页面关闭按钮");
    await agent.aiAssert("设置页面关闭")

    // 步骤 2: 打开终端，打开标签页的右键菜单，展示关闭标签页，关闭其他标签页，重命名标题
    // 终端应该已经打开，确保有标签页
    await agent.aiRightClick("终端标签页",{ deepThink: true } );
    await agent.aiWaitFor("标签页右键菜单已显示");
    // 验证菜单项存在（不需要点击，只需要展示）
    await agent.aiAssert("右键菜单存在关闭标签页");
    await agent.aiAssert("右键菜单存在关闭其他标签页");
    await agent.aiAssert("右键菜单存在重命名标题");

    // 步骤 3: 点击重命名标题，预期弹出重命名标签页弹框
    await agent.aiTap("重命名标题");
    await agent.aiWaitFor("重命名标签页弹框已显示");
    
    // 预期：标签标题格式输入框内容默认全选，标签标题格式的值与上一步骤记录的标签标题格式的值一致
    await agent.aiAssert("标签标题格式输入框的内容为选中状态");
    await agent.aiAssert("标签标题格式当前值为%w");
    await agent.aiTap("弹窗右上角关闭")
    await agent.aiAssert("重命名输入框关闭")
    // 注意：无法直接验证是否全选，但可以验证值是否正确



    // 步骤 4-6: 使用循环遍历不同的标签标题格式
    const formatOptions = [
      { value: "%n", expectedLabel: "bash" },
      { value: "%d", expectedLabel: "uos" }, 
      { value: "%D", expectedLabel: "~" },
      { value: "%#", expectedLabel: /\d+/ }, // 数字
      { value: "%u", expectedLabel: "${username}" }, // 从TEST_USERNAME获取，默认uos
      { value: "%h", expectedLabel: "${username}-PC" },
      { value: "%w", expectedLabel: "${username}@${username}-PC" }
    ];

    for (const option of formatOptions) {
      // 点击插入后方的倒三角
      await agent.aiRightClick("终端标签页");
      await agent.aiTap("重命名标题");
      await agent.aiWaitFor("重命名标签页弹框已显示");
      await agent.aiTap("插入倒三角按钮");
      await agent.aiWaitFor("插入选项菜单已显示");
      
      // 选中对应的格式选项
      await agent.aiTap(option.value, { deepThink: true });
      await agent.aiWaitFor("选项已选中");
      
      // 预期：标签标题格式输入框显示选择插入的格式
      await agent.aiAssert(`标签标题格式显示为${option.value}`);
      
      // 点击确定
      await agent.aiTap("确定按钮", { deepThink: true });
      await agent.aiWaitFor("重命名标签页弹框关闭");
      
      // 验证标签标题显示正确
      await agent.aiAssert(`终端标签页显示为${option.expectedLabel}`);
    }

    // 重复执行步骤4，遍历不同的标签标题格式，点击取消
    for (const option of formatOptions) {
      // 点击插入后方的倒三角
      await agent.aiRightClick("终端标签页");
      await agent.aiTap("重命名标题");
      await agent.aiWaitFor("重命名标签页弹框已显示");
      await agent.aiTap("插入倒三角按钮", { deepThink: true });
      await agent.aiWaitFor("插入选项菜单已显示");
      
      // 选中对应的格式选项
      await agent.aiTap(option.value, { deepThink: true });
      await agent.aiWaitFor("选项已选中");
      
      // 点击取消
      await agent.aiTap("取消按钮");
      await agent.aiWaitFor("重命名标签页弹框关闭");
      await agent.aiAssert("终端标签页显示为${TEST_USERNAME}@${TEST_USERNAME}-PC");
    }

    // 步骤 7: 点击标签标题格式后方的x按钮，点击确定，重命名的标签展示Terminal
    await agent.aiRightClick("终端标签页");
    await agent.aiTap("重命名标题");
    await agent.aiWaitFor("重命名标签页弹框已显示");
    await agent.aiTap("标签标题格式清除按钮"); // x按钮
    await agent.aiTap("确定按钮");
    await agent.aiWaitFor("重命名标签页弹框关闭");
    await agent.aiAssert("终端标签页显示为Terminal");
  }, { timeout: 1800000, tags: ['1653161', 'level2', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("终端标签页");
    await agent.aiWaitFor("标签页右键菜单已显示");
    await agent.aiTap("重命名标题");
    await agent.aiWaitFor("重命名标签页弹框已显示");
    
    await agent.aiTap("插入倒三角按钮");
    await agent.aiWaitFor("插入选项菜单已显示");
    await agent.aiTap("shell设定的窗口标题：%w");
    await agent.aiWaitFor("选项已选中");
    await agent.aiTap("确定按钮");
    await agent.aiWaitFor("重命名标签页弹框关闭");
    
    // 验证标签显示为uos@uos-PC
    await agent.aiAssert("终端标签页显示为${TEST_USERNAME}@${TEST_USERNAME}-PC");
    
    // 最终清理：关闭终端
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
