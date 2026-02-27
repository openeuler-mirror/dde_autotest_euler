#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
【任务栏】右键关机
用例编号：1978587
步骤1：切换任务栏为时尚模式，在任务栏-关机插件-右键-关机 -> 打开关机确认界面
步骤2：切换任务栏为高效模式，重复步骤1和2 -> 结果同1
"""

import pytest

from src import sleep
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    """【任务栏】右键关机"""

    def test_dde_1978587(self):
        """【任务栏】右键关机 - 时尚模式与高效模式下均能打开关机确认界面"""
        dock = DdeDockPublicWidget()
        euler = DdeMethod()

        # ========== 步骤1：时尚模式 ==========
        # 切换任务栏为时尚模式
        dock.click_right_submenu_dock_mode_fashion()
        sleep(1)
        self.assert_dock_mode(0)

        # 在任务栏-关机插件-右键
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        # 点击菜单项「关机」
        euler.dde_dock.click_by_ocr("关机")
        sleep(2)
        # 【断言】打开关机确认界面
        self.assert_ocr_exist("关机", "取消", mode="any")

        # 关闭关机确认界面，避免真关机
        Src.esc()
        sleep(1)

        # ========== 步骤2：高效模式 ==========
        # 切换任务栏为高效模式
        dock.click_right_submenu_dock_mode_efficient()
        sleep(1)
        self.assert_dock_mode(1)

        # 重复：任务栏-关机插件-右键-关机
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        euler.dde_dock.click_by_ocr("关机")
        sleep(2)
        # 【断言】结果同步骤1：打开关机确认界面
        self.assert_ocr_exist("关机", "取消", mode="any")

        # 关闭关机确认界面
        Src.esc()
        sleep(1)

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1978587(self):
        """前置与后置：保证结束时任务栏为高效模式并关闭可能残留的弹窗"""
        yield
        dock = DdeDockPublicWidget()
        Src.esc()
        sleep(0.5)
        dock.click_right_submenu_dock_mode_efficient()
        sleep(0.5)
        dock.move_to(960, 540)
