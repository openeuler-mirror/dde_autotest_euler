/**
 * 用例 PMSID: 1806975
 * 用例标题: 【Ctrl+Z撤销】跨分区拖拽文件后，Ctrl+Z撤销弹出彻底删除提示
 * 生成时间: 2026-07-10 17:17:53
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const usbFlash = process.env.USB_FLASH || 'UOS';
const testFileName = 'te1806975.txt';
const desktopPath = `/home/${username}/Desktop`;
const desktopFilePath = `${desktopPath}/${testFileName}`;
const usbPath = `/media/${username}/${usbFlash}`;
const usbFilePath = `${usbPath}/${testFileName}`;

// 功能函数：初始化文管测试环境
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin.dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

// 功能函数：清理测试文件
async function cleanTestFiles(system) {
  try {
    await system.exec(`rm -f "${desktopFilePath}"`);
    await system.exec(`rm -f "${usbFilePath}"`);
    console.log('测试文件清理完成');
  } catch (err) {
    console.error('清理测试文件失败:', err);
  }
}

describe('1806975-【Ctrl+Z撤销】跨分区拖拽文件后，Ctrl+Z撤销弹出彻底删除提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await cleanTestFiles(system);
    await device.pressKey('Esc');
    await uos.showDesktop();

    // 前置条件：在桌面创建测试文件te1806975.txt
    console.log('前置条件：在桌面创建测试文件te1806975.txt');
    await system.exec(`echo "test file for 1806975" > "${desktopFilePath}"`);
  });

  test('1806975-【Ctrl+Z撤销】跨分区拖拽文件后，Ctrl+Z撤销弹出彻底删除提示', async ({ device, agent, uos, system }) => {
    // 步骤1：打开U盘，拖动te1806975.txt到U盘中
    console.log('步骤1：打开U盘，拖动te1806975.txt到U盘中');
    await uos.openApp('文件管理器');
    await agent.aiTap(`文件管理器侧边栏的${usbFlash}磁盘`, { deepThink: true });

    // 拖拽桌面te1806975.txt到U盘
    console.log('拖拽桌面te1806975.txt到U盘');
    await agent.aiDrag(`桌面上的${testFileName}文件`, 'UOS目录空白区域', { deepThink: true });

    // 断言1：U盘中有te1806975.txt
    console.log('断言1：U盘中有te1806975.txt');
    await agent.aiAssert(`UOS目录中存在${testFileName}文件`);
    console.log('断言1通过：U盘中有te1806975.txt');

    // 步骤2：Ctrl+Z撤销
    console.log('步骤2：Ctrl+Z撤销');
    await device.pressKey('Ctrl', 'z');

    // 断言2：弹窗提示：撤销后将会彻底删除，您确定要彻底删除？
    console.log('断言2：弹窗提示：撤销后将会彻底删除，您确定要彻底删除？');
    await agent.aiAssert('弹窗显示提示文字：撤销后将会彻底删除');
    console.log('断言2通过：弹窗提示彻底删除确认');

    // 步骤3：在弹窗中点击删除
    console.log('步骤3：在弹窗中点击删除');
    await agent.aiTap('弹框右下角红色字体的删除按钮', { deepThink: true });

    // 断言3：U盘中没有te1806975.txt
    console.log('断言3：U盘中没有te1806975.txt');
    await agent.aiAssert(`UOS目录中不存在${testFileName}文件`);
    console.log('断言3通过：U盘中没有te1806975.txt');

    // 步骤4：Ctrl+Y恢复撤销
    console.log('步骤4：Ctrl+Y恢复撤销');
    await device.pressKey('Ctrl', 'y');
    await agent.aiTap('UOS目录空白区域', { deepThink: true });

    // 断言4：U盘中有te1806975.txt
    console.log('断言4：U盘中有te1806975.txt');
    await agent.aiAssert(`UOS目录中存在${testFileName}文件`);
    console.log('断言4通过：U盘中有te1806975.txt');

    // 步骤5：Ctrl+Z撤销，弹出提示框
    console.log('步骤5：Ctrl+Z撤销，弹出提示框');
    await device.pressKey('Ctrl', 'z');

    // 步骤6：在弹窗中点击取消
    console.log('步骤6：在弹窗中点击取消');
    await agent.aiTap('弹窗中的取消按钮', { deepThink: true });

    // 断言5：弹窗关闭，U盘中有te1806975.txt
    console.log('断言5：弹窗关闭，U盘中有te1806975.txt');
    await agent.aiAssert('撤销确认弹窗已关闭');
    await agent.aiAssert(`UOS目录中存在${testFileName}文件`);
    console.log('断言5通过：弹窗关闭，U盘中有te1806975.txt');

  }, {
    timeout: 600000,
    tags: ['1806975', 'level2', 'cancel', 'hujian']
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理U盘中新建的测试文档及桌面文件
    await cleanTestFiles(system);
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
