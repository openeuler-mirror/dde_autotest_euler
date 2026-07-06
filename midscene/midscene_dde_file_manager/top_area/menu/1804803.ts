/**
 * 用例 PMSID: 1804803
 * 用例标题: 勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-不弹窗提示
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

describe('1804803-勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804803-勾选【显示隐藏文件】-在文管窗口普通目录内以“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos , system}) => {

    // 步骤 1:设置勾选“显示隐藏文件”
    await uos.openApp("文件管理器");
    await agent.aiTap("侧边栏的文档目录");
    await device.pressKey(`Ctrl+H`)

    // 步骤 2: 创建.开头文件
    await agent.aiRightClick("文档目录空白处");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText(".测试文件");
    await device.pressKey(`Enter`)
    
    const result1 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFile1 = ".测试文件.txt";
    if (result1.stdout && result1.stdout.includes(expectedFile1)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFile1}" 的文件`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFile1}"`);
      console.error("当前文档目录文件列表:", result1.stdout);
      throw new Error(`新建文件失败：未在文档目录找到 ${expectedFile1}`);
    }

    // 步骤 3: 创建.开头文件夹
    await agent.aiRightClick("文档目录空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText(".测试文件夹");
    await device.pressKey(`Enter`)
    
    const result2 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFolder1 = ".测试文件夹";
    if (result2.stdout && result2.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFolder1}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFolder1}"`);
      console.error("当前文档目录文件列表:", result2.stdout);
      throw new Error(`新建文件夹失败：未在文档目录找到 ${expectedFolder1}`);
    }

    // 步骤 4: 重命名.开头文件
    await agent.aiRightClick(".测试文件.txt");
    await agent.aiTap("重命名");
    await device.typeText(".测试2");
    await device.pressKey(`Enter`)
    
    const result3 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFile2 = ".测试2.txt";
    if (result3.stdout && result3.stdout.includes(expectedFile2)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFile2}" 的文件`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFile2}"`);
      console.error("当前文档目录文件列表:", result3.stdout);
      throw new Error(`重命名文件失败：未在文档目录找到 ${expectedFile2}`);
    }

    // 步骤 5: 重命名.开头文件夹
    await agent.aiRightClick(".测试文件夹");
    await agent.aiTap("重命名");
    await device.typeText(".测试3");
    await device.pressKey(`Enter`)
    
    const result4 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFolder2 = ".测试3";
    if (result4.stdout && result4.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFolder2}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFolder2}"`);
      console.error("当前文档目录文件列表:", result4.stdout);
      throw new Error(`重命名文件夹失败：未在文档目录找到 ${expectedFolder2}`);
    }

  }, { timeout: 600000, tags: ['1804803', 'level2', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey(`Ctrl+H`)
    await system.exec(`rm -rf /home/$USER/Documents/.测试*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
