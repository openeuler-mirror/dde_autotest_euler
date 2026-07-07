/**
 * 用例 PMSID: 1815833
 * 用例标题: 埋点，右键菜单项点击分布-新建文档
 * 生成时间: 2026-05-22 15:30:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME || 'uos';
const desktopNewDoc = `/home/${username}/Desktop/新建文本.txt`;
const docDirNewDoc = `/home/${username}/Documents/新建文本.txt`;

// 清理测试环境：关闭文件管理器进程，删除配置文件和测试文件
async function clearEnv(system) {
  try {
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec(`rm -f ${desktopNewDoc}`);
    await system.exec(`rm -f ${docDirNewDoc}`);
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

describe('1815833-埋点，右键菜单项点击分布-新建文档', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });

  test('1815833-埋点，右键菜单项点击分布-新建文档', async ({ device, agent, uos, system }) => {
    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 操作前：记录埋点日志文件大小（场景1：桌面右键新建文档）
    const logSizeBefore1 = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore1}`);

    // 步骤1：在桌面右键菜单新建一个文档
    console.log('步骤1：在桌面右键菜单新建一个文档');
    await agent.aiRightClick('桌面空白处');
    await agent.aiTap('右键菜单中的新建文档');
    await agent.aiTap('二级菜单中的文本文档');
    await device.pressKey('Enter');

    // 断言1：文档新建成功
    console.log('断言1：验证桌面文档新建成功');
    await agent.aiAssert('桌面上存在新建文本.txt', { deepThink: true });
    console.log('断言1通过：桌面文档新建成功');

    // 步骤2：读取桌面新建文档操作后新增的埋点日志
    console.log('步骤2：读取桌面新建文档操作后新增的埋点日志');
    const newLogs1 = await readNewLogs(system, logFile, logSizeBefore1);
    console.log(`桌面新建文档后新增的埋点日志:\n${newLogs1}`);

    if (!newLogs1) {
      throw new Error('桌面新建文档操作后未产生新的埋点日志');
    }

    // 断言2：新增埋点日志包含文管版本、操作日期时间、选项名称(item_name=文本文档)、选中文件类型(type)、进程名称(dde-desktop/org.deepin.dde-shell)、触发位置(location)
    console.log('断言2：验证桌面右键新建文档的新增埋点日志上报内容');
    const hasAppVersion1 = newLogs1.includes('app_version');
    const hasSysTime1 = newLogs1.includes('sysTime');
    const hasItemName1 = newLogs1.includes('item_name') && newLogs1.includes('文本文档');
    const hasType1 = newLogs1.includes('type') && newLogs1.includes('文本文档');
    const hasDesktopProcess = newLogs1.includes('dde-desktop') || newLogs1.includes('org.deepin.dde-shell');
    const hasLocation1 = newLogs1.includes('location');
    if (!hasAppVersion1 || !hasSysTime1 || !hasItemName1 || !hasType1 || !hasDesktopProcess || !hasLocation1) {
      console.log(`断言2详情: app_version=${hasAppVersion1}, sysTime=${hasSysTime1}, item_name=${hasItemName1}, type=${hasType1}, process=${hasDesktopProcess}, location=${hasLocation1}`);
      throw new Error(`断言2失败：桌面新建文档新增埋点日志缺少必要字段 - app_version:${hasAppVersion1}, sysTime:${hasSysTime1}, item_name:${hasItemName1}, type:${hasType1}, process:${hasDesktopProcess}, location:${hasLocation1}`);
    }
    console.log('断言2通过：成功验证桌面右键新建文档的新增埋点日志包含文管版本、操作日期时间、选项名称(文本文档)、文件类型(文本文档)、进程名称、触发位置');

    // 操作前：记录埋点日志文件大小（场景2：文管右键新建文档）
    const logSizeBefore2 = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore2}`);

    // 步骤3：打开文件管理器，在文档目录（Documents）右键菜单新建一个文档
    console.log('步骤3：打开文件管理器，在文档目录右键新建文档');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap('左侧边栏中的文档', { deepThink: true });
    await agent.aiRightClick('文件管理器当前目录的空白区域');
    await agent.aiTap('右键菜单中的新建文档');
    await agent.aiTap('二级菜单中的文本文档');
    await device.pressKey('Enter');

    // 断言3：文档新建成功
    console.log('断言3：验证文档目录中文档新建成功');
    await agent.aiAssert('文档目录中存在新建文本.txt', { deepThink: true });
    console.log('断言3通过：文档目录中文档新建成功');

    // 步骤4：读取文管新建文档操作后新增的埋点日志
    console.log('步骤4：读取文管新建文档操作后新增的埋点日志');
    const newLogs2 = await readNewLogs(system, logFile, logSizeBefore2);
    console.log(`文管新建文档后新增的埋点日志:\n${newLogs2}`);

    if (!newLogs2) {
      throw new Error('文管新建文档操作后未产生新的埋点日志');
    }

    // 断言4：新增埋点日志包含文管版本、操作日期时间、选项名称(item_name=文本文档)、选中文件类型(type)、进程名称(dde-file-manager/org.deepin.dde-shell)、触发位置(location)
    console.log('断言4：验证文件管理器右键新建文档的新增埋点日志上报内容');
    const hasAppVersion2 = newLogs2.includes('app_version');
    const hasSysTime2 = newLogs2.includes('sysTime');
    const hasItemName2 = newLogs2.includes('item_name') && newLogs2.includes('文本文档');
    const hasType2 = newLogs2.includes('type') && newLogs2.includes('文本文档');
    const hasFmProcess = newLogs2.includes('dde-file-manager') || newLogs2.includes('org.deepin.dde-shell');
    const hasLocation2 = newLogs2.includes('location');
    if (!hasAppVersion2 || !hasSysTime2 || !hasItemName2 || !hasType2 || !hasFmProcess || !hasLocation2) {
      console.log(`断言4详情: app_version=${hasAppVersion2}, sysTime=${hasSysTime2}, item_name=${hasItemName2}, type=${hasType2}, process=${hasFmProcess}, location=${hasLocation2}`);
      throw new Error(`断言4失败：文管新建文档新增埋点日志缺少必要字段 - app_version:${hasAppVersion2}, sysTime:${hasSysTime2}, item_name:${hasItemName2}, type:${hasType2}, process:${hasFmProcess}, location:${hasLocation2}`);
    }
    console.log('断言4通过：成功验证文件管理器右键新建文档的新增埋点日志包含文管版本、操作日期时间、选项名称(文本文档)、文件类型(文本文档)、进程名称、触发位置');

  }, { timeout: 600000, tags: ['1815833', 'level3', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');

    // 后置步骤：环境清理
    await clearEnv(system);
    await uos.showDesktop();
  });
});
