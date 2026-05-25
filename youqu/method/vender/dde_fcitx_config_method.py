from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinFcitxConfigMethod(BaseMethod):

    def __init__(self):
        super().__init__("fcitx-config-gtk3")


    def close_by_x(self):
        self.click_by_img("close_shurufa_btn.png")

    def close_by_menu(self):
        self.right_click_by_ocr("输入法配置")
        self.click_by_ocr("关闭")