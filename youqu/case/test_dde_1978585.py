
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.dde_dock_method import DdeDockMethod

from src import CmdCtl as Cmd
from src import Src, sleep
import pytest


class TestDdeCase(BaseCase):

    @pytest.fixture(scope="class", autouse=True)
    def setup_teardown(self):
        DdeMethod().click_restore()
        notify_loc = DdeDockMethod().get_x_y_by_img("dock_notify_icon.png")
        DdeDockMethod().click(*notify_loc)
        sleep(1)
        clean_loc = DdeDockMethod().get_x_y_by_img("notify_clean_btn.png")
        DdeDockMethod().click(*clean_loc)
        DdeMethod().click_restore()

    def test_dde_1978585(self):
        notify_loc = DdeDockMethod().get_x_y_by_img("dock_notify_icon.png")

        # 悬浮显示提示
        Src.move_to(*notify_loc)
        sleep(2)
        self.assert_ocr_exist("暂无新消息")

        # 发送通知
        for i in range(5):
            Cmd.run_cmd(f"notify-send 标题{i} 内容{i}")
            sleep(1)

        # 悬浮显示已有通知
        DdeMethod().click_restore()
        sleep(6)
        Src.move_to(*notify_loc)
        sleep(2)
        self.assert_ocr_exist("5条通知")

        # 断言通知标题和内容
        DdeDockMethod().click(notify_loc)
        sleep(2)
        self.assert_ocr_exist("标题4", "内容4")

        # 清理1条通知
        DdeMethod().dde_dock.double_click_by_ocr("内容0")
        sleep(2)
        clean_message_loc = DdeDockMethod().get_x_y_by_img("notify_message_close_btn.png")
        DdeDockMethod().click(*clean_message_loc)
        sleep(2)
        self.assert_ocr_not_exist("标题0", "内容0")

        # 清理所有通知
        clean_loc = DdeDockMethod().get_x_y_by_img("notify_clean_btn.png")
        DdeDockMethod().click(*clean_loc)

        # 断言通知消失
        self.assert_ocr_not_exist("标题", "内容")

        DdeMethod().click_restore()

        # 断言悬浮提示无消息
        sleep(5)
        Src.move_to(*notify_loc)
        sleep(2)
        self.assert_ocr_exist("暂无新消息")

        sleep(1)
