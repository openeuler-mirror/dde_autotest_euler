// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809807
 * 用例标题: 新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销
 * 生成时间: 2025-12-19 11:17:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1809807-新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器并进入主目录保险箱
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809807-新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system, env }) => {
      
      // 检测并删除桌面存在的pubKey.key文件
      await system.exec('rm -f ~/Desktop/recoveryKey.key', 500);

      // 检测是否已创建保险箱，如果已创建，则直接打开；如果未创建，需要重新创建
      await agent.aiRightClick('文件管理器左侧的“保险箱”');
       try {
        console.log('检测是否已创建保险箱，如果已创建，则直接打开；如果未创建，需要重新创建');
        // 1. 不存在保险箱
        await agent.aiWaitFor('创建保险箱');
        // 设置保险箱解锁方式
        await agent.aiTap('创建保险箱');
        await agent.aiTap('弹框下方的开启按钮');
        await agent.aiWaitFor('设置解锁方式');
        await agent.aiTap('密码右侧的输入框');
        await device.typeText('Uos123!!');
        await agent.aiTap('重复密码右侧的输入框');
        await device.typeText('Uos123!!');
        await agent.aiTap('蓝色方框内的下一步');
        await agent.aiWaitFor('保存秘钥文件');

        // 保存秘钥文件
        await agent.aiTap('蓝色方框内的...');
        await agent.aiWaitFor('recoveryKey');
        await agent.aiDoubleClick('主目录弹框的桌面文件夹');
        await agent.aiWaitFor('蓝色方框内桌面');
        await agent.aiTap('保存');
        await agent.aiWaitFor('蓝色方框的下一步');
        await agent.aiTap('蓝色方框的下一步');

        // 加密保险箱
        await agent.aiWaitFor('加密保险箱');
        await agent.aiTap('加密保险箱');

        // 密码认证
        await agent.aiWaitFor('创建文件保险箱需要认证');
        await agent.aiTap('密码输入框');
        await device.typeText(env.testPassword);
        await agent.aiTap('确定按钮');
        await system.exec('sleep 15');
        await agent.aiWaitFor('加密已完成');
        await agent.aiTap('确定');
        await agent.aiWaitFor('文件夹为空');
        console.log('已完成新建保险箱');
    } catch (error) {
      console.log('已存在保险箱，直接打开即可');
      await agent.aiTap('打开');
    }
     
      // 保险箱新建文本文档
      console.log('文件撤销恢复测试开始');
      console.log('新建文件');
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('新建文档');
      await agent.aiTap('文本文档');
      await agent.aiTap('任意空白处');
      await agent.aiWaitFor('新建文本');

      // Ctrl+Z撤销操作，文本文件消失
      console.log('Ctrl+Z撤销');
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor('彻底删除');
      await agent.aiTap('弹框右下角红色字体的“删除”');
      await agent.aiAssert("文件夹为空");

      // Ctrl+Y恢复操作
      console.log('Ctrl+Y恢复');
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiAssert("新建文本");

    }, { timeout: 1200000, tags: ["1809807", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 删除保险箱
      await agent.aiRightClick('左侧的保险箱');
      await agent.aiWaitFor('删除保险箱');
      await agent.aiTap('删除保险箱');
      await agent.aiWaitFor('删除保险箱弹框');
      await agent.aiTap('密码输入框');
      await device.typeText('Uos123!!');
      await agent.aiTap('删除');

      // 删除保险箱认证流程
      await agent.aiWaitFor('删除文件保险箱需要认证');
      await agent.aiTap('密码输入框');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');

      // 检测并删除桌面存在的pubKey.key文件
      await system.exec(' rm -f ~/Desktop/recoveryKey.key', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  });
