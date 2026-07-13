
/**
 * 用例 PMSID: 1806391
 * 用例标题: 文管选择窗-记录排序方式
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806391-文管选择窗-记录排序方式', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806391-文管选择窗-记录排序方式', async ({ device, agent, uos, system }) => {
    await system.exec(`mkdir ~/Downloads/hu123`, 500);
    //创建5个文件夹
    for (let i = 5; i > 0; i--) {
      await system.exec(`dd if=/dev/zero of=/home/$USER/Downloads/hu123/1806391${i} bs=1M count=${i}`, 500);
  
    }
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+o');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏下载');
    await agent.aiDoubleClick('hu123');
    await agent.aiTap('文件管理器选择窗口右上角的列表视图按钮', { deepThink: true });
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('排序方式');

    //判断排列方式，根据判断结果执行下一步操作
    const result = await agent.aiBoolean('二级菜单已勾选名称');
    let result1 = 0;
    if (result) {
        console.log('已勾选名称排序，切换大小排序');
        await device.pressKey('Down');
        await device.pressKey('Down');
        await device.pressKey('Down');
        await device.pressKey('Enter');
        //切换大小排序为从大到小
        await agent.aiRightClick('文管窗口内空白处');
        await agent.aiTap('排序方式');
        await device.pressKey('Down');
        await device.pressKey('Down');
        await device.pressKey('Down');
        await device.pressKey('Enter');
        await agent.aiAssert('文管窗口内文件18063911排在文件列表最下面');
        console.log('修改result1值为1');
        result1 = 1;
    } else {
        console.log('未勾选名称排序，点击勾选名称排序');
        await device.pressKey('Down');
        await device.pressKey('Enter');
        await agent.aiAssert('文管窗口内文件18063911排在文件列表最上面');
    }
    //关闭文管选择弹框
    await agent.aiTap('文管选择窗口下方取消按钮');
    //重新打开文管选择弹框
    await device.pressKey('Ctrl+o');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏下载');
    await agent.aiDoubleClick('hu123');
    await agent.aiTap('文件管理器选择窗口右上角的列表视图按钮', { deepThink: true });

    console.log('开始确认第二次打开弹框打开保持之前排序选项',`result1的值为：${result1}`);  
    if(result1 == 1){
      await agent.aiAssert('文管窗口内文件18063911排在文件列表最下面');
    }else{
      await agent.aiAssert('文管窗口内文件18063911排在文件列表最上面');
    }
    await system.exec('killall dde-file-dialog & killall deepin-editor', 500);
  }, { timeout: 600000, tags: ['1806391', 'level4', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Downloads/hu123`, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
