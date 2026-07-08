/**
 * 用例 PMSID: 1815841
 * 用例标题: 埋点，右键菜单项点击分布-排序方式，修改时间
 * 生成时间: 2026-05-25 10:00:00
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

describe('1815841-埋点，右键菜单项点击分布-排序方式，修改时间', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });

  test('1815841-埋点，右键菜单项点击分布-排序方式，修改时间', async ({ device, agent, uos, system }) => {
    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 操作前：记录埋点日志文件大小（场景1：桌面右键排序方式-修改时间）
    const logSizeBefore1 = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore1}`);

    // 步骤1：在桌面空白处右键菜单，点击排序方式--修改时间
    console.log('步骤1：在桌面空白处右键菜单，点击排序方式--修改时间');
    await agent.aiRightClick('桌面空白处');
    await agent.aiTap('右键菜单中的排序方式');
    await agent.aiTap('二级菜单中的修改时间');
    
    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：检查埋点日志
    console.log('步骤2：读取桌面排序方式操作后新增的埋点日志');
    const newLogs1 = await readNewLogs(system, logFile, logSizeBefore1);
    console.log(`桌面排序方式操作后新增的埋点日志:\n${newLogs1}`);

    if (!newLogs1) {
      throw new Error('桌面排序方式操作后未产生新的埋点日志');
    }

    // 断言1：触发上报事件，上报内容：文管版本、操作日期时间、选项名称、选中文件类型、进程名称(dde-file-manager/dde-desktop)、触发位置（file/none）
    console.log('断言1：验证桌面右键排序方式的新增埋点日志上报内容');
    const hasAppVersion1 = newLogs1.includes('app_version');
    const hasSysTime1 = newLogs1.includes('sysTime');
    const hasItemName1 = newLogs1.includes('item_name') && newLogs1.includes('修改时间');
    const hasType1 = newLogs1.includes('type');
    const hasDesktopProcess = newLogs1.includes('dde-desktop') || newLogs1.includes('dde-file-manager') || newLogs1.includes('org.deepin.dde-shell');
    const hasLocation1 = newLogs1.includes('location');
    if (!hasAppVersion1 || !hasSysTime1 || !hasItemName1 || !hasType1 || !hasDesktopProcess || !hasLocation1) {
      console.log(`断言1详情: app_version=${hasAppVersion1}, sysTime=${hasSysTime1}, item_name=${hasItemName1}, type=${hasType1}, process=${hasDesktopProcess}, location=${hasLocation1}`);
      throw new Error(`断言1失败：桌面排序方式新增埋点日志缺少必要字段 - app_version:${hasAppVersion1}, sysTime:${hasSysTime1}, item_name:${hasItemName1}, type:${hasType1}, process:${hasDesktopProcess}, location:${hasLocation1}`);
    }
    console.log('断言1通过：成功验证桌面右键排序方式的新增埋点日志包含文管版本、操作日期时间、选项名称(修改时间)、选中文件类型、进程名称、触发位置');

    // 操作前：记录埋点日志文件大小（场景2：文管右键排序方式-修改时间）
    const logSizeBefore2 = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore2}`);

    // 步骤3：打开文管，进入桌面目录，空白处右键菜单，点击排序方式--修改时间
    console.log('步骤3：打开文件管理器，进入桌面目录，空白处右键菜单，点击排序方式--修改时间');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap('左侧边栏中的桌面', { deepThink: true });
    await agent.aiRightClick('文件管理器当前目录的空白区域');
    await agent.aiTap('右键菜单中的排序方式');
    await agent.aiTap('二级菜单中的修改时间');
    
    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤4：检查埋点日志
    console.log('步骤4：读取文管排序方式操作后新增的埋点日志');
    const newLogs2 = await readNewLogs(system, logFile, logSizeBefore2);
    console.log(`文管排序方式操作后新增的埋点日志:\n${newLogs2}`);

    if (!newLogs2) {
      throw new Error('文管排序方式操作后未产生新的埋点日志');
    }

    // 断言2：触发上报事件，上报内容：文管版本、操作日期时间、选项名称、选中文件类型、进程名称(dde-file-manager/dde-desktop)、触发位置（file/none）
    console.log('断言2：验证文件管理器右键排序方式的新增埋点日志上报内容');
    const hasAppVersion2 = newLogs2.includes('app_version');
    const hasSysTime2 = newLogs2.includes('sysTime');
    const hasItemName2 = newLogs2.includes('item_name') && newLogs2.includes('修改时间');
    const hasType2 = newLogs2.includes('type');
    const hasFmProcess = newLogs2.includes('dde-file-manager') || newLogs2.includes('dde-desktop') || newLogs2.includes('org.deepin.dde-shell');
    const hasLocation2 = newLogs2.includes('location');
    if (!hasAppVersion2 || !hasSysTime2 || !hasItemName2 || !hasType2 || !hasFmProcess || !hasLocation2) {
      console.log(`断言2详情: app_version=${hasAppVersion2}, sysTime=${hasSysTime2}, item_name=${hasItemName2}, type=${hasType2}, process=${hasFmProcess}, location=${hasLocation2}`);
      throw new Error(`断言2失败：文管排序方式新增埋点日志缺少必要字段 - app_version:${hasAppVersion2}, sysTime:${hasSysTime2}, item_name:${hasItemName2}, type:${hasType2}, process:${hasFmProcess}, location:${hasLocation2}`);
    }
    console.log('断言2通过：成功验证文件管理器右键排序方式的新增埋点日志包含文管版本、操作日期时间、选项名称(修改时间)、选中文件类型、进程名称、触发位置');

  }, { timeout: 600000, tags: ['1815841', 'level3', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');

    // 后置步骤：环境清理
    await clearEnv(system);
    await uos.showDesktop();
  });
});
