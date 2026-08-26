/**
 * 用例 PMSID: 1806859
 * 用例标题:  U盘中，文件夹右键功能-添加书签
 * 生成时间: 2026-5-15 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';

describe('1806859-U盘中，文件夹右键功能-添加书签', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，创建测试文件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
    });
  
    test('1806859-U盘中，文件夹右键功能-添加书签', async ({ device, agent, uos }) => {     
   
      // 步骤1：进入U盘内部，选择文件夹，右键选择“添加到快捷访问”
      await agent.aiTap("点击任务栏上三叉结构，中间有向上箭头的usb图标，不是点击向左箭头图标");
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap(`文件管理器左侧栏的${usbFlash}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert(`成功进入名称为${usbFlash}的u盘目录`);

      // 步骤1预期：文管左侧栏有文件夹的快捷访问    
      await device.pressKey('Ctrl', 'Shift', 'N');
      await device.typeText('1806859');
      await agent.aiTap(`${usbFlash}目录里的空白处`);
      await agent.aiRightClick("1806859文件夹的图标");
      await agent.aiTap("添加到快捷访问");
      await agent.aiAssert("文件管理器左侧栏看到1806859");
      await agent.aiRightClick(`${usbFlash}目录里的1806859文件夹的图标`);
      await agent.aiTap("删除");
      await agent.aiTap("删除按钮");
      await agent.aiRightClick("文件管理器左侧栏的1806859");
      await agent.aiTap("从快捷访问移除");

    }, { timeout: 1200000, tags: ["1806859",'level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });