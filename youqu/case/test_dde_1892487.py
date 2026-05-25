
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.dde_dock_method import DdeDockMethod

from src import CmdCtl as Cmd
from src import Src, sleep


class TestDdeCase(BaseCase):

    def setup(self):
        self.notify_loc = DdeDockMethod().get_x_y_by_img("dock_notify_icon.png")

    def test_dde_1892487(self):

        DdeDockMethod.click(*self.notify_loc)
        self.assert_ocr_exist("通知中心")

        DdeMethod().click_restore()

        # 悬浮显示提示
        Src.move_to(*self.notify_loc)
        sleep(2)
        self.assert_ocr_exist("暂无新消息")

        # 发送通知
        Cmd.run_cmd("notify-send hello world")

        # 悬浮显示已有通知
        DdeMethod().click_restore()
        sleep(5)
        Src.move_to(*self.notify_loc)
        sleep(2)
        self.assert_ocr_exist("1条通知")

        DdeDockMethod().click(self.notify_loc)
        self.assert_ocr_exist("hello")
        self.assert_ocr_exist("world")
        DdeMethod().click_restore()
        sleep(1)

    def teardown(self):
        DdeDockMethod().click(*self.notify_loc)
        sleep(1)
        clean_loc = DdeDockMethod().get_x_y_by_img("notify_clean_btn.png")
        DdeDockMethod().click(*clean_loc)
        DdeMethod().click_restore()
