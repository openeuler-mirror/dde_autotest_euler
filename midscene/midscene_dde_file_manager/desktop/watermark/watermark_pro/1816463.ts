/**
 * 用例 PMSID: 1816463
 * 用例标题: 水印支持配置-组策略修改自定义水印参数
 * 生成时间: 2026-08-18 13:31:22
 * 用例编写人: UT002899(胡诗敏)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1816463-水印支持配置-组策略修改自定义水印参数', () => {
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

  test('1816463-水印支持配置-组策略修改自定义水印参数', async ({ device, agent, uos, system }) => {
    // 前置条件： 开启自定义水印并已设置自定义水印
    console.log('前置条件： 开启自定义水印并已设置自定义水印');
    await system.exec('dde-dconfig-editor')
    await uos.maximizeWindow()
    await agent.aiWaitFor('打开dde-dconfig-editor窗口')

    await agent.aiTap('应用Id输入框')
    await device.typeText('org.deepin.dde.file-manager')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager')
    await agent.aiTap('配置Id输入框')
    await device.typeText('org.deepin.dde.file-manager.desktop')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager.desktop')
    await agent.aiWaitFor('右侧存在启用水印文字')

    await agent.aiTap('水印路径右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('~/Downloads/logo.svg')
    await agent.aiWaitFor('水印路径右侧的输入框显示：~/Downloads/logo.svg')

    const isCheck = await agent.aiBoolean("启用水印右侧的开关");
    if (isCheck) {
        console.log("不需要开启水印")
    } else {
        console.log("需要开启水印");
        await agent.aiTap("启用水印右侧的开关");
    }
    await system.exec('killall dde-dconfig-editor || true')

    // 步骤 1： 启动dde-dconfig-editor
    console.log('步骤 1: 启动dde-dconfig-editor');
    await system.exec('dde-dconfig-editor')
    await uos.maximizeWindow()
    await agent.aiAssert('打开dde-dconfig-editor窗口')

    //步骤 2： 进入org.deepin.dde.file-manager--org.deepin.dde.file-manager.desktop
    console.log('步骤 2： 进入org.deepin.dde.file-manager-->org.deepin.dde.file-manager.desktop');
    await agent.aiTap('应用Id输入框')
    await device.typeText('org.deepin.dde.file-manager')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager')
    await agent.aiTap('配置Id输入框')
    await device.typeText('org.deepin.dde.file-manager.desktop')
    await agent.aiTap('输入框下方的org.deepin.dde.file-manager.desktop')
    await agent.aiAssert('右侧存在启用水印文字')

    // 步骤 3： 修改Width [maskWidth]为任意整数
    console.log('步骤 3： 修改Width [maskWidth]为任意整数')
    await agent.aiTap('宽度右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('40')
    await agent.aiAssert('宽度右侧的输入框显示：40')

    // 步骤 4： 修改Horizontal Offset [maskOffsetX]为任意整数
    console.log('步骤 4： 修改Horizontal Offset [maskOffsetX]为任意整数')
    await agent.aiTap('水平偏移右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('30')
    await agent.aiAssert('水平偏移右侧的输入框显示：30')

    // 步骤 5： 修改Vertical Offset [maskOffsetY]为任意整数
    console.log('步骤 5： 修改Vertical Offset [maskOffsetY]为任意整数')
    await agent.aiTap('垂直偏移右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('50')
    await agent.aiAssert('垂直偏移右侧的输入框显示：50')

    // 步骤 6： 修改Height [maskHeight]为任意整数
    console.log('步骤 6： 修改Height [maskHeight]为任意整数')
    await agent.aiTap('高度右侧的输入框')
    await device.pressKey('Ctrl', 'A')
    await device.pressKey('delete')
    await device.typeText('40')
    await agent.aiAssert('高度右侧的输入框显示：40')

    // 步骤 7： 检查桌面自定义水印展示情况
    console.log('步骤 7： 检查桌面自定义水印展示情况')
    await device.pressKey('Super', 'D')
    await agent.aiAssert('桌面右下方任务栏上方存在两个相对的L形水印图标，L形水印下方显示一个PC标识的图标')

  }, { timeout: 600000, tags: ['1816463', 'level3', 'watermark', 'hushimin'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 每个测试后的清理');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskWidth -v '114'`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskOffsetX -v '0'`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskOffsetY -v '0'`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskHeight -v '14'`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k maskLogoUri -v ''`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k enableMask -v false`)
    await system.exec('killall dde-dconfig-editor || true')
    await system.exec('rm -rf ~/Downloads/*')
    await uos.showDesktop();
  });
});