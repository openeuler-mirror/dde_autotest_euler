#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/6/13
@Author : xianglongfei@uniontech.com
"""
import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1893225(self):
        """【任务栏】【菜单】设置模式_切换"""
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标在任务栏右键菜单点击：模式 -> 时尚模式
        dock.click_right_submenu_dock_mode_fashion()
        #【断言】:1.当前任务栏模式 -> 时尚模式
        self.assert_dock_mode(0)

        #【步骤】:1.鼠标在任务栏右键菜单点击：模式 -> 高效模式
        dock.click_right_submenu_dock_mode_efficient()
        #【断言】:1.当前任务栏模式 -> 高效模式
        self.assert_dock_mode(1)

    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1893225(self):
        """前置和后置"""
        yield
        dock = DdeDockPublicWidget()
        dock.click_right_submenu_dock_mode_efficient()
        self.assert_dock_mode(1)
