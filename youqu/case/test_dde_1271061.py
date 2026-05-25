from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271061(self, clear_file_in_home_and_kill_process):
        """画板——退出应用"""
        euler = DdeMethod()
        euler.open_software_by_launcher("huaban")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")
        Src.alt_f4()
        self.assert_process_status(False, "deepin-draw")
        sleep(2)
        # 打开后修改关闭
        euler.open_software_by_launcher("huaban")
        sleep(5)
        euler.deepin_draw.click_rectangle_tool_btn_by_attr()
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        Src.alt_f4()
        sleep(1)
        self.assert_ocr_exist("保存")
        self.assert_process_status(True, "deepin-draw")

    @pytest.fixture
    def clear_file_in_home_and_kill_process(self):
        """清除测试文件，关闭进程"""
        yield
        DdeMethod().kill_process("deepin-draw")
