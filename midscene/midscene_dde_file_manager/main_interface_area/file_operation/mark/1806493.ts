/**
 * 用例 PMSID: 1806493
 * 用例标题:角标-设置损坏图片_
 * 生成时间: 2026-08-05 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806493-角标-设置损坏图片_', () => {

  const CASEDIR = process.env.TESTCASE_DIR;

  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = "testfile_1806493.txt"

  const username = process.env.TEST_USERNAME;
  let test_file_path = "/home/" + username + "/Desktop/" + test_file;
  let test_pic = "test.png"


  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    test_pic = "/home/" + username + "/Desktop/" + test_pic;
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
    await system.exec(`cp ${pic_url} ${test_pic}`);
    await system.exec(`head -c 1024 ${test_pic} > ${test_pic}`); // 截取图片的前1024个字节创建损坏的图片

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806493-角标-设置损坏图片_', async ({ device, agent, uos, system }) => {
    // 步骤 1: 给文件设置角标
    console.log('步骤 1: 给文件设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic};lu"`);
    // await agent.aiRightClick('桌面任意空白处');
    // await agent.aiWaitFor("右键菜单加载完成");
    // await agent.aiTap("刷新");

    // 预期 1: 文件角标设置失败
    console.log('预期 1: 文件角标设置失败');
    // assertFalse(result.success, `文件角标设置失败`);
    await device.pressKey('F5');
    await agent.aiAssert(`桌面上${test_file}角标设置失败, 文件${test_file}左上角没有缩小的龙猫图片`);

  }, { timeout: 600000, tags: ['1806493', 'level4', 'DITT', 'youwei', 'emblems'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
