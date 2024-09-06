from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeFontManagerMethod(BaseMethod):
    def dde_font_manager_method_click_by_attr(self, path):
        """在字体管理器中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-font-manager/{path}").click()

    def dde_font_manager_method_click_search_box_attr(self):
        """在字体管理器中点击搜索框"""
        self.dde_font_manager_method_click_by_attr("DSearchEditIconButton")


if __name__ == "__main__":
    sleep(3)
    DdeFontManagerMethod().dde_font_manager_method_click_search_box_attr()
