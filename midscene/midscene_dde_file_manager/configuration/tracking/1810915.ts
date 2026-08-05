/**
 * 用例 PMSID: 1810915
 * 用例标题: 埋点，侧边栏各目录去重后的点击分布-已添加的标签（颜色标签）
 * 生成时间: 2026-05-20 20:04:04
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME || 'uos';
const desktopFilePath = `/home/${username}/Desktop/tracking_test.txt`;

// 清理测试环境：关闭文件管理器进程，删除配置文件和桌面测试文件
async function clearEnv(system) {
  try {
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -f ${desktopFilePath}`);
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

describe('1810915-埋点，侧边栏各目录去重后的点击分布-已添加的标签（颜色标签）', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();

    // 前置条件：在桌面创建tracking_test.txt文件
    await system.exec(`echo "tracking test" > ${desktopFilePath}`);
    await agent.aiWaitFor('桌面上存在tracking_test.txt文件');

    // 前置条件：右键该文件，点击"标记信息"，添加标记"yellow"
    await agent.aiRightClick('桌面上的tracking_test.txt文件');
    await agent.aiTap('右键菜单中的标记信息');
    await device.typeText('yellow');
    await device.pressKey('Enter');
    await device.pressKey('Esc');
    console.log('前置条件：已为tracking_test.txt添加yellow标记');
  });

  test('1810915-埋点，侧边栏各目录去重后的点击分布-已添加的标签（颜色标签）', async ({ device, agent, uos, system }) => {
    // 获取埋点日志文件路径
    const logFile = await getLatestLogFile(system);
    console.log(`找到埋点日志文件: ${logFile}`);
    if (!logFile) {
      throw new Error('未找到埋点日志文件');
    }

    // 操作前：记录埋点日志文件大小
    const logSizeBefore = await getLogFileSize(system, logFile);
    console.log(`操作前日志文件大小: ${logSizeBefore}`);

    // 步骤1：打开文件管理器，点击侧边栏标记下方的yellow
    console.log('步骤1：打开文件管理器，点击侧边栏标记下方的yellow');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('左侧边栏标记下方的yellow', { deepThink: true });
    await agent.aiWaitFor('已切换到yellow标签筛选页面');

    // 等待埋点日志写入
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：读取操作后新增的埋点日志
    console.log('步骤2：读取点击yellow后新增的埋点日志');
    const newLogs = await readNewLogs(system, logFile, logSizeBefore);
    console.log(`点击yellow后新增的埋点日志:\n${newLogs}`);

    if (!newLogs) {
      throw new Error('点击yellow后未产生新的埋点日志');
    }

    // 断言1：埋点日志中上报了点击事件，包含文管版本、操作日期时间、侧边栏目录名称（Tag）
    console.log('断言1：验证埋点日志上报内容');
    const hasAppVersion = newLogs.includes('app_version');
    const hasSysTime = newLogs.includes('sysTime');
    const hasSidebarItem = newLogs.includes('sidebar_item') && newLogs.includes('Tag');
    if (!hasAppVersion || !hasSysTime || !hasSidebarItem) {
      console.log(`断言1详情: app_version=${hasAppVersion}, sysTime=${hasSysTime}, sidebar_item=Tag=${hasSidebarItem}`);
      throw new Error(`断言1失败：新增埋点日志缺少必要字段 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, sidebar_item(Tag):${hasSidebarItem}`);
    }
    console.log('断言1通过：成功验证新增埋点日志包含文管版本、操作日期时间和侧边栏目录名称Tag');

  }, { timeout: 600000, tags: ['1810915', 'level3', 'tracking', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');

    // 后置步骤1：清理标记信息，右键侧边栏yellow，点击移除
    try {
      await agent.aiRightClick('左侧边栏标记下方的yellow', { deepThink: true });
      await agent.aiTap('右键菜单中的移除');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const hasDialog = await agent.aiBoolean('页面上有确认弹窗或删除弹窗显示');
      if (hasDialog) {
        await agent.aiTap('弹窗中的删除或确定按钮');
      }
      console.log('已移除yellow标记');
    } catch (err) {
      console.error('移除yellow标记失败，尝试通过命令行清理:', err);
    }

    // 后置步骤2：环境清理
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
