import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src


class TestDdeCase(BaseCase):

    def test_dde_1271309_1(self):
        """在任务栏中打开启动器"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(1)
        # 等待 1 秒，判断launcher是否启动
        self.assert_image_exist_in_dde("test_dde_1271309.png")

    def test_dde_1271309_2(self):
        """在任务栏中打开启动器"""
        Src.press_key("win")
        sleep(10)
        # 等待 1 秒，判断launcher是否启动
        self.assert_image_exist_in_dde("test_dde_1271309.png")
        sleep(3)
        Src.press_key("win")
        sleep(1)
        self.assert_image_not_exist_in_dde("test_dde_1271309.png")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().click_restore()
        sleep(1)
        yield
        DdeMethod().click_restore()
        sleep(2)
