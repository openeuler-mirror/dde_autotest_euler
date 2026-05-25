import pytest
from src import sleep
from src import Src
from src import CmdCtl as Cmd
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeFileManagerCase(BaseCase):

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271283(self):
        """前置和后置"""
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(3)
        yield
        Cmd.run_cmd("rm -rf ~/Documents/*")
        Cmd.run_cmd("rm -rf /home/uos/.local/share/Trash/files/*")
        Src.kill_process("dde-file-manager")

    def test_dde_1271283_1(self):
        """文件管理器——还原文件"""
        # 1. 在回收站中选中一个文件，点击右键-还原，查看软件提示
        # 1. 软件没有任何提示，直接还原当前文件
        Cmd.run_cmd("touch ~/Documents/test1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.delete()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.right_click_file_in_right_view_by_attr("test1")
        euler.dde_file_manager.click(*euler.ocr("还原"))
        self.assert_file_exist("~/Documents/test1")

    def test_dde_1271283_2(self):
        """文件管理器——还原文件"""
        # 2. 假如：在还原的过程中会遇到重名冲突，查看软件显示
        # 2. 软件会弹出冲突提示对话框
        Cmd.run_cmd("touch ~/Documents/test1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.delete()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        # 原位置新建重名文件
        Cmd.run_cmd("touch ~/Documents/test1")
        euler.dde_file_manager.right_click_file_in_right_view_by_attr("test1")
        euler.dde_file_manager.click(*euler.ocr("还原"))
        self.assert_ocr_exist("目标文件夹中已存在")

    def test_dde_1271283_3(self):
        """文件管理器——还原文件"""
        # 3. 在回收站中选中多个文件和文件夹，点击右键还原
        # 3. 软件会直接还原文件和文件夹
        Cmd.run_cmd("touch ~/Documents/test1")
        Cmd.run_cmd("mkdir ~/Documents/test_dir1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.ctrl_a()
        Src.delete()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.ctrl_a()
        Src.right_click()
        euler.dde_file_manager.click(*euler.ocr("还原"))
        self.assert_file_exist("~/Documents/test1")
        self.assert_file_exist("~/Documents/test_dir1")

    def test_dde_1271283_4(self):
        """文件管理器——还原文件"""
        # 4. 从文件夹中删除文件，然后修改文件夹权限为只读权限，从回收站中还原，查看软件显示
        # 4. 弹出提示 操作失败！1个文件还原失败，目标文件夹不可写
        Cmd.run_cmd("mkdir ~/Documents/test_dir1")
        Cmd.run_cmd("touch ~/Documents/test_dir1/test1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.double_click_file_in_right_view_by_attr("test_dir1")
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.delete()
        sleep(3)
        Cmd.run_cmd("chmod 555 ~/Documents/test_dir1")
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.right_click_file_in_right_view_by_attr("test1")
        euler.dde_file_manager.click(*euler.ocr("还原"))
        self.assert_ocr_exist("目标文件夹不可写")
