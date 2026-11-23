/**
 * 用例 PMSID: 1990349
 * 用例标题: 【无法删除时彻底删除文件】U盘空间不足时彻底删除文件
 * 生成时间: 2026-11-16 20:00:00
 * 用例编写人: UT000649（黄甜）
 */

// @ts-nocheck

const username = process.env.TEST_USERNAME || 'uos';
let USB_FLASH = process.env.USB_FLASH;
let usbDir;

describe('1990349-【无法删除时彻底删除文件】U盘空间不足时彻底删除文件', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    // 动态检测U盘挂载点（环境变量未设时自动找 /media/uos/ 下非 smbmounts 的目录）
    if (!USB_FLASH) {
      const lsResult = await system.exec(`ls /media/${username}/`);
      const mounts = (lsResult.stdout || '').trim().split('\n').filter(m => m && m !== 'smbmounts');
      USB_FLASH = mounts[0] || 'USB_FLASH';
    }
    usbDir = `/media/${username}/${USB_FLASH}`;
    console.log(`=== 检测到U盘挂载点: ${usbDir} ===`);

    // 前置2：U盘中预先创建 视频文件 + 文本文件 + 文件夹
    console.log('=== 前置条件2：U盘中创建测试文件 ===');
    await system.exec(`echo "fake video" > ${usbDir}/1990349-video.mp4`);
    await system.exec(`echo "fake text" > ${usbDir}/1990349-text.txt`);
    await system.exec(`mkdir -p ${usbDir}/1990349-folder && echo "inside folder" > ${usbDir}/1990349-folder/nested.txt`);
    console.log('✅ 视频 + 文本 + 文件夹 已创建');

    // 前置3：fallocate 填满U盘剩余空间
    console.log('=== 前置条件3：fallocate 填满U盘 ===');
    const dfResult = await system.exec(`df -h ${usbDir} | tail -1 | awk '{print $4}'`);
    const fillSize = (dfResult.stdout || '').trim();
    console.log(`U盘剩余空间 = "${fillSize}"`);
    await system.exec(`fallocate -l ${fillSize} ${usbDir}/test`);
    const dfAfter = await system.exec(`df -h ${usbDir} | tail -1`);
    console.log(`填满后: ${(dfAfter.stdout || '').trim()}`);

    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  test('1990349-【无法删除时彻底删除文件】U盘空间不足时彻底删除文件', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤2：点击左侧U盘挂载点，进入U盘目录
    await agent.aiTap(`文件管理器左侧栏中的 ${USB_FLASH} U盘挂载点`);
    await new Promise(r => setTimeout(r, 2000));

    // 步骤3：选中U盘中的视频文件，右键删除
    await agent.aiRightClick(`U盘中的 1990349-video.mp4 文件`);
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('右键菜单中的删除选项');

    // 步骤4：预期弹出彻底删除窗口，点击彻底删除
    await agent.aiWaitFor('彻底删除弹窗已显示', { timeoutMs: 10000 });
    console.log('✅ 彻底删除弹窗已弹出');
    await agent.aiTap('彻底删除弹窗中的彻底删除按钮');
    await new Promise(r => setTimeout(r, 3000));

    // 步骤5：断言1 - U盘中该文件不存在
    await agent.aiAssert(`U盘中不再显示 1990349-video.mp4 文件`);
    console.log('✅ U盘中无该文件');

    // 断言2 - 回收站中无该文件
    const trashCheck = await system.exec(`ls /home/${username}/.local/share/Trash/files/ 2>/dev/null | grep -c 1990349 || echo 0`);
    const trashCount = parseInt((trashCheck.stdout || '').trim(), 10);
    if (trashCount > 0) {
      throw new Error(`回收站中还有 1990349 相关文件`);
    }
    console.log('✅ 回收站中无该文件');

  }, { timeout: 600000, tags: ['1990349', 'level3', '2500u1', 'permanently_delete', 'huangtian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    // 清理所有前置条件创建的文件 + fallocate 填满U盘的 test 文件
    console.log('=== 清理：删除所有前置文件 ===');
    await system.exec(`rm -f ${usbDir}/test ${usbDir}/1990349-video.mp4 ${usbDir}/1990349-text.txt 2>/dev/null`);
    await system.exec(`rm -rf ${usbDir}/1990349-folder 2>/dev/null`);
    const dfDone = await system.exec(`df -h ${usbDir} 2>/dev/null | tail -1`);
    console.log(`清理后U盘: ${(dfDone.stdout || '').trim()}`);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
