/**
 * 用例 PMSID: 1806513
 * 用例标题: 角标设置-设置不支持格式/大小的图片
 * 生成时间: 2026-08-24 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806513-角标设置-设置不支持格式/大小的图片', () => {
  const CASEDIR = process.env.TESTCASE_DIR;
  const USERNAME = process.env.TEST_USERNAME;

  const pics = 
    {
      "test.tif": `${CASEDIR}midscene_dde_file_manager/resources/test_res/fly.tif`,
      "test.pgm": `${CASEDIR}midscene_dde_file_manager/resources/test_res/PGM.pgm`,
      "test_100K.png": `${CASEDIR}midscene_dde_file_manager/resources/test_res/2k9o1m.png`
    }
  const test_file = "testfile_1806513.txt"

  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);

    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  test('1806513-角标设置-设置不支持格式/大小的图片', async ({ device, agent, uos, system }) => {
    for (let pic_file in pics) {
      if (Object.hasOwnProperty.call(pics, pic_file)) {
        let pic_url = pics[pic_file];
        // 步骤 1： 准备测试图片
        console.log(`步骤 1： 准备测试图片`);
        const test_pic_path = `${work_dir}/${pic_file}`;
        await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
        await system.exec(`cp ${pic_url} ${test_pic_path}`);

        // 步骤 2: 给文件设置角标
        console.log(`步骤 2： 给文件设置角标`);
        await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);

        // 预期 2: 文件角标设置不成功， 文件右上角没有缩小的龙猫图片
        console.log(`预期 2： 文件角标设置不成功， 文件右上角没有缩小的龙猫图片`);
        await device.pressKey('F5');
        await agent.aiAssert(`桌面上${test_file}右上角没有缩小的龙猫图片`);
      }
    }
  }, { timeout: 600000, tags: ['1806513', 'level3', 'DITT', 'youwei', 'emblems', 'invaild pic'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    for (const pic_file of Object.keys(pics)) {
      const test_pic_path = `${work_dir}/${pic_file}`;
      await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    }

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
