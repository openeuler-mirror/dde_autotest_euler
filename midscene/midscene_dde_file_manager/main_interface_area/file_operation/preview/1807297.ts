/**
 * 用例 PMSID: 1807297
 * 用例标题:  [core]音频支持缩略图-未设置“音乐预览”，勾选后功能后，存在缩略图的音频文件缩略图即时生效
 * 生成时间: 2025-12-22
 * 用例编写人: UT000054（叶飞）
 */

describe('1807297-[core]音频支持缩略图-未设置“音乐预览”，勾选后功能后，存在缩略图的音频文件缩略图即时生效', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    //关闭视图选项的显示预览，以免干扰
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");

  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807297-[core]音频支持缩略图-未设置"音乐预览"，勾选后功能后，存在缩略图的音频文件缩略图即时生效', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 将测试拷贝至主目录');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807297.mp3`;

    // 使用系统命令复制文件
    await system.exec(`cp -r "${sourcePath}" ~`);
    console.log(`文件已复制到: 家目录`);
    //设置图标定位
    const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器设置图标.png`;

    //前置条件设置：关闭音乐预览和显示预览
    //关闭显示预览
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '文件管理器设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("弹出菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("基础设置");
    await agent.aiTap("缩略图预览");
    await agent.aiWaitFor("音乐预览文字内容可见");
    //判断音乐预览是否已勾选，如果已勾选，则需要取消勾选，如果是未勾选状态，则不执行
    const isChecked = await agent.aiQuery('音乐预览前面的复选框是否已勾选', { type: 'boolean' });
    if (isChecked) {
      console.log('YES');
      await agent.aiTap("音乐预览前面的复选框");
    } else {
      console.log('NO');
    }
    await agent.aiTap("设置窗口的关闭按钮");
    await agent.aiTap("窗口右上角关闭按钮:X");//关闭文管

    // 步骤1： 打开文管，在主目录下找到音乐文件，检查预览显示（音乐预览已关闭）
    console.log('步骤2: 打开文件管理器并检查音乐预览（已关闭状态）');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap("1807297.mp3");
    await agent.aiWaitFor("显示文件的缩略图：图标为有音乐符号的MP3专属图标");

    //步骤2： 开启音乐预览，重新检查音乐文件预览图显示
    console.log('步骤3: 开启音乐预览，检查即时生效');
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '文件管理器设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("弹出菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("弹出基础设置窗口");
    await agent.aiTap("缩略图预览");
    await agent.aiWaitFor("音乐预览文字内容可见");
    await agent.aiTap("音乐预览前面的复选框");
    await agent.aiTap("设置窗口的关闭按钮");

    // 验证音乐文件缩略图即时生效
    await agent.aiTap("1807297.mp3");
    await agent.aiWaitFor("显示文件的缩略图：带有公路的图标");

    //步骤3： 关闭文管，再次打开，检查预览生效
    console.log('步骤3: 关闭文管，再次打开，检查预览生效');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");//以防有其他文管窗口打开被干扰

    // 重新打开文件管理器
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap("1807297.mp3");
    await agent.aiWaitFor("显示文件的缩略图：夕阳下的公路");
    await agent.aiAssert("音乐文件的预览图标显示是夕阳下的公路");

    //步骤4： 命令行kill dde-file-manager 再打开文管，检查预览生效
    console.log('步骤4: 命令行kill dde-file-manager，再打开文管，检查预览生效');
    await system.exec("killall dde-file-manager");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待进程完全结束

    // 重新打开文件管理器
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap("1807297.mp3");
    await agent.aiWaitFor("图标为夕阳下的公路");

    //步骤5： 再次关闭音乐预览，验证缩略图恢复为默认图标
    console.log('步骤5: 再次关闭音乐预览，验证缩略图恢复');
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '文件管理器设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("弹出菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("弹出基础设置窗口");
    await agent.aiTap("缩略图预览");
    await agent.aiWaitFor("窗口右侧音乐预览文字内容可见");
    await agent.aiTap("音乐预览前面的复选框");
    await agent.aiTap("设置窗口的关闭按钮");

    // 验证音乐文件缩略图恢复为默认图标
    await agent.aiTap("1807297.mp3");
    await agent.aiWaitFor("显示文件的缩略图：文件图标是默认音频图标");
    await agent.aiAssert("图标为有音乐符号的MP3专属图标");


  }, { timeout: 600000, tags: ["1807297", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1807297.mp3");
    //恢复设置
    //设置图标定位
    const caseDir = process.env.TESTCASE_DIR;
    const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器设置图标.png`;
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '文件管理器设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("弹出菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("弹出基础设置窗口");
    await agent.aiHover("窗口右侧的基础设置");
    await agent.aiScroll("基础设置", { direction: 'down' });
    await agent.aiWaitFor("文件粉碎可见");
    await agent.aiTap("文件粉碎");
    await agent.aiWaitFor("恢复默认可见");
    await agent.aiTap("恢复默认");
    await agent.aiTap("设置窗口的关闭按钮");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
