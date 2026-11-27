/**
 * 用例 PMSID: 1809813
 * 用例标题: 【撤销交互】【文件管理器】sftp远程路径新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销
 * 生成时间: 2026-07-10 17:17:53
 * 用例编写人: UT002411（胡戬）
 */

const caseDir = process.env.TESTCASE_DIR;
const sftpIp = process.env.SFTP_IP;
const sftpMountPath = `/run/user/1000/gvfs/sftp:host=${sftpIp}/sftp/upload`;

// 功能函数：初始化文管测试环境
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin.dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -f "${sftpMountPath}/新建文本.txt"`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1809813-【撤销交互】【文件管理器】sftp远程路径新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();

    // 前置条件：挂载一个sftp测试文件夹
    console.log('前置条件：挂载sftp测试文件夹');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    const { cleanSftpMounts, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    await SftpMount(agent, system, device);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Alt', 'F4');
  });

  test('1809813-【撤销交互】【文件管理器】sftp远程路径新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system }) => {
    // 打开文件管理器并进入sftp目录
    console.log('打开文件管理器并进入sftp共享目录');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap(`侧边栏中的${sftpIp}文本`, { deepThink: true });

    // 步骤1：在sftp测试文件夹中，新建一个文本文档
    console.log('步骤1：在sftp测试文件夹中，新建一个文本文档');
    await agent.aiRightClick('sftp共享目录空白区域', { deepThink: true });
    await agent.aiTap('右键菜单中的新建文档');
    await agent.aiTap('二级菜单中的文本文档');
    await agent.aiTap('sftp共享目录空白区域', { deepThink: true });

    // 断言1：新建成功
    console.log('断言1：新建文本文档成功');
    await agent.aiAssert('sftp共享目录中存在新建文本.txt文件');
    console.log('断言1通过：新建文本文档成功');

    // 步骤2：Ctrl+Z撤销新建文本文档
    console.log('步骤2：Ctrl+Z撤销新建文本文档');
    await device.pressKey('Ctrl', 'z');
    await agent.aiWaitFor('彻底删除弹窗已显示', { timeoutMs: 10000 });
    await agent.aiTap('弹框右下角红色字体的删除按钮', { deepThink: true });

    // 断言2：新建的文档被删除
    console.log('断言2：新建的文档被删除');
    await agent.aiAssert('sftp共享目录中不存在新建文本.txt文件');
    console.log('断言2通过：新建的文档被删除');

    // 步骤3：Ctrl+Y恢复撤销新建文本文档
    console.log('步骤3：Ctrl+Y恢复撤销新建文本文档');
    await device.pressKey('Ctrl', 'y');
    await agent.aiTap('sftp共享目录空白区域', { deepThink: true });

    // 断言3：新建的文档被恢复
    console.log('断言3：新建的文档被恢复');
    await agent.aiAssert('sftp共享目录中存在新建文本.txt文件');
    console.log('断言3通过：新建的文档被恢复');

  }, {
    timeout: 600000,
    tags: ['1809813', 'level3', 'cancel', 'hujian']
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理sftp中新建的文档
    try {
      await system.exec(`rm -f "${sftpMountPath}/新建文本.txt"`);
    } catch (err) {
      console.error('清理sftp文档失败:', err);
    }

    // 卸载sftp
    try {
      await uos.openApp('文件管理器', { maximizeWindow: true });
      await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 20000 });
      const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSftpMounts(agent, system);
      console.log('sftp卸载完成');
    } catch (err) {
      console.error('卸载sftp失败:', err);
    }

    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
