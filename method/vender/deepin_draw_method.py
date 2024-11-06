from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinDrawMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-draw")
    def deepin_draw_method_click_by_attr(self, path):
        """在画板中通过元素点击"""
        self.dog.element_click(path)

    def deepin_draw_method_click_option_btn_by_attr(self):
        """在画板中通过元素点击右上角菜单按钮"""
        self.deepin_draw_method_click_by_attr("DTitlebarDWindowOptionButton")

    def deepin_draw_method_quit_by_menu(self):
        """通过菜单选项退出画板应用"""
        self.deepin_draw_method_click_option_btn_by_attr()
        sleep(1)
        self.reverse_select_menu(1)
        sleep(2)

    def deepin_draw_method_click_rectangle_tool_btn_by_attr(self):
        """通过元素在画板中点击矩形工具按钮"""
        self.deepin_draw_method_click_by_attr("Rectangle tool button")
