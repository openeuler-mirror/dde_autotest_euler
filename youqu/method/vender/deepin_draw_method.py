from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinDrawMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-draw")

    def click_by_attr(self, path):
        """在画板中通过元素点击"""
        self.dog.element_click(path)

    def click_option_btn_by_attr(self):
        """在画板中通过元素点击右上角菜单按钮"""
        self.click_by_attr("DTitlebarDWindowOptionButton")

    def quit_by_menu(self):
        """通过菜单选项退出画板应用"""
        self.click_option_btn_by_attr()
        sleep(1)
        self.reverse_select_menu(1)
        sleep(2)

    def click_rectangle_tool_btn_by_attr(self):
        """通过元素在画板中点击矩形工具按钮"""
        self.click_by_attr("Rectangle tool button")
