/**
 * 用例 PMSID: 1807929
 * 用例标题:  [116]自定义壁纸-smb目录下图片右键设置桌面壁纸 
 * 生成时间: 2026-01-06 11:13:26
 * 用例编写人：UT000054（叶飞）
 */
// @ts-nocheck

const caseDir = process.env.TESTCASE_DIR;
describe('1807929-[116]自定义壁纸-smb目录下图片右键设置桌面壁纸', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    // 启动DDE文件管理器应用
    await uos.openApp('文件管理器', { maximizeWindow: true });

  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

test('1807929-[116]自定义壁纸-smb目录下图片右键设置桌面壁纸', async ({ device, agent, uos, system, env }) => {

  // 判断smb服务器是否已经挂载，如挂载即取消挂载
  const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await cleanSmbMounts(agent, system);
  console.log('卸载smb');

  //挂载： 【SmbMount】根据是否传入参数1来分别执行用户名挂载和匿名挂载（通过地址栏挂载）
  //用户名挂载smb
  const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await SmbMount(agent, system, device, 1);
  // 进入服务器目录，验证是否需要认证
  await agent.aiDoubleClick('SmbTest');
  // 测试数据下面的图片目录，找到任意一张图片
  await agent.aiDoubleClick("测试数据");
  await agent.aiWaitFor("测试图片jpg文件夹可见");
  await agent.aiDoubleClick("测试图片jpg");
  await agent.aiWaitFor("目录中出现图片文件");
  await agent.aiRightClick("1.jpg");
  await agent.aiWaitFor("右键菜单显示");
  await agent.aiAssert("设置壁纸字体颜色是灰色，比打开的字体颜色浅");
  await device.pressKey("ESC");//取消右键菜单

}, { timeout: 600000, tags: ["1807929", "level3", "wallpaper_screensaver", "yefei"] });

afterEach(async ({ device }) => {
  console.log('4. afterEach: 每个测试后的清理');
});

afterAll(async ({ uos, agent, device, system, env }) => {
  console.log('5. afterAll: 清理测试套件');
  // 卸载smb服务器
  console.log('卸载smb');
  const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await cleanSmbMounts(agent, system, 1);

  // 关闭文件管理器窗口
  await system.exec("killall dde-file-manager");
  await system.cleanupFileManager();
});
});
