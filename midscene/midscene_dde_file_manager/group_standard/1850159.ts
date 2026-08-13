/**
 * 用例 PMSID: 1850159
 * 用例标题: 1850159-文本、图片、视频、音乐快速访问
 * 生成时间: 2026-02-05 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850159-文本、图片、视频、音乐快速访问', () => {
  // 测试相关变量定义
  const test_dir = "~/Videos/testdir";

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建并打开测试目录${test_dir}
    console.log(`创建并打开测试目录${test_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 最大化文件管理器窗口
    console.log('最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口右上角显示还原按钮');
  });

  test('1850159-文本、图片、视频、音乐快速访问_文本', async ({ device, system, agent, uos }) => {
    let test_file = 'testfile.txt';
    let content = "Hello World! 你好, 世界!";
    // 准备步骤: 准备测试文件${test_file}
    console.log(`准备测试文件${test_file}`);
    await system.exec(`echo "${content}" > ${test_dir}/${test_file}`);
    await agent.aiWaitFor(`文件管理器窗口${test_file}`);

    // 步骤 1: 单击选中${test_file}
    console.log(`步骤 1: 单击选中${test_file}`);
    await agent.aiTap(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor(`选中${test_file}`);

    // 步骤 2: 点击空格
    console.log('步骤 2: 点击空格');
    await device.pressKey('Space');
    await agent.aiWaitFor('屏幕中间弹出一个预览窗口');

    // 预期 2: 已打开预览窗口, 显示${content}
    console.log(`预期 2: 已打开预览窗口, 显示${content}`);
    await agent.aiAssert('屏幕中间弹出一个预览窗口');
    await agent.aiAssert(`窗口中显示${content}`);

  }, { timeout: 600000, tags: ['1850159', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'quick view', 'txt'] });

  test('1850159-文本、图片、视频、音乐快速访问_图片', async ({ device, system, agent, uos }) => {
    let test_file = 'test.png';
    let url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/5dkmy1.png';

    // 准备步骤: 准备测试文件${test_file}
    console.log(`准备测试文件${test_file}`);
    await system.exec(`wget ${url} -O ${test_dir}/${test_file}`);
    await agent.aiWaitFor(`文件管理器窗口${test_file}`);

    // 步骤 1: 单击选中${txt_file}
    console.log(`步骤 1: 单击选中${test_file}`);
    await agent.aiTap(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor(`选中${test_file}`);

    // 步骤 2: 点击空格
    console.log('步骤 2: 点击空格');
    await device.pressKey('Space');
    await agent.aiWaitFor('屏幕中间弹出一个预览窗口');

    // 预期 2: 已打开预览窗口, 显示图片
    console.log('预期 2: 已打开预览窗口, 显示图片');
    await agent.aiAssert('屏幕中间弹出一个预览窗口');
    await agent.aiAssert('窗口中显示图片');

  }, { timeout: 600000, tags: ['1850159', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'quick view', 'picture'] });

  test('1850159-文本、图片、视频、音乐快速访问_视频', async ({ device, system, agent, uos }) => {
    let test_file = 'test.mp4';
    let url = 'https://cdimage.uniontech.com/daily-iso/source/wuhan/stability/testvideo/demo.mp4';

    // 准备步骤: 准备测试文件${test_file}
    console.log(`准备测试文件${test_file}`);
    await system.exec(`wget ${url} -O ${test_dir}/${test_file}`);
    await agent.aiWaitFor(`文件管理器窗口${test_file}`);

    // 步骤 1: 单击选中${txt_file}
    console.log(`步骤 1: 单击选中${test_file}`);
    await agent.aiTap(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor(`选中${test_file}`);

    // 步骤 2: 点击空格
    console.log('步骤 2: 点击空格');
    await device.pressKey('Space');
    await agent.aiWaitFor('屏幕中间弹出一个预览窗口');

    // 预期 2: 已打开预览窗口, 视频正常播放
    console.log('预期 2: 已打开预览窗口, 视频正常播放');
    await agent.aiAssert('屏幕中间弹出一个预览窗口');
    await agent.aiAssert('窗口中视频正常播放');

  }, { timeout: 600000, tags: ['1850159', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'quick view', 'video'] });

  test('1850159-文本、图片、视频、音乐快速访问_音乐', async ({ device, system, agent, uos }) => {
    let test_file = 'test.mp3';
    let url = 'https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E9%9F%B3%E4%B9%90/%E9%9F%B3%E9%A2%91%E5%90%84%E7%A7%8D%E6%A0%BC%E5%BC%8F/mp3/Demons.mp3';

    // 准备步骤: 准备测试文件${test_file}
    console.log(`准备测试文件${test_file}`);
    await system.exec(`wget ${url} -O ${test_dir}/${test_file}`);
    await agent.aiWaitFor(`文件管理器窗口${test_file}`);

    // 步骤 1: 单击选中${txt_file}
    console.log(`步骤 1: 单击选中${test_file}`);
    await agent.aiTap(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor(`选中${test_file}`);

    // 步骤 2: 点击空格
    console.log('步骤 2: 点击空格');
    await device.pressKey('Space');
    await agent.aiWaitFor('屏幕中间弹出一个预览窗口');

    // 预期 2: 已打开预览窗口, 音乐正常播放
    console.log('预期 2: 已打开预览窗口, 音乐正常播放');
    await agent.aiAssert('屏幕中间弹出一个预览窗口');
    await agent.aiAssert('窗口中音乐正常播放');

  }, { timeout: 600000, tags: ['1850159', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'quick view', 'music'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm -v ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 删除测试文件夹
    console.log('删除测试文件夹');
    let result = await system.exec(`rm -rf -v ${test_dir}`);
    if (result.success) {
      console.log(`测试文件夹 ${test_dir} 已删除`);
    } else {
      console.log(`测试文件夹 ${test_dir} 删除失败`);
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
