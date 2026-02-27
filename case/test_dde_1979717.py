#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
【启动器】启动器中打开设置
用例编号：1979717
步骤1：打开启动器（win键） -> 展开成功
步骤2：点击左下角的「齿轮」图标 -> 成功进入控制中心首页
"""

import pytest

from src import sleep
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    """【启动器】启动器中打开设置"""

    def test_dde_1979717(self):
        """【启动器】启动器中打开设置 - Win键展开启动器，齿轮进入控制中心首页"""
        euler = DdeMethod()

        # ========== 步骤1：打开启动器（Win键） ==========
        Src.press_key("win")
        sleep(3)
        # 【断言】展开成功
        self.assert_ocr_exist("搜索")

        # ========== 步骤2：点击左下角「齿轮」图标 ==========
        euler.dde_dock.click_by_img("launcher_control_center_icon.png")
        sleep(3)
        # 【断言】成功进入控制中心首页
        self.assert_process_status(True, "dde-control-center")
        self.assert_ocr_exist("控制中心", "帐户", "显示", "默认程序")

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1979717(self):
        """后置：关闭控制中心并恢复桌面"""
        yield
        DdeMethod().dde_control_center.kill_dde_control_center()
        DdeMethod().click_restore()
        sleep(2)
