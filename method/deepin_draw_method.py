from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DeepinDrawMethod(BaseMethod):
    def deepin_draw_method_click_by_attr(self, path):
        """在画板中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-draw/{path}").click()

    def deepin_draw_method_click_option_btn_by_attr(self):
        """在画板中通过元素点击右上角菜单按钮"""
        self.deepin_draw_method_click_by_attr("DTitlebarDWindowOptionButton")

    def deepin_draw_method_quit_by_menu(self):
        """通过菜单选项退出画板应用"""
        self.deepin_draw_method_click_option_btn_by_attr()
        sleep(1)
        pylinuxauto.reverse_select_menu(1)
        sleep(2)

    def deepin_draw_method_click_rectangle_tool_btn_by_attr(self):
        """通过元素在画板中点击矩形工具按钮"""
        self.deepin_draw_method_click_by_attr("Rectangle tool button")
