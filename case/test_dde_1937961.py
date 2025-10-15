#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

# SPDX-FileCopyrightText: 2023 UnionTech Software Technology Co., Ltd.

# SPDX-License-Identifier: GPL-2.0-only
# pylint: disable=C0114,C0115,C0116,R0904,R0915

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget
from src import sleep


class TestDdeCase(BaseCase):
    """【分支AE】1.首次单击打开应用"""

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1937961(self):
        """用例前置和后置"""
        # 前置：确保任务栏显示正常，关闭可能存在的文件管理器
        euler = DdeMethod()
        euler.kill_process("dde-file-manager")
        sleep(1)
        
        yield
        
        # 后置：清理打开的窗口
        euler.kill_process("dde-file-manager")
        sleep(1)

    def test_dde_1937961_1(self):
        """【分支AE】1.首次单击打开应用 - 时尚模式"""
        dock = DdeDockPublicWidget()
        
        # 【前置条件】任务栏显示正常
        # 确保任务栏处于时尚模式
        dock.click_right_submenu_dock_mode_fashion()
        sleep(2)
        
        # 【步骤】1. 任务栏模式设置为时尚模式,单击文件管理器图标
        dock.click_file_manager_btn_in_dock_by_attr()
        sleep(3)
        
        # 【断言】能够打开文件管理器窗口
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("系统盘")  # 验证文件管理器窗口打开

    def test_dde_1937961_2(self):
        """【分支AE】1.首次单击打开应用 - 高效模式"""
        dock = DdeDockPublicWidget()
        
        # 【前置条件】任务栏显示正常
        # 确保任务栏处于高效模式
        dock.click_right_submenu_dock_mode_efficient()
        sleep(2)
        
        # 【步骤】2. 任务栏设置高效模式,关闭文件管理之后,单击文件管理器图标
        # 先确保文件管理器已关闭
        euler = DdeMethod()
        euler.kill_process("dde-file-manager")
        sleep(1)
        
        # 单击文件管理器图标
        dock.click_file_manager_btn_in_dock_by_attr()
        sleep(3)
        
        # 【断言】能够打开文件管理器窗口
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("系统盘")  # 验证文件管理器窗口打开
