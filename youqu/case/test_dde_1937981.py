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
    """【任务栏】高效模式左下角显示桌面测试"""

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1937981(self):
        """用例前置和后置"""
        # 前置：确保任务栏处于高效模式
        dock = DdeDockPublicWidget()
        dock.click_right_submenu_dock_mode_efficient()
        sleep(2)
        
        yield
        
        # 后置：清理打开的窗口
        euler = DdeMethod()
        euler.kill_process("dde-file-manager")
        euler.kill_process("deepin-terminal")
        sleep(1)

    def test_dde_1937981_1(self):
        """【任务栏】高效模式左下角显示桌面测试 - 多窗口显示桌面功能"""
        dock = DdeDockPublicWidget()
        euler = DdeMethod()
        
        # 【前置条件】打开多个程序窗口
        # 打开文件管理器
        euler.open_software_by_launcher("filemanager")
        sleep(2)
        
        # 验证窗口已打开
        self.assert_ocr_exist("系统盘")  # 文件管理器窗口
        self.assert_process_status(True, "dde-file-manager")
        
        # 【步骤】2. 打开多个程序窗口，然后点击显示桌面的图标
        dock.click_show_desktop_in_dock_by_attr()
        sleep(2)
        
        # 【断言】显示桌面成功
        # 验证窗口已最小化（窗口标题不可见）
        self.assert_ocr_not_exist("系统盘")  # 文件管理器窗口标题不可见
        
        # 验证进程仍在运行（窗口只是最小化，不是关闭）
        self.assert_process_status(True, "dde-file-manager")
        
        # 验证桌面显示（通过OCR识别桌面元素）
        self.assert_ocr_exist("回收站")  # 桌面通常有回收站图标
