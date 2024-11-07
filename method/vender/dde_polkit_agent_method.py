from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DdePolkitAgentMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-polkit-agent")

    def click_by_attr(self, path):
        """在终端界面内点击右上角的【设置】按钮"""
        self.dog.element_click(path)

    def input_password(self):
        """弹出鉴权窗口后输入管理员密码"""
        sleep(2)
        self.click_by_attr("EditableText_passwordinput")
        from setting import conf
        self.input_message(conf.PASSWORD)
        sleep(3)
        self.enter()
        sleep(2)
