import os
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src
from src import CmdCtl as Cmd
from src.shortcut import ShortCut
from apps.dde_autotest_euler.method.vender.dde_control_center_method import DdeControlCenterMethod


class TestSrfCase(BaseCase):
    @pytest.fixture(scope="function", autouse=True)
    def teardown_1271215(self):
        """恢复输入法"""
        yield
        Src.kill_process("deepin-editor")
        Src.kill_process("dde-file-manager")
        Src.kill_process("dde-desktop")
        Cmd.run_cmd("rm -rf ~/Documents/*")
        Cmd.run_cmd("rm -f ~/Desktop/test1.txt")
        sleep(5)

    def test_dde_1271215(self):
        """切换输入法并在文本中编辑中文"""
        Cmd.sudo_run_cmd("yum install ibus-libpinyin -y")
        euler = DdeMethod()
        euler.dde_dock.right_click_by_img("test_dde_1271217_1.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_11.png")
        sleep(5)
        euler.dde_dock.right_click_by_img("test_dde_1271217_12.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_2.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_3.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_4.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_5.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_6.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_7.png")
        sleep(1)
        euler.dde_dock.click_by_img("test_dde_1271217_8.png")
        sleep(1)
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(3)
        Cmd.run_cmd("touch ~/Documents/test1.txt")
        euler1 = DdeMethod()
        euler1.dde_file_manager.click_document_dir_in_left_view_by_attr()
        sleep(3)
        euler1.dde_file_manager.double_click_file_in_right_view_by_attr("test1.txt")
        sleep(3)

        euler1.dde_dock.click_by_img("test_dde_1271217_1.png")
        sleep(1)
        euler1.dde_dock.click_by_img("test_dde_1271217_9.png")

        ShortCut.input_message("kuaile")
        ShortCut.space()

        self.assert_image_exist_in_dde("test_dde_1271215_1.png")
