/**
 * 用例 PMSID: 1816461
 * 用例标题: 水印支持配置-组策略支持添加自定义水印
 * 生成时间: 2026-08-18 9:18:22
 * 用例编写人: UT002899(胡诗敏)
 */



const caseDir = process.env.TESTCASE_DIR;

describe('1816461-水印支持配置-组策略支持添加自定义水印', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 安装dde-dconfig-editor
    const { installDeb} = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await installDeb(system,"dde-dconfig-editor")
    await system.exec(`cd ~/Downloads && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/logo.svg`)
  });

  test('1816461-水印支持配置-组策略支持添加自定义水印', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动dde-dconfig-editor
    console.log('步骤 1: 启动dde-dconfig-editor');
    await system.exec('dde-dconfig-editor')
    await uos.maximizeWindow()
    await agent.aiAssert('打开dde-dconfig-editor窗口')

    // 步骤 2： 进入org.deepin.dde.file-manager--org.deepin.dde.file-manager.desktop
    console.log('步骤 2： 进入org.deepin.dde.file-manager-->org.deepin.dde.file-manager.desktop');
    await agent.aiTap('应用Id输入框')
    await device.typeText('org.deepin.dde.file-manager')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager')
    await agent.aiTap('配置Id输入框')
    await device.typeText('org.deepin.dde.file-manager.desktop')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager.desktop')
    await agent.aiAssert('右侧存在启用水印的文字')

    // 步骤 3： 复制svg水印图片链接到WasterMask Uri【maskLogoUri】中
    console.log('步骤 3： 复制svg水印图片链接到WasterMask Uri中')
    await agent.aiTap('水印路径右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('~/Downloads/logo.svg')
    await agent.aiAssert('水印路径右侧的输入框显示：~/Downloads/logo.svg')

    // 步骤 4： 打开Enable WasterMask项
    console.log('步骤 4： 打开Enable WasterMask项')
    const isCheck = await agent.aiBoolean("启用水印右侧的开关");
    if (isCheck) {
        console.log("不需要开启水印")
    } else {
        console.log("需要开启水印");
        await agent.aiTap("启用水印右侧的开关");
    }

    await device.pressKey('Super', 'D')
    await agent.aiAssert('桌面右下方任务栏上方存在两个相对的L形水印图标，该图标上方显示自定义的图标')

   }, { timeout: 300000, tags: ['1816461', 'level3', 'watermark', 'hushimin'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 每个测试后的清理');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskLogoUri -v ''`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k enableMask -v false`)
    await system.exec('killall dde-dconfig-editor || true')
    await system.exec('rm -rf ~/Downloads/*')
    await uos.showDesktop();
  });
});