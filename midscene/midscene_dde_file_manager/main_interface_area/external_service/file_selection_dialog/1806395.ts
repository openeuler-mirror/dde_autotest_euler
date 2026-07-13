
/**
 * 用例 PMSID: 1806395
 * 用例标题: 文管选择窗-右键菜单检查
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */


// @ts-nocheck
require("dotenv/config");

describe('1806395-文管选择窗-右键菜单检查', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806395-文管选择窗-右键菜单检查', async ({ device, agent, uos, system }) => {
    await system.exec(`mkdir ~/Downloads/1806395`, 500);
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+o');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏下载');
    await agent.aiDoubleClick('1806395上方文件夹图标');
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiAssert('显示右键菜单,并且粘贴选项文字颜色比其他选项文字颜色浅');
    // 新建文件夹
    await agent.aiTap('新建文件夹', true);
    await agent.aiAssert('文管窗口内多出1个文件夹名称为“新建文件夹”');
    // 新建文件txt
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('二级菜单中的文本文档');
    await agent.aiAssert('文管窗口内多出1个文件名称为“新建文本.txt”');
    // 新建文件pptx
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('二级菜单中的演示文档');
    await agent.aiAssert('文管窗口内多出1个文件名称为“演示文档.pptx”');

    // await agent.aiTap('文件管理器选择窗口右上角的列表视图按钮', { deepThink: true });
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('显示方式');

    //判断排列方式，根据判断结果执行下一步操作
    const result = await agent.aiBoolean('二级菜单已勾选图标视图');
    let result1 = 0;
    if (result) {
        console.log('已勾选图标视图，切换列表视图');
        await device.pressKey('Down');
        await device.pressKey('Down');
        await device.pressKey('Enter');
        await agent.aiAssert('文管窗口内文件显示为列表视图');
        console.log('修改result1值为1');
        result1 = 1;
    } else {
        console.log('未勾选图标视图，切换图标视图');
        await device.pressKey('Down');
        await device.pressKey('Enter');
        await agent.aiAssert('文管窗口内文件显示为图标视图');
    }

    console.log('开始确认排序选项情况',`result1的值为：${result1}`);  
    if(result1 == 1){
      await agent.aiRightClick('文管窗口内空白处');
      await agent.aiTap('排序方式');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Enter');
      console.log('改变排序方式');
      await agent.aiRightClick('文管窗口内空白处');
      await agent.aiTap('排序方式');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Enter');
      await agent.aiAssert('文管窗口内文件”演示文档.pptx“排在文件列表中间位置');
    }else{
      // 改变显示方式
      await agent.aiRightClick('文管窗口内空白处');
      await agent.aiTap('显示方式');
      console.log('未勾选图标视图，切换图标视图');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Enter');
      // 改变排序方式
      await agent.aiRightClick('文管窗口内空白处');
      await agent.aiTap('排序方式');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Enter');
      console.log('改变排序方式');
      await agent.aiRightClick('文管窗口内空白处');
      await agent.aiTap('排序方式');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Down');
      await device.pressKey('Enter');
      await agent.aiAssert('文管窗口内文件”演示文档.pptx“排在文件列表中间位置');
    }
    // 复制文件
    await agent.aiTap('新建文件夹');
    await agent.aiRightClick('新建文件夹');
    await agent.aiTap('复制');
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('粘贴');
    await agent.aiAssert('文管窗口内文件多出一个名称为”新建文件夹（副本）“的文件夹');

  }, { timeout: 1500000, tags: ['1806395', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Downloads/1806395`, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
