/**
 * 用例 PMSID: 1805967
 * 用例标题: [033]我的目录-属性页面共享文件夹
 * 生成时间: 2026-07-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1805967-[033]我的目录-属性页面共享文件夹', () => {

  const test_folders_dict = {
    "桌面": "desktop",
    "视频": "video",
    "音乐": "music",
    "图片": "picture",
    "文档": "document",
    "下载": "download"
  }
  const test_folders = Object.keys(test_folders_dict);
  const share_config_prefix = `/var/lib/samba/usershares/`;

  const caseDir = process.env.TESTCASE_DIR;
  const PASSWD = process.env.TEST_PASSWORD;
  const USERNAME = process.env.TEST_USERNAME;
  const smbpwd = '1';

  let is_start = false;
  let is_smb_user = false;


  async function startSMB(system) {
    // 准备步骤: 设置共享密码
    console.log('准备步骤: 设置共享密码');
    let result = await system.exec(`echo ${PASSWD} | sudo -S pdbedit -L | grep ${USERNAME}`);
    is_smb_user = result.success;
    if (!is_smb_user) {
      await system.exec(`echo '${PASSWD}' | sudo -S su -c "printf '${smbpwd}\n${smbpwd}\n' | smbpasswd -a '${USERNAME}' -s"`);
    }

    // 准备步骤: 启动smbd服务
    console.log('准备步骤: 启动smbd服务');
    result = await system.exec(`echo ${PASSWD} | sudo -S systemctl is-active smbd`);
    is_start = result.success;
    await system.exec(`echo ${PASSWD} | sudo -S systemctl restart smbd`);
  }

  async function stopSMB(system) {
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
  }

  async function shareFolder(agent, folder) {
    // 步骤 1: 右击文件夹图标
    console.log('步骤 1: 右击文件夹图标');
    await agent.aiRightClick(`文件管理器右侧内容区域的${folder}`);
    await agent.aiWaitFor('文件右键菜单已显示');

    // 步骤 2: 点击属性
    console.log('步骤 2: 点击属性');
    await agent.aiTap('右键菜单中的属性按钮');
    await agent.aiWaitFor('属性页面已打开');

    // 步骤 3: 如果共享管理菜单没有展开, 点击共享管理
    console.log('步骤 3: 如果共享管理菜单没有展开， 点击共享管理');
    let isExpand = await agent.aiBoolean('共享管理菜单已展开');
    if (!isExpand) {
      await agent.aiTap('共享管理');
    }
    await agent.aiWaitFor('共享管理菜单已展开');

    // 步骤 4: 点击共享此文件夹左边的复选框
    console.log('步骤 4: 点击共享此文件夹左边的复选框');
    let isSelected = await agent.aiBoolean('共享文件夹已被勾选');
    if (!isSelected) {
      await agent.aiTap('共享此文件夹左边的复选框');
    }

    // 预期 4: 共享文件夹成功, 默认权限为可读写, 且不允许匿名访问
    console.log('预期 4: 共享文件夹成功， 默认权限为可读写， 且不允许匿名访问');
    await agent.aiAssert('共享文件夹被勾选');
    await agent.aiAssert('当前权限为可读写');
    await agent.aiAssert('当前匿名不允许');

    // 步骤 5: 修改权限为只读
    console.log('步骤 5: 修改权限为只读');
    await agent.aiTap('可读写选项');
    await agent.aiTap('只读');

    // 预期 5: 只读权限生效
    console.log('预期 5: 只读权限生效');
    await agent.aiAssert('当前权限是只读');

    // 步骤 6: 设置为允许匿名访问
    console.log('步骤 6: 设置为允许匿名访问');
    await agent.aiTap('匿名选项右边的不允许');
    await agent.aiTap('允许');

    // 预期 6: 允许匿名访问生效
    console.log('预期 6: 允许匿名访问生效');
    await agent.aiAssert('当前匿名设置为允许');
  }

  async function unshareFolder(system, assertTrue) {
    for (let folder of test_folders) {
      let share_config = `${share_config_prefix}${folder}`;

      // 清理步骤 1: 清除测试文件${folder}共享
      console.log('清理步骤 1: 清除测试文件${folder}共享');
      await system.exec(`test -f "${share_config}" && echo ${PASSWD} | sudo -S smbcontrol smbd close-share "${folder}"; `);
      await system.exec(`test -f "${share_config}" && echo ${PASSWD} | sudo -S rm -v "${share_config}"`)
      let result = await system.exec(`export LANG=zh_CN.UTF-8; ls -l "${share_config}" | grep "${folder}"`);
    //   console.log(result.stdout);
    //   console.log(result.stderr);
      assertTrue(!result.success, `清除测试文件${folder}共享失败, 请检查`);
    }
  }

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤: 开启SMB共享
    console.log('准备步骤：开启SMB共享');
    await startSMB(system);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 打开计算机页面
    console.log('准备步骤：打开计算机页面');
    await system.exec('dde-file-manager computer://');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器计算机页面打开成功');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 释放所有可能按下的按键
    console.log('清理步骤：释放所有可能按下的按键');
    await device.releaseAllKeys();

    // 清理步骤: 关闭所有文管窗口和属性对话框
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');
    await agent.aiWaitFor('所有文件管理器窗口和属性对话框关闭');

    // 清理步骤: 取消所有文件管理器共享
    console.log('清理步骤：取消所有文件管理器共享');
    await unshareFolder(system, assertTrue);
    
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 取消所有文件管理器共享
    console.log('清理步骤：取消所有文件管理器共享');
    await unshareFolder(system, assertTrue);

    // 清理步骤：停止SMB共享
    console.log('清理步骤：停止SMB共享');
    await stopSMB(system);
  });

  test('1805967-[033]我的目录-属性页面共享文件夹_桌面', async ({ device, agent, uos, system }) => {
    const test_folder = "桌面";
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'computer', 'share', 'desktop'] });

  test('1805967-[033]我的目录-属性页面共享文件夹_视频', async ({ device, agent, uos, system }) => {
    const test_folder = '视频';
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'share', 'video'] });

  test('1805967-[033]我的目录-属性页面共享文件夹_音乐', async ({ device, agent, uos, system }) => {
    const test_folder = '音乐';
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'share', 'music'] });

  test('1805967-[033]我的目录-属性页面共享文件夹_图片', async ({ device, agent, uos, system }) => {
    const test_folder = '图片';
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'share', 'picture'] });

  test('1805967-[033]我的目录-属性页面共享文件夹_文档', async ({ device, agent, uos, system }) => {
    const test_folder = '文档';
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'share', 'document'] });

  test('1805967-[033]我的目录-属性页面共享文件夹_下载', async ({ device, agent, uos, system }) => {
    const test_folder = '下载';
    // 步骤&预期 1: 共享${test_folder}
    console.log(`步骤&预期 1：共享${test_folder}`);
    await shareFolder(agent, test_folder);

  }, { timeout: 600000, tags: ['1805967', 'level3', 'remote', 'DITT', 'youwei', 'share', 'download'] });

});
