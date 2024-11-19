import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDdeFileManagerCase(BaseCase):

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271277(self):
        """前置和后置"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("kantu")
        sleep(3)
        euler.dde_launcher.click_by_attr("看图")
        euler.click(*euler.ocr("打开图片"))
        sleep(3)
        euler.dde_desktop.click_picture_dir_in_left_dialog_by_attr()
        sleep(3)

        yield
        Src.kill_process("deepin-image-viewer")
        Src.kill_process("dde-desktop")
        Cmd.run_cmd("rm -rf ~/Pictures/test.txt")
        Cmd.run_cmd("rm -rf ~/Pictures/uos.PNG")
        Cmd.run_cmd("rm -rf ~/Pictures/test1")
        Cmd.run_cmd("rm -rf ~/Videos")
        sleep(5)

    def test_dde_1271277_1(self):
        """文件管理器——打开文件"""
        # 1. 打开看图应用，点击打开图片，系统会自动弹出一个文件选择对话框，查看对话框显示
        # 1. 对话框会以文件管理器的形式打开，可以选择相关文件
        Cmd.run_cmd("echo hello > ~/Pictures/test.txt")
        DdeMethod().dde_file_manager.cp_static_res("uos.PNG", "~/Pictures/")
        euler = DdeMethod()
        self.assert_ocr_exist("所有图片")
        # 2. 假如只能打开图片文件，查看打开对话框中的文件显示
        # 2. 图片文件可以被选中，其他文件为置灰状态，不能被选中
        euler.dde_desktop.click_icon_view_in_dialog_by_attr()  # 图标视图
        euler.dde_desktop.click_file_in_dialog_by_attr("uos.PNG")
        self.assert_image_exist_in_dde("test_dde_1271277_1.png")
        sleep(3)
        euler.dde_desktop.click_file_in_dialog_by_attr("test.txt")
        self.assert_image_exist_in_dde("test_dde_1271277_1.png")
        # 3. 在文件选择对话框中，选中图片文件，点击打开按钮，查看系统显示
        # 3. 可以正常的打开选中的图片文件
        sleep(1)
        euler.click(*euler.ocr("打开"))
        self.assert_image_exist_in_dde("test_dde_1271277_3.png")

    def test_dde_1271277_2(self):
        """文件管理器——打开文件"""
        # 4. 在文件选中对话框中，用鼠标拖动右上角的图标大小调节按钮，查看对话框中的文件显示
        # 4. 对话框中的文件会随着大小调节按钮变化而变化
        Cmd.run_cmd("echo hello > ~/Pictures/test.txt")
        DdeMethod().dde_file_manager.cp_static_res("uos.PNG", "~/Pictures/")
        euler = DdeMethod()
        euler.dde_desktop.click_icon_view_in_dialog_by_attr()  # 图标视图
        euler.dde_desktop.click_file_in_dialog_by_attr("uos.PNG")
        sleep(3)
        x, y = euler.dde_desktop.get_x_y_by_img("desktop_size_set_button.png")
        Src.click(x + 45, y)
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271277_4.png")

    @pytest.mark.parametrize("operate", ["cancle", "esc"])
    def test_dde_1271277_3(self, operate):
        """文件管理器——打开文件"""
        # 5. 在文件选中对话框中，点击取消按钮，查看对话框显示
        # 5. 对话框会自动退出，不进行任何操作
        # 6. 在文件选中对话框中，直接按ESC键，查看对话框显示
        # 6. 对话框会自动退出
        euler = DdeMethod()
        if operate == "cancle":
            euler.click(*euler.ocr("取消"))
        elif operate == "esc":
            Src.esc()
        self.assert_ocr_not_exist("所有图片")

    def test_dde_1271277_4(self):
        """文件管理器——打开文件"""
        # 7. 在文件选择对话框中，选择一个路径较深的文件，查看能否正常打开
        # 7. 可以正常打开
        Cmd.run_cmd("mkdir -p ~/Pictures/test1/test2/test3/test4/test5")
        DdeMethod().dde_file_manager.cp_static_res("uos.PNG",
                                                   "~/Pictures/test1/test2/test3/test4/test5")

        euler = DdeMethod()
        euler.dde_desktop.click_search_btn_in_dialog_by_attr()
        Src.input("/home/uos/Pictures/test1/test2/test3/test4/test5")
        Src.enter()
        sleep(3)
        euler.dde_desktop.click_file_in_dialog_by_attr("uos.PNG")
        sleep(1)
        euler.click(*euler.ocr("打开"))
        self.assert_image_exist_in_dde("test_dde_1271277_3.png")

    def test_dde_1271277_5(self):
        """文件管理器——打开文件"""
        # 8. 在文件选择对话框中，选中多个文件，点击打开按钮，查看软件显示
        # 8. 可以同时打开多个文件
        DdeMethod().dde_file_manager.cp_static_res("uos.PNG", "~/Videos")
        DdeMethod().dde_file_manager.cp_static_res("panghu.PNG", "~/Videos")
        euler = DdeMethod()
        euler.dde_desktop.click_video_dir_in_left_dialog_by_attr()
        sleep(3)
        euler.dde_desktop.click_center_in_dialog_by_attr()
        Src.ctrl_a()
        sleep(1)
        euler.click(*euler.ocr("打开"))
        self.assert_image_exist_in_dde("test_dde_1271277_5.png")
