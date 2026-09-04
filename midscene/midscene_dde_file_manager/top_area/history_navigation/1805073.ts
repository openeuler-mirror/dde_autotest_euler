/**
 * 优化后的测试脚本
 * 用例 PMSID: 1805073
 * 用例标题: 历史导航-挂载目录跳转普通目录
 * 生成时间: 2026-03-05
 * 用例编写人: UT000244（李庆玲）
 * 优化说明: 按照测试要求优化挂载/卸载逻辑和导航步骤
 */

describe('1805073-[t]历史导航-挂载目录跳转普通目录', () => {
  
  beforeAll(async ({ device, uos, agent, system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    
    // 检查U盘是否已挂载
    const mountResult = await system.exec(`mount | grep ${process.env.USB_FLASH} | head -1`);
    if (!mountResult.stdout.trim()) {
      throw new Error(`未检测到已挂载的U盘 ${process.env.USB_FLASH}，请插入U盘并确保已自动挂载`);
    }
    
    console.log(`检测到U盘 ${process.env.USB_FLASH} 已挂载`);
  });
    
  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1805073-[t]历史导航-挂载目录跳转普通目录', async ({ device, agent, uos, system, env }) => {
    // 定义挂载点和分区信息
    const mountPoint = `/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;
    
    // 步骤1：恢复文件管理器设置
    await system.cleanupFileManager();
    
    // 步骤2：打开文件管理器
    console.log('步骤2：打开文件管理器并测试历史导航');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    
    // 步骤3：点击左侧导航栏U盘，地址栏前进按钮置灰
    await agent.aiTap(`左侧导航栏${process.env.USB_FLASH}目录`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待导航完成
    await agent.aiAssert('地址栏前进按钮显示为灰色');
    await agent.aiAssert(`左侧导航栏${process.env.USB_FLASH}目录`);
    
    // 步骤4：点击后退按钮，返回到计算机目录，计算机目录高亮
    await agent.aiTap('地址栏后退按钮');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待回退完成
    await agent.aiAssert('地址栏后退按钮显示为灰色');
    await agent.aiAssert('计算机目录高亮');
    
    // 步骤5：计算机目录，在地址栏上点击前进按钮，前进按钮为灰色
    console.log('步骤5：从计算机目录前进到U盘目录');
    await agent.aiTap('地址栏前进按钮');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待前进完成
    await agent.aiAssert('地址栏前进按钮显示为灰色');
    
    // 步骤6：卸载U盘后再挂载
    console.log('步骤6：卸载U盘后再重新挂载');
    
    // 获取磁盘分区信息
    const partitionResult = await system.exec(`findmnt -no SOURCE ${mountPoint}`);
    const diskPartition = partitionResult.stdout.trim();
    
    // 卸载U盘
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S umount ${mountPoint}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 重新挂载U盘
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S mount ${diskPartition} ${mountPoint}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 确保挂载完成
    
    // 步骤7：从挂载目录进入普通目录
    console.log('步骤7：从挂载目录进入普通目录');
    await agent.aiTap(`左侧导航栏${process.env.USB_FLASH}目录`);
    await agent.aiTap('左侧导航栏计算机目录');
    await agent.aiTap('地址栏后退按钮');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待回退完成
    await agent.aiAssert(`${process.env.USB_FLASH}目录高亮显示`);
    
    // 步骤8：取消挂载，直接回退到计算机目录
    console.log('步骤8：取消挂载并测试回退');
    
    // 取消挂载
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S umount ${mountPoint}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 点击回退按钮，应该直接回退到计算机目录
    await agent.aiTap('地址栏后退按钮');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待回退完成
    await agent.aiAssert('计算机目录高亮');

    // 确保U盘重新挂载，以免影响其他测试
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S mount ${diskPartition} ${mountPoint}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 确保挂载完成

  }, { timeout: 1800000, tags: ["1805073", "level3", "history_navigation", "liqingling"] });
  
  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');

    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
});
