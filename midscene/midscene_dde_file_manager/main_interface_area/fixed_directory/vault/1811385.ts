/**
 * 用例 PMSID: 1811385
 * 用例标题: 保险箱-操作大量
 * 生成时间: 2026-3-10 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

async function step1and2(uos, env, agent, device, system){
    await agent.aiWaitFor("桌面已显示");    

    //前置条件：已开启保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
  
    //测试素材准备：在~/Desktop目录下创建一个名称为1811385、1811385-test的文件夹
    //await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await device.pressKey("Alt+F4");
    await device.pressKey("Super+D");
    await system.exec("mkdir -p ~/Desktop/1811385");
    await system.exec("mkdir -p ~/Desktop/1811385-test");
    await agent.aiAssert("桌面上有1811385、1811385-test的文件夹");

    //测试素材准备：判断桌面上的1811385、1811385-test文件夹是否在左侧，如果不是在左侧，拖拽它到桌面左侧
    try {
      await agent.aiAssert("桌面上的1811385文件夹在桌面左侧");
      console.log("1811385文件夹已经在桌面左侧");
    } catch (error) {
      console.log("1811385文件夹不在桌面左侧，准备拖拽到左侧");
      await agent.aiDrag("桌面上的1811385文件夹", "桌面左侧");
      await agent.aiWaitFor("桌面上的1811385文件夹移动到桌面左侧");
      console.log("已成功将1811385文件夹拖拽到桌面左侧");
    }

    try {
      await agent.aiAssert("桌面上的1811385-test文件夹在桌面左侧");
      console.log("1811385-test文件夹已经在桌面左侧");
    } catch (error) {
      console.log("1811385-test文件夹不在桌面左侧，准备拖拽到左侧");
      await agent.aiDrag("桌面上的1811385-test文件夹", "桌面左侧");
      await agent.aiWaitFor("桌面上的1811385-test文件夹移动到桌面左侧");
      console.log("已成功将1811385-test文件夹拖拽到桌面左侧");
    }

    //测试素材准备：在1811385、1811385-test文件夹中创建5000个后缀为txt的文本文档（使用seq+xargs避免too many open files错误）
    await system.exec(`seq 1 5000 | xargs -I {} sh -c 'echo "this is a test file" > ~/Desktop/1811385/{}.txt'`);
    console.log("1811385文件夹中5000个文本文档创建成功");

    await system.exec(`seq 1 5000 | xargs -I {} sh -c 'echo "this is a test file" > ~/Desktop/1811385-test/{}.txt'`);
    console.log("1811385-test文件夹中5000个文本文档创建成功");
    
    //测试素材准备：验证文件夹中有5000项
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的桌面");
    await agent.aiTap("桌面目录里的1811385文件夹图标");
    await agent.aiAssert("桌面目录内容区域底部可以看到文字：5000项");

    //步骤1：剪切/复制/拖拽包含大量文件的文件夹进保险箱
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiWaitFor("成功打开保险箱", { timeoutMs: 6000,checkIntervalMs: 2000 });
    await device.pressKey("Super+Right");

    await agent.aiTap("桌面上1811385文件夹的图标");
    await agent.aiRightClick("桌面上的1811385文件夹");
    await agent.aiTap("剪切");

    await agent.aiTap("保险箱内空白处");
    await agent.aiRightClick("保险箱内空白处");
    await agent.aiWaitFor("右键菜单弹出", { timeoutMs: 8000,checkIntervalMs: 4000 });
    
    // 检查粘贴按钮是否可用，如果不可用则重新执行操作
    //const isPasteAvailable = await agent.aiAssert("粘贴按钮可用", {
    //await agent.aiTap("粘贴");
    const isPasteAvailable = await agent.aiAssert("粘贴按钮可以点击", {
        timeoutMs: 2000,
        checkIntervalMs: 500,
        failOnError: false
    }).catch(() => false);
    
    if (!isPasteAvailable) {
        // 重新执行76行到83行的操作
        await agent.aiTap("桌面上1811385文件夹的图标");
        await agent.aiRightClick("桌面上的1811385文件夹");
        await agent.aiTap("剪切");        
        await agent.aiTap("保险箱内空白处");
        await agent.aiRightClick("保险箱内空白处");
        await agent.aiWaitFor("右键菜单弹出", { timeoutMs: 8000,checkIntervalMs: 4000 });
    }
    
    await agent.aiTap("粘贴");

    //鼠标hover到粘贴窗口的正在复制文字上
    await agent.aiWaitFor("有1个任务正在进行", { timeoutMs: 10000 });
    await agent.aiHover("移动窗口正在移动文字上");

    //点击粘贴窗口中的暂停按钮
    await agent.aiAssert("移动窗口看到两条竖线的暂停按钮");
    await agent.aiTap("移动窗口中的暂停按钮");
    
    //验证粘贴百分比数据不变，停止粘贴
    await agent.aiHover("移动窗口正在移动文字上");
    await agent.aiAssert("移动窗口看到三角形的继续按钮");

    //点击粘贴窗口中的中断按钮
    await agent.aiTap("移动窗口中的中断(也就是红色正方形图标)按钮");
    await agent.aiAssert("没有1个任务正在进行文字");
    await agent.aiAssert("保险箱中有1811385文件夹");
   
    //删除保险箱中已剪切的文件夹
    await system.exec(`rm -rf ~/.config/Vault/vault_unlocked/1811385`);

    //显示桌面
    await device.pressKey("Super+D");

    //复制桌面上的1811385文件夹到保险箱
    await agent.aiTap("桌面上1811385-test文件夹的图标");
    await agent.aiRightClick("桌面上的1811385-test文件夹");
    await agent.aiTap("复制");
    await agent.aiTap("任务栏上的文件管理器图标");
    await agent.aiTap("保险箱空白处");
    await agent.aiRightClick("保险箱空白处");
    await agent.aiWaitFor("右键菜单弹出", { timeoutMs: 8000,checkIntervalMs: 4000 });
    await agent.aiTap("粘贴");

    //鼠标hover到复制窗口的正在复制文字上
    await agent.aiWaitFor("有1个任务正在进行", { timeoutMs: 10000 });
    await agent.aiHover("复制窗口的正在复制文字上");

    //点击复制窗口中的暂停按钮
    await agent.aiAssert("复制窗口看到两条竖线的暂停按钮");
    await agent.aiTap("复制窗口中的暂停按钮");
    
    //点击复制窗口中的继续按钮
    await agent.aiHover("复制窗口正在复制文字上");
    await agent.aiTap("复制窗口中的三角形继续按钮");
    await agent.aiWaitFor("复制进度条为100%或者没有1个任务正在进行文字", { timeoutMs: 900000,checkIntervalMs: 4000 });
    //删除保险箱中已复制的文件夹
    await system.exec(`rm -rf ~/.config/Vault/vault_unlocked/1811385-test`);
    
    //拖拽大量文件到保险箱
    await agent.aiTap("桌面上1811385-test文件夹的图标");
    await agent.aiDrag("桌面上的1811385-test文件夹", "保险箱空白处");
    await agent.aiWaitFor("复制进度条为100%或者没有1个任务正在进行文字", { timeoutMs: 900000,checkIntervalMs: 4000 });
  
    //步骤2：在保险箱中浏览包含大量文件的文件夹
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("保险箱内的1811385-test文件夹");
    await agent.aiWaitFor("保险箱内容区域底部可以看到文字：5000项", { timeoutMs: 600000,checkIntervalMs: 2000 });
  }

describe('1811385-保险箱-操作大量', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      await rmVault(system);
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');  

  });
  
  test('1811385-保险箱-操作大量', async ({ device, agent, uos, env, system }) => {       
    //调用函数执行步骤1和步骤2
    await step1and2(uos, env, agent, device, system);
    //步骤3：从保险箱复制/剪切/拖拽大量文件到本地目录下，如音乐
    //从保险箱复制大量文件到音乐目录
    await agent.aiTap("文件管理器左侧栏的保险箱");    
    await agent.aiRightClick("保险箱内的1811385-test文件夹");
    await agent.aiTap("复制");
    await agent.aiTap("文件管理器左侧栏的音乐");
    await agent.aiTap("音乐目录内空白处");
    await agent.aiRightClick("音乐目录内空白处");
    await agent.aiWaitFor("右键菜单弹出", { timeoutMs: 8000,checkIntervalMs: 4000 });
    await agent.aiTap("粘贴");

    await agent.aiWaitFor("复制进度条为100%或者没有1个任务正在进行文字", { timeoutMs: 900000,checkIntervalMs: 4000 });
    await agent.aiAssert("音乐目录中有1811385-test文件夹");

    //从保险箱剪切大量文件到下载目录
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiRightClick("保险箱内的1811385-test文件夹");
    await agent.aiTap("剪切");

    await agent.aiTap("文件管理器左侧栏的下载");
    await agent.aiRightClick("下载目录内空白处");
    await agent.aiWaitFor("右键菜单弹出", { timeoutMs: 6000,checkIntervalMs: 2000 });
    await agent.aiTap("粘贴");

    //鼠标hover到粘贴窗口的正在移动文字上
    await agent.aiWaitFor("有1个任务正在进行", { timeoutMs: 10000 });
    await agent.aiHover("移动窗口正在移动文字上");

    //点击粘贴窗口中的中断按钮
    await agent.aiTap("移动窗口中的中断(也就是红色正方形图标)按钮");
    await agent.aiAssert("没有1个任务正在进行文字");
    await agent.aiAssert("下载目录中有1811385-test文件夹");
    //删除保险箱中已剪切的文件夹
    await system.exec(`rm -rf ~/.config/Vault/vault_unlocked/1811385-test`);
    //测试素材准备：在保险箱创建1811385-test文件夹并在文件夹中创建5000个后缀为txt的文本文档（使用seq+xargs避免too many open files错误）
    await system.exec("mkdir -p ~/.config/Vault/vault_unlocked/1811385-test");
    await system.exec(`seq 1 5000 | xargs -I {} sh -c 'echo "this is a test file" > ~/.config/Vault/vault_unlocked/1811385-test/{}.txt'`);
    console.log("保险箱1811385-test文件夹中5000个文本文档创建成功");    

    //从保险箱拖拽大量文件到桌面
    //删除桌面上的1811385-test文件夹
    await system.exec(`rm -rf ~/Desktop/1811385-test`);
    await device.pressKey("Super+Right");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("保险箱内的1811385-test文件夹");
    await agent.aiDrag("保险箱内的1811385-test文件夹", "桌面空白处");
    await agent.aiWaitFor("复制进度条为100%或者没有1个任务正在进行文字", { timeoutMs: 900000,checkIntervalMs: 4000 });  
    await agent.aiAssert("桌面上有的1811385-test文件夹");
    
  }, { timeout: 2400000, tags: ['1811385','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("rm -rf ~/Desktop/1811385*");
      await system.exec("rm -rf ~/Downloads/1811385-test");
      await system.exec("rm -rf ~/Music/1811385-test");
    });
  });