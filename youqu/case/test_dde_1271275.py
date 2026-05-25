import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDdeFileManagerCase(BaseCase):

    @pytest.fixture(scope="class", autouse=True)
    def setup_teardown(self):
        """类前置和后置"""
        Cmd.run_cmd("rm -f ~/.config/deepin/deepin-image-viewer/config.conf")
        sleep(5)

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271275(self):
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
        Cmd.run_cmd("rm -rf ~/Videos")
        sleep(5)

    def test_dde_1271275_1(self):
        """文件管理器——打开文件目录"""
        # 1. 打开看图，选择打开图片，检查弹出的对话框显示
        # 1. 对话框显示为文件管理器，检查窗口标题显示正常;
        self.assert_image_exist_in_dde("test_dde_1271275_1.png")
        # 2. 点击视图方式为图标视图
        # 2. 窗口显示为图标视图，且可以调节窗口图标大小
        euler = DdeMethod()
        euler.dde_desktop.click_icon_view_in_dialog_by_attr()  # 图标视图
        sleep(3)
        x, y = euler.dde_desktop.get_x_y_by_img("desktop_size_set_button.png")
        Src.click(x + 45, y)
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271275_2.png")

    def test_dde_1271275_2(self):
        """文件管理器——打开文件目录"""
        # 3. 检查窗口侧标签显示
        # 3. 不会显示回收站，其他显示正常
        self.assert_ocr_not_exist("回收站", max_match_number=1)
        # 4. 点击切换不同路径，检查是否可以正常切换
        # 4. 目录切换正常，右侧窗口只显示文件夹，自动过滤掉非文件夹的文件
        Cmd.run_cmd("touch ~/Videos/test.txt")
        Cmd.run_cmd("mkdir ~/Videos/test_dir")
        sleep(3)
        euler = DdeMethod()
        euler.dde_desktop.click_video_dir_in_left_dialog_by_attr()
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271275_3.png")

    def test_dde_1271275_3(self):
        """文件管理器——打开文件目录"""
        # 5. 在空白处右键，检查右键菜单显示
        # 5. 新建文件夹 新建文档 排序方式 显示方式
        euler = DdeMethod()
        euler.dde_desktop.click_center_in_dialog_by_attr()
        sleep(3)
        Src.right_click()
        self.assert_ocr_exist("新建文件夹", "新建文档", "显示方式", "排序方式")

    def test_dde_1271275_4(self):
        """文件管理器——打开文件目录"""
        # 6. 选中文件夹右键，检查右键菜单
        # 6. 打开 剪切 复制 重命名 压缩 删除
        euler = DdeMethod()
        euler.dde_desktop.right_click_file_in_dialog_by_attr("Wallpapers")
        self.assert_ocr_exist("打开", "剪切", "复制", "重命名", "压缩", "删除")

    def test_dde_1271275_5(self):
        """文件管理器——打开文件目录"""
        # 7. 选择空文件夹，点击打开
        # 7. 可以点击正常打开
        Cmd.run_cmd("mkdir ~/Videos/empty")
        sleep(3)
        euler = DdeMethod()
        euler.dde_desktop.click_video_dir_in_left_dialog_by_attr()
        sleep(3)
        euler.dde_desktop.click_file_in_dialog_by_attr("empty")
        euler.click(*euler.ocr("打开"))
        self.assert_ocr_exist("文件夹为空")

    def test_dde_1271275_6(self):
        """文件管理器——打开文件目录"""
        # 8. 选择非空文件夹，有图片文件的文件夹，点击打开
        # 8. 图片文件被正常导入
        euler = DdeMethod()
        euler.dde_desktop.click_file_in_dialog_by_attr("Wallpapers")
        sleep(3)
        euler.click(*euler.ocr("打开"))
        self.assert_element_exist(f"$/dde-desktop//dm_splitter/right_view/file_view/abc-123.jpg")

    def test_dde_1271275_7(self):
        """文件管理器——打开文件目录"""
        # 9. 直接点击取消
        # 9. 窗口被关闭
        euler = DdeMethod()
        euler.click(*euler.ocr("取消"))
        self.assert_image_not_exist_in_dde("test_dde_1271275_1.png")

    def test_dde_1271275_8(self):
        """文件管理器——打开文件目录"""
        # 10. 直接点击右上角x按钮
        # 10. 窗口被关闭
        euler = DdeMethod()
        euler.dde_desktop.click_dialog_x_btn_by_image()
        self.assert_image_not_exist_in_dde("test_dde_1271275_1.png")