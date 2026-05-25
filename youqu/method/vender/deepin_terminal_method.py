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

    def click_option_dialog_center_by_image(self):
        """终端右上角，最小化"""
        self.dog.element_click("DSettingDialogContentWidget")

    def click_menu_btn_by_attr(self):
        """点击右上角菜单按钮"""
        self.dog.element_click("DTitlebarDWindowOptionButton")

    def click_menu_about_btn_by_attr(self):
        """点击关于按钮"""
        self.click_by_ocr("关于")