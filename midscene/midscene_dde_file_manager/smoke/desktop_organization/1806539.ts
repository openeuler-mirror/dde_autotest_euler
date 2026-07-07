/**
 * 用例 PMSID: 1806539
 * 用例标题: [005][core]角标设置-桌面文件/文件夹设置角标
 * 生成时间: 2026-01-20 10:00:00
 * 用例编写人: UT000159（游伟）
 */

const pic_url = "https://cdimage.uniontech.com/daily-iso/source/chengdu/%E5%A4%9A%E5%AA%92%E4%BD%93/%E7%9C%8B%E5%9B%BE/%E4%B8%8D%E5%90%8C%E6%A0%BC%E5%BC%8F%E5%9B%BE%E7%89%87/20150826145233628.jpg";
const test_file = "testfile_1806539.txt"
const test_folder = "testfolder_1806539"
let test_file_path = ""
let test_dir = ""
let test_pic = "test.png"

describe('1806539-[005][core]角标设置-桌面文件/文件夹设置角标', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    let result = await system.exec(`whoami`);
    const user = result.stdout.trim();
    test_dir = "/home/" + user + "/Desktop/" + test_folder;
    test_file_path = "/home/" + user + "/Desktop/" + test_file;
    test_pic = "/home/" + user + "/Desktop/" + test_pic;
    await system.exec(`touch ${test_file_path}`);
    await system.exec(`mkdir ${test_dir}`);
    await system.exec(`wget ${pic_url} -O ${test_pic}`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806539-[005][core]角标设置-桌面文件/文件夹设置角标', async ({ device, agent, uos, system }) => {
    // 步骤 1: 给文件设置角标
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic};lu"`);
    // await agent.aiRightClick('桌面任意空白处');
    // await agent.aiWaitFor("右键菜单加载完成");
    // await agent.aiTap("刷新");
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置成功, 文件${test_file}左上角有缩小的图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行已使用aiWaitFor断言成功
    // await agent.aiAssert(`桌面上${test_file}角标设置成功, 文件${test_file}左上角有缩小的图片`);

    // 步骤 2: 给文件夹设置角标
    await system.exec(`gio set ${test_dir} -t stringv metadata::emblems "${test_pic};lu"`);
    // await agent.aiRightClick('桌面任意空白处');
    // await agent.aiWaitFor("右键菜单加载完成");
    // await agent.aiTap("刷新");
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_folder}角标设置成功, 文件夹${test_folder}左上角有缩小的图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行已使用aiWaitFor断言成功
    // await agent.aiAssert(`对比${check_folder}, 桌面上${test_folder}角标设置成功, 文件夹${test_folder}左上角有缩小的图片`);

  }, { timeout: 600000, tags: ['1806539', 'level2', 'smoke', 'DITT', 'youwei', 'desktop', 'emblems', 'badges'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);
    await system.exec(`gio set ${test_dir} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -d ${test_dir} && rmdir ${test_dir} | true`);
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} | true`);
    await system.exec(`test -f ${test_pic} && rm ${test_pic} | true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
