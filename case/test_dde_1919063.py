import pytest

from src import sleep
from src import Src

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1919063(self):
        dock = DdeDockPublicWidget()
        dde = DdeMethod()

        """控制中心-个性化，勾选回收站显示 """
        dock.click_right_menu_dock_set()
        sleep(1)
        self.assert_ocr_exist("个性化")
        sleep(1)

        """正常显示插件区域，勾选回收站 """
        self.assert_ocr_exist("插件区域")
        Src.click(887, 466)
        self.assert_image_exist_in_dde('test_dde_1919063_1.png')
        dde.dde_control_center.kill_dde_control_center()

        """切换到时尚模式后双击回收站"""
        dock.click_right_submenu_dock_mode_fashion()
        self.assert_dock_mode(0)
        dde.dde_dock.double_click_by_img("test_dde_1919063.png")
        self.assert_process_status(True, 'dde-file-manager')
        self.assert_image_exist_in_dde('test_dde_1919063_2.png')
        dde.kill_process('dde-file-manager')

        """任务栏右键打开回收站"""
        dock.right_click_trash_in_dock_by_attr()
        dde.dde_dock.click_by_ocr("打开")
        self.assert_process_status(True, 'dde-file-manager')
        self.assert_image_exist_in_dde('test_dde_1919063_2.png')
        dde.kill_process('dde-file-manager')

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1918671(self):
        """前置和后置"""
        yield
        # 切换回高效模式取消勾选回收站
        DdeDockPublicWidget().click_right_submenu_dock_mode_efficient()
        DdeDockPublicWidget().click_right_menu_dock_set()
        sleep(3)
        Src.click(885, 466)
        DdeMethod().dde_control_center.kill_dde_control_center()

