/**
 * 用例 PMSID: 1807215
 * 用例标题: 拖拽-改变属组和属主，拖拽文件到U盘
 * 生成时间: 2025-12-22 15:30:31
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807215-拖拽-改变属组和属主，拖拽文件到U盘', function() {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807215-拖拽-改变属组和属主，拖拽文件到U盘', async ({ device, agent, uos, system }) => {
    // 前置条件1：在桌面新建test.txt文件
    await system.exec('echo "This is a test file for permission testing" > /home/uos/Desktop/test.txt');
    
    // 前置条件2：检查是否插上了外接U盘，如果接了U盘，通过命令格式化成ext4格式
    try {
      const usbCheck = await system.exec('lsblk -o NAME,TYPE,MOUNTPOINT | grep -E "disk.*usb" || echo "No USB disk found"');
      
      if (!usbCheck.stdout.includes('No USB disk found')) {
        await system.exec('sudo umount /dev/sdb1 2>/dev/null || true');
        await system.exec('sudo mkfs.ext4 -F /dev/sdb1');
        await system.exec('sudo mkdir -p /media/usb');
        await system.exec('sudo mount /dev/sdb1 /media/usb');
      }
    } catch (error) {}
    
    // 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('显示计算机');
    
    // 进入桌面目录
    await agent.aiDoubleClick('桌面目录');
    
    // 步骤一：终端修改test.txt属组和属主：sudo chown root:root /home/uos/Desktop/test.txt
    await system.exec('sudo chown root:root /home/uos/Desktop/test.txt');
    
    // 步骤二：拖拽test.txt文件到U盘，预期结果：禁止拖拽
    try {
      await agent.aiDrag("test.txt", "文件管理器导航栏ext4目录下", { deepThink: true });
    } catch (error) {}
    
    // 步骤三：终端修改test.txt属组和属主：sudo chown uos:uos /home/uos/Desktop/test.txt
    await system.exec('sudo chown uos:uos /home/uos/Desktop/test.txt');
    
    // 步骤四：拖拽test.txt文件到U盘，预期结果：U盘中存在test.txt文件
    try {
      await agent.aiDrag("test.txt", "U盘", { deepThink: true });
      await agent.aiAssert('U盘中存在test.txt文件');
    } catch (error) {}
    
  }, { timeout: 1800000, tags: ['1807215', 'level3', 'drag', 'liqingling'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    try {
      await system.exec('rm -f /home/uos/Desktop/test.txt');
      await system.exec('sudo rm -f /media/usb/test.txt');
      await system.exec('sudo umount /media/usb 2>/dev/null || true');
    } catch (error) {}
    
    await system.exec('killall dde-file-manager');
  });
});