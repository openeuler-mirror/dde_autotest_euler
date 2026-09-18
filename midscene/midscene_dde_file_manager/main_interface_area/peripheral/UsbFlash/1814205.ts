/**
 * 用例 PMSID: 1814205
 * 用例标题: 【U盘】创建链接文件到U盘
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

const testDir =`/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;

describe('1814205-【U盘】创建链接文件到U盘', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec(`killall dde-file-manager` );
    await system.exec(`touch /home/$USER/Desktop/测试1.txt`,{timeoutMS:1000} );
    await system.exec(`touch /home/$USER/Documents/测试2.txt` );
  });

  beforeEach(async ({ device, agent, system, uos ,}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.openApp("文件管理器",{timeoutMS:500});
    await agent.aiScroll(`文件管理器侧边栏区域`,{direction:`down`,distance:10});
    await agent.aiRightClick(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiTap("格式化");
    await agent.aiTap("类型右侧选择框");
    await agent.aiTap("ext4");
    await agent.aiTap("格式化");
    await agent.aiTap("继续");
    await agent.aiWaitFor("格式化成功");
    await agent.aiTap("完成");
    await agent.aiRightClick("ext4");
    await agent.aiTap("重命名");
    await device.typeText(`${process.env.USB_FLASH}`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为UOS");
  });

  test('1814205-【U盘】创建链接文件到U盘', async ({ device, agent, uos , system}) => {

    // 步骤 1: 创建链接
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiRightClick("测试1.txt");
    await agent.aiTap("发送到");
    await agent.aiTap("创建链接");
    await agent.aiScroll(`文件管理器对话窗的侧边栏区域`,{direction:`down`,distance:10});
    await agent.aiTap(`文件管理器对话窗的${process.env.USB_FLASH}磁盘`);
    await agent.aiTap("文件管理器对话窗的保存");

    await agent.aiTap("文件管理器侧边栏的文档");    
    await agent.aiRightClick("测试2.txt");
    await agent.aiTap("发送到");
    await agent.aiTap("创建链接");
    await agent.aiScroll(`文件管理器对话窗的侧边栏区域`,{direction:`down`,distance:10});
    await agent.aiTap(`文件管理器对话窗的${process.env.USB_FLASH}磁盘`);
    await agent.aiTap("文件管理器对话窗的保存");


    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiAssert("目录内存在测试1快捷方式.txt和测试2快捷方式.txt");

     // 步骤 2:打开链接文件
    await agent.aiDoubleClick("测试1快捷方式.txt");
    await agent.aiAssert("测试1.txt打开成功");
    await agent.aiTap("测试1.txt旁边的x");

    await agent.aiDoubleClick("测试2快捷方式.txt");
    await agent.aiAssert("测试2.txt打开成功");
    await agent.aiTap("测试2.txt旁边的x"); 

  }, { timeout: 1200000, tags: ['1814205', 'level2', 'UsbFlash', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ${testDir}/测试*`);
    await system.exec(`rm -rf /home/$USER/Desktop/测试*`);
    await system.exec(`rm -rf /home/$USER/Documents/测试*`);
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});