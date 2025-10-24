import pytest

from src import sleep
from src import Src
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1940063(self):
        dock = DdeDockPublicWidget()
        dde = DdeMethod()

        """切换到时尚模式"""
        dock.click_right_submenu_dock_mode_fashion()
        self.assert_dock_mode(0)

        """控制中心-个性化，勾选回收站显示 """
        dock.click_right_menu_dock_set()
        sleep(1)
        self.assert_ocr_exist("个性化")
        sleep(1)

        """正常显示插件区域，勾选回收站 """
        self.assert_ocr_exist("插件区域")
        Src.click(885, 436)
        self.assert_image_exist_in_dde('test_dde_1940063_trash.png')
        dde.dde_control_center.kill_dde_control_center()

        """任务栏右键打开回收站,删除文件存在"""
        dock.right_click_trash_in_dock_by_attr()
        dde.dde_dock.click_by_ocr("打开")
        self.assert_image_exist_in_dde('test_dde_1940063_del.png')
        dde.kill_process('dde-file-manager')

        """清空回收站"""
        dock.right_click_trash_in_dock_by_attr()
        dde.dde_dock.click_by_ocr("清空")
        sleep(1)
        dde.dde_dock.click_by_ocr("删除")

        """清空回收站后文件不存在"""
        dock.right_click_trash_in_dock_by_attr()
        dde.dde_dock.click_by_ocr("打开")
        self.assert_image_not_exist_in_dde('test_dde_1940063_del.png')
        dde.kill_process('dde-file-manager')

        """清空回收站后无清空按钮"""
        dock.right_click_trash_in_dock_by_attr()
        self.assert_image_not_exist_in_dde("test_dde_1940063_empty.png")
        dde.kill_process('dde-file-manager')


    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1940063(self):
        """前置和后置"""
        Cmd.run_cmd("touch ~/Desktop/1940063.txt")
        DdeMethod().dde_dock.right_click_by_img('test_dde_1940063_desk.png')
        DdeMethod().dde_dock.click_by_ocr("删除")
        yield
        # 切换回高效模式取消勾选回收站
        DdeDockPublicWidget().click_right_submenu_dock_mode_efficient()
        DdeDockPublicWidget().click_right_menu_dock_set()
        sleep(3)
        Src.click(885, 460)
        DdeMethod().dde_control_center.kill_dde_control_center()
        DdeMethod().kill_process('dde-file-manager')

