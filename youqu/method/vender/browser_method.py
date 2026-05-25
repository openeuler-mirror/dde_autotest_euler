
from apps.dde_autotest_euler.method.base_method import BaseMethod


class BrowserMethod(BaseMethod):

    def __init__(self):
        super().__init__(name="Firefox")


    def click_by_attr(self, path):
        """在浏览器中通过属性进行点击"""
        self.dog.element_click(path)

    def click_menu_icon_by_img(self):
        """在浏览器中点击右上角的菜单按钮"""
        self.click_by_img("firefox_menu_icon.png")

    def click_close_btn_by_attr(self):
        """在浏览器中点击右上角的关闭按钮"""
        self.click_by_img("firefox_close_btn.png")

    def right_click_by_ocr(self, text):
        """在浏览器中通过属性右键点击对应的标签页"""
        self.click_by_ocr(text)
