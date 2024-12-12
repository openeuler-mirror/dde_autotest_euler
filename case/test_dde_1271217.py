import os
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from apps.dde_autotest_euler.method.vender.dde_control_center_method import DdeControlCenterMethod
from src import CmdCtl as Cmd


class TestSrfCase(BaseCase):
    @pytest.fixture(scope="function", autouse=True)
    def teardown_1271217(self):
        """恢复输入法"""
        yield
        euler.dde_dock.click_by_img("test_dde_1271217_10.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_13.png")
        sleep(1)

    def test_dde_1271217(self):
        """输入法添加中文"""
        Cmd.sudo_run_cmd("yum install ibus-libpinyin -y")
        euler = DdeMethod()
        euler.dde_dock.right_click_by_img("test_dde_1271217_1.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_11.png")
        sleep(5)
        euler.dde_dock.right_click_by_img("test_dde_1271217_12.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_2.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_3.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_4.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_5.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_6.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_7.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_8.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_12.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_9.png")
        self.assert_image_exist_in_dde("test_dde_1271217_10.png")
