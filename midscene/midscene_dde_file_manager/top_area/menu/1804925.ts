/**
 * 用例 PMSID: 1804925
 * 用例标题: 不勾选【显示隐藏文件】-在桌面以"."开头新建/重命名文件-弹窗提示-点击【隐藏】
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeExec(system, cmd) {
  console.log('[LOG] shell ->', cmd);
  try {
    const res = await system.exec(cmd);
    if (res && res.stdout) console.log('[LOG] shell stdout ->', res.stdout.trim());
    return res;
  } catch (e) {
    console.error('[ERROR] shell failed ->', cmd, e);
    throw e;
  }
}

describe('1804925-不勾选【显示隐藏文件】-在桌面以"."开头新建/重命名文件-弹窗提示-点击【隐藏】', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

  });

  test('1804925-不勾选【显示隐藏文件】-在桌面以"."开头新建/重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos , system}) => {

    // 步骤 1: 新建"."开头文件隐藏
    await agent.aiRightClick("桌面空白处");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText(".测试");
    await device.pressKey(`Enter`);
    await agent.aiTap("隐藏");
    await agent.aiAssert("桌面无.测试.txt文件");
    await device.pressKey(`Ctrl+H`)

    const result2 = await safeExec(system, `ls -al ~/Desktop/`);
    const expectedFile1 = ".测试.txt";
    if (result2.stdout && result2.stdout.includes(expectedFile1)) {
      console.log(`✅ 验证成功：桌面已找到 "${expectedFile1}"`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFile1}"`);
      console.error("当前桌面文件列表:", result2.stdout);
      throw new Error(`验证失败：桌面应该有 ${expectedFile1}`);
    }

    // 步骤 2: 新建"."开头文件夹隐藏
    await device.pressKey(`Ctrl+H`)
    await agent.aiRightClick("桌面空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText(".测试2");
    await device.pressKey(`Enter`)
    await agent.aiTap("隐藏");
    await agent.aiAssert("桌面无.测试2文件夹");
    await device.pressKey(`Ctrl+H`)

    const result4 = await safeExec(system, `ls -al ~/Desktop/`);
    const expectedFolder1 = ".测试2";
    if (result4.stdout && result4.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：桌面已找到 "${expectedFolder1}"`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFolder1}"`);
      console.error("当前桌面文件列表:", result4.stdout);
      throw new Error(`验证失败：桌面应该有 ${expectedFolder1}`);
    }

    // 步骤 3:重命名"."开头文件隐藏
    await system.exec(`touch /home/$USER/Desktop/测试3.txt`)
    await device.pressKey(`Ctrl+H`)
    await agent.aiRightClick(".测试3.txt");
    await agent.aiTap("重命名");
    await device.typeText(".测试4");
    await device.pressKey(`Enter`)
    await agent.aiTap("隐藏");
    await agent.aiAssert("桌面无.测试4.txt文件");
    await device.pressKey(`Ctrl+H`)

    const result6 = await safeExec(system, `ls -al ~/Desktop/`);
    const expectedFile2 = ".测试4.txt";
    if (result6.stdout && result6.stdout.includes(expectedFile2)) {
      console.log(`✅ 验证成功：桌面已找到 "${expectedFile2}"`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFile2}"`);
      console.error("当前桌面文件列表:", result6.stdout);
      throw new Error(`验证失败：桌面应该有 ${expectedFile2}`);
    }

    // 步骤 4: 重命名"."开头文件夹隐藏
    await system.exec(`mkdir /home/$USER/Desktop/测试5`)
    await device.pressKey(`Ctrl+H`)
    await agent.aiRightClick("测试5文件夹");
    await agent.aiTap("重命名");
    await device.typeText(".测试6");
    await device.pressKey(`Enter`)
    await agent.aiTap("隐藏");
    await agent.aiAssert("桌面无.测试6文件夹");
    await device.pressKey(`Ctrl+H`)

    const result8 = await safeExec(system, `ls -al ~/Desktop/`);
    const expectedFolder2 = ".测试6";
    if (result8.stdout && result8.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：桌面已找到 "${expectedFolder2}"`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFolder2}"`);
      console.error("当前桌面文件列表:", result8.stdout);
      throw new Error(`验证失败：桌面应该有 ${expectedFolder2}`);
    }

  }, { timeout: 600000, tags: ['1804925', 'level2', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/.测试*`)
    await system.exec(`rm -rf /home/$USER/Desktop/测试*`)
    await device.pressKey(`Ctrl+H`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});