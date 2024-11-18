import pytest
from src import sleep
from src import Src
from src import CmdCtl as Cmd
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeFileManagerCase(BaseCase):

    @pytest.fixture(scope="function", autouse=False)
    def setup_teardown_1271281(self):
        """前置和后置"""
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(3)
        yield
        Cmd.run_cmd("rm -rf ~/Documents/*")
        Cmd.run_cmd("rm -rf /home/uos/.local/share/Trash/files/*")
        Src.kill_process("dde-file-manager")

    @pytest.fixture(scope="function", autouse=False)
    def setup_teardown_1271281_5(self):
        """前置和后置"""
        yield
        Cmd.run_cmd(
            'dbus-send --print-reply --session --dest=com.deepin.dde.Dock /com/deepin/dde/Dock com.deepin.dde.Dock.setPluginVisible string:"回收站" boolean:false')

    def test_dde_1271281_1(self, setup_teardown_1271281):
        """文件管理器——清空回收站"""
        # 1. 在回收站内没有任何文件时，查看页面显示
        # 1. 没有清空回收站按钮显示
        euler = DdeMethod()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        self.assert_image_not_exist_in_dde("test_dde_1271281_1")

    def test_dde_1271281_2(self, setup_teardown_1271281):
        """文件管理器——清空回收站"""
        # 2. 在回收站内有文件时，查看页面显示
        # 2. 回收站上方会显示清空回收站按钮
        Cmd.run_cmd("touch ~/Documents/test1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.delete()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271281_1")
        # 3. 回收站上方出现按钮后，将鼠标悬停在该按钮上查看系统显示
        # 3. 系统会有tooltip提示显示
        x, y = euler.dog.element_center("EmptyTrashButton")
        sleep(3)
        euler.dog.move_to(x, y, duration=1)
        self.assert_ocr_exist("清空回收站")
        # 4. 回收站上方出现按钮后，点击清空回收站按钮，查看系统显示
        # 4. 系统会自动弹出提示对话框：您确定要清空此回收站吗
        euler.dog.click()
        self.assert_ocr_exist("您确定要清空回收站")
        # 5. 在系统弹出提示对话框后，点击确定按钮，查看系统显示
        # 5. 系统会自动清空当前回收站中所有文件，清空回收站后上方的按钮会自动隐藏
        euler.dde_file_manager.click_empty_confirm_btn_by_image()
        sleep(1)
        self.assert_file_not_exist("/home/uos/.local/share/Trash/files/test1")
        self.assert_image_not_exist_in_dde("test_dde_1271281_1")

    @pytest.mark.parametrize("operate", ["cancle", "x", "esc"])
    def test_dde_1271281_3(self, setup_teardown_1271281, operate):
        """文件管理器——清空回收站"""
        # 6. 在系统弹出提示对话框后，点击取消按钮，查看系统显示
        # 6. 系统提示对话框取消，回收站中无任何操作
        # 7. 在系统弹出提示对话框后，点击对话框右上角的×按钮，查看系统显示
        # 7. 系统提示对话框消失，回收站无任何操作
        # 8. 在系统弹出提示对话框后，按ESC键，查看系统显示
        # 8. 系统提示对话框消失，回收站无任何操作
        Cmd.run_cmd("touch ~/Documents/test1")
        euler = DdeMethod()
        euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
        Src.delete()
        euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
        sleep(3)
        euler.dde_file_manager.click_empty_btn_in_right_view_by_attr()
        sleep(3)
        if operate == 'cancle':
            euler.dde_file_manager.click_empty_cancle_btn_by_image()
        elif operate == 'x':
            euler.dde_file_manager.click_empty_x_btn_by_image()
        elif operate == 'esc':
            Src.esc()
        sleep(1)
        self.assert_file_exist("/home/uos/.local/share/Trash/files/test1")
        self.assert_image_exist_in_dde("test_dde_1271281_1")

    def test_dde_1271281_4(self, setup_teardown_1271281):
        """文件管理器——清空回收站"""
        # 9. 在桌面选中回收站，右键－清空回收站，查看回收站显示
        # 9. 回收站被清空
        Cmd.run_cmd("touch /home/uos/.local/share/Trash/files/test1")
        euler = DdeMethod()
        Src.alt_f4()
        sleep(3)
        euler.dde_file_manager.right_click_trash_in_desktop_by_image()
        sleep(2)
        Src.down()
        Src.down()
        Src.enter()
        sleep(1)
        euler.dde_file_manager.click_empty_confirm_btn_by_image()
        sleep(1)
        self.assert_file_not_exist("/home/uos/.local/share/Trash/files/test1")

    def test_dde_1271281_5(self, setup_teardown_1271281_5):
        """文件管理器——清空回收站"""
        # 10. 在任务栏上选中回收站，右键－清空回收站，查看回收站显示
        # 10. 回收站被清空
        Cmd.run_cmd("touch /home/uos/.local/share/Trash/files/test1")
        # dock栏显示回收站
        Cmd.run_cmd(
            'dbus-send --print-reply --session --dest=com.deepin.dde.Dock /com/deepin/dde/Dock com.deepin.dde.Dock.setPluginVisible string:"回收站" boolean:true')
        sleep(3)
        euler = DdeMethod()
        euler.dde_dock.right_click_trash_icon_by_attr()
        Src.down()
        Src.down()
        Src.enter()
        sleep(1)
        euler.dde_dock.click_by_ocr("删除")
        sleep(1)
        self.assert_file_not_exist("/home/uos/.local/share/Trash/files/test1")