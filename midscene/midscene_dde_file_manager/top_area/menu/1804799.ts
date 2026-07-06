/**
 * 用例 PMSID: 1804799
 * 用例标题: 勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示
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

describe('1804799-勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804799-勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos , system}) => {

    // 步骤 1: 打开文件保存对话框，取消保存.开头文件
    await uos.openApp("文本编辑器");
    await agent.aiTap("标签页右侧的+");
    await agent.aiTap("文本编辑器主菜单按钮");    
    await agent.aiTap("保存");
    await agent.aiTap("文件管理器窗口侧边栏的文档目录"); 
    await agent.aiTap("文件管理器窗口文件名输入框");
    await device.pressKey(`Ctrl+A`);
    await device.typeText(".测试文件");
    await agent.aiTap("保存");
    await agent.aiTap("取消");
    await agent.aiAssert("返回文本编辑器的保存文件对话框");

    // 步骤 2: 打开文件保存对话框，隐藏保存.开头文件
    await agent.aiTap("保存");
    await agent.aiTap("隐藏");
    await agent.aiAssert("文件管理器窗口关闭");

    // 步骤 3:设置取消勾选“显示隐藏文件”
    await agent.aiTap("文本编辑器主菜单按钮");
    await agent.aiTap("另存为");
    await agent.aiTap("文件管理器窗口侧边栏的文档目录"); 
    await agent.aiTap("文件管理器窗口文档目录的空白处"); 
    await device.pressKey(`Ctrl+H`);

    // 步骤 4: 新建“.”开头文件夹
    await agent.aiRightClick("文件管理器窗口文档目录空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText(".测试文件夹");
    await agent.aiTap("文件管理器窗口文档目录空白处");
    
    const result1 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFolder1 = ".测试文件夹";
    if (result1.stdout && result1.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFolder1}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFolder1}"`);
      console.error("当前文档目录文件列表:", result1.stdout);
      throw new Error(`新建文件夹失败：未在文档目录找到 ${expectedFolder1}`);
    }

    // 步骤 5: 重命名.开头文件夹
    await agent.aiRightClick("文件管理器窗口文档目录.测试文件夹");
    await agent.aiTap("重命名");
    await device.typeText(".测试文件夹2");
    await device.pressKey(`Enter`);
    
    const result2 = await safeExec(system, `ls -al ~/Documents/`);
    const expectedFolder2 = ".测试文件夹2";
    if (result2.stdout && result2.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：文档目录已找到包含 "${expectedFolder2}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：文档目录未找到 "${expectedFolder2}"`);
      console.error("当前文档目录文件列表:", result2.stdout);
      throw new Error(`重命名文件夹失败：未在文档目录找到 ${expectedFolder2}`);
    }

  }, { timeout: 600000, tags: ['1804799', 'level3', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey(`Ctrl+H`);
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
    await agent.aiTap("文本编辑器窗口右上角关闭按钮:X");
    await system.exec(`rm -rf /home/$USER/Documents/.测试*`);
  });

