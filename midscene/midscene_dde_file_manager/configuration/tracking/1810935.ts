/**
 * 用例 PMSID: 1810935
 * 用例标题: 埋点，侧边栏各目录去重后的点击分布-保险箱
 * 生成时间: 2026-05-22 14:00:00
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

describe('1810935-埋点，侧边栏各目录去重后的点击分布-保险箱', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();

    // 前置条件：创建一个保险箱（透明加密）
    const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64';
    const { rmVault, createNoPasswordVault } = await import(`${caseDir}/midscene_dde_file_manager/common/common.ts`);
    console.log('前置条件：删除可能存在的保险箱');
    await rmVault(system);
    console.log('前置条件：创建透明加密保险箱');
    await createNoPasswordVault(uos, env, agent, device, system);
    console.log('前置条件：透明加密保险箱创建完成');
  });

  test('1810935-埋点，侧边栏各目录去重后的点击分布-保险箱', async ({ device, agent, uos, system }) => {
    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 操作前：记录埋点日志文件大小
    const logSizeBefore = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore}`);

    // 步骤1：打开文管，点击左侧边栏-保险箱
    console.log('步骤1：打开文件管理器，点击侧边栏保险箱');
    await agent.aiTap('左侧边栏中的计算机', { deepThink: true });
    await agent.aiTap('左侧边栏中的保险箱', { deepThink: true });
    await agent.aiWaitFor('已切换到保险箱目录');

    // 断言1：切换到保险箱目录
    console.log('断言1：验证已切换到保险箱目录');
    await agent.aiAssert('当前已切换到保险箱目录', { deepThink: true });
    console.log('断言1通过：已成功切换到保险箱目录');

    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：读取操作后新增的埋点日志
    console.log('步骤2：读取点击保险箱后新增的埋点日志');
    const newLogs = await readNewLogs(system, logFile, logSizeBefore);
    console.log(`点击保险箱后新增的埋点日志:\n${newLogs}`);

    if (!newLogs) {
      throw new Error('点击保险箱后未产生新的埋点日志');
    }

    // 断言2：埋点日志包含文管版本、操作日期时间、侧边栏目录名称（Vault）
    console.log('断言2：验证新增埋点日志上报内容');
    const hasAppVersion = newLogs.includes('app_version');
    const hasSysTime = newLogs.includes('sysTime');
    const hasSidebarItem = newLogs.includes('sidebar_item') && newLogs.includes('Vault');
    if (!hasAppVersion || !hasSysTime || !hasSidebarItem) {
      console.log(`断言2详情: app_version=${hasAppVersion}, sysTime=${hasSysTime}, sidebar_item=Vault=${hasSidebarItem}`);
      throw new Error(`断言2失败：新增埋点日志缺少必要字段 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, sidebar_item(Vault):${hasSidebarItem}`);
    }
    console.log('断言2通过：成功验证新增埋点日志包含文管版本、操作日期时间和侧边栏目录名称Vault');

  }, { timeout: 600000, tags: ['1810935', 'level3', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64';

    // 后置步骤1：删除创建的保险箱
    try {
      const { rmVault } = await import(`${caseDir}/midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      console.log('已删除保险箱');
    } catch (err) {
      console.error('删除保险箱失败:', err);
    }

    // 后置步骤2：环境清理
    await clearEnv(system);
    await uos.showDesktop();
  });
});
