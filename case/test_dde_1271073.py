from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271073_1(self):
        """文本编辑器-关闭标签，打开文件后用ctrl+w关闭当前标签"""
        euler = DdeMethod()
        euler.base_method_create_file_in_documents_by_cmd("test.txt")
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.dde_editor_method_click_menu_btn_by_attr()
        euler.deepin_editor.dde_editor_method_choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.dde_editor_method_click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        sleep(3)
        Src.ctrl_w()
        sleep(2)
        self.assert_element_not_exist("/deepin-editor/test.txt")

    def test_dde_1271073_2(self):
        """文本编辑器-关闭标签，打开文件进行修改后用ctrl+w关闭当前标签"""
        euler = DdeMethod()
        euler.deepin_editor.dde_editor_method_click_menu_btn_by_attr()
        euler.deepin_editor.dde_editor_method_choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.dde_editor_method_click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        sleep(3)
        Src.input_message("1")
        Src.ctrl_w()
        euler.deepin_editor.dde_editor_method_click_by_attr("/deepin-editor/保存")
        sleep(2)
        self.assert_element_not_exist("/deepin-editor/test.txt")

    def test_dde_1271073_3(self):
        """文本编辑器-关闭标签，打开文件进行修改后右键关闭当前标签"""
        euler = DdeMethod()
        euler.deepin_editor.dde_editor_method_click_menu_btn_by_attr()
        euler.deepin_editor.dde_editor_method_choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.dde_editor_method_click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        sleep(3)
        Src.input_message("2")
        euler.deepin_editor.dde_editor_method_close_tab_by_attr("*test.txt")
        euler.deepin_editor.dde_editor_method_click_by_attr("/deepin-editor/保存")
        sleep(2)
        self.assert_element_not_exist("/deepin-editor/test.txt")

    def test_dde_1271073_4(self, clear_file_in_documents):
        """文本编辑器-关闭标签，打开文件进行修改后点击标签右方关闭按钮关闭当前标签"""
        euler = DdeMethod()
        euler.deepin_editor.dde_editor_method_click_menu_btn_by_attr()
        euler.deepin_editor.dde_editor_method_choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.dde_editor_method_click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        sleep(3)
        Src.input_message("3")
        euler.deepin_editor.dde_editor_method_close_tab_by_img()
        euler.deepin_editor.dde_editor_method_click_by_attr("/deepin-editor/保存")
        sleep(2)
        self.assert_element_not_exist("/deepin-editor/test.txt")

    @pytest.fixture
    def clear_file_in_documents(self):
        """清除测试文件并且关闭文本编辑器"""
        yield
        sleep(1)
        DdeMethod().base_method_kill_process_by_cmd("deepin-editor")
        DdeMethod().base_method_delete_file_in_documents_by_cmd("test.txt")
