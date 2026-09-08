
/**
 * 用例 PMSID: 1811707
 * 用例标题: 【保险箱】保险箱-开启保险箱完整流程
 * 生成时间: 2026-01-16 13:30:38
 * 用例编写人：UT006252(杨通)
 */

describe('1811707-【保险箱】保险箱-开启保险箱完整流程', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    //打开文件管理器并全屏显示
    await uos.showDesktop();
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

  test('1811707-【保险箱】保险箱-开启保险箱完整流程', async ({ device, agent, uos,system}) => {
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    const TEST_USERNAME = process.env.TEST_USERNAME;
    //密匙加密创建保险箱
    await agent.aiDoubleClick('保险箱图标');
    await agent.aiWaitFor('出现专属与个人的安全空间文本');
    await agent.aiTap('开启按钮');
    await agent.aiInput('Aa!12345','密码输入框');
    await agent.aiInput('Aa!12345','重复密码输入框');
    await agent.aiTap('下一步按钮');
    await agent.aiWaitFor('下一步按钮');
    await agent.aiAssert('出现保存恢复密匙文件并将其存放在安全的地方文本')
    await agent.aiTap('选择密匙文件保存路径文本右侧的蓝色底三个白色圆点的按钮');
    await agent.aiTap('保存按钮');
    await agent.aiTap('下一步按钮');
    await agent.aiTap('加密保险箱按钮');
    await device.typeText(`${TEST_PASSWORD}`, true);
    await agent.aiWaitFor('确定按钮',{ timeoutMs: 60000 });
    await agent.aiAssert('出现加密已完成文本');
    await agent.aiTap('确定按钮');
    await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    //删除保险箱并进行重新创建
    await agent.aiWaitFor('出现文件夹为空文本');
    await agent.aiRightClick('侧边栏中的保险箱文本');
    await agent.aiTap('删除保险箱选项');
    await agent.aiAssert("界面出现删除保险箱后，其中的所有内容都将会被永久删除文本");
    await agent.aiTap('密码文本') 
    await device.typeText('Aa!12345', true);
    await device.typeText(`${TEST_PASSWORD}`);
    await agent.aiTap('确定按钮')
    await agent.aiTap('确定按钮')
    //重新密匙加密创建保险箱
    await agent.aiDoubleClick('保险箱图标');
    await agent.aiWaitFor('出现专属与个人的安全空间文本');
    await agent.aiTap('开启按钮');
    await agent.aiInput('Aa!12345','密码输入框');
    await agent.aiInput('Aa!12345','重复密码输入框');
    await agent.aiTap('下一步按钮');
    await agent.aiWaitFor('下一步按钮');
    await agent.aiAssert('出现保存恢复密匙文件并将其存放在安全的地方文本')
    await agent.aiTap('选择密匙文件保存路径文本右侧的蓝色底三个白色圆点的按钮');
    await agent.aiTap('保存按钮');
    await agent.aiTap('下一步按钮');
    await agent.aiTap('加密保险箱按钮');
    await device.typeText(`${TEST_PASSWORD}`, true);
    await agent.aiWaitFor('确定按钮');
    await agent.aiAssert('出现加密已完成文本');
    await agent.aiTap('确定按钮');
    await agent.aiAssert('出现文件夹为空文本');
    //校验密匙文件非明文密码
    const rsapubkey = await system.exec(`cat /home/${TEST_USERNAME}/.config/Vault/rsapubkey`);
    if (rsapubkey.success) {
        const content = rsapubkey.stdout; 
        if (content.includes('Aa!12345')) {
            throw new Error('RSA 公钥中包含明文密码，存在安全风险！');
        } else {
            console.log('公钥未包含明文密码，校验通过');
        }
    } else {
        console.error('无法读取 rsapubkey.key:', rsapubkey.stderr);
    }
  }, { timeout: 1200000, tags: ['1811707', 'level2','smoke','DITT','yangtong'] });

  afterEach(async ({ device,agent,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    const TEST_USERNAME = process.env.TEST_USERNAME;
    //删除保险箱
    console.log('卸载保险箱');
    await agent.aiTap('计算机文本') 
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

  afterAll(async ({ uos, agent, device,system }) => {
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
