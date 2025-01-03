from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271075_1(self):
        """文本编辑器——另存为 非重复文件名"""
        euler = DdeMethod()
        euler.dde_dock.create_file_in_documents_by_cmd("test.txt")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        sleep(3)
        euler.deepin_editor.click_menu_btn_by_attr()
        sleep(1)
        euler.deepin_editor.choose_save_as_option_by_ocr()
        sleep(3)
        euler.rename_file_in_pop_window_by_attr("new.txt")
        self.assert_file_exist("~/Documents/new.txt")

    def test_dde_1271075_2(self):
        """文本编辑器——另存为 重复文件名"""
        euler = DdeMethod()
        sleep(3)
        euler.deepin_editor.click_menu_btn_by_attr()
        sleep(1)
        euler.deepin_editor.choose_save_as_option_by_ocr()
        sleep(3)
        euler.rename_file_same_name_in_pop_window_by_attr("new.txt")
        self.assert_image_exist_in_dde("test_dde_1271075.png")

    @pytest.fixture(autouse=True)
    def clear_file_in_documents(self):
        """清除测试文件并且关闭文本编辑器"""
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().kill_process("deepin-editor")
        yield
        sleep(1)
        
        sleep(1)
        
        sleep(1)
        DdeMethod().kill_process("deepin-editor")
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().dde_dock.delete_file_in_documents_by_cmd("new.txt")
        DdeMethod().dde_dock.delete_file_in_documents_by_cmd("test.txt")
