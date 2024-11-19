from apps.dde_autotest_euler.method.base_method import BaseMethod


class DeepinTerminalMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-terminal")

    def click_option_by_attr(self):
        """在终端界面内点击右上角的【设置】按钮"""
        self.dog.element_click("DTitlebarDWindowOptionButton")

    def click_window_x_by_image(self):
        """终端右上角，X"""
        self.click_by_img("close_window_btn_1.png")

    def click_window_min_by_image(self):
        """终端右上角，最小化"""
        self.click_by_img("min_window_btn.png")