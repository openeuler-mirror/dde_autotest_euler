from apps.dde_autotest_euler.method.base_method import BaseMethod


class DeepinTerminalMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-terminal")

    def right_click_by_xy(self):
        """通过右键点击【在终端中打开】"""
        self.right_click(960, 540)
        self.base_method_click_by_ocr("在终端中打开")

    def click_option_by_attr(self):
        """在终端界面内点击右上角的【设置】按钮"""
        self.dog.element_click("DTitlebarDWindowOptionButton")
