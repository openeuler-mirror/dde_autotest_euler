from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271073_1(self):
        """文本编辑器-关闭标签，打开文件后用ctrl+w关闭当前标签"""
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
        Src.ctrl_w()
        sleep(2)
        self.assert_element_not_exist("$/deepin-editor//test.txt")

    def test_dde_1271073_2(self):
        """文本编辑器-关闭标签，打开文件进行修改后用ctrl+w关闭当前标签"""
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
        Src.input_message("1")
        Src.ctrl_w()
        euler.deepin_editor.click_by_attr("保存")
        sleep(2)
        self.assert_element_not_exist("$/deepin-editor//test.txt")

    def test_dde_1271073_3(self):
        """文本编辑器-关闭标签，打开文件进行修改后右键关闭当前标签"""
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
        Src.input_message("2")
        euler.deepin_editor.close_tab_by_attr("*test.txt")
        euler.deepin_editor.click_by_attr("保存")
        sleep(2)
        self.assert_element_not_exist("$/deepin-editor//test.txt")

    def test_dde_1271073_4(self):
        """文本编辑器-关闭标签，打开文件进行修改后点击标签右方关闭按钮关闭当前标签"""
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
        Src.input_message("3")
        euler.deepin_editor.close_tab_by_img()
        euler.deepin_editor.click_by_attr("保存")
        sleep(2)
        self.assert_element_not_exist("$/deepin-editor//test.txt")

    @pytest.fixture(autouse=True)
    def clear_file_in_documents(self):
        """清除测试文件并且关闭文本编辑器"""
        yield
        sleep(1)
        DdeMethod().kill_process("deepin-editor")
        DdeMethod().dde_dock.delete_file_in_documents_by_cmd("test.txt")
