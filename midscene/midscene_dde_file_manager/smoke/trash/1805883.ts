// @ts-nocheck
/**
 * 用例 PMSID: 1805883
 * 用例标题: [081]右键菜单-回收站内同时选中有文件和文件夹呼出右键菜单正常
 * 生成时间: 2025-12-19 07:44:53
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1805883-[081]右键菜单-回收站内同时选中有文件和文件夹呼出右键菜单正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805883-[081]右键菜单-回收站内同时选中有文件和文件夹呼出右键菜单正常', async ({ device, agent, uos, system }) => {
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);

    //清理回收站内容
    system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);

    // 新建1-2个文件夹
    for (let i = 1; i <= 2; i++) {
      system.exec(`touch ~/.local/share/Trash/files/test'${i}'.txt`);
    }

    // 打开桌面回收站图标
    console.log('执行步骤11：双击打开桌面回收站图标');
    await uos.openApp('回收站', 2000, 20000, true);

    // 步骤15：快捷Ctrl+A
    console.log('执行步骤12：全选回收站中的所有文件');
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("test文件被选中");

    // 步骤6：右键选中所有文件，右键菜单包含'还原''删除''剪切''复制''属性'项
    console.log('执行步骤13：右键点击选中的文件，验证右键菜单内容');
    await agent.aiRightClick("test1.txt文件");
    await agent.aiWaitFor("弹出右键菜单");
    await agent.aiAssert("右键菜单项包含'还原''删除''剪切''复制''属性'项");
    console.log('测试用例执行完成');

    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1805883', 'level2', 'smoke', 'sushanshan'] });

  afterEach(async ({ device }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    //清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);

    //清理回收站内容
    system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    console.log('[清理] 测试环境清理完成');
  });
});
