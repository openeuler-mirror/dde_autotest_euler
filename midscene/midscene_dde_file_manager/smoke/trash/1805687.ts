/**
 * 用例 PMSID: 1805687
 * 用例标题: 【回收站】入口-通过dock栏回收站图标进入回收站
 * 生成时间: 2025-12-19 07:44:53
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1805687-【回收站】入口-通过dock栏回收站图标进入回收站', function () {
    beforeAll(async function ({ device, uos, agent }) {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async function ({ device, agent }) {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1805687- 【回收站】入口-通过dock栏回收站图标进入回收站', async function ({ device, agent, uos }) {
        console.log('开始执行测试用例 1805687');
        // 设置统一的超时时间和重试机制
        const DEFAULT_TIMEOUT = 15000;
        const RETRY_DELAY = 2000;
        const MAX_RETRIES = 2;

        // ========== 仅替换此部分：目录定位方法（简洁版环境变量拼接） ==========
        // 直接通过TESTCASE_DIR环境变量拼接图片绝对路径，移除原有所有路径工具函数
        const TESTCASE_DIR = process.env.TESTCASE_DIR || '';
        const imgRelativePath = 'midscene_dde_file_manager/picture/1805687.png';
        const imgAbsolutePath = `${TESTCASE_DIR}${imgRelativePath}`;
        console.log('测试用例根目录：', TESTCASE_DIR);
        console.log('图片绝对路径：', imgAbsolutePath);
        console.log('图片路径拼接完成（基于环境变量TESTCASE_DIR）');
        // ===============================================

        // 前置条件：判断任务栏是否存在回收站图标（使用aiBoolean替代try-catch）
        console.log('步骤0: 检查桌面窗口底部任务栏是否存在回收站图标');
        const hasTrashIcon = await agent.aiBoolean({
            prompt: '桌面窗口底部任务栏绿色垃圾桶图标',
            images: [
                {
                    name: '绿色垃圾桶图标',
                    url: imgAbsolutePath,
                },
            ],
        }, { deepThink: true });
        if (hasTrashIcon) {
            console.log('桌面窗口底部任务栏有显示回收站图标');
        } else {
            console.log('桌面窗口底部任务栏未显示回收站图标，开始执行添加流程');
        }

        // 逻辑修正：当不存在回收站图标时才执行添加操作
        if (!hasTrashIcon) {
            console.log('开始执行添加回收站图标到任务栏的流程');

            // 不存在回收站图标时，打开启动器图标，搜索回收站
            console.log('步骤1: 打开启动器');
            await uos.openLauncher();
            console.log('启动器已打开');

            console.log('步骤2: 在启动器中搜索回收站');
            await uos.searchInLauncher('回收站');
            console.log('已在启动器中搜索回收站');

            // 右键点击回收站，发送到任务栏
            console.log('步骤: 悬停在启动器的回收站图标');
            await agent.aiHover('启动器窗口回收站', { timeout: DEFAULT_TIMEOUT });
            console.log('已悬停在回收站图标上');

            // 等待一下确保悬停生效
            await new Promise(function (resolve) { setTimeout(resolve, 1000); });

            console.log('步骤3: 右键点击启动器中的回收站图标');
            await agent.aiRightClick('启动器窗口回收站', { timeout: DEFAULT_TIMEOUT });
            console.log('已右键点击回收站图标');

            // 等待右键菜单出现
            await new Promise(function (resolve) { setTimeout(resolve, RETRY_DELAY); });

            // 点击“发送到任务栏”
            console.log('步骤4: 尝试点击"发送到任务栏"');
            await agent.aiTap('发送到任务栏', { timeout: DEFAULT_TIMEOUT });
            console.log('已将回收站图标发送至任务栏');

            // 检查任务栏是否已存在回收站的图标
            await agent.aiWaitFor({
                prompt: '桌面窗口底部任务栏绿色垃圾桶图标',
                images: [
                    {
                        name: '绿色垃圾桶图标',
                        url: imgAbsolutePath,
                    },
                ],
            }, { deepThink: true });
            console.log('桌面窗口底部任务栏显示出绿色回收站图标');

        } else {
            console.log('桌面窗口底部任务栏显示出绿色回收站图标，跳过添加步骤');
        }

        // 步骤1：单击dock栏（即任务栏右侧区域）的回收站图标
        await agent.aiTap({
            prompt: '桌面窗口底部任务栏绿色垃圾桶图标',
            images: [
                {
                    name: '绿色垃圾桶图标',
                    url: imgAbsolutePath,
                },
            ],
        }, { deepThink: true });
        console.log('打开桌面窗口底部任务栏有绿色垃圾桶图标');

        // 结果1：打开进入回收站
        console.log('步骤7: 等待文件管理器打开');
        await agent.aiWaitFor('文件管理器窗口已打开完成', { timeout: DEFAULT_TIMEOUT });
        console.log('文件管理器窗口已成功打开');

        // 断言：左侧侧边栏高亮定位在回收站
        console.log('步骤8: 验证回收站侧边栏高亮');
        await agent.aiAssert('文件管理器窗口左侧侧边栏"回收站"项蓝色高亮显示', { timeout: 10000 });

        // 步骤2：关闭回收站
        console.log('步骤9: 关闭回收站窗口');
        await uos.closeCurrentWindow();
        console.log('回收站窗口已关闭');

        // 步骤3：dock栏回收站图标-右键-点击打开
        console.log('步骤10: 右键点击任务栏回收站图标');
        await agent.aiRightClick({
            prompt: '桌面窗口底部任务栏绿色垃圾桶图标',
            images: [
                {
                    name: '绿色垃圾桶图标',
                    url: imgAbsolutePath,
                },
            ],
        }, { deepThink: true });

        console.log('打开桌面窗口底部任务栏有绿色垃圾桶图标');
        // 等待右键菜单出现
        console.log('等待右键菜单出现...');
        await new Promise(function (resolve) { setTimeout(resolve, RETRY_DELAY); });

        // 点击右键打开菜单
        console.log('步骤11: 点击右键菜单中的"打开"选项');
        await agent.aiTap('右键打开项', { timeout: DEFAULT_TIMEOUT });

        // 结果2：打开进入回收站，且左侧侧边栏高亮定位在回收站
        console.log('步骤12: 等待文件管理器窗口重新打开');
        await agent.aiWaitFor('文件管理器窗口打开完成', { timeout: DEFAULT_TIMEOUT });
        console.log('文件管理器窗口已重新打开');

        // 断言：左侧侧边栏高亮定位在回收站
        console.log('步骤13: 验证回收站侧边栏高亮（第二次）');
        await agent.aiAssert('文件管理器窗口左侧侧边栏"回收站"项蓝色高亮显示', { timeout: 10000 });
        console.log('回收站侧边栏已正确高亮显示');

    }, { timeout: 180000, tags: ['1805687', 'level1', 'smoke', 'sushanshan'] });

    afterEach(async function ({ device, uos }) {
        console.log('测试用例清理');
        await uos.closeCurrentWindow();
        console.log('回收站窗口已关闭');
    });

    afterAll(async function ({ uos, agent, device, system }) {
        console.log('5. afterAll: 清理测试套件');
        await uos.showDesktop();
        console.log('测试套件清理完成');
        await system.exec('killall dde-file-manager', 500);
    });
});