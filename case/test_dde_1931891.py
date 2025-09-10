from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1931891(self):
        """控制中心中-显示-刷新率"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_ocr("显示")
        euler.dde_dock.click_by_img("refresh_rate_options.png")
        sleep(3)
        euler.dde_dock.click_by_img("refresh_rate_switch.png")
        # Src.hot_key("ctrl", "down")
        # Src.hot_key("enter")
        sleep(1)
        # self.assert_ocr_exist("是否要保存显示设置")
        euler.dde_dock.click_by_img("refresh_rate_restore.png")
        sleep(2)
        self.assert_ocr_exist("60赫兹")


    def teardown_method(self):
        """关闭控制中心窗口"""
        DdeMethod().dde_control_center.kill_dde_control_center()
