/**
 * 用例 PMSID: 1850211
 * 用例标题: 共享文件夹-不可匿名访问-读写
 * 生成时间: 2026-04-29 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850211-共享文件夹-不可匿名访问-读写', () => {

  // 测试相关变量定义
  const PASSWD = process.env.TEST_PASSWORD;
  const USERNAME = process.env.TEST_USERNAME;

  const work_dir = "~/Desktop/";
  const test_folder = "testdir_1850211";

  const smbpwd = '1';
  const share_config = `/var/lib/samba/usershare/${test_folder}`;

  let is_smb_user = false;
  let is_start = false;

  // 相关方法定义
  // 鉴权方法
  async function auth(system, device, agent, passwd) {
    const auth_process = 'polkit-agent-helper';
    let result = await system.exec(`ps aux | grep -v grep | grep ${auth_process} | awk '{print $2}'`);
    if (result.success) {
      await device.typeText(passwd);
      // await agent.aiInput('密码输入框', env.TEST_PASSWORD);
      await agent.aiWaitFor('确定按钮可以使用')
      await agent.aiTap('确定');
    }
  }

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 清理测试文件夹${work_dir}${test_folder}, 以免干扰测试
    console.log(`准备步骤: 清理测试文件夹${work_dir}${test_folder}, 以免干扰测试`);
    await system.exec(`test -d ${work_dir}${test_folder} && rm -rf ${work_dir}${test_folder} || true`);

    // 准备步骤: 清除测试文件${work_dir}共享
    console.log('准备步骤: 清除测试文件${work_dir}共享');
    await system.exec(`test -f ${share_config} && echo ${PASSWD} | sudo -S smbcontrol smbd close-share ${test_folder} ; rm ${share_config}`);

    // 准备步骤: 设置共享密码
    console.log('准备步骤: 设置共享密码');
    let result = await system.exec(`echo ${PASSWD} | sudo -S pdbedit -L | grep ${USERNAME}`);
    is_smb_user = result.success;
    if (!is_smb_user) {
      await system.exec(`echo '${PASSWD}' | sudo -S su -c "printf '${smbpwd}\n${smbpwd}\n' | smbpasswd -a '${USERNAME}' -s"`);
    }

    // 准备步骤: 清除测试文件${work_dir}共享
    console.log('准备步骤: 清除测试文件${work_dir}共享');
    await system.exec(`test -f ${share_config} && echo ${PASSWD} | sudo -S smbcontrol smbd close-share ${test_folder} ; echo ${PASSWD} | sudo -S rm ${share_config}`);

    // 准备步骤: 启动smbd服务
    console.log('准备步骤: 启动smbd服务');
    result = await system.exec(`echo ${PASSWD} | sudo -S systemctl is-active smbd`);
    is_start = result.success;
    await system.exec(`echo ${PASSWD} | sudo -S systemctl restart smbd`);

    // 准备步骤: 创建测试文件夹${work_dir}${test_folder}
    console.log(`准备步骤: 创建测试文件夹${work_dir}${test_folder}`);
    await system.exec(`mkdir -pv ${work_dir}${test_folder}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 清除测试文件${work_dir}共享
    console.log('清理步骤: 清除测试文件${work_dir}共享');
    await system.exec(`test -f ${share_config} && echo ${PASSWD} | sudo -S smbcontrol smbd close-share ${test_folder} ; rm ${share_config}`);

    // 清理步骤: 清理测试文件夹${work_dir}${test_folder}
    console.log(`清理步骤: 清理测试文件夹${work_dir}${test_folder}`);
    await system.exec(`test -d ${work_dir}${test_folder} && rm -rf ${work_dir}${test_folder} || true`);

    // 清理步骤: 如果测试前测试用户不在smb用户列表中, 删除测试用户
    console.log('清理步骤: 如果测试前测试用户不在smb用户列表中, 删除测试用户');
    if (!is_smb_user) {
      await system.exec(`echo ${PASSWD} | sudo -S pdbedit -x ${USERNAME}`);
    }

    // 清理步骤: 如果测试前smbd服务未启动, 关闭smbd服务
    console.log('清理步骤: 如果测试前smbd服务未启动, 关闭smbd服务');
    if (!is_start) {
      await system.exec(`echo ${PASSWD} | sudo -S systemctl stop smbd`);
    }

    // 清理步骤: 重启桌面, 确保关闭属性窗口
    console.log('清理步骤: 重启桌面, 确保关闭属性窗口');
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850211-共享文件夹-不可匿名访问-读写', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右键点击桌面上${test_folder}图标
    console.log(`步骤 1: 右键点击桌面上${test_folder}图标`);
    await agent.aiRightClick(`桌面上${test_folder}图标`);
    await agent.aiWaitFor('打开右键菜单, 右键菜单中有共享文件夹选项');

    // 步骤 2: 点击右键菜单中的共享文件夹选项
    console.log('步骤 2: 点击右键菜单中的共享文件夹选项');
    await agent.aiTap('右键菜单中的共享文件夹选项');
    await agent.aiWaitFor('打开文件夹属性窗口, 共享管理选项被展开');

    // 步骤 3: 勾选共享此文件夹选项
    console.log('步骤 3: 勾选共享此文件夹选项');
    await agent.aiTap('共享此文件夹选项左边的勾选框');

    // 步骤 3-1: 如果有共享名重复弹窗, 先点击"替换"按钮
    console.log("步骤 3-1: 如果有共享名重复弹窗, 先点击'替换'按钮");
    if (await agent.aiBoolean('有 该共享名已存在, 是否替换原有共享文件夹 的弹窗')) {
      await agent.aiTap('替换按钮');
      await agent.aiWaitFor('该共享名已存在, 是否替换原有共享文件夹 的弹窗关闭');
    }

    // 预期 3: 共享文件夹信息正确
    console.log('预期 3: 共享文件夹信息正确');
    await agent.aiWaitFor('共享此文件夹选项左边的勾选框被勾选');
    await agent.aiWaitFor(`文件夹共享名是${test_folder}`);
    await agent.aiWaitFor('权限是可读写');
    await agent.aiWaitFor('匿名是不允许');

    // 步骤 4: 关闭属性窗口
    console.log('步骤 4: 关闭属性窗口');
    await agent.aiTap('属性对话框窗口右上角的关闭按钮X');
    await agent.aiWaitFor('属性对话框窗口关闭');

    // 预期 4: 文件夹${test_folder}右下角有共享图标
    console.log('预期 4: 文件夹${test_folder}右下角有共享图标');
    await agent.aiWaitFor(`文件夹${test_folder}右下角有共享图标`);

  }, { timeout: 600000, tags: ['1850211', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'shared folder', 'non-anonymous'] });

});
