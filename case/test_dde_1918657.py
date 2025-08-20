from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1918657(self):
        """控制中心 快捷键关闭"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        self.assert_ocr_exist("键盘和语言")
        Src.hot_key("alt", "f4")
        sleep(1)
        self.assert_ocr_not_exist("键盘和语言", max_match_number=1)


    def teardown_method(self):
        """关闭控制中心"""
        ...
