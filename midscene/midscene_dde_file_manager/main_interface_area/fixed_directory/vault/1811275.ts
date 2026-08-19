/**
 * 用例 PMSID: 1811275
 * 用例标题: 透明加解密 - Keyring工具修改/删除密码，不会导致保险箱异常
 * 生成时间: 2026-3-17 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

async function createNoPasswordVault(uos, env, agent, device, system){
  await agent.aiTap("任务栏上的文件管理器图标");
  await agent.aiTap("文件管理器左侧栏的保险箱");
  await agent.aiTap("开启按钮");
  await agent.aiTap("密钥加密文字");
  await agent.aiTap("透明加密文字");
  await agent.aiTap("下一步");
  await agent.aiTap("有加密保险箱文字的蓝色按钮");
  await device.typeText(`${process.env.TEST_PASSWORD}`);
  await agent.aiTap("确定");
  try {
    await agent.aiWaitFor("有加密已完成文字",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
  } catch (error) {
    console.log("创建保险箱失败");
    throw error;
  }
  await agent.aiTap("确定");
  }

async function step1(device, agent, uos, env, system){
    await agent.aiWaitFor("桌面已显示");  
    //前置条件1：【加密方式】选择"透明加密"，保险箱创建完成
    await createNoPasswordVault(uos, env, agent, device, system);
 
    //前置条件2：检查并安装libsecret-tools
    const updateResult = await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S apt update;date`);
    
    // 定义检查函数，每隔3秒检查一次，直到包含年、月、日
    const checkDateInResult = async () => {
      const maxCheckTimes = 20; // 最大检查次数，避免无限循环
      let checkCount = 0;
      
      while (checkCount < maxCheckTimes) {
        // 合并stdout和stderr，避免输出位置不同导致检查失败
        const resultContent = `${updateResult.stdout || ''}\n${updateResult.stderr || ''}`;
        const hasYear = resultContent.includes('年');
        const hasMonth = resultContent.includes('月');
        const hasDay = resultContent.includes('日');
        
        if (hasYear && hasMonth && hasDay) {
          console.log('apt update命令执行成功');
          return true;
        }
        
        checkCount++;
        console.log(`第${checkCount}次检查，未同时找到年、月、日，3秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 每隔3秒检查一次
      }
      
      console.error('超过最大检查次数，未在updateResult中找到年、月、日');
      return false;
    };
    
    // 执行检查逻辑
    await checkDateInResult();

    // 执行apt policy命令
    const result = await system.exec("apt policy libsecret-tools");
    console.log("apt policy libsecret-tools结果: ");
    console.log("退出码:", result.code); // 打印命令执行退出码（0为成功）
    console.log("标准输出:\n", result.stdout || "无"); // 打印标准输出（核心内容）
    console.log("标准错误:\n", result.stderr || "无"); // 打印标准错误（排查问题用）
    
    // 判断是否安装libsecret-tools（逻辑保留，仅优化打印）     
    if (result.stdout && result.stdout.includes("候选：") && !result.stdout.includes("候选： (无)")) {
      console.log("检测到libsecret-tools包，开始安装...");
      // 第一步：执行安装命令（仅执行一次）
      await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S apt install -y libsecret-tools`);
      
      // 第二步：定义检查安装状态的函数（每3秒执行apt policy检查）
      const checkInstallStatus = async () => {
        const maxCheckTimes = 40; // 最大检查次数（40*3=120秒）
        let checkCount = 0;
      
        while (checkCount < maxCheckTimes) {
          // 每3秒执行一次apt policy命令，获取最新安装状态
          const policyResult = await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S apt policy libsecret-tools`);
          const policyOutput = `${policyResult.stdout || ''}\n${policyResult.stderr || ''}`;
          
          // 核心判断：“已安装：”右侧不是“(无)”
          if (policyOutput.includes("已安装：") && !policyOutput.includes("已安装： (无)")) {
            console.log("libsecret-tools安装完成");
            return true;
          }
          
          checkCount++;
          console.log(`第${checkCount}次检查，libsecret-tools仍未安装完成，3秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      
        console.error('超过最大检查次数，libsecret-tools安装未完成');
        return false;
      };
      
      //执行检查逻辑
      await checkInstallStatus();
    } else {
      console.log("仓库中没有libsecret-tools包");
    }
   
    //记录保险箱密码
    const vaultPassword = await system.exec("secret-tool lookup user uos domain uos.cryfs");
    console.log("获取到的保险箱密码:", vaultPassword.stdout || vaultPassword.stderr || "无");
    
    //步骤1：使用Keyring工具修改/删除密码后，检查保险箱基本功能
    await system.exec("secret-tool clear user uos domain uos.cryfs");
    console.log("密码删除成功");
    
    //删除密码后，检查保险箱基本功能
    //进入保险箱
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("成功打开保险箱");
    
    //右键保险箱空白处，点击新建文件夹
    await agent.aiRightClick("保险箱空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText("1811275");
    await agent.aiTap("保险箱空白处");
    
    //检查文件夹是否创建成功
    await agent.aiAssert("保险箱内看到名称为1811275的文件夹");
    
    //点击保险箱内的1811275文件夹，按Delete键
    await agent.aiRightClick("保险箱内1811275文件夹");
    await agent.aiTap("删除");
    await agent.aiTap("删除按钮");   
    
    //检查文件夹是否删除成功
    await agent.aiAssert("保险箱内没有名称为1811275的文件夹");
    
    //检查保险箱是否能够正常进入
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("成功打开保险箱");
  }

describe('1811275-透明加解密 - Keyring工具修改/删除密码，不会导致保险箱异常', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      await rmVault(system);
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  
  test('1811275-透明加解密 - Keyring工具修改/删除密码，不会导致保险箱异常', async ({ device, agent, uos, env, system }) => {
    //调用函数执行步骤1
    await step1(device, agent, uos, env, system);

    //步骤2：锁屏/重启，然后重新登录，检查保险箱基本功能
    await device.pressKey("Control", "Alt", "Delete");
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('锁屏按钮',{ deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    await agent.aiInput(`${process.env.TEST_PASSWORD}`, '密码输入框');
    await agent.aiTap('登录按钮');

    //锁屏后检查保险箱基本功能，预期：无法访问保险箱
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    //看到磁盘列表，说明未进入保险箱
    await agent.aiAssert("看到磁盘列表文字");

    await device.pressKey("Control", "Alt", "Delete");
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('重启按钮',{ deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    await agent.aiInput(`${process.env.TEST_PASSWORD}`, '密码输入框');
    await agent.aiTap('登录按钮');
    await agent.aiWaitFor("桌面已显示", { timeoutMs: 10000,checkIntervalMs: 2000 });
    //重启后检查保险箱基本功能，预期：无法访问保险箱
    await agent.aiTap("任务栏上的文件管理器图片");
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    //看到磁盘列表，说明未进入保险箱
    await agent.aiAssert("看到磁盘列表文字");
    await device.pressKey("Alt+F4");
    
    //步骤3：删除保险箱(rm -rf ~/.config/Vault)，再开启保险箱 
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await rmVault(system);      
    await createNoPasswordVault(uos, env, agent, device, system);
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("成功进入保险箱目录");   

  }, { timeout: 1800000, tags: ['1811275','level3','remote','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 删除保险箱
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await rmVault(system);
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    //卸载libsecret-tools
    await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S apt remove -y libsecret-tools`);
  });
});