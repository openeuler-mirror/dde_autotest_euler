/**
 * 用例 PMSID: 2000559
 * 用例标题: 【全局搜索-图片文本内容搜索】多关键词搜索 
 * 生成时间: 2026-07-08 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
// 定义测试图片文件名
const testImageFiles = {
    img1: '多关键词-1.png',
    img2: '多关键词-2.png'
};
// 定义目标存放目录列表
const targetDirs = [
    `/home/${userName}/Desktop`,
    `/home/${userName}/Videos`,
    `/home/${userName}/Music`,
    `/home/${userName}/Documents`,
    `/home/${userName}/Pictures`,
    `/home/${userName}/Downloads`
];
describe('2000559-【全局搜索-图片文本内容搜索】多关键词搜索', () => {
    beforeAll(async ({ device, agent, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件，部署测试图片文件');
        await uos.showDesktop();
        // 前置2：下载附件到桌面、视频、音乐、文档、图片、下载目录上
        console.log('===== 批量复制测试图片至各目录 =====');
        for (const dir of targetDirs) {
            await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/2000559/* ${dir}/`);
        }
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        await system.exec("ps aux |grep dde-control-center | grep -v grep | awk '{print $2}' | xargs kill -15");
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前环境清理与前置配置校验');
    });

    test('2000559-【全局搜索-图片文本内容搜索】多关键词搜索-更新索引', async ({ device, system, agent, uos }) => {
        // 前置1：打开文管设置-搜索，确保图片文件内容搜索已勾选
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("高级设置");
        const imgSearchChecked = await agent.aiBoolean("图片文件内容搜索是否为勾选状态");
        if (!imgSearchChecked) {
            await agent.aiTap("图片文件内容搜索前面复选框的中心");
            console.log("前置1：未开启图片文件内容搜索，已完成勾选");
        } else {
            console.log("前置1：图片文件内容搜索已勾选");
            await agent.aiTap("图片文件内容搜索前面复选框的中心");
            await agent.aiTap("图片文件内容搜索前面复选框的中心");
        }

        // 前置3：循环等待图片文本索引更新完成，每3s轮询
        let indexLoop = true;
        while (indexLoop) {
            const isIndexFinish = await agent.aiBoolean("图片文本内容搜索复选框下方是否有索引更新完成提示文字");
            if (isIndexFinish) {
                console.log("前置3：图片文本内容搜索索引更新完成");
                indexLoop = false;
            } else {
                console.log("前置3：图片文本索引正在更新，等待3s后重试");
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        await device.pressKey("Alt+F4"); // 关闭设置窗口
        await device.pressKey("Alt+F4"); // 关闭文件管理器

    }, { timeout: 1800000, tags: ['2000559','level3','2500u1','image_content_search','DITT','lanyanling'] });

    test('2000559-【全局搜索-图片文本内容搜索】多关键词搜索', async ({ device, system, agent, uos }) => {
        console.log('===== 步骤1：点击任务栏上的全局搜索图标打开全局搜索，搜索框输入：测试最长 1211测试 =====');
        // 点击任务栏全局搜索图标唤起全局搜索
        await agent.aiTap("任务栏上的搜索图标");
        await agent.aiTap("全局搜索输入框");
        await agent.aiInput("测试最长 1211测试", "含有搜索想要查找的内容文字的输入框");
        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('===== 步骤1：检查最佳匹配类目“图片中找到的文字”类目能否搜索出桌面、视频、音乐、文档、图片、下载目录上的多关键词-1.png、多关键词-2.png =====');
        await agent.aiAssert("最佳匹配类目下有2个多关键词-1.png、2个多关键词-2.png");

        const isMore = await agent.aiBoolean("是否看到更多按钮");
        if (isMore) {
            await agent.aiTap("更多");
            console.log("点击更多按钮");
        } else {
            console.log("图片中找到的文字右侧没有更多按钮");
        }

        await agent.aiTap("图片中找到的文字");
        await agent.aiScroll("图片中找到的文字", { direction: 'down', distance: 20 });
        await agent.aiAssert("至少看到8个多关键词");

    }, { timeout: 1800000, tags: ['2000559','level3','2500u1','image_content_search','DITT','lanyanling'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 清理文件管理器进程');

    });

    afterAll(async ({ device, system, agent }) => {
        console.log('5. afterAll: 清理所有目录下的测试图片文件');
        // 循环删除各目录下2000559相关图片
        for (const dir of targetDirs) {
            await system.exec(`rm -f ${dir}/多关键词-*.png`);
        }
        await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
    });
});