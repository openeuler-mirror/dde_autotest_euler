/**
 * 优化后的测试脚本
 * 用例 PMSID: 1805881
 * 用例标题: [080]右键菜单-回收站内文件夹下部分右键菜单灰显不可点击
 * 生成时间: 2026-01-27 12:00:00
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1805881-[080]右键菜单-回收站内文件夹下部分右键菜单灰显不可点击', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);

    //清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
  });

  test('1805881-[080]右键菜单-回收站内文件夹下部分右键菜单灰显不可点击', async ({ device, agent, uos, system, PCAgent }) => {

    // 步骤1: 使用命令创建、删除2个文件夹
    await system.exec(`mkdir -p ~/Desktop/folder`);
    console.log('步骤1: 使用命令创建、删除2个文件夹');
    for (let i = 1; i <= 2; i++) {
      await system.exec(`mkdir -p ~/Desktop/folder/folder${i}`);
    }
    await system.exec(`gio trash ~/Desktop/folder`);
    // 等待配置文件写入（预留5S，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 步骤2: 启动器打开回收站
    console.log('步骤2: 启动器打开回收站');
    await uos.openApp('回收站', 2000, 20000, true);
    await agent.aiWaitFor("回收站窗口已显示", { timeout: 10000 });

    // 步骤3: 右键点击回收站窗口空白区，弹出右键菜单
    console.log('步骤3: 右键点击回收站窗口空白区，验证右键菜单');
    await agent.aiDoubleClick("folder文件夹");
    await agent.aiRightClick("folder文件夹窗口空白区域");
    await agent.aiWaitFor(`右键菜单包含'全部还原''清空回收站''显示方式''排序方式''分组方式''属性(R)'`);
    // 验证全部还原和清空回收站不可点击：点击后菜单仍然显示，无响应
    console.log('抽验"全部还原"/"清空回收站"选项不可点击');
    await agent.aiTap("全部还原");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

    // 步骤4: 点击回收站窗口空白区
    console.log('步骤4: 点击回收站窗口空白区关闭右键菜单');
    await agent.aiTap("回收站窗口空白区域");

    // 步骤5: 右键点击窗口文件1，弹出右键菜单
    console.log('步骤5: 右键点击窗口文件1，验证右键菜单');
    await agent.aiTap("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiWaitFor(`右键菜单包含'打开(O)''在新窗口打开''还原''删除(D)''反选''剪切(T)''复制(C)''病毒查杀''属性(R)'选项`);
    // 验证还原、删除、剪切不可点击：点击后菜单仍然显示，无响应
    console.log('抽验证"还原"/"删除"/"剪切"选项不可点击');
    await agent.aiTap("删除(D)");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

    // 步骤6: 快捷ctrl+A,全选文件1、文件2，右键点击验证菜单
    console.log('步骤6: 全选文件1、文件2，右键点击验证菜单');
    await agent.aiTap("回收站窗口空白区域"); // 先点击空白区域取消选择
    await device.pressKey("Ctrl+A");// Ctrl+A全选
    await agent.aiRightClick("回收站窗口中的folder1文件夹");
    await agent.aiWaitFor(`右键菜单包含'打开(O)''还原''删除(D)''反选''剪切(T)''复制(C)''病毒查杀''属性(R)'选项`);
    // 验证还原、删除、剪切不可点击：点击后菜单仍然显示，无响应
    console.log('抽验证"还原"/"删除"/"剪切"选项不可点击');
    await agent.aiTap("还原");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

    // 步骤7: 点击回收站窗口空白区，命令清空回收站
    console.log('步骤7: 点击回收站窗口空白区，清空回收站');
    await agent.aiTap("回收站窗口空白区域");
    await agent.aiTap("回收站窗口'<'后退按钮");
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    await agent.aiWaitFor("回收站已清空", { timeout: 3000 });

    // 步骤8: 使用命令创建、删除2个文本文件
    console.log('步骤8: 使用命令创建、删除2个文本文件');
    await system.exec(`mkdir -p ~/Desktop/folder`);
    for (let i = 1; i <= 2; i++) {
      await system.exec(`touch ~/Desktop/folder/file${i}.txt`);
    }
    await system.exec(`gio trash ~/Desktop/folder`);

    // 等待配置文件写入（预留5S，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 步骤9: 右键点击窗口文件夹1，弹出右键菜单
    console.log('步骤9: 右键点击窗口文件1，验证右键菜单');
    await agent.aiDoubleClick("folder文件夹");
    await agent.aiRightClick("回收站窗口中的file1.txt");
    await agent.aiWaitFor(`右键菜单包含'还原''删除(D)''反选''剪切(T)''复制(C)''病毒查杀''属性(R)'选项`);
    // 验证还原、删除、剪切不可点击：点击后菜单仍然显示，无响应
    console.log('抽验证"还原"/"删除"/"剪切"选项不可点击');
    await agent.aiTap("剪切(T)");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

    // 步骤10: 点击回收站窗口空白区
    console.log('步骤10: 点击回收站窗口空白区关闭右键菜单');
    await agent.aiTap("回收站窗口空白区域");

    // 步骤11: 快捷ctrl+A,全选文件夹1、文件夹2，右键点击验证菜单
    console.log('步骤11: 全选文件1、文件2，右键点击验证菜单');
    await device.pressKey('Ctrl+A');// Ctrl+A全选
    await agent.aiRightClick("回收站窗口中的file1.txt");
    await agent.aiWaitFor(`右键菜单包含'还原''删除(D)''反选''剪切(T)''复制(C)''病毒查杀''属性(R)'选项`);
    // 验证还原、删除、剪切不可点击：点击后菜单仍然显示，无响应
    console.log('抽验证"还原"/"删除"/"剪切"选项不可点击');
    await agent.aiTap("还原");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

    // 步骤12: 点击回收站窗口空白区，命令清空回收站
    console.log('步骤12: 点击回收站窗口空白区，清空回收站');
    await agent.aiTap("回收站窗口空白区域");
    await agent.aiTap("回收站窗口'<'后退按钮");
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    await agent.aiWaitFor("回收站已清空", { timeout: 3000 });

    // 步骤13: 使用命令创建、删除2个文件夹、文本，全选后验证右键菜单
    console.log('步骤13: 创建混合类型文件，全选后验证右键菜单');
    await system.exec(`mkdir -p ~/Desktop/folder`);
     for (let i = 1; i <= 2; i++) {
      await system.exec(`mkdir -p ~/Desktop/folder/folder${i}`);
      await system.exec(`touch ~/Desktop/folder/file${i}.txt`);
    }
    await system.exec(`gio trash ~/Desktop/folder`);
    // 等待配置文件写入（预留5S，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("folder文件夹");
    await agent.aiWaitFor("folder文件夹被选中", { timeout: 3000 });
    await agent.aiDoubleClick("folder文件夹");
    
    await device.pressKey('Ctrl+A');// Ctrl+A全选
    await agent.aiRightClick("回收站窗口中的folder1");
    await agent.aiWaitFor("文件右键菜单已显示", { timeout: 5000 });
    await agent.aiWaitFor(`右键菜单包含'打开(O)''还原''删除(D)''反选''剪切(T)''复制(C)''病毒查杀''属性(R)'选项`);
    // 验证还原、删除、剪切不可点击：点击后菜单仍然显示，无响应
    console.log('抽验证"还原"/"删除"/"剪切"选项不可点击');
    await agent.aiTap("删除(D)");
    await agent.aiAssert("右键菜单仍然显示，点击无响应");

  }, { timeout: 800000, tags: ['1805881', 'level2', 'smoke', 'DITT', 'sushanshan'] });

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
    //清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    await uos.showDesktop();
  });
});
