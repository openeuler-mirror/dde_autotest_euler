from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1915293(self):
        """控制中心-个性化-光标的主题展示"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_ocr("个性化")
        self.assert_ocr_exist("光标主题")
        euler.dde_dock.click_by_ocr("光标主题")
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1915293_1.png")
        self.assert_image_exist_in_dde("test_dde_1915293_2.png")
        self.assert_image_exist_in_dde("test_dde_1915293_3.png")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
