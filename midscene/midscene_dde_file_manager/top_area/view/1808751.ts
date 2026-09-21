/**
 * 用例 PMSID: 1808751
 * 用例标题: 树状结构-开启树状结构
 * 生成时间: 2026-01-05 15:08:47
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808751-树状结构-开启树状结构', () => {
  // 目录名称映射对象：中文目录名 -> 英文系统目录名
  const directoryMapping = {
    '桌面': 'Desktop',
    '视频': 'Videos',
    '图片': 'Pictures',
    '音乐': 'Music',
    '文档': 'Documents'
  };

  // 定义目录列表
  const directories = ['桌面', '视频', '图片', '音乐', '文档'];
  
  // 随机选择一个目录
  const randomIndex = Math.floor(Math.random() * directories.length);
  const selectedDir = directories[randomIndex];
  // 使用目录映射将中文目录名转换为英文系统目录名
  const englishDir = directoryMapping[selectedDir] || selectedDir;
  const targetPath = '/home/' + process.env.TEST_USERNAME + '/' + englishDir;

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  
  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808751-树状结构-开启树状结构', async ({ device, agent, uos, system }) => {
    console.log(`随机选择目录: ${selectedDir} -> ${englishDir}`);
    
    // 步骤1：打开文件管理器
    await uos.openApp('文件管理器');
    
    // 步骤3：进入随机选择的目录
    await agent.aiTap(`左侧导航栏${selectedDir}目录`);

    // 步骤4：在随机目录中创建文件夹
    await system.exec(`mkdir -p ${targetPath}/1808751_1/1808751_2/1808751_3`);
    
    // 步骤4：点击右侧标题栏的"树状视图"小图标
    await agent.aiTap('地址栏右侧的第三个树状视图按钮');
    
    // 步骤5：验证树状视图设置成功,且所有目录默认为折叠状态
    await agent.aiAssert('1808751_1文件夹为折叠状态');
    await agent.aiRightClick(`${selectedDir}目录右侧中间空白区域`);
    await agent.aiHover("显示方式");
    await agent.aiAssert("树状视图被勾选");
    await agent.aiTap(`${selectedDir}目录右侧中间空白区域`);

    // 步骤6：进入最近使用的目录，不支持切换到树状视图
    await agent.aiTap('左侧导航栏最近使用', 500);
    await agent.aiTap('最近使用目录右侧的中间空白区域');
    await agent.aiRightClick('最近使用目录右侧的中间空白区域');
    await agent.aiHover('显示方式');
    await agent.aiAssert("只显示图标视图和列表视图，且列表视图被勾选");
    
  }, { timeout: 1800000, tags: ["1808751", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');

    console.log(`清理目录: ${selectedDir} -> ${englishDir}`);
    
    // 删除文件
    await system.exec(`rm -rf ${targetPath}/1808751*`);
  });
});
