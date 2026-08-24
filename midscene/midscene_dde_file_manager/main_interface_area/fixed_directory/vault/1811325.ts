/**
 * 用例 PMSID: 1811325
 * 用例标题: 保险箱-复制到保险箱外的文件回撤
 * 生成时间: 2026-2-11 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811325-保险箱-复制到保险箱外的文件回撤', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });
  
  test('1811325-保险箱-复制到保险箱外的文件回撤', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");

    //前置条件：已进入保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);

    // 在保险箱内创建10个文件夹和10个文本文档，名称分别为1到10
    for (let i = 1; i <= 10; i++) {
      await system.exec(`mkdir -p ~/.config/Vault/vault_unlocked/${i}`);
      await system.exec(`echo "this is a test file" > ~/.config/Vault/vault_unlocked/${i}.txt`);
      await system.exec(`cp ~/.config/Vault/vault_unlocked/${i}.txt ~/.config/Vault/vault_unlocked/${i}`);
    }

    //步骤1：选择一个文件/文件夹复制到保险箱外，ctrl+z回撤
    await agent.aiTap("保险箱内的1.txt文本文档");
    await device.pressKey("Ctrl+C");
    //await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("Super+D");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("桌面已显示");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("桌面上有1.txt文本文档");
    await device.pressKey("Ctrl+Z");
    await agent.aiWaitFor("弹出删除窗口，看到删除按钮",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("带有红色删除文字的按钮");
    await agent.aiAssert("桌面上没有1.txt文本文档");
    await agent.aiTap("任务栏上的文件管理器图标");
    await agent.aiTap("保险箱内名称为1的文件夹");
    await device.pressKey("Ctrl+C");
    //await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("Super+D");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("桌面已显示");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("桌面上有名称为1的文件夹");
    await device.pressKey("Ctrl+Z");
    await agent.aiWaitFor("弹出删除窗口，看到删除按钮",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("带有红色删除文字的按钮");
    await agent.aiAssert("桌面上没有名称为1的文件夹");

    //步骤2：选择多个文件/文件夹复制到保险箱外，ctrl+z回撤
    await agent.aiTap("任务栏上的文件管理器图标");
    await device.pressKey("Ctrl+A");
    await device.pressKey("Ctrl+C");
    //await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("Super+D");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("桌面已显示");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("桌面上有1.txt、2.txt、3.txt、4.txt、5.txt、6.txt、7.txt、8.txt、9.txt、10.txt文本文档和名称分别为1、2、3、4、5、6、7、8、9、10的文件夹");
    await device.pressKey("Ctrl+Z");
    await agent.aiWaitFor("弹出删除窗口，看到删除按钮",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("带有红色删除文字的按钮");
    await agent.aiAssert("桌面上没有1.txt、2.txt、3.txt、4.txt、5.txt、6.txt、7.txt、8.txt、9.txt、10.txt文本文档和名称分别为1、2、3、4、5、6、7、8、9、10的文件夹");

  }, { timeout: 1200000, tags: ['1811325','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("rm -rf ~/Desktop/*.txt")

    });
  });