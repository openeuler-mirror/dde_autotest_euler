#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
【任务栏】右键进入电源管理
用例编号：1978595
步骤1：切换任务栏为时尚模式 -> 切换成功
步骤2：在任务栏-右键关机-电源管理 -> 进入控制中心-电源管理界面
步骤3：切换任务栏为高效模式，重复步骤1~2 -> 结果同1~2
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    """【任务栏】右键进入电源管理"""

    def test_dde_1978595(self):
        """【任务栏】右键进入电源管理 - 时尚/高效模式下均能进入控制中心电源管理界面"""
        dock = DdeDockPublicWidget()
        euler = DdeMethod()

        # ========== 步骤1：时尚模式 ==========
        # 切换任务栏为时尚模式
        dock.click_right_submenu_dock_mode_fashion()
        sleep(1)
        # 【断言】切换成功
        self.assert_dock_mode(0)

        # ========== 步骤2：右键关机-电源管理 ==========
        # 在任务栏-右键关机插件
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        # 点击菜单项「电源设置」进入电源管理
        euler.dde_dock.click_by_ocr("电源设置")
        sleep(6)
        # 【断言】进入控制中心-电源管理界面
        self.assert_ocr_exist("电源管理", "使用电源", "唤醒设置")

        # 关闭控制中心，便于步骤3重复操作
        DdeMethod().dde_control_center.kill_dde_control_center()
        sleep(2)

        # ========== 步骤3：高效模式，重复步骤1~2 ==========
        # 切换任务栏为高效模式
        dock.click_right_submenu_dock_mode_efficient()
        sleep(1)
        self.assert_dock_mode(1)

        # 重复步骤2：任务栏-右键关机-电源管理
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        euler.dde_dock.click_by_ocr("电源设置")
        sleep(6)
        # 【断言】结果同步骤1~2：进入控制中心-电源管理界面
        self.assert_ocr_exist("电源管理", "使用电源", "唤醒设置")

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1978595(self):
        """前置与后置：关闭控制中心并恢复任务栏为高效模式"""
        yield
        dock = DdeDockPublicWidget()
        DdeMethod().dde_control_center.kill_dde_control_center()
        sleep(1)
        dock.click_right_submenu_dock_mode_efficient()
        sleep(0.5)
        dock.move_to(960, 540)
