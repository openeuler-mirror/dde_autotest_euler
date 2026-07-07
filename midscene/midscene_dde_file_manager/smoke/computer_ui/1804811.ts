/**
 * 用例 PMSID: 1804811
 * 用例标题: [179]扩展名隐藏-取消勾选"显示文件扩展名"后，检查多扩展名文件是否正确隐藏扩展名
 * 生成时间: 2026-01-22
 * 用例编写人: UT000211(陈依)
 */


describe('1804811-[179]扩展名隐藏-取消勾选"显示文件扩展名"后，检查多扩展名文件是否正确隐藏扩展名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    await uos.openApp('文件管理器',5000,100000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1804811-扩展名隐藏-取消勾选"显示文件扩展名"后，检查多扩展名文件是否正确隐藏扩展名', async ({ uos, agent, device, system }) => {
    // 1.打开文件管理器，点击右上方设置菜单，进入设置页面
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('进入设置页面');

    
    // 2.点击文件和目录
    await agent.aiTap('设置页面中的文件和目录选项');
    await agent.aiAssert('文件和目录高亮显示');
    
    // 3.点击设置页面显示文件扩展名前方方框
    await agent.aiTap('设置页面显示文件扩展名前方的方框');
    await agent.aiAssert('显示文件扩展名前方方框没有被勾选');
    
    // 4.关闭设置
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置页面被关闭');
    
    // 5.点击桌面目录
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    
    // 6.使用命令在桌面新建文件test，并且使用命令7z a -ttar -mx=9 test.tar.gz test
    await system.exec("touch ~/Desktop/test");
    await system.exec("7z a -ttar -mx=9 ~/Desktop/test.tar.7z ~/Desktop/test");
    await agent.aiAssert('存在test.tar文件');
    
    // 7.点击test.tar，打开test.tar的右键菜单，点击重命名，快捷键执行全选操作，输入文本test.tar.7z，进行确认操作
    await agent.aiTap('test.tar文件');
    await agent.aiRightClick('test.tar文件');
    await agent.aiTap('右键菜单中的重命名');
    await device.pressKey('Control+A'); // 全选操作
    await device.typeText('test1.tar', false);
    await device.pressKey('Enter');
    await agent.aiAssert('存在test1.tar文件');
    
    // 8.使用命令复制文件到桌面并重命名为test.jpg.png.jpeg
    await system.exec("cp /usr/share/deepin-manual/manual-assets/application/uosdrive/uosdrive/zh_TW/fig/01launcher.jpeg ~/Desktop/test.jpg.png.jpeg");
    await agent.aiAssert('存在test.jpg.png文件');
    
    // 9.使用命令复制文件到桌面并重命名为test.jpg.jpg
    await system.exec("cp /usr/share/browser/product_logo_64.png ~/Desktop/test.jpg.jpg");
    await agent.aiAssert('存在test.jpg文件');

     // 10.打开文件管理器，点击右上方设置菜单，进入设置页面
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('进入设置页面');
    
    // 11.点击文件和目录
    await agent.aiTap('设置页面中的文件和目录选项');
    await agent.aiAssert('文件和目录高亮显示');
    
    // 12.点击设置页面显示文件扩展名前方方框
    await agent.aiTap('设置页面显示文件扩展名前方的方框');
    await agent.aiAssert('显示文件扩展名前方方框被勾选');
    
    // 13.关闭设置
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置页面被关闭');
    
    }, { timeout: 600000, tags: ["1804811",'level2', 'smoke','DITT','chenyi'] });
    


  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 10.删除文件test.tar.7z   test.jpg.jpg  test.jpg.png.jpeg  test.tar  test.jpg test.jpg.png
    await system.exec("rm -rf ~/Desktop/test.tar.7z ~/Desktop/test.jpg.jpg ~/Desktop/test.jpg.png.jpeg ~/Desktop/test.tar ~/Desktop/test.jpg ~/Desktop/test.jpg.png ~/Desktop/test ~/Desktop/test.tar.gz ~/Desktop/01launcher.jpeg ~/Desktop/product_logo_64.png");
    await agent.aiAssert('桌面不存在test.jpg.png  test.jpg test.tar test.jpg.png.jpeg test.jpg.jpg test.tar.7z    ');
     
   
    
    // 例如：关闭应用、清理文件等
    await agent.aiTap("窗口右上角关闭按钮:X");
    await uos.showDesktop();
  });
});
