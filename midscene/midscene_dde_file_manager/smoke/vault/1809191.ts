/**
 * 用例 PMSID: 1809191
 * 用例标题: 透明加解密 - 【加密方式】选择“密钥加密”，并完成保险箱创建
 * 生成时间: 2025-12-18 20:28:25
 * 用例编写人：UT006252(杨通)
 */
describe('1809191-透明加解密 - 【加密方式】选择“密钥加密”，并完成保险箱创建', () => {
    beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log('打开文件管理器');
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();

    //前置进行保险箱删除操作确保环境干净
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
    await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    const result = await system.exec(`fusermount -u /home/${TEST_USERNAME}/.config/Vault/vault_unlocked`);
    console.log(result.stderr);
    if (result.success) {
      console.log('保险箱环境有残留，已强制卸载');
      await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
      await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    } else {
        console.log('保险箱环境无需清理');
      }
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1809191-透明加解密 - 【加密方式】选择“密钥加密”，并完成保险箱创建', async ({ device, agent, uos }) => {
      const TEST_PASSWORD = process.env.TEST_PASSWORD;
      //透明密匙加密创建保险箱
      console.log('密匙加密创建保险箱');
      await agent.aiDoubleClick('保险箱图标')
      await agent.aiAssert('出现专属于个人的安全空间文本')
      await agent.aiTap('开启按钮')
      await agent.aiInput('Aa!12345','密码输入框');
      await agent.aiInput('Aa!12345','重复密码输入框');
      await agent.aiTap('下一步按钮')
      await agent.aiTap('选择密匙文件保存路径文本右侧的蓝色底三个白色圆点的按钮')
      await agent.aiTap('保存按钮')
      await agent.aiTap('下一步按钮')
      await agent.aiTap('加密保险箱按钮')
      await device.typeText(`${TEST_PASSWORD}`, true);
      await agent.aiWaitFor('确定按钮',{ timeoutMs: 60000 });
      await agent.aiAssert('出现加密已完成文本')
      console.log('创建保险箱成功');
      await agent.aiTap('确定按钮')
      
    }, { timeout: 1200000, tags: ['1809191', 'level2', 'smoke','yangtong'] });
  
    afterEach(async ({ device,agent,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
      const TEST_PASSWORD = process.env.TEST_PASSWORD;
      const TEST_USERNAME = process.env.TEST_USERNAME;
      console.log('卸载保险箱');
      await agent.aiRightClick('保险箱文本')
      await agent.aiTap('删除保险箱选项') 
      await agent.aiTap('密码文本') 
      await device.typeText('Aa!12345', true);
      await device.typeText(`${TEST_PASSWORD}`);
      await agent.aiTap('确定按钮')
      await agent.aiTap('确定按钮')
      const result = await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
      if (result.success) {
        console.log('删除密匙文件成功');
      } else {
        console.error('错误:', result.stderr);
      }
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      console.log('关闭文件管理器');
      await uos.closeCurrentWindow();
      await uos.showDesktop(); // 恢复桌面状态
      //双重保险清理文件管理器环境
      await system.exec('killall dde-file-manager');
      await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
      await system.exec('rm -rf dde-file-manager.obtusely.json');  
      await system.exec('dde-dconfig reset org.deepin.dde.file-manager'); 
    });
  });
  