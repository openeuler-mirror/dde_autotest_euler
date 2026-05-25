from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271059(self, clear_file_in_home_and_kill_process):
        """画板-文件保存"""
        default_name = 'aaaa'
        Cmd.run_cmd(f"rm ~/{default_name}.ddf")
        euler = DdeMethod()
        euler.open_software_by_launcher("huaban")
        sleep(5)
        euler.deepin_draw.click_rectangle_tool_btn_by_attr()
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        sleep(1)
        Src.ctrl_s()
        sleep(1)
        euler.input_message('aaaa')
        euler.click_save_btn_in_pop_window()
        sleep(1)
        self.assert_file_exist('~', f'{default_name}.ddf')
        DdeMethod().kill_process("deepin-draw")
        sleep(2)
        euler.open_software_by_launcher("wenjianguanliqi")
        sleep(5)
        euler.dde_dock.click_by_ocr("主目录")
        sleep(5)
        euler.dde_dock.double_click_by_ocr(default_name)
        sleep(5)
        self.assert_process_status(True, "deepin-draw")
        euler.deepin_draw.click_rectangle_tool_btn_by_attr()
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        sleep(1)
        Src.ctrl_s()
        sleep(1)
        euler.alt_f4()
        sleep(1)
        self.assert_file_exist('~', f'{default_name}.ddf')


    @pytest.fixture
    def clear_file_in_home_and_kill_process(self):
        """清除测试文件，关闭进程"""
        yield
        DdeMethod().kill_process("deepin-draw")
        DdeMethod().kill_process("dde-file-manager")
        Cmd.run_cmd(f"rm ~/*.ddf")
