#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

# SPDX-FileCopyrightText: 2023 UnionTech Software Technology Co., Ltd.

# SPDX-License-Identifier: GPL-2.0-only
# pylint: disable=C0114,C0115,C0116,R0904,R0915

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src.cmdctl import CmdCtl
from src import sleep


class TestDeepinTerminalCase(BaseCase):
    """终端关于对话框测试用例"""

    def setup_class(self):
        """获取终端rpm包版本"""
        result = CmdCtl.run_cmd("rpm -qa deepin-terminal --qf '%{VERSION}'")
        self.terminal_version = result.strip()  # 获取完整的版本号

    @pytest.fixture(scope="function", autouse=True)
    def teardown_1916019(self):
        """用例清理"""
        yield
        DdeMethod().kill_process("deepin-terminal")
        sleep(2)

    def test_dde_1916019(self):
        """测试终端关于对话框显示"""
        euler = DdeMethod()
        
        # 打开终端
        euler.open_software_by_launcher("terminal")
        sleep(2)
        self.assert_process_status(True, "deepin-terminal")
        
        # 点击菜单按钮并选择关于
        euler.deepin_terminal.click_menu_btn_by_attr()
        sleep(1)
        euler.deepin_terminal.click_menu_about_btn_by_attr()
        sleep(2)

        # 验证关于窗口内容
        self.assert_ocr_exist("终端")  # 验证应用名称
        self.assert_ocr_exist(self.terminal_version)  # 验证版本号与rpm包版本一致
