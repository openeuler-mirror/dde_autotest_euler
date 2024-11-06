from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271135(self):
        """在浏览器中新打开网页，并且进入百度界面"""
        DdeMethod().open_software_by_launcher("Firefox")
        sleep(10)
        DdeMethod().browser.right_click_by_ocr("开源社区")
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271135_1.png")
        DdeMethod().browser.click_by_attr("新建标签页")
        DdeMethod().browser.click_by_attr("使用 百度 搜索，或者输入网址")
        Src.input_message("www.baidu.com")
        sleep(3)
        Src.enter()
        self.assert_image_exist_in_dde("test_dde_1271135_2.png")

    def teardown_method(self):
        """关闭浏览器"""
        DdeMethod().browser.click_close_btn_by_attr()
