/**
 * 用例 PMSID: 2003943
 * 用例标题: 埋点，侧边栏各目录去重后的点击分布-挂载ftp共享文件夹
 * 生成时间: 2026-05-22 11:04:46
 * 用例编写人: UT002411（胡戬）
 */

// 清理测试环境：关闭文件管理器进程，删除配置文件
async function clearEnv(system) {
  try {
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    console.log('环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

// 获取日志文件大小（字节数），用于后续计算新增日志的偏移量
async function getLogFileSize(system, logFile) {
  const result = await system.exec(`stat -c %s ${logFile} 2>/dev/null || echo 0`);
  return parseInt(result.stdout.trim(), 10);
}

// 获取最新的埋点日志文件路径
async function getLatestLogFile(system) {
  const logDir = '/var/lib/deepin/event-log';
  const findResult = await system.exec(`ls -t ${logDir}/event_*.log 2>/dev/null | head -1`);
  return findResult.stdout.trim();
}

// 从指定偏移量开始读取日志文件，获取操作后新增的埋点日志内容
async function readNewLogs(system, logFile, offset) {
  if (offset > 0) {
    const result = await system.exec(`tail -c +${offset + 1} ${logFile}`);
    return result.stdout.trim();
  }
  const result = await system.exec(`cat ${logFile}`);
  return result.stdout.trim();
}

describe('2003943-埋点，侧边栏各目录去重后的点击分布-挂载ftp共享文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });

  test('2003943-埋点，侧边栏各目录去重后的点击分布-挂载ftp共享文件夹', async ({ device, agent, uos, system }) => {
    const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64';
    const ftpIp = process.env.FTP_IP;
    const ftpUsername = process.env.FTP_USERNAME;
    const ftpPassword = process.env.FTP_PASSWORD;

    if (!ftpIp || !ftpUsername || !ftpPassword) {
      throw new Error('缺少FTP环境变量配置：FTP_IP, FTP_USERNAME, FTP_PASSWORD');
    }

    // 步骤1：前置清理ftp挂载
    console.log('步骤1：前置清理ftp挂载');
    const { cleanFtpMounts } = await import(`${caseDir}/midscene_dde_file_manager/common/common.ts`);
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');
    await cleanFtpMounts(agent, system, device);

    // 步骤2：挂载ftp
    console.log('步骤2：挂载ftp');
    const { FtpMount } = await import(`${caseDir}/midscene_dde_file_manager/common/common.ts`);
    await FtpMount(agent, system, device, 1);

    // 断言1：挂载成功
    console.log('断言1：验证ftp挂载成功');
    await agent.aiAssert(`侧边栏存在${ftpIp}挂载项`, { deepThink: true });
    console.log('断言1通过：ftp挂载成功');

    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 操作前：记录埋点日志文件大小
    const logSizeBefore = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore}`);

    // 步骤3：点击侧边栏ftp地址项
    console.log('步骤3：点击侧边栏ftp地址项');
    await agent.aiTap('侧边栏中的计算机');
    await agent.aiTap(`侧边栏中的${ftpIp}文本`, { deepThink: true });
    await agent.aiWaitFor('已进入共享目录');

    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤4：读取操作后新增的埋点日志
    console.log('步骤4：读取点击ftp后新增的埋点日志');
    const newLogs = await readNewLogs(system, logFile, logSizeBefore);
    console.log(`点击ftp后新增的埋点日志:\n${newLogs}`);

    if (!newLogs) {
      throw new Error('点击ftp后未产生新的埋点日志');
    }

    // 断言2：埋点日志包含文管版本、操作日期时间、侧边栏目录名称（ftp地址）
    console.log('断言2：验证新增埋点日志上报内容');
    const hasAppVersion = newLogs.includes('app_version');
    const hasSysTime = newLogs.includes('sysTime');
    const hasSidebarItem = newLogs.includes('sidebar_item') && newLogs.includes('Sharing Folders');
    if (!hasAppVersion || !hasSysTime || !hasSidebarItem) {
      console.log(`断言2详情: app_version=${hasAppVersion}, sysTime=${hasSysTime}, sidebar_item=${hasSidebarItem}`);
      throw new Error(`断言2失败：新增埋点日志缺少必要字段 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, sidebar_item:${hasSidebarItem}`);
    }
    console.log('断言2通过：成功验证新增埋点日志包含文管版本、操作日期时间和侧边栏目录名称');

  }, { timeout: 600000, tags: ['2003943', 'level3', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64';
    const ftpIp = process.env.FTP_IP;

    // 后置步骤1：卸载挂载的ftp
    try {
      if (ftpIp) {
        const { cleanFtpMounts } = await import(`${caseDir}/midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, device);
        console.log('已卸载ftp挂载');
      }
    } catch (err) {
      console.error('卸载ftp失败:', err);
    }

    // 后置步骤2：环境清理
    await clearEnv(system);
    await uos.showDesktop();
  });
});
