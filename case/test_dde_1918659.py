from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1918659(self):
        """控制中心中-显示-刷新率的选项"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_ocr("显示")
        euler.dde_dock.click_by_img("refresh_rate_options.png")
        sleep(3)
        self.assert_ocr_exist("60赫兹")
        self.assert_image_exist_in_dde("test_dde_1918659_1.png")
        # self.assert_image_exist_in_dde("test_dde_1271011.png")

    def teardown_method(self):
        """关闭控制中心窗口"""
        DdeMethod().dde_control_center.kill_dde_control_center()
