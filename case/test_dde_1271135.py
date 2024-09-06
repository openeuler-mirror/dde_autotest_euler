from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep
import pylinuxauto


class TestDdeCase(BaseCase):
    def test_dde_1271135(self):
        """在浏览器中新打开网页，并且进入百度界面"""
        DdeMethod().dde_method_open_software_by_launcher("Firefox")
        sleep(6)
        DdeMethod().dde_browser_method_right_click_by_ocr("开源社区")
        self.assert_image_exist_in_dde("test_dde_1271135_1.png")
        DdeMethod().dde_browser_method_click_by_attr("新建标签页")
        DdeMethod().dde_browser_method_click_by_attr("使用 百度 搜索，或者输入网址")
        pylinuxauto.input_message("www.baidu.com")
        sleep(3)
        pylinuxauto.enter()
        self.assert_image_exist_in_dde("test_dde_1271135_2.png")

    def teardown_method(self):
        """关闭浏览器"""
        DdeMethod().dde_browser_method_click_close_btn_by_attr()
