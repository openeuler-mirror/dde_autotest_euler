/**
 * 用例 PMSID: 1654947
 * 用例标题: 日志json配置文件位置
 * 生成时间: 2026-04-22
 * 用例编写人:  UT006165（李日华）
 */

describe('1654947-日志json配置文件位置', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1654947-日志json配置文件位置', async ({ device, agent, uos, system }) => {
    // 步骤 1: 检查路径存在/usr/share/deepin-log-viewer/deepin-log.conf.d/
    const checkDirCmd = "ls -d /usr/share/deepin-log-viewer/deepin-log.conf.d/";
    const dirResult = await system.exec(checkDirCmd);
    console.log('dirResult',dirResult.stdout);
    assertTrue(dirResult.stdout);

    //步骤 2: 进入该路径下查看文件，文件后缀名全为.json文件
    const checkFilesCmd = "ls /usr/share/deepin-log-viewer/deepin-log.conf.d/";
    const filesResult = await system.exec(checkFilesCmd);
    console.log('dirResult',filesResult.stdout);
    
    const files = filesResult.stdout.trim().split('\n');
    console.log('file:',files)
    //说明：循环检查该路径文件下的所有文件的后缀名，不符合均抛出异常
    for (const file of files) {
      assertTrue(file.endsWith('.json'))
      if (!file.endsWith('.json')) {
        throw new Error(`发现非 .json 后缀的文件: ${file}`);
      }
    }

    // 步骤 3: 存在dde-file-manager.json、org.deepin.kwin.json、org.deepin.dde.control-center.json
    const requiredFiles = [
      'dde-file-manager.json',
      'org.deepin.kwin.json',
      'org.deepin.dde.control-center.json'
    ];
    //说明：仅循环检查三个核心组件的日志是否存在
    for (const requiredFile of requiredFiles) {
      const checkFileCmd = `ls /usr/share/deepin-log-viewer/deepin-log.conf.d/${requiredFile}`;
      const fileResult = await system.exec(checkFileCmd);
      console.log('dirResult',fileResult.stdout);
      assertTrue(fileResult.stdout);
      if (!fileResult.stdout) {
        throw new Error(`/usr/share/deepin-log-viewer/deepin-log.conf.d/ 路径下缺少必需的文件: ${requiredFile}`);
      }
    }

  }, { timeout: 120000, tags: ['1654947', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

});
