import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDdeFileManagerCase(BaseCase):

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271279(self):
        """前置和后置"""
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(3)
        yield
        Src.kill_process("deepin-editor")
        Src.kill_process("dde-file-manager")
        Src.kill_process("dde-desktop")
        Cmd.run_cmd("rm -rf ~/Documents/*")
        Cmd.run_cmd("rm -rf ~/Desktop/*")

    def test_dde_1271279_1(self):
        """文件管理器——保存文件"""
        # 1. 任意打开一个doc文档，点击另存为按钮，查看系统显示
        # 1. 系统会自动弹出保存 对话框
        # 备注：由于euler没有预装wps，在此使用txt文档代替，不影响测试点
        Cmd.run_cmd("echo hello > ~/Documents/test1.txt")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.double_click_file_in_right_view_by_attr("test1.txt")
        sleep(3)
        Src.ctrl_shift_s()
        self.assert_ocr_exist("保存")
        # 2. 查看对话框默认显示
        # 2. 文件类型下拉按钮做“蓝白”反色；
        euler.dde_file_manager.click_dialog_drop_menu_by_image()
        self.assert_image_exist_in_dde("test_dde_1271279_1.png")
        # 3. 在保存对话框中，点击新建文件夹按钮，查看系统提示
        # 3. 系统会自动新建一个文件夹
        Src.click(540, 300)
        Src.right_click()
        euler.dde_file_manager.click(*euler.ocr("新建文件夹"))
        Src.double_click(540, 300)
        self.assert_file_exist("~/Documents/新建文件夹")
        # 4. 在保存对话框中，选中一个文件夹，点击保存按钮，查看系统显示
        # 4. 该文件会自动保存到该文件夹下
        sleep(3)
        euler.dde_file_manager.double_click(*euler.ocr("新建文件夹"))
        sleep(3)
        euler.dde_file_manager.click(*euler.ocr("保存"))
        self.assert_file_exist("~/Documents/新建文件夹/test1.txt")

    def test_dde_1271279_2(self):
        """文件管理器——保存文件"""
        # 5. 在保存对话框中，直接点击保存按钮，查看系统显示
        # 5. 该文件会自动保存到默认打开的路径文件夹中
        Cmd.run_cmd("echo hello > ~/Documents/test1.txt")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.double_click_file_in_right_view_by_attr("test1.txt")
        sleep(3)
        Src.ctrl_shift_s()
        sleep(3)
        euler.dde_file_manager.click(*euler.ocr("保存"))
        euler.dde_file_manager.click_dialog_pop_replace_by_image()
        self.assert_file_exist("~/Documents/test1.txt")

    def test_dde_1271279_3(self):
        """文件管理器——保存文件"""
        # 6. 在保存对话框中，修改保存路径为：桌面，点击保存，查看系统显示
        # 6. 文件会自动保存在桌面
        Cmd.run_cmd("echo hello > ~/Documents/test1.txt")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.double_click_file_in_right_view_by_attr("test1.txt")
        sleep(3)
        Src.ctrl_shift_s()
        sleep(3)
        euler.dde_file_manager.click_desktop_dir_in_left_view_by_attr()
        euler.dde_file_manager.click(*euler.ocr("保存"))
        self.assert_file_exist("~/Desktop/test1.txt")