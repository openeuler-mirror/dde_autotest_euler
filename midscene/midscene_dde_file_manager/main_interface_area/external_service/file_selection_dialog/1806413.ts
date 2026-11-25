
/**
 * 用例 PMSID: 1806413
 * 用例标题: 文管选择窗-看图调用
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人：UT002411（胡戬）
 */

require("dotenv/config");

const usbFlash = process.env.USB_FLASH || 'UOS';

describe('1806413-文管选择窗-看图调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall deepin-image-viewer & killall dde-file-dialog', 500);
    await uos.showDesktop();
    // 前置条件1：下载网络测试文件到图片目录并解压
    await system.exec(`cd ~/Pictures && rm -f test1.zip && wget -O test1.zip http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806413/test1.zip`, 30000);
    await system.exec(`cd ~/Pictures && unzip -o test1.zip && rm -f test1.zip`, 10000);
    // 前置条件2：下载网络测试文件到U盘中并解压
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`cd ${usbPath} && rm -f test2.zip && wget -O test2.zip http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806413/test2.zip`, 30000);
      await system.exec(`cd ${usbPath} && unzip -o test2.zip && rm -f test2.zip`, 10000);
    } else {
      console.log('未找到U盘挂载路径，跳过U盘测试文件下载');
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806413-文管选择窗-看图调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开看图，菜单中点击"打开图片"，打开文件选择窗口，点击图片目录，双击test1文件夹，按ctrl+a选中所有图片，点击下方打开按钮
    console.log('步骤1：打开看图，点击"打开图片"，进入图片目录的test1文件夹，ctrl+a全选，点击打开');
    await uos.openApp("看图");
    await agent.aiTap("看图窗口右上角的菜单按钮");
    await agent.aiTap("打开图片");
    // 断言：文件选择窗口已打开
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言：文件选择窗口已打开');
    await agent.aiTap("文件选择窗口左侧边栏的图片");
    await agent.aiDoubleClick("文件选择窗口中的test1文件夹");
    await device.pressKey('Ctrl', 'a');
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言1：图片被打开
    await agent.aiAssert("图片被打开，看图窗口显示图片内容");
    console.log('断言1：图片被打开');

    // 步骤2：关闭应用程序
    console.log('步骤2：关闭看图应用程序');
    await system.exec('killall deepin-image-viewer & killall dde-file-dialog', 500);
    await uos.showDesktop();

    // 步骤3：打开看图，菜单中点击"打开图片"，打开文件选择窗口，鼠标悬浮在侧边栏桌面目录，滚轮向下滚动到底，点击UOS磁盘，在UOS目录双击test2文件夹，按ctrl+a选中所有图片，点击下方打开按钮
    console.log('步骤3：打开看图，点击"打开图片"，悬浮侧边栏桌面，滚轮向下，点击UOS磁盘，双击test2文件夹，ctrl+a全选，点击打开');
    await uos.openApp("看图");
    await agent.aiTap("看图窗口右上角的菜单按钮");
    await agent.aiTap("打开图片");
    await agent.aiAssert("文件选择窗口已打开");
    await agent.aiHover("文件选择窗口左侧边栏的桌面");
    await agent.aiScroll("文件选择窗口左侧边栏", { direction: "down", distance: 500 });
    await agent.aiTap("文件选择窗口左侧边栏的UOS磁盘");
    await agent.aiDoubleClick("文件选择窗口中的test2文件夹");
    await device.pressKey('Ctrl', 'a');
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：图片被打开
    await agent.aiAssert("图片被打开，看图窗口显示图片内容");
    console.log('断言2：图片被打开');

  }, { timeout: 600000, tags: ['1806413', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境，关闭应用，删除创建的测试文件夹
    await system.exec('killall deepin-image-viewer & killall dde-file-dialog', 500);
    await system.exec(`rm -rf ~/Pictures/test1`, 500);
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -rf ${usbPath}/test2`, 500);
    }
    await uos.showDesktop();
  });
});
