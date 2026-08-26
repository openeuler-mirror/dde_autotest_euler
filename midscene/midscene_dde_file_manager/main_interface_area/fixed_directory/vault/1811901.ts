/**
 * 用例 PMSID: 1811901
 * 用例标题: 设置解锁方式弹窗-密码输入框-输入类型满足要求且小于8位字符
 * 生成时间: 2026-1-23 14:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

async function rmVault(system){
    //前置进行保险箱删除操作确保环境干净
    await system.exec('rm -r /home/uos/.config/Vault');
    const result = await system.exec('fusermount -u /home/uos/.config/Vault/vault_unlocked');
    console.log(result.stderr);
    if (result.success) {
      console.log('保险箱环境有残留，已强制卸载');
      await system.exec('rm -r /home/uos/.config/Vault');
      await system.exec('rm /home/uos/recoveryKey.key');
    } else {
        console.log('保险箱环境无需清理');
      }
  }

async function clearEnvironment(system){
    //测试前还原文管配置到默认值
    //清理桌面配置目录，影响桌面布局和桌面整理布局
    await system.exec("rm -rf ~/.config/deepin/dde-desktop");
    //清理文管配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager.json");
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager.obtusely.json");
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("systemctl --user restart deepin-service-plugin@org.deepin.Filemanager.TextIndex.service");
    await system.exec("systemctl --user restart deepin-anything-daemon.service");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
    await system.exec("systemctl --user restart dde-file-manager.service");
    //清楚文本编辑器
    await system.exec("rm -rf ~/Desktop/*.txt");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
  }

describe('1811901-设置解锁方式弹窗-密码输入框-输入类型满足要求且小于8位字符', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await clearEnvironment(system);
    await rmVault(system);
  });
  
  test('1811901-设置解锁方式弹窗-密码输入框-输入类型满足要求且小于8位字符', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框右侧眼睛");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Aa1%","含有至少8位文字的输入框");
    await agent.aiTap("设置解锁方式");
    await agent.aiAssert("有如下错误提示：至少8位，包含A-Z,a-z,0-9和符号");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");

  }, { timeout: 1200000, tags: ['1811901','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await rmVault(system);
      await system.exec("rm -rf ~/Desktop/*.txt");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
    });
  });

