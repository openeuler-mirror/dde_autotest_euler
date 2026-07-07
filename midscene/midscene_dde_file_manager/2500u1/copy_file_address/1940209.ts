/**
 * 用例 PMSID: 1940209
 * 用例标题:  【复制文件地址】文管快捷键面板新增复制文件地址快捷键
 * 生成时间: 2026-5-25 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPassword = process.env.TEST_PASSWORD;

describe('1940209-【复制文件地址】文管快捷键面板新增复制文件地址快捷键', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，创建测试文件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
    });
  
    test('1940209-【复制文件地址】文管快捷键面板新增复制文件地址快捷键', async ({ device, agent, uos, system }) => {
      await agent.aiWaitFor("桌面已显示");
   
      //步骤1：打开文管，按ctrl + shift + ？弹出文管快捷键面板
      await uos.openApp("文件管理器", 3000, 20000, true);
      await device.keyDown("ctrl+shift+slash");
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiAssert("看到快捷键面板");    

      //步骤2：检查“重命名”后是否新增项：复制文件地址  Ctrl + Shift + C
      await agent.aiAssert("在终端中打开上方，有：复制文件地址    Ctrl + Shift + C");
      await device.keyUp("ctrl+shift+slash");

      await device.pressKey("Alt+F4");

    }, { timeout: 1200000, tags: ['1940209', 'level4', '2500u1', 'copy_file_address', 'DITT', 'lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');      
      await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);

    });
  });