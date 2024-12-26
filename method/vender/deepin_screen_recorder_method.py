from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinScreenRecorderMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-screen-recorder")

    def method_click_by_attr(self, path):
        """ "在截图录屏中根据元素点击"""
        self.dog.element_click(path)

    def method_click_option_by_ocr(self, menu_name):
        """通过ocr点击选项"""
        self.click_by_ocr("选项")
        sleep(1)
        self.click_by_ocr(menu_name)

    def method_click_screen_btn_by_image(self):
        """通过图片点击截图按钮"""
        self.click_by_img("deepin_screen_recoder_screen.png")

    def method_click_close_btn_by_image(self):
        """通过图片点击X按钮"""
        self.click_by_img("deepin_screen_recoder_close.png")

    def method_click_text_btn_by_image(self):
        """通过图片点击T按钮"""
        self.click_by_img("deepin_screen_recoder_text.png")
