from time import sleep
import pylinuxauto
import pytest
from nocmd import Cmd

from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271057(self, clear_file_in_home_and_kill_process):
        """画板-ddf格式文件打开"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("huaban")
        sleep(5)
        euler.deepin_draw_method_click_rectangle_tool_btn_by_attr()
        pylinuxauto.mouse_down(500, 500)
        pylinuxauto.drag_to(600, 600, 1, 1)
        sleep(1)
        pylinuxauto.ctrl_s()
        sleep(1)
        euler.dde_methode_click_save_btn_in_pop_window()
        sleep(1)
        DdeMethod().base_method_kill_process_by_cmd("deepin-draw")
        sleep(2)
        euler.dde_method_open_software_by_launcher("wenjianguanliqi")
        euler.base_method_click_by_ocr("主目录")
        euler.base_method_double_click_by_ocr("未命名")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    @pytest.fixture
    def clear_file_in_home_and_kill_process(self):
        """清除测试文件，关闭进程"""
        yield
        DdeMethod().base_method_kill_process_by_cmd("deepin-draw")
        DdeMethod().base_method_kill_process_by_cmd("dde-file-manager")
        Cmd.run("rm ~/未命名.ddf")
