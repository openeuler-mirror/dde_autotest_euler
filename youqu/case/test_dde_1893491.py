from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1893491(self):
        """控制中心-个性化-通用-主题展示"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_dock.click_by_ocr("个性化")
        self.assert_ocr_exist("通用")
        euler.dde_dock.click_by_ocr("通用")
        sleep(6)
        self.assert_image_exist_in_dde("test_dde_1893491_1.png")
        self.assert_image_exist_in_dde("test_dde_1893491_2.png")
        self.assert_image_exist_in_dde("test_dde_1893491_3.png")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
