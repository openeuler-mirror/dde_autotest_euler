/**
 * 用例 PMSID: 1807235
 * 用例标题: [007]预览-预览支持类型
 * 生成时间: 2026-01-23
 * 用例编写人: UT000211（陈依）
 */



describe('1807235-[007]预览-预览支持类型', () => {
  beforeAll(async ({ device, uos, env, agent, system }) => {
    // 预安装测试所需的依赖
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec('rm -f ~/Desktop/test.tar.7z ~/Desktop/test.jpeg ~/Desktop/test.png ~/Desktop/test.jpg ~/Desktop/test.gif ~/Desktop/test.bmp ~/Desktop/test ~/Desktop/test.mp3 ~/Desktop/test.mp4 ~/Desktop/test.tar.7z'); 
    await system.exec(`echo ${env.testPassword} | sudo -S apt-get install graphicsmagick-imagemagick-compat -y`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1807235-[007]预览-预览支持类型', async ({ uos, agent, device, system }) => {
    // 1.打开文件管理器，进入到桌面目录
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await device.pressKey('Super', 'Up');
    
    // 2.使用命令在桌面新建文件test，并且使用命令7z a -ttar -mx=9 test.tar.7z test,点击test.tar.7z文件，快捷键执行空格操作，打开弹窗，页面显示压缩文件，关闭弹窗
    await system.exec("touch ~/Desktop/test");
    await system.exec("7z a -ttar -mx=9 ~/Desktop/test.tar.7z ~/Desktop/test");
    await system.exec("rm -rf ~/Desktop/test");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('test.tar.7z文件');
    await agent.aiAssert('test.tar.7z被选中');
    await device.pressKey('Space');
    await agent.aiWaitFor('预览弹窗出现')
    await agent.aiAssert('打开test.tar.7z的预览弹窗');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('压缩文件预览弹窗被关闭');
    
    // 3.使用命令复制文件到桌面cp /usr/share/deepin-manual/manual-assets/application/uosdrive/uosdrive/zh_TW/fig/01launcher.jpeg  ~/Desktop/test.jpeg, 点击test.jpeg文件，快捷键执行空格操作，打开弹窗，显示test.jpeg,关闭弹窗
    await system.exec("cp /usr/share/deepin-manual/manual-assets/application/uosdrive/uosdrive/zh_TW/fig/01launcher.jpeg ~/Desktop/test.jpeg");
    await agent.aiTap('test.jpeg文件');
    await agent.aiAssert('test.jpeg被选中')
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示test.jpeg');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('图片预览弹窗被关闭');
    
    // 4.使用命令复制文件到桌面cp /usr/share/browser/product_logo_64.png ~/Desktop/test.png，点击test.png文件，快捷键执行空格操作，打开弹窗，显示test.png,关闭弹窗
    await system.exec("cp /usr/share/browser/product_logo_64.png ~/Desktop/test.png");
    await agent.aiTap('test.png文件');
    await agent.aiAssert('test.png被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示test.png');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('图片预览弹窗被关闭');
    
    // 5.使用命令复制文件到桌面cp /usr/share/doc/syslinux-common/examples/syslinux_splash.jpg ~/Desktop/test.jpg，点击test.jpg文件，快捷键执行空格操作，打开弹窗，显示test.jpg,关闭弹窗
    await system.exec("cp /usr/share/doc/syslinux-common/examples/syslinux_splash.jpg ~/Desktop/test.jpg");
    await agent.aiTap('test.jpg文件');
    await agent.aiAssert('test.jpg被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示test.jpg');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('图片预览弹窗被关闭');
    
    // 6.使用命令复制文件到桌面cp /usr/share/cups/doc-root/images/wait.gif ~/Desktop/test.gif，点击test.gif文件，快捷键执行空格操作，打开弹窗，显示test.gif,关闭弹窗
    await system.exec("cp /usr/share/cups/doc-root/images/wait.gif ~/Desktop/test.gif");
    await agent.aiTap('test.gif文件');
    await agent.aiAssert('test.gif被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示test.gif');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('图片预览弹窗被关闭');
    
    // 7.执行命令convert test.jpg test.bmp,点击test.bmp文件，快捷键执行空格操作，打开弹窗，显示test.bmp,关闭弹窗
    await system.exec("convert ~/Desktop/test.jpg ~/Desktop/test.bmp");
    await agent.aiAssert('桌面存在test.bmp');
    await agent.aiTap('test.bmp文件');
    await agent.aiAssert('test.bmp被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示test.bmp');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('图片预览弹窗被关闭');
    
    // 8.使用命令在桌面创建test文件，并写入123,点击test文件，快捷键执行空格操作，打开弹窗，弹窗显示123,关闭弹窗
    await system.exec("echo '123' > ~/Desktop/test");
    await agent.aiTap('test文件');
    await agent.aiAssert('test被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示123');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('文件预览弹窗被关闭');
    

    
    // 9.使用命令cp /usr/share/dde-introduction/uos/1-DDE.mp4 ~/Desktop/test.mp4，，点击test.mp4文件，快捷键执行空格操作，打开弹窗，弹窗显示的test.mp4
    await system.exec("cp /usr/share/dde-introduction/uos/1-DDE.mp4 ~/Desktop/test.mp4");
    await agent.aiTap('test.mp4文件');
    await agent.aiAssert('test.mp4被选中');
    await device.pressKey('Space');
    await agent.aiWaitFor('预览弹窗出现')
    await agent.aiAssert('弹窗显示test.mp4');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('视频预览弹窗被关闭');

    // 10.使用命令cp ~/Music/bensound-sunny.mp3 ~/Desktop/test.mp3，，点击test.mp3文件，快捷键执行空格操作，打开弹窗，弹窗显示音乐文件的图标,关闭弹窗
    await system.exec("cp ~/Music/bensound-sunny.mp3 ~/Desktop/test.mp3");
    await agent.aiTap('test.mp3文件');
    await agent.aiAssert('test.mp3被选中');
    await device.pressKey('Space');
    await agent.aiAssert('弹窗显示音乐文件的图标');
    await agent.aiTap('预览弹窗的关闭按钮');
    await agent.aiAssert('音乐预览弹窗被关闭');

    
    }, { timeout: 1300000, tags: ["1807235",'level2', 'smoke','DITT','chenyi'] });
    


  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent,env, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 10.删除文件步骤1到步骤10产生的文件
    await system.exec("rm -f ~/Desktop/test.tar.7z ~/Desktop/test.jpeg ~/Desktop/test.png ~/Desktop/test.jpg ~/Desktop/test.gif ~/Desktop/test.bmp ~/Desktop/test ~/Desktop/test.mp3 ~/Desktop/test.mp4 ~/Desktop/test.tar.7z");
    await system.exec(`echo ${env.testPassword} | sudo -S apt  purge graphicsmagick-imagemagick-compat -y`);
    await agent.aiAssert('桌面不存在test.tar.7z test.jpeg test.png test.gif  test.bmp test test  test.mp3 test.mp4');
    
    // 例如：关闭应用、清理文件等
    await device.pressKey('Super', 'Down')
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await uos.showDesktop();
  });
});
