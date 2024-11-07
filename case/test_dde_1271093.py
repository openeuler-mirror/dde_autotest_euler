from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271093_1(self):
        """用文本编辑器打开txt文件"""
        euler = DdeMethod()
        euler.dde_dock.create_file_in_documents_by_cmd("test1.txt")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    def test_dde_1271093_2(self):
        """用文本编辑器打开xml文件"""
        euler = DdeMethod()
        euler.dde_dock.create_file_in_documents_by_cmd("test1.xml")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    def test_dde_1271093_3(self, clear_test_file_3):
        """用文本编辑器打开json文件"""
        euler = DdeMethod()
        euler.dde_dock.create_file_in_documents_by_cmd("test1.json")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    @pytest.fixture(autouse=True)
    def clear_test_file_1(self):
        """删除测试文件，关闭文本编辑器窗口"""
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().kill_process("deepin-editor")
        yield
        DdeMethod().dde_dock.delete_file_in_documents_by_cmd("test1.txt")
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().kill_process("deepin-editor")
