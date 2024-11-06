from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271123(self):
        """检查系统是否默认安装Firefox浏览器，并且语言为中文"""
        DdeMethod().dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        DdeMethod().dde_launcher.click_search_box_by_attr()
        Src.input_message("firefox")
        sleep(2)
        Src.enter()
        sleep(6)
        DdeMethod().browser.click_menu_icon_by_img()
        self.assert_ocr_exist("退出")

    def teardown_method(self):
        """关闭Firefox浏览器"""
        DdeMethod().browser.click_close_btn_by_attr()
        sleep(2)
