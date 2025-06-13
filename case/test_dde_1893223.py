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
    def test_dde_1893223(self):
        """【任务栏】【菜单】设置位置_切换"""
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标在任务栏右键菜单点击：位置 -> 上
        dock.click_right_submenu_dock_location_up()
        #【断言】:1.当前任务栏位置 -> 上
        self.assert_dock_location(0)
        
        #【步骤】:1.鼠标在任务栏右键菜单点击：位置 -> 左
        dock.click_right_submenu_dock_location_left()
        #【断言】:1.当前任务栏位置 -> 左
        self.assert_dock_location(3)

        #【步骤】:1.鼠标在任务栏右键菜单点击：位置 -> 右
        dock.click_right_submenu_dock_location_right()
        #【断言】:1.当前任务栏位置 -> 右
        self.assert_dock_location(1)

        #【步骤】:1.鼠标在任务栏右键菜单点击：位置 -> 下
        dock.click_right_submenu_dock_location_down() 
        #【断言】:1.当前任务栏位置 -> 下
        self.assert_dock_location(2)


    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1893223(self):
        """前置和后置"""
        yield
        dock = DdeDockPublicWidget()
        dock.click_right_submenu_dock_location_down() 
        self.assert_dock_location(2)
