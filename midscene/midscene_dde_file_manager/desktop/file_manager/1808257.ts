/**
 * 用例 PMSID: 1808257
 * 用例标题: 桌面刷新优化-硬盘挂载/卸载-桌面自动刷新
 * 生成时间: 2026-01-21 11:27:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808257-桌面刷新优化-硬盘挂载/卸载-桌面自动刷新', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle"); // 显示桌面
    // 获取已挂载的移动硬盘的挂载分区（兼容stdout空值/空格）
    const diskPartition = await system.exec(`findmnt -no SOURCE /media/${env.testUsername}/${process.env.SSD_HDD}`);
    // 若分区存在，命令行执行卸载移动硬盘（避免空值执行命令报错）
    if (diskPartition) {
      await system.exec(`echo ${env.testPassword}|sudo -S umount ${diskPartition}`);
      console.log(`前置操作：成功卸载移动硬盘分区 ${diskPartition}`);
    } else {
      console.log('前置操作：未检测到已挂载的移动硬盘，无需卸载');
    }
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808257-桌面刷新优化-硬盘挂载/卸载-桌面自动刷新', async ({ device, agent, uos, system, env }) => {
   
    // ========== 步骤1：挂载移动硬盘，检查桌面图标、数量等正常刷新=========
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap(`左侧导航栏${process.env.SSD_HDD}`);
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle"); // 切换到桌面
    await agent.aiAssert("挂载后，桌面右下角显示磁盘挂载图标，桌面上文件和图标数量显示正常");

    // ========== 步骤2：卸载移动硬盘，检查桌面状态无变化 ==========
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiRightClick(`左侧导航栏${process.env.SSD_HDD}`);
    await agent.aiTap("卸载");
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle"); // 切换到桌面
    await agent.aiAssert("桌面右下角磁盘挂载图标消失，桌面上文件和图标数量显示正常");

  }, { timeout: 600000, tags: ["1808257", "level3", "file_manager", "SSD_HDD", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留，恢复环境');
    await device.pressKey("ESC"); // 关闭残留右键菜单/窗口
    // 重新挂载移动硬盘（修复原代码LABLE拼写错误+补全挂载目录）
    const mountDir = `/media/${env.testUsername}/${process.env.SSD_HDD}`;
    await system.exec(`sudo mkdir -p ${mountDir}`); // 确保挂载目录存在
    await system.exec(`echo ${env.testPassword} | sudo -S mount LABEL=${process.env.SSD_HDD} ${mountDir}`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    console.log('测试环境清理完成，移动硬盘已恢复挂载 ✅');
  });
});
