from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271093_1(self, clear_test_file_1):
        """用文本编辑器打开txt文件"""
        euler = DdeMethod()
        euler.create_file_in_documents_by_cmd("test1.txt")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    def test_dde_1271093_2(self, clear_test_file_2):
        """用文本编辑器打开xml文件"""
        euler = DdeMethod()
        euler.create_file_in_documents_by_cmd("test1.xml")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    def test_dde_1271093_3(self, clear_test_file_3):
        """用文本编辑器打开json文件"""
        euler = DdeMethod()
        euler.create_file_in_documents_by_cmd("test1.json")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        self.assert_ocr_exist("This is test message")

    @pytest.fixture()
    def clear_test_file_1(self):
        """删除测试文件，关闭文本编辑器窗口"""
        yield
        DdeMethod().delete_file_in_documents_by_cmd("test1.txt")
        DdeMethod().close_window()
        sleep(3)

    @pytest.fixture()
    def clear_test_file_2(self):
        """删除测试文件，关闭文本编辑器窗口"""
        yield
        DdeMethod().delete_file_in_documents_by_cmd("test1.xml")
        DdeMethod().close_window()
        sleep(3)

    @pytest.fixture()
    def clear_test_file_3(self):
        """删除测试文件，关闭文本编辑器窗口"""
        yield
        DdeMethod().delete_file_in_documents_by_cmd("test1.json")
        DdeMethod().close_window()
