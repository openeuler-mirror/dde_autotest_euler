/**
 * 用例 PMSID: 1807213
 * 用例标题: Bug202013转：拖拽文件到同目录的文件夹下
 * 生成时间: 2025-12-18 14:45:38
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807213-Bug202013转：拖拽文件到同目录的文件夹下', function() {
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

  beforeAll(async function({ device, uos, agent }) {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async function() {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807213-Bug202013转：拖拽文件到同目录的文件夹下', async function({ device, agent, uos, system, env }) {
    // 前置条件：在随机选择的目录下，创建文本文档和文件夹
    await system.exec(`echo "This is a test file for drag and drop testing" > /${targetPath}/1807213.txt`);
    await system.exec(`mkdir -p /${targetPath}/1807213`);
    
    // 打开文件管理器
    await uos.openApp('文件管理器');
    
    // 进入随机选择的目录
    await agent.aiDoubleClick(`${selectedDir}目录`);
    
    // 步骤一：拖拽文本文档到文件夹下
    await agent.aiAction('将文本文档1807213.txt拖拽到文件夹1807213中');
    
    // 预期结果：文件夹目录下有文本文档
    await agent.aiDoubleClick('文件夹1807213');
    await agent.aiAssert('文件夹1807213目录下存在1807213.txt');
    
  }, { timeout: 1800000, tags: ['1807213', 'level1', 'drag', 'liqingling'] });

  afterEach(async function() {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async function({ system }) {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理测试文件
    await system.exec(`rm -f /${targetPath}/1807213*`);
    
    await system.exec('killall dde-file-manager');
  });
});