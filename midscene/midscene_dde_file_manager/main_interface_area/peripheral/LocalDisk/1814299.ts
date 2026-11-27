/**
 * 用例 PMSID: 1814299
 * 用例标题:  【本地磁盘】磁盘占用优化-磁盘空间展示
 * 生成时间: 2026-10-29 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1814299-【本地磁盘】磁盘占用优化-磁盘空间展示', () => {

  const vol = "系统盘";

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤1：初始化测试环境 ===');

    // 准备步骤: 点击桌面空白处, 关闭可能打开的启动器
    console.log('准备步骤：点击桌面空白处，关闭可能打开的启动器');
    await agent.aiTap('桌面空白处');

    // 准备步骤：关闭可能残留的文件管理器窗口
    console.log('准备步骤：关闭可能残留的文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤2：每个测试前的准备 ===');

    // 准备步骤：本用例为只读视觉检查，无需额外准备
    console.log('准备步骤：本用例为只读视觉检查，无需额外准备');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤4：每个测试后的清理 ===');

    // 清理步骤: 关闭可能打开的文件管理器窗口
    console.log('清理步骤：关闭可能打开的文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

  });

  afterAll(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤5：清理测试套件 ===');

    // 清理步骤：关闭文件管理器窗口
    console.log('清理步骤：关闭文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

    // 清理步骤：回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  test('1814299-【本地磁盘】磁盘占用优化-磁盘空间展示', async ({ device, agent, uos, system }) => {

    // 步骤 1：获取当前磁盘空间占用
    console.log('步骤 1：获取当前磁盘空间占用');
    const usage_res = await system.exec("df -h / | tail -1 | awk '{print $5}' | tr -d '%'");
    const free_res = await system.exec("df -B 1 / | tail -1 | awk '{print $4}' | tr -d 'G'");
    const usage = parseInt(String(usage_res.stdout ?? usage_res).trim(), 10);
    const free = parseInt(String(free_res.stdout ?? free_res).trim(), 10);
    const free_string = free > 1024 * 1024 * 1024 ? `${(free / 1024 / 1024 / 1024).toFixed(1)} GB` : 
        free > 1024 * 1024 ? `${(free / 1024 / 1024).toFixed(1)} MB` : `${(free / 1024 ).toFixed(1)} KB`
    console.log(`当前根分区占用: ${usage}%`);
    console.log(`当前根分区已空闲: ${free_string}`);

    // 步骤 2: 打开文件管理器并定位到计算机视图
    console.log('步骤 2：打开文件管理器并定位到计算机视图');
    await system.exec('dde-file-manager computer:///');
    await agent.aiWaitFor('文件管理器计算机视图已打开');

    // 预期 2：根据占用区间检查进度条颜色
    if (usage < 70) {
      // 预期 2-a：进度条显示蓝色
      console.log('预期 2-a：磁盘空间占用小于70%，进度条显示蓝色');
      await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为蓝色`);
    } else if (usage >= 70 && usage <= 90) {
      // 预期 2-b：进度条显示黄色
      console.log('预期 2-b：磁盘空间占用70%-90%，进度条显示黄色');
      await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为黄色`);
    } else {
      // 预期 2-b：进度条显示红色
      console.log('预期 2-c：磁盘空间占用大于90%，进度条显示红色');
      await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为红色`);
    };

    // 步骤 3: 打开${vol}属性界面
    console.log('步骤 3：打开${vol}属性界面');
    await agent.aiTap(`文件管理器计算机视图中右侧内容区域中磁盘列表下的${vol}`);
    await device.pressKey('Ctrl', "I");
    await agent.aiWaitFor(`${vol}属性界面已打开`);

    // 预期 3: 可用空间显示正确
    console.log('预期 3：可用空间显示正确');
    await agent.aiAssert(`在${vol}属性界面中可用空间为${free_string}`);

    // 步骤 4: 关闭${vol}属性界面
    console.log(`步骤 4：关闭${vol}属性界面`);
    await device.pressKey('Esc');
    await agent.aiWaitFor(`${vol}属性界面已关闭`);

    // 步骤 5: 进入到${vol}目录中
    console.log('步骤 5：进入到系统盘目录中');
    await agent.aiDoubleClick(`文件管理器计算机视图中右侧内容区域中磁盘列表下的${vol}`);
    await agent.aiWaitFor(`文件管理器${vol}窗口已打开`);

    // 步骤 6: 打开${vol}属性页面
    console.log('步骤 6：打开${vol}属性界面');
    await agent.aiRightClick(`文件管理器右侧内容区域空白处`);
    await agent.aiWaitFor('文件管理器右侧内容区域空白处右键菜单已出现');
    await agent.aiTap('文件管理器右侧内容区域空白处右键菜单中属性');
    await agent.aiWaitFor(`${vol}属性界面已打开`);

    // 预期 6: 可用空间显示正确
    console.log('预期 6：可用空间显示正确');
    await agent.aiAssert(`在${vol}属性界面中可用空间为${free_string}`);

  }, { timeout: 600000, tags: ['1814299', 'level4', 'DITT', 'youwei', 'local_disk', 'capacity', 'progress_bar'] });
});
