/**
 * 用例 PMSID: 1805069
 * 用例标题: 文管历史导航，回退功能_
 * 生成时间: 2025-12-18 09:00:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['test1', 'test2', 'test3', 'test4'];

const buttons = {
  'backward': '后退按钮<',
  'forward': '前进按钮>'
};

// const tooltips = {
//   'backward': "后退按钮下方显示字符后退",
//   'forward': "前进按钮下方显示字符前进"
// };

const statuses = {
  'available': '背景是灰色',
  'unavailable': '背景是白色'
};
// 检查按钮字符不稳定, 容易误判

describe('1805069-[080]历史导航-历史前进和后退按钮状态', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
  });

  test('1805069-[080]历史导航-历史前进和后退按钮状态', async ({ device, agent, uos }) => {
    // 步骤 1: 双击打开桌面上的test1文件夹
    // await uos.openApp('文件管理器');
    // await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiDoubleClick(`桌面上的${levels[0]}文件夹`);
    await agent.aiWaitFor(`文件管理器界面已打开, 当前目录是${levels[0]}`);

    // 最大化
    await device.pressKey("Super", "Down");
    await device.pressKey("Super", "Up");

    // 确认导航栏前进和后退按钮为不可用状态
    await agent.aiHover(buttons['backward']);
    // await agent.aiWaitFor(tooltips['backward']);
    await agent.aiAssert(`${buttons['backward']}, 导航栏中的${buttons['backward']}${statuses['unavailable']}`);
    await agent.aiTap('右侧窗口空白区域');
    await agent.aiHover(buttons['forward']);
    // await agent.aiWaitFor(tooltips['forward']);
    await agent.aiAssert(`${buttons['forward']}, 导航栏中的${buttons['forward']}${statuses['unavailable']}`);
    await agent.aiTap('右侧窗口空白区域');

    // 步骤 2: 打开test4目录
    let tmp_levels = levels.slice(1);
    for (const level of tmp_levels) {
      await agent.aiDoubleClick(`文件列表中的${level}文件夹`);
      await agent.aiAssert(`文件管理器跳转到${level}目录`);
    }

    // 确认页面已跳转到最深层目录
    await agent.aiAssert('当前目录内容为空');

    // 确认导航栏后退按钮为可用状态，前进按钮为不可用状态
    await agent.aiHover(buttons['backward']);
    // await agent.aiWaitFor(tooltips['backward']);
    await agent.aiAssert(`导航栏中的${buttons['backward']}${statuses['available']}`);
    await agent.aiTap('右侧窗口空白区域');
    await agent.aiHover(buttons['forward']);
    // await agent.aiWaitFor(tooltips['forward']);
    await agent.aiAssert(`导航栏中的${buttons['forward']}${statuses['unavailable']}`);
    await agent.aiTap('右侧窗口空白区域');

    // 步骤 3: 使用导航栏后退按钮返回test3目录
    await agent.aiTap('导航栏中的后退按钮');
    await agent.aiWaitFor(`当前目录是${levels[levels.length - 2]}`);

    // 确认导航栏后退按钮为可用状态，前进按钮为可用状态
    await agent.aiHover(buttons['backward']);
    // await agent.aiWaitFor(tooltips['backward']);
    await agent.aiAssert(`导航栏中的${buttons['backward']}${statuses['available']}`);
    await agent.aiTap('右侧窗口空白区域');
    await agent.aiHover(buttons['forward']);
    // await agent.aiWaitFor(tooltips['forward']);
    await agent.aiAssert(`导航栏中的${buttons['forward']}${statuses['available']}`);
    await agent.aiTap('右侧窗口空白区域');

    // 步骤 4: 使用导航栏回退按钮到test1目录
    tmp_levels = levels.slice(0, levels.length - 2).reverse();
    for (const level of tmp_levels) {
      await agent.aiTap('导航栏中的后退按钮');
      await agent.aiWaitFor(`当前目录是${level}`)
    }

    // 确认导航栏后退按钮为可用状态，前进按钮为不可用状态
    await agent.aiHover(buttons['backward']);
    // await agent.aiWaitFor(tooltips['backward']);
    await agent.aiAssert(`导航栏中的${buttons['backward']}${statuses['unavailable']}`);
    await agent.aiTap('右侧窗口空白区域');
    await agent.aiHover(buttons['forward']);
    // await agent.aiWaitFor(tooltips['forward']);
    await agent.aiAssert(`导航栏中的${buttons['forward']}${statuses['available']}`);
    await agent.aiTap('右侧窗口空白区域');

  }, { timeout: 600000, tags: ['1805069', 'level2', 'smoke', 'youwei', 'navigation', 'file-manager', 'forward', 'backward'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('窗口右上角关闭按钮:X');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
