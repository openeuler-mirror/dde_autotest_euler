from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):
    def test_dde_1270989(self):
        """控制中心中手动修改时间"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.change_time_by_control_center()
        sleep(2)
        self.assert_image_exist_in_dde("test_dde_1270989_1.png")
        sleep(2)
        self.assert_image_exist_in_dde("test_dde_1270989_2.png")

    def teardown_method(self):
        """重新开启时间同步，重置时间"""
        DdeMethod().dde_control_center.click_time_setting_by_attr()
        sleep(1)
        DdeMethod().dde_control_center.click_time_synchronization_btn_by_attr()
        sleep(2)
        DdeMethod().dde_control_center.kill_dde_control_center()
