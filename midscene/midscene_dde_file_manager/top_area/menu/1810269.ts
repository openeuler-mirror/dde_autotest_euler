/**
 * 用例 PMSID: 1810269
 * 用例标题: 勾选【显示隐藏文件】-在保险箱内以"."开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-2-3 13:16:40
 * 用例编写人: UT000686(李双双)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1810269-勾选【显示隐藏文件】-在保险箱内以"."开头新建/重命名文件-不弹窗提示', () => {
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
  
  test('1810269-勾选【显示隐藏文件】-在保险箱内以"."开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    // await uos.openApp("文件管理器", 3000, 20000, true);
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    // 前置条件：创建测试文件
    await system.exec('touch /home/$USER/.config/Vault/vault_unlocked/269des.txt');
    await system.exec('mkdir /home/$USER/.config/Vault/vault_unlocked/269desf');

    // 勾选显示隐藏文件
   await agent.aiTap('右上角主菜单')
        await agent.aiTap('设置', { deepThink: true })
        await agent.aiTap('文件和目录',{ deepThink: true })
        
        // 检查显示隐藏文件是否已经勾选，未勾选则点击
        let isChecked = false;
        try {
            await agent.aiAssert('显示隐藏文件前面的勾选框已勾选', { timeout: 1000 });
            isChecked = true;
            console.log('显示隐藏文件已勾选，跳过点击操作');
        } catch (error) {
            isChecked = false;
            console.log('显示隐藏文件未勾选，执行点击操作');
        }
        
        if (!isChecked) {
            await agent.aiTap('显示隐藏文件前面的勾选框')
        }
        
        await device.pressKey('esc')

    // 1. 右键新建文件，重命名为".newf269"
    await agent.aiTap("文件管理器侧边栏的保险项")
    await agent.aiRightClick("保险箱中间页面空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText(".newf269");
    await device.pressKey("Enter");
    await agent.aiAssert(".newf269文件正常显示,无是否隐藏文件的弹框");

    // 2. 右键新建文档->文本文档，重命名为".new269"
    await agent.aiRightClick("保险箱中间页面空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText(".new269");
    await device.pressKey("Enter");
    await agent.aiAssert(".new269.txt文件正常显示,无是否隐藏文件的弹框");

    // 3. 右键269des.txt，重命名为.update269
    await agent.aiRightClick("269des.txt文件");
    await agent.aiTap("重命名");
    await device.typeText(".update269");
    await device.pressKey("Enter");
    await agent.aiAssert(".update269文件正常显示,无是否隐藏文件的弹框");

    // 4. 右键269desf，重命名为.updatef269
    await agent.aiRightClick("269desf文件");
    await agent.aiTap("重命名");
    await device.typeText(".updatef269");
    await device.pressKey("Enter");
    await agent.aiAssert(".updatef269文件正常显示,无是否隐藏文件的弹框");

    // 清理测试文件
    await system.exec('rm -rf /home/$USER/.config/Vault/vault_unlocked/269des*');
    await system.exec('rm -rf /home/$USER/.config/Vault/vault_unlocked/.new269*');
    await system.exec('rm -rf /home/$USER/.config/Vault/vault_unlocked/.newf269');
    await system.exec('rm -rf /home/$USER/.config/Vault/vault_unlocked/.update269');
    await system.exec('rm -rf /home/$USER/.config/Vault/vault_unlocked/.updatef269');

  }, { timeout: 1800000, tags: ['1810269','level3','top_area','menu','DITT','lishuangshuang'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
    });
  });