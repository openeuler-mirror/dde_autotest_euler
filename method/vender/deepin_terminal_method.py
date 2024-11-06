from apps.dde_autotest_euler.method.base_method import BaseMethod


class DeepinTerminalMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-terminal")

    def click_option_by_attr(self):
        """在终端界面内点击右上角的【设置】按钮"""
        self.dog.element_click("DTitlebarDWindowOptionButton")
