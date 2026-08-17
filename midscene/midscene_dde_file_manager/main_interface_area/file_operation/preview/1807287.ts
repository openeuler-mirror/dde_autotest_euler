/**
 * 用例 PMSID: 1807287
 * 用例标题: 音频支持缩略图-设置“音乐预览”，检查损坏的有封面缩略图的音频
 * 生成时间: 2025-12-22
 * 用例编写人: UT000054（叶飞）
 */

describe('1807287-音频支持缩略图-设置“音乐预览”，检查损坏的有封面缩略图的音频', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807287-音频支持缩略图-设置“音乐预览”，检查损坏的有封面缩略图的音频', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 将测试拷贝至主目录');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807287.wav`;

    // 使用系统命令复制文件
    await system.exec(`cp -r "${sourcePath}" ~`);
    console.log(`文件已复制到: 家目录`);
    //前置条件设置：开启音乐预览
    await uos.openApp("文件管理器", { maximizeWindow: true });
    //设置图标定位
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
    await agent.aiWaitFor("基础设置");
    await agent.aiTap("缩略图预览");
    await agent.aiWaitFor("音乐预览文字内容可见");
    //判断音乐预览是否已勾选，如果未勾选，则需要勾选，如果是已勾选状态，则不执行
    const isChecked = await agent.aiQuery('音乐预览前面的复选框是否已勾选', { type: 'boolean' });
    if (isChecked) {
      console.log('YES');
      // 已勾选，不执行
    } else {
      console.log('NO');
      await agent.aiTap("音乐预览前面的复选框");
    }
    await agent.aiTap("设置窗口的关闭按钮");
    await agent.aiTap("窗口右上角关闭按钮:X");//关闭文管

    // 步骤1： 打开文管进入主目录
    console.log('步骤2: 打开文件管理器并进入测试目录');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap("1807287.wav");
    await agent.aiAssert("显示文件的缩略图：文件图标是张图片");

  }, { timeout: 600000, tags: ["1807287", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1807287.wav");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.exec("killall deepin-movie");
    await system.exec("killall deepin-music");
    await system.exec("killall deepin-image-viewer");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
