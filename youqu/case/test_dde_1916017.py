#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

# SPDX-FileCopyrightText: 2023 UnionTech Software Technology Co., Ltd.

# SPDX-License-Identifier: GPL-2.0-only
# pylint: disable=C0114,C0115,C0116,R0904,R0915

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src.shortcut import ShortCut
from src import Src, sleep


class TestDeepinTerminalCase(BaseCase):
    """终端快捷键测试用例"""

    @pytest.fixture(scope="function", autouse=True)
    def teardown_1916017(self):
        """用例清理"""
        yield
        DdeMethod().kill_process("deepin-terminal")
        sleep(2)

    def test_dde_1916017(self):
        """测试使用快捷键Ctrl+Alt+T打开终端并执行命令"""
        # 使用快捷键打开终端
        ShortCut.ctrl_alt_t()
        sleep(2)

        # 验证终端是否正常打开
        self.assert_process_status(True, "deepin-terminal")
        sleep(1)

        # 在终端中输入ls命令
        ShortCut.input_message("uname -a")
        sleep(1)
        ShortCut.enter()
        sleep(2)
        self.assert_ocr_exist("Linux")  # 验证输出包含Linux
        

        # 验证进程仍在运行
        self.assert_process_status(True, "deepin-terminal")
