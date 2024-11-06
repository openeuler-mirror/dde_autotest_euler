from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271309_1(self):
        """在任务栏中打开启动器"""
        euler = DdeMethod()
        euler.dde_dock.dde_dock_method_click_launcher_btn_by_attr()
        sleep(1)
        # 等待 1 秒，判断launcher是否启动
        self.assert_image_exist_in_dde("test_dde_1271309.png")
        DdeMethod().base_method_kill_process_by_cmd("dde-launcher")
        sleep(3)
        self.assert_image_not_exist_in_dde("test_dde_1271309.png")
        sleep(3)

    def test_dde_1271309_2(self):
        """在任务栏中打开启动器"""
        Src.win_left()
        sleep(1)
        # 等待 1 秒，判断launcher是否启动
        self.assert_image_exist_in_dde("test_dde_1271309.png")

        sleep(3)
        Src.win_left()
        sleep(1)
        self.assert_image_not_exist_in_dde("test_dde_1271309.png")
