// @ts-nocheck

/**
 * 用例 PMSID: 1805569
 * 用例标题: 开启全文搜索-事件上报
 * 生成时间: 2026-09-16
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

const logDir = '/var/lib/deepin/event-log';

// 清理测试环境：关闭文件管理器进程，删除配置文件
async function clearEnv(system) {
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    try {
        await closeFileManager(system);
        await clearEnvironment(system);
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

describe('1805569-开启全文搜索-事件上报', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件：全文搜索为关闭状态
        await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.search -k enableFullTextSearch -v false`);
        console.log('前置条件：全文搜索已设置为关闭状态');
    });


    beforeEach(async ({ device, uos, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
    test('1805569-开启全文搜索-事件上报', async ({ device, agent, uos, system }) => {
        // 获取埋点日志文件路径
        const logFile = await getLatestLogFile(system);
        console.log(`找到埋点日志文件: ${logFile}`);
        if (!logFile) {
            throw new Error('未找到埋点日志文件');
        }

        // 操作前：记录埋点日志文件大小
        const logSizeBefore = await getLogFileSize(system, logFile);
        console.log(`操作前日志文件大小: ${logSizeBefore}`);

        // 步骤1：打开文件管理器，进入设置-搜索页面
        console.log('步骤1：打开文件管理器，进入设置-搜索页面');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiWaitFor('文件管理器界面已显示');
        await agent.aiTap('文件管理器右上角菜单按钮', { deepThink: true });
        await agent.aiTap('设置');
        await agent.aiWaitFor('设置界面已打开');
        // 左侧导航栏较小，'高级设置'分组下的'搜索'项可能被窗口底边裁剪，先向下滚动导航栏使其可见
        await agent.aiScroll('设置窗口左侧导航栏', { direction: 'down', distance: 150 });
        await agent.aiTap("设置窗口左侧导航栏中'高级设置'分组下的'搜索'菜单项");
        await agent.aiWaitFor('搜索设置页面已显示');

        // 确认当前全文搜索为未勾选状态（若已勾选则先取消，保证从关闭状态开启）
        const isUnchecked = await agent.aiBoolean('全文搜索左侧复选框为未勾选状态');
        if (!isUnchecked) {
            console.log('当前全文搜索已勾选，先取消勾选');
            await agent.aiTap('全文搜索左侧复选框的中心', { deepThink: true });
            await agent.aiWaitFor('全文搜索左侧复选框为未勾选状态', { timeout: 10000 });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // 步骤2：在文管【设置-索引】开启全文搜索，触发开关变更事件上报
        console.log('步骤2：勾选开启全文搜索');
        await agent.aiTap('全文搜索左侧复选框的中心', { deepThink: true });
        await agent.aiAssert('全文搜索左侧复选框为勾选状态');

        // 若出现确认弹窗则点击确认
        const hasDialog = await agent.aiBoolean('设置界面出现确认弹窗');
        if (hasDialog) {
            await agent.aiTap('弹窗中的确认按钮');
        }

        // 等待埋点日志写入
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 步骤3：读取操作后新增的埋点日志
        console.log('步骤3：读取开启全文搜索后新增的埋点日志');
        const newLogs = await readNewLogs(system, logFile, logSizeBefore);
        console.log(`开启全文搜索后新增的埋点日志:\n${newLogs}`);
        if (!newLogs) {
            throw new Error('开启全文搜索后未产生新的埋点日志');
        }

        // 断言：上报内容包含文件管理器版本号、开关变更后状态（开启）、开关变更触发时间
        console.log('断言：验证埋点日志上报内容');
        const hasAppVersion = newLogs.includes('app_version');
        const hasSysTime = newLogs.includes('sysTime');
        // 实际埋点结构：开关变更事件 tid=1000500002，字段 mode:1 表示开启（0 为关闭），
        // dde-file-manager 与 dde-file-dialog 进程均会上报该事件（日志为多层转义 JSON，用宽松正则匹配）
        const hasSwitchEvent = newLogs.includes('1000500002') && /mode[\\":\s]{1,6}1(?![0-9])/.test(newLogs);
        if (!hasAppVersion || !hasSysTime || !hasSwitchEvent) {
            throw new Error(`断言失败：新增埋点日志缺少必要内容 - app_version:${hasAppVersion}, sysTime:${hasSysTime}, 全文搜索开关事件:${hasSwitchEvent}`);
        }
        console.log('断言通过：新增埋点日志包含文件管理器版本号(app_version)、开关变更触发时间(sysTime)及全文搜索开关状态');
    }, { timeout: 1200000, tags: ['1805569', 'level2', 'vault', 'xuqi', 'DITT'] });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        try {
            await device.pressKey('Esc');
        } catch (err) {
            console.error('按Esc失败:', err);
        }
        // 清理环境（删除配置文件后全文搜索恢复默认状态）
        await clearEnv(system);
        await uos.showDesktop();
    });
});
