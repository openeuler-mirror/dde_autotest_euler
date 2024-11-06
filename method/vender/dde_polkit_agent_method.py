from apps.dde_autotest_euler.method.base_method import BaseMethod


class DdePolkitAgentMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-polkit-agent")

    def click_by_attr(self, path):
        """在终端界面内点击右上角的【设置】按钮"""
        self.dog.element_click(path)
