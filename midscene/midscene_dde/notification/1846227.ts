/**
 * 用例 PMSID: 1846227
 * 用例标题: 【通知中心】通知中心无未查看通知，没有打开通知中心，任务栏通知图标为普通模式
 * 生成时间: 2026-07-14 10:45:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846227-【通知中心】通知中心无未查看通知，没有打开通知中心，任务栏通知图标为普通模式', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 调用dbus接口将通知图标添加到任务栏插件区展示
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await agent.aiWaitFor("任务栏右侧区域出现'通知'图标");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846227-【通知中心】通知中心无未查看通知，没有打开通知中心，任务栏通知图标为普通模式', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查: 通知图标为普通模式（与参考图对比）
    // 根据当前系统主题选择对应的参考图进行对比
    const themeResult = await system.exec("busctl --user get-property org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 GlobalTheme");
    const isDark = themeResult.stdout.includes('dark');
    const notifyIconUrl = isDark ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAD4ElEQVR4nO2b3YsWVRzHv2d9Q0EQXS9SVkusCMRMdm/MQBQRb4oEIRV6U8TsUsW/IPBSRfDGILzJC1FURC8NKyiIRChqDand9SUtLHbNdn35dDGzuv2e2d2ZOefMrDifu/PwzPf7PeeZOec855yRGhoanmVcFSaAk9Qp6S1JXZLmSXpO0pz0K39KuiHpuqRvJZ2S9J1zjiryRQOYAnwM9FKcHuAjYErd9SgFsB74pUTFLVeAdXXXJzeAA/YCDwNUfphHwD6gre76jUla+aOjVKIf+Bx4B1gCtI+4rj39bBNwLP1uFp+R9CcTk/RXsgwB+4G5BXTmAgfSay2fxKxDaYB3M8LeBFZ6aL6Rali2hMzuDTAbuG1C9gELA2g/D1wz2reAWSGyBwE4ZAL2A8sC6i8HBozHwVD6XqS//qAJtzuCz17jMQjMGf/KyAA7TbBuYGoEn6m0zit2hPYpE+wrE2pPRC97F1yM5ZU30CTg3xGBHgHzI/p1mAa4B0yK5Zcn0GITqKcCTzsiLPLR851avmzKP3vq5eFHU37FR8y3Aezs7pqnXh6sR+4ZZha+DWCf99899fJwx5Tn+Yj5NkCHKfd56uXh9jgZCuHbAHaq+5unXh6umvICHzHfBrDm0UcBSd2m7HUHlAaYDNw1Q1L0qSkwM51vDNNfy1wA6DSVr2IEGPa+YbxfK6vl8wisMOWvPbSKcsmUS685+DSANf3SQ6soF0z59Qq9E0gWPEbSVaF3l/Hurcp7tAADVLh+T/In7C+TobOMVtlHYLMpn3fO3S+pVRjn3ENJX5iPN1ViDrRl3P4bKjH/f44tJsP1SoZDYK0x/huYHt24Ncf0jMdgdVGdMo/AVlM+7py7V0LHi9TzhPl4W1RT4CXggWn1NVFNx86zymR5ACyOafipMfyeGreq0v7oB5PpSCyzDlqXvzdGMSuWy3aGQwTYkMkyOmyMfmIC7NaSzAm6TbbDoU2WZzz77wU18QD4IKMveDWUeBvwjTG4wgQ6uUFyEsVumlwgRP8EbOfpxQ7ZLYzbQsBVSS94t2Q99DnnxlwxytOJTQ4Upg7G/X+SpwF2qpr1/tD8oSR7Q0NDQ7UAuyOM6btiZI01l48xSwx+7EaK1wC3ImjejKAZrQF+fUo047wvAExTso09M5DkgKR259xgIL3HRLkD0qCnA0qejFH5qJCsH94P0PsPAS/WXZ9SkH16vCgT83R4HkiWq855VP4sdZ4DDAEwjdFfohiLY9Sw4RIFkjdJPqR1Sy2LXuB9Klpur3RNH5gh6U1Jb0taqifne3okXZZ0UtIZ59w/VeZqaGh4dvkPA9GZyqtU6LIAAAAASUVORK5CYII=' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADhklEQVR4nO2bSWsUQRiGn5nJQgRBojkYiYpoRBDUkFxcQBRRQRAE0RhwBXE5GskvEHJUEXIxIh50PImC6DHiAgqiF7dEgmY3QVwS0cREPXRHp7+eJN1dy8xgP1CHmul5369quqq/7qqGmJiY/5mERZ9aYCdQB1QC84G57vcfgX6gD3gC3ASeAr8txWeMYuAk0I3TmDClCzjuahQk24G3hG+4LB3AVsuxK5EAmoAJ1Bs/WX4BzUDSYjsikQCukL0Rw8A1YC+wEpiX8bt57mf1QNo9NpvGZezNW5Foxh/0GHAWqAihUwGcc38r9c5ojFcr+/EHOwCsV9Dc4GpI3QalSA1QDgzhDbIHWKRBezHQK7QHgTkatLVxAf94X61RvwYYER7nNeorUQ6M4g2u0YBPk/AY5V8ilVNO4A2sHSgx4FOCP684ZsAnNA/xBnXaoJc8C+4b9ApECviBN2FZYNCvCm8HfHdjyBlLRUBdFjzlFWGJiphqarlc1N8o6gXhpaivUBFT7QCZ3fUq6gVBeoTJMH2odoAc7x8U9YLwSdQrVcRUO6BK1HsU9YIwNEMMoVDtAJnqvlfUC0KnqC9UEVPtAGlu4yrQLupKZ4AKRcA3vJckG6npbJx8I/O+Iye5QC3extu4AkzSL7zXRBVSGQJrRf2RglZYnot65GcOKh0gTR8oaIWlTdTXWfT+Sw/e07DOoned8O626J01gBHsPr9PAZ9FDLVRhKIOgX2ifhf4GVErChPAPfFZvS3zJP7Tf5ct8wwaRAx9WLocbhHGX4AyG8aCMvzDYJMN47QwbbVhOgWXRCxXTRtWA+PCdLNp02nYKGIZx3lIY4xWYfiM3C5VJYEXIqaLpsyq8D/+3m3KLARyMhxDz4KMjxZh9Jr8WK1N4dwhZsbWotukBv/YP6DbRIFD+OeCVbrEk8BjYdBBfu3cKMa/aNKGpvnpqBAupHJERwd05kFDopYZb5KCTGJFAY7JV7Tcn+zAn/sXQhkCtunogJiYmJiwNKJ/UjtlIlBTubyJLNHEthtjHTBoQHPAgKaxDnhXIJrGKAW+om/8D7ua2jF1BowCtzTq3XA1C4pqnFxc9d8fA5ZZjl0b2XaPhy15uzs8CCngDtEbf5sc7wPUQSlTv0QxXUmTmwUXIySAwwS7re4GDpLnb4ZEZRbOKzPXgVc4q8ojOJsf08Ae95iYmJgYK/wBDa4yWQf53dkAAAAASUVORK5CYII=';
    await agent.aiAssert({
      prompt: '任务栏右侧的通知图标显示为普通模式，与参考图一致',
      images: [
        { name: '通知图标普通模式', url: notifyIconUrl }
      ],
    });
  }, { timeout: 600000, tags: ['1846227', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0");
  });
});
