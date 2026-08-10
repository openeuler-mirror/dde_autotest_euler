/**
 * 用例 PMSID: 1805905
 * 用例标题: 添加数据到回收站-多次删除文件到回收站
 * 生成时间: 2025-12-29 17:03:00
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 实现文件权限和回收站功能测试，添加随机目录右键新建删除文件夹测试
 */

describe('1805905-添加数据到回收站-多次删除文件到回收站', () => {
  // 目录名称映射对象：中文目录名 -> 英文系统目录名
  const directoryMapping = {
      '桌面': 'Desktop',
      '视频': 'Videos',
      '图片': 'Pictures',
      '音乐': 'Music',
      '文档': 'Documents',
      '下载': 'Downloads'
  };

  // 定义home目录下的常见子目录列表
  const homeSubdirs = ['桌面', '视频', '音乐', '图片', '下载', '文档'];
  
  // 随机选择一个目录
  const randomIndex = Math.floor(Math.random() * homeSubdirs.length);
  const selectedDir = homeSubdirs[randomIndex];
  // 使用目录映射将中文目录名转换为英文系统目录名
  const englishDir = directoryMapping[selectedDir] || selectedDir;
  const targetPath = '/home/' + process.env.TEST_USERNAME + '/' + englishDir;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805905-随机目录右键新建删除文件夹测试', async ({ device, agent, uos, system }) => {
    // 打开文件管理器，进入计算机页面
    await uos.openApp('文件管理器');
    
    // 导航到目标目录
    await agent.aiTap(`左侧导航栏${selectedDir}`);
    
    // 创建第一个测试文件夹
    await system.exec(`mkdir -p ${targetPath}/1805905_1`);
    await agent.aiAssert(`${selectedDir}中存在1805905_1`);
    
    // 步骤二：右键删除第一个文件夹
    await agent.aiTap("1805905_1");
    await agent.aiRightClick("在1805905_1文件夹上右键点击");
    await agent.aiTap("删除");
    
    // 验证删除结果
    await agent.aiTap("左侧导航栏回收站");
    await agent.aiAssert("1805905_1文件夹在回收站中");
    
    // 步骤三：返回目录并新建第二个测试文件夹
    await agent.aiTap(`左侧导航栏${selectedDir}`);
    await system.exec(`mkdir -p ${targetPath}/1805905_2`);
    await agent.aiAssert(`${selectedDir}中存在1805905_2`);
    
    // 步骤四：拖拽删除第二个文件夹
    await agent.aiTap("1805905_2");
    await agent.aiAction("按住1805905_2文件夹，拖拽到左侧导航栏回收站图标上，然后释放");
    
    // 验证第二个删除结果
    await agent.aiTap("左侧导航栏回收站图标");
    await agent.aiAssert("1805905_2文件夹在回收站中");
    
  }, { timeout: 1800000, tags: ["1805905", "level3", "trash", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
      console.log('5. afterAll: 清理测试套件');
      
      // 清理测试文件
      await system.exec('rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*');
      //关闭所有文管窗口
      await system.exec('killall dde-file-manager');
      // 删除所有可能创建的测试文件夹
      await system.exec(`rm -rf ${targetPath}/1805905*`);
    });
  });
