/**
 * 用例 PMSID: 1815867
 * 用例标题: 埋点-右键菜单项点击分布-以管理员身份打开（空白地方）
 * 生成时间: 2026-05-25 16:30:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME || 'uos';

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

describe('1815867-埋点-右键菜单项点击分布-以管理员身份打开（空白地方）', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });

  test('1815867-埋点-右键菜单项点击分布-以管理员身份打开（空白地方）', async ({ device, agent, uos, system }) => {
    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 步骤1：打开文件管理器，进入文档目录
    console.log('步骤1：打开文件管理器，进入文档目录');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap('左侧边栏中的文档', { deepThink: true });

    // 断言1：已进入文档目录
    console.log('断言1：验证已进入文档目录');
    await agent.aiAssert('当前已进入文档目录', { deepThink: true });
    console.log('断言1通过：已进入文档目录');

    // 操作前：记录埋点日志文件大小
    const logSizeBefore = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore}`);

    // 步骤2：在当前目录空白处右键点击"以管理员身份打开"，然后按esc退出
    console.log('步骤2：在当前目录空白处右键点击"以管理员身份打开"');
    await agent.aiRightClick('文件管理器当前目录的空白区域');
    await agent.aiTap('右键菜单中的以管理员身份打开');

    // 等待认证窗口出现后按ESC退出
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Escape');

    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：检查埋点日志
    console.log('步骤3：读取以管理员身份打开操作后新增的埋点日志');
    const newLogs = await readNewLogs(system, logFile, logSizeBefore);
    console.log(`以管理员身份打开操作后新增的埋点日志:\n${newLogs}`);

    if (!newLogs) {
      throw new Error('以管理员身份打开操作后未产生新的埋点日志');
    }

    // 断言2：触发上报事件，上报内容：文管版本、操作日期时间、选项名称、选中文件类型、进程名称(dde-file-manager/dde-desktop)、触发位置（file/none）
    console.log('断言2：验证以管理员身份打开的新增埋点日志上报内容');
    const hasAppVersion = newLogs.includes('app_version');
    const hasSysTime = newLogs.includes('sysTime');
    const hasItemName = newLogs.includes('item_name') && newLogs.includes('以管理员身份打开');
    const hasType = newLogs.includes('type');
    const hasProcess = newLogs.includes('dde-file-manager') || newLogs.includes('dde-desktop') || newLogs.includes('org.deepin.dde-shell');
    const hasLocation = newLogs.includes('location');
    if (!hasAppVersion || !hasSysTime || !hasItemName || !hasType || !hasProcess || !hasLocation) {
      console.log(`断言2详情: app_version=${hasAppVersion}, sysTime=${hasSysTime}, item_name=${hasItemName}, type=${hasType}, process=${hasProcess}, location=${hasLocation}`);
      throw new Error(`断言2失败：以管理员身份打开新增埋点日志缺少必要字段 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, item_name:${hasItemName}, type:${hasType}, process:${hasProcess}, location:${hasLocation}`);
    }
    console.log('断言2通过：成功验证以管理员身份打开的新增埋点日志包含文管版本、操作日期时间、选项名称(以管理员身份打开)、选中文件类型、进程名称、触发位置');

  }, { timeout: 600000, tags: ['1815867', 'level4', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');

    // 后置步骤：环境清理
    await clearEnv(system);
    await uos.showDesktop();
  });
});
