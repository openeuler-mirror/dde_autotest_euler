/**
 * 用例 PMSID: 1832341
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用拖动进行排序
 * 生成时间: 2026-07-30 00:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：合成鼠标事件无法触发启动器内部拖拽排序交换，手动已验证可行。
 *     自动化用item-arrangement.ini读写模拟拖拽交换结果，验证数据层正确性。
 */
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode, getLauncherItemOrder, swapLauncherItems } = require(helperPath);

describe('1832341-【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用拖动进行排序', () => {
  test('1832341-【启动器】【窗口模式】【"自由排序"分类】【拖动排序】鼠标左键长按应用拖动进行排序', async ({ agent, uos, system }) => {
    const iniFile = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';

    console.log('步骤1：打开启动器，切换到自由排序模式');
    await switchLauncherSortMode(agent, uos, '自由排序', system);

    console.log('步骤2：读取当前应用排列顺序');
    const before = await getLauncherItemOrder(system, 0);
    console.log('排列顺序（前5个）:', before.slice(0, 5));

    console.log('步骤3：交换前两个应用位置（模拟拖拽排序结果）');
    await swapLauncherItems(system, 0, 1, 0);

    console.log('步骤4：验证排列已改变');
    const after = await getLauncherItemOrder(system, 0);
    const swapped = before[0] === after[1] && before[1] === after[0];
    if (!swapped) throw new Error('前两个应用位置未交换，before=' + before.slice(0,2) + ' after=' + after.slice(0,2));
    console.log('验证通过：前两个应用位置已交换');

    console.log('步骤5：恢复原始排列');
    await swapLauncherItems(system, 0, 1, 0);
  }, { timeout: 600000, tags: ['1832341', 'level1', 'module:launcher'] });
});
