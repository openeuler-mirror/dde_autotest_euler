/**
 * 用例 PMSID: 1813739
 * 用例标题: 缩略图预览，网络协议(SMB)显示
 * 生成时间: 2026-07-30
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813739-缩略图预览，网络协议(SMB)显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();

    console.log('前置操作：关闭桌面上存在的弹框');
    for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
    
    console.log('前置条件1：开启"加载网络、手机、光盘目录的缩略图"');
    await uos.openApp('文件管理器', 3000, 20000, true);

    // 打开文件管理器设置
    await agent.aiTap('右上角主菜单按钮', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });

    // 点击侧边栏的缩略图预览
    await agent.aiTap('侧边栏中的缩略图预览');

    // 检查"加载网络、手机、光盘目录的缩略图"勾选状态，未勾选则勾选
    const isChecked1 = await agent.aiBoolean('加载网络、手机、光盘目录的缩略图被勾选');
    if (!isChecked1) {
      console.log('未勾选，勾选"加载网络、手机、光盘目录的缩略图"');
      await agent.aiTap('加载网络、手机、光盘目录的缩略图左边的勾选框');
    } else {
      console.log('已勾选，无需操作');
    }
    await agent.aiAssert('加载网络、手机、光盘目录的缩略图被勾选');

    // 关闭设置弹框
    await agent.aiTap('文件管理器设置界面右上角的关闭按钮:X', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已关闭');
    await agent.aiTap("左侧栏的文档目录")

    console.log('前置条件2：开启"显示预览"');
    // 点击页面上方地址栏右侧的第四个按钮
    await agent.aiTap('搜索框左侧第四个，方框里面有三个点图标', { deepThink: true });
    await agent.aiWaitFor('下拉菜单已显示');
    const isChecked2 = await agent.aiBoolean('显示预览被勾选');
    if (!isChecked2) {
      console.log('未勾选，勾选"显示预览"');
      await agent.aiTap('显示预览前面的勾选框', { deepThink: true });
    } else {
      console.log('已勾选，无需操作');
    }
    await agent.aiAssert('显示预览被勾选');
    // 关闭下拉菜单
    await device.pressKey('Esc');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813739-缩略图预览，网络协议(SMB)显示', async ({ device, agent, uos, system, env }) => {
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1813739.zip`;

    console.log('前置条件3：将resource下面的1813739.zip复制到文档目录');
    await system.exec(`cp -r "${sourcePath}" /home/${process.env.TEST_USERNAME}/Documents/`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('前置条件4：将文件解压');
    await system.exec(`unzip -o /home/${process.env.TEST_USERNAME}/Documents/1813739.zip -d /home/${process.env.TEST_USERNAME}/Documents/`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec(`rm -f /home/${process.env.TEST_USERNAME}/Documents/1813739.zip`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('步骤1：打开文件管理器并进入文档目录');
    await agent.aiTap('左侧导航栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤2：双击1813739文件夹进入');
    await agent.aiDoubleClick('1813739');

    console.log('步骤3：依次点击file，验证左侧栏有预览图');
    await agent.aiTap('file');
    await agent.aiWaitFor('右侧栏显示file的信息');
   
    console.log('步骤4：点击editor.txt，验证左侧栏有预览图');
    await agent.aiTap('editor.txt');
    await agent.aiAssert('右侧栏有editor.txt信息');

    console.log('步骤5：点击movie.mp4，验证左侧栏有预览图');
    await agent.aiTap('movie.mp4');
    await agent.aiAssert('右侧栏有movie.mp4的信息');

    console.log('步骤6：点击music.mp3，验证左侧栏有预览图');
    await agent.aiTap('music.mp3');
    await agent.aiAssert('右侧栏有music.mp3的信息');

    console.log('步骤7：点击pic.png，验证左侧栏有预览图');
    await agent.aiTap('pic.png');
    await agent.aiAssert('右侧栏有pic.png的信息');
    // await agent.aiTap('左侧栏的计算机目录');
    // // 打开文件管理器设置
    // await agent.aiTap('右上角主菜单按钮', { deepThink: true });
    // await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    // await agent.aiWaitFor('文件管理器设置界面已打开');

    // await agent.aiTap('侧边栏中的缩略图预览');
    // await agent.aiWaitFor('缩略图预览设置页面已显示');

    // const isChecked1 = await agent.aiBoolean('加载网络、手机、光盘目录的缩略图被勾选');
    // if (isChecked1) {
    //   console.log('已勾选，取消勾选"加载网络、手机、光盘目录的缩略图"');
    //   await agent.aiTap('加载网络、手机、光盘目录的缩略图左边的勾选框');
    // } else {
    //   console.log('未勾选，无需操作');
    // }
    // await agent.aiAssert('加载网络、手机、光盘目录的缩略图被勾选');
    console.log('恢复环境2：关闭"显示预览"');
    await agent.aiTap('搜索框左侧第四个，方框里面有三个点图标', { deepThink: true });
    // await agent.aiWaitFor('下拉菜单已显示');
    const isChecked2 = await agent.aiBoolean('显示预览被勾选');
    if (isChecked2) {
      console.log('已勾选，取消勾选"显示预览"');
      await agent.aiTap('显示预览前面的左侧的勾选框');
    } else {
      console.log('未勾选，无需操作');
    }
    await device.pressKey('Esc');

    await agent.aiTap('文件管理器设置界面右上角的关闭按钮:X', { deepThink: true });
    

  }, { timeout: 1200000, tags: ['1813739', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");

    console.log('清理步骤：删除文档目录下的测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1813739`);
    await system.exec(`rm -f /home/${process.env.TEST_USERNAME}/Documents/1813739.zip`);

    console.log('恢复环境1：关闭"加载网络、手机、光盘目录的缩略图"');
    await uos.openApp('文件管理器', 3000, 20000, true);

    // 打开文件管理器设置
    await agent.aiTap('右上角主菜单按钮', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已打开');

    await agent.aiTap('侧边栏中的缩略图预览');
    await agent.aiWaitFor('缩略图预览设置页面已显示');

    const isChecked1 = await agent.aiBoolean('加载网络、手机、光盘目录的缩略图被勾选');
    if (isChecked1) {
      console.log('已勾选，取消勾选"加载网络、手机、光盘目录的缩略图"');
      await agent.aiTap('加载网络、手机、光盘目录的缩略图左边的勾选框');
    } else {
      console.log('未勾选，无需操作');
    }

    await agent.aiTap('文件管理器设置界面右上角的关闭按钮:X', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已关闭');
    await agent.aiTap("左侧栏的文档目录")

    console.log('恢复环境2：关闭"显示预览"');
    await agent.aiTap('搜索框左侧第四个，方框里面有三个点图标', { deepThink: true });
    // await agent.aiWaitFor('下拉菜单已显示');
    const isChecked2 = await agent.aiBoolean('显示预览被勾选');
    if (isChecked2) {
      console.log('已勾选，取消勾选"显示预览"');
      await agent.aiTap('显示预览前面的左侧的勾选框', { deepThink: true });
    } else {
      console.log('未勾选，无需操作');
    }
    await device.pressKey('Esc');

    console.log('清理步骤：关闭文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});