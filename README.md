<p align="center">
    <em>DDE Autotest for openEuler, based on YouQu.</em>
</p>

----------------------

**openEuler** 系统 **DDE** 桌面自动化测试。

## 安装

1、下载欧拉最新镜像

镜像下载网址：https://www.openeuler.org/zh/download/

2、虚拟机安装镜像

3、配置欧拉 DDE 桌面环境

进入系统后，通过以下步骤切换 DDE 桌面环境：

```shell
sudo yum install dde rsync
sudo systemctl set-default graphical.target
reboot
```

## 环境部署

以下所有操作在 DDE 桌面环境下进行，且`不在 root 用户下操作`，

建议新建一个普通管理员用户：**uos**

```bash
sudo pip3 install youqu

# 初始化工程
youqu-startproject dde

# 克隆用例仓库
cd dde/apps/
git clone https://gitee.com/openeuler/dde_autotest_euler.git
```

**配置测试机的密码**

配置文件：
```bash
setting/globalconfig.ini
```

修改配置文件：
```ini
;测试机的密码
PASSWORD = <PASSWORD>
```

**安装依赖**

```bash
cd dde/
bash env.sh
```

## 运行

```bash
# 在项目根目录下运行
youqu manage.py run
```

更多运行方式请查看文档：https://youqu.uniontech.com/

## 提交规范

1、每次提交的 PR 只能包含一条提交。

2、提交 PR 时要在标题中对提交的内容进行简单描述，要求清晰明了。

3、PR 的内容应当是有价值的，无关紧要的内容或非常简单的优化可以与其他内容一起提交。

4、 提交的 PR 应当是独立的，不能影响其他文件的功能，不可影响其他用例的执行。

5、提交的代码应当注重规范性，提交前要对代码的格式与内容进行检查。

## 常见问题
Q: OCR识别、图像识别服务器不可用？

> A: OCR识别、图像识别等服务器仅对内网开放，外部可自行部署或者联系公司技术支持。