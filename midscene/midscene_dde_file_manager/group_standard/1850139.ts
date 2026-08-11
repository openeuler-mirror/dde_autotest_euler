/**
 * 用例 PMSID: 1850139
 * 用例标题: 文本文件缩略图、图片缩略图、视频首帧缩略图
 * 生成时间: 2026-01-30 16:00:00
 * 用例编写人: UT000159（游伟）
 */

const test_dir = '~/Videos/testdir';


describe('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图', () => {
  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 步骤 1: 创建测试文件夹并打开
    console.log(`步骤 1: 创建测试文件夹${test_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 2: 最大化文件管理器窗口
    console.log('步骤 2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');
  });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_txt', async ({ device, agent, uos, system }) => {
    const testfile = 'testfile.txt';
    const content = "Hello World! 你好, 世界!";

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`yes ${content} | head -n 10 > ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图, 缩略图中显示有很小的字符`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示缩略图, 缩略图中显示有很小的字符`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'txt'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_txt_1M', async ({ device, agent, uos, system }) => {
    const testfile = 'testfile.txt';
    const content = "Hello World! 你好, 世界!";

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`yes ${content} | head -c ${1024 * 1024 + 1} > ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 不显示缩略图
    console.log(`预期 1: ${testfile} 不显示缩略图`);
    await agent.aiAssert(`${testfile}显示为文本文件图标, 不显示显示缩略图`);

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'txt', '1M'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_BMP', async ({ device, agent, uos, system }) => {
    const testfile = 'test.bmp';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/1.bmp';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'bmp'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_GIF', async ({ device, agent, uos, system }) => {
    const testfile = 'test.gif';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/9a0a4c97036f61.gif';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'gif'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_JPG', async ({ device, agent, uos, system }) => {
    const testfile = 'test.jpg';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/676-160929111603.jpg';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'jpg'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_PNG', async ({ device, agent, uos, system }) => {
    const testfile = 'test.png';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/5dkmy1.png';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'png'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_PBM', async ({ device, agent, uos, system }) => {
    const testfile = 'test.pbm';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/PBM.pbm';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'pbm'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_PGM', async ({ device, agent, uos, system }) => {
    const testfile = 'test.pgm';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/PGM.pgm';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'pgm'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_PPM', async ({ device, agent, uos, system }) => {
    const testfile = 'test.ppm';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/PPM.ppm';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'ppm'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_XBM', async ({ device, agent, uos, system }) => {
    const testfile = 'test.xbm';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/XBM.xbm';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'xbm'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_XPM', async ({ device, agent, uos, system }) => {
    const testfile = 'test.xpm';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/XPM.xpm';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'xpm'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_SVG', async ({ device, agent, uos, system }) => {
    const testfile = 'test.svg';
    // const comparison_file = 'comparison.svg';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/deadbeef.svg';
    // const comparison_url = "https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/ddddd.svg";

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    // await system.exec(`wget ${comparison_url} -O ${test_dir}/${comparison_file}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);
    // await agent.aiWaitFor(`文件管理器内容区域有${testfile}和${comparison_file}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'svg'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_HEIC', async ({ device, agent, uos, system }) => {
    const testfile = 'test.heic';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/wuhan/stability/res/heic.heic';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'heic'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_HEIF', async ({ device, agent, uos, system }) => {
    const testfile = 'test.heif';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/wuhan/stability/res/heif.heif';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 显示缩略图
    console.log(`预期 1: ${testfile} 显示缩略图`);
    // 显示缩略图需要一定时间, 使用aiWaitFor等待一会
    await agent.aiWaitFor(`${testfile}显示缩略图`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`${testfile}显示为图片缩略图`);
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'heif'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_PNG_30M+', async ({ device, agent, uos, system }) => {
    const testfile = 'test.png';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/wuhan/stability/res/74M.png';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 不显示缩略图
    console.log(`预期 1: ${testfile} 不显示缩略图`);
    await agent.aiAssert(`${testfile}显示为图片文件图标, 不显示显示缩略图`);

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'png', '30M'] });

  test('1850139-文本文件缩略图、图片缩略图、视频首帧缩略图_GIF_30M+', async ({ device, agent, uos, system }) => {
    const testfile = 'test.gif';
    const url = 'https://cdimage.uniontech.com/daily-iso/source/wuhan/stability/res/50M.gif';

    // 步骤 1: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`wget ${url} -O ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`文件管理器内容区域有${testfile}文件`);

    // 预期 1: ${testfile} 不显示缩略图
    console.log(`预期 1: ${testfile} 不显示缩略图`);
    await agent.aiAssert(`${testfile}图标中有gif标识`); // 直接判断gif文件图标有概率失败, 借用图片中没有gif标识间接判断

  }, { timeout: 600000, tags: ['1850139', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'thumbnail', 'picture', 'gif', '30M'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -d ${test_dir} && rm -rf ${test_dir} || true`);
    await agent.aiWaitFor('文件管理器内容区域已清空');

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复桌面
    await uos.showDesktop();
  });
});
