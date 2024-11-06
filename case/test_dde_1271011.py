from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1271011(self):
        """控制中心中更改屏幕分辨率后默认选中当前分辨率推荐的刷新率"""
        DdeMethod().dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        DdeMethod().change_resolution_by_control_center()
        # self.assert_element_exist("/dde-control-center/59.81赫兹")
        self.assert_image_exist_in_dde("test_dde_1271011.png")

    def teardown_method(self):
        """将分辨率重置，关闭控制中心窗口"""
        DdeMethod().reset_resolution_by_control_center()
        DdeMethod().dde_control_center.kill_dde_control_center()
