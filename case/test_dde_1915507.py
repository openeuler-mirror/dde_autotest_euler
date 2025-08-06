from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1915507(self):
        """控制中心-个性化-光标的主题切换"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_ocr("个性化")
        sleep(1)
        euler.dde_dock.click_by_ocr("光标主题")
        sleep(3)
        euler.dde_dock.click_by_img("test_dde_1915293_1.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1915293_3.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1915293_2.png")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
