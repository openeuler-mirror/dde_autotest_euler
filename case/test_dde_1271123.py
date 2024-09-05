from youqu3.gui import pylinuxauto
from case.base_case import BaseCase
from method.dde_method import DdeMethod
from youqu3 import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271123(self):
        """检查系统是否默认安装Firefox浏览器，并且语言为中文"""
        DdeMethod().dde_dock_method_click_launcher_btn_by_attr()
        sleep(2)
        DdeMethod().dde_launcher_method_click_search_box_by_attr()
        pylinuxauto.input_message("firefox")
        sleep(2)
        self.assert_ocr_exist("Firefox")
        pylinuxauto.enter()
        sleep(6)
        DdeMethod().dde_browser_method_click_menu_icon_by_img()
        self.assert_ocr_exist("退出")

    def teardown_method(self):
        """关闭Firefox浏览器"""
        DdeMethod().dde_browser_method_click_close_btn_by_attr()
        sleep(2)
