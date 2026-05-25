#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
【任务栏】右键重启
用例编号：1978589
步骤1：切换任务栏为时尚模式，在任务栏-右键关机插件-重启 -> 打开重启确认界面
步骤2：切换任务栏为高效模式，重复步骤1和2 -> 结果同1和2
"""

import pytest

from src import sleep
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    """【任务栏】右键重启"""

    def test_dde_1978589(self):
        """【任务栏】右键重启 - 时尚模式与高效模式下均能打开重启确认界面"""
        dock = DdeDockPublicWidget()
        euler = DdeMethod()

        # ========== 步骤1：时尚模式 ==========
        # 切换任务栏为时尚模式
        dock.click_right_submenu_dock_mode_fashion()
        sleep(1)
        self.assert_dock_mode(0)

        # 在任务栏-右键关机插件
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        # 点击菜单项「重启」
        euler.dde_dock.click_by_ocr("重启")
        sleep(2)
        # 【断言】打开重启确认界面
        self.assert_ocr_exist("重启", "取消", mode="any")

        # 关闭重启确认界面，避免真重启
        Src.esc()
        sleep(1)

        # ========== 步骤2：高效模式 ==========
        # 切换任务栏为高效模式
        dock.click_right_submenu_dock_mode_efficient()
        sleep(1)
        self.assert_dock_mode(1)

        # 重复：任务栏-右键关机插件-重启
        dock.right_click_element_in_dock_by_attr("Btn_shutdown")
        sleep(2)
        euler.dde_dock.click_by_ocr("重启")
        sleep(2)
        # 【断言】结果同步骤1和2：打开重启确认界面
        self.assert_ocr_exist("重启", "取消", mode="any")

        # 关闭重启确认界面
        Src.esc()
        sleep(1)

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1978589(self):
        """前置与后置：保证结束时任务栏为高效模式并关闭可能残留的弹窗"""
        yield
        dock = DdeDockPublicWidget()
        Src.esc()
        sleep(0.5)
        dock.click_right_submenu_dock_mode_efficient()
        sleep(0.5)
        dock.move_to(960, 540)
