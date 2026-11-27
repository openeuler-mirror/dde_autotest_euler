/**
 * 用例 PMSID: 1806533
 * 用例标题: 角标设置-FTP/SMB目录设置角标
 * 生成时间: 2026-08-26 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806533-角标设置-FTP/SMB目录设置角标', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  const test_pic_path = `/home/${USERNAME}/Desktop/test.jpg`;
  const test_pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;

  const test_file = "testfile_1806533.txt";
  let test_file_path = "";

  let umount_func = null;
  let umount_func_args = [];

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 下载测试图片
    console.log('准备步骤: 下载测试图片');
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    await system.exec(`cp ${test_pic_url} ${test_pic_path}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    if (test_file_path != "") {
      await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    }
    test_file_path = "";
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);

    // 清理步骤: 取消挂载
    console.log('清理步骤: 取消挂载');
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');
    await umount_func(...umount_func_args);
    umount_func = null;
    umount_func_args = [];

    // 清理步骤: 清理环境
    console.log('清理步骤: 清理环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 清理步骤: 显示桌面
    console.log('清理步骤: 显示桌面');
    await uos.showDesktop();
  });


  test('1806533-角标设置-FTP/SMB目录设置角标_SMB', async ({ device, agent, uos, system }) => {
    const { SmbMount, cleanSmbMounts } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);

    umount_func = cleanSmbMounts;
    umount_func_args = [agent, system, 1];
    const work_dir = `/media/${USERNAME}/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/`;
    // 步骤 1: 挂载SMB目录
    console.log('步骤 1: 挂载SMB目录');
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');
    await SmbMount(agent, system, device, 1);

    // 步骤 2: 打开SMB目录
    console.log('步骤 2: 打开SMB目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器已打开, 并跳转到 ${process.env.SMB_DIR} 目录`);

    // 步骤 3: 创建测试文件
    console.log('步骤 3: 创建测试文件');
    test_file_path = `${work_dir}${test_file}`;
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 预期 3: 测试文件${test_file}创建成功
    console.log(`预期 3：测试文件${test_file}创建成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件管理器右侧内容窗口有${test_file}文件图标`);

    // 步骤 4: 设置角标
    console.log('步骤 4: 设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);

    // 预期 4: 文件${test_file}角标设置失败
    console.log(`预期 4：文件${test_file}角标设置失败`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置失败, 文件${test_file}右上角没有有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806533', 'level3', 'DITT', 'youwei', 'emblems', 'smb'] });

  test('1806533-角标设置-FTP/SMB目录设置角标_FTP', async ({ device, agent, uos, system }) => {
    const { FtpMount, cleanFtpMounts } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);

    umount_func = cleanFtpMounts;
    umount_func_args = [agent, system, device];
    const work_dir = `/run/user/1000/gvfs/ftp:host=${process.env.FTP_IP}/`;
    // 步骤 1: 挂载FTP目录
    console.log('步骤 1: 挂载FTP目录');
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');
    await FtpMount(agent, system, device, 1);

    // 步骤 2: 打开FTP目录
    console.log('步骤 2: 打开FTP目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器已打开, 并跳转到 ${process.env.FTP_IP}上的/ 目录`);

    // 步骤 3: 创建测试文件
    console.log('步骤 3: 创建测试文件');
    test_file_path = `${work_dir}${test_file}`;
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 预期 3: 测试文件${test_file}创建成功
    console.log(`预期 3：测试文件${test_file}创建成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件管理器右侧内容窗口有${test_file}文件图标`);

    // 步骤 4: 设置角标
    console.log('步骤 4: 设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);

    // 预期 4: 文件${test_file}角标设置失败
    console.log(`预期 4：文件${test_file}角标设置失败`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置失败, 文件${test_file}右上角没有有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806533', 'level3', 'DITT', 'youwei', 'emblems', 'ftp'] });

  test('1806533-角标设置-FTP/SMB目录设置角标_SFTP', async ({ device, agent, uos, system }) => {
    const { SftpMount, cleanSftpMounts } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);

    umount_func = cleanSftpMounts;
    umount_func_args = [agent, system];
    const work_dir = `/run/user/1000/gvfs/sftp:host=${process.env.SFTP_IP}/sftp/upload/`;
    // 步骤 1: 挂载SFTP目录
    console.log('步骤 1: 挂载SFTP目录');
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');
    await SftpMount(agent, system, device, 1);

    // 步骤 2: 打开SFTP目录
    console.log('步骤 2: 打开SFTP目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器已打开, 并跳转到 upload 目录`);

    // 步骤 3: 创建测试文件
    console.log('步骤 3: 创建测试文件');
    test_file_path = `${work_dir}${test_file}`;
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 预期 3: 测试文件${test_file}创建成功
    console.log(`预期 3：测试文件${test_file}创建成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件管理器右侧内容窗口有${test_file}文件图标`);

    // 步骤 4: 设置角标
    console.log('步骤 4: 设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);

    // 预期 4: 文件${test_file}角标设置失败
    console.log(`预期 4：文件${test_file}角标设置失败`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置失败, 文件${test_file}右上角没有有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806533', 'level3', 'DITT', 'youwei', 'emblems', 'sftp'] });
});
