#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/08/26
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1918675(self):
        """【任务栏】【插件】任务栏时间图标hover下tips提示 """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏时间图标上
        dock.move_to_element_in_dock_by_attr("Btn_datetime")
        sleep(2)
        euler = DdeMethod()
        #【断言】:2.tips显示系统当前时间:格式“xxxx年xx月xx日 星期x xx:xx”
        # 系统的秒数一直变化:只精确到分钟
        # 获取当前日期并转换为中文大写星期格式
        weekday_num = euler.run_cmd("date +'%w'").strip()
        weekday_map = {'0': '日', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六'}
        weekday_cn = weekday_map.get(weekday_num, '')
        time = euler.run_cmd(f"date +'%Y年%-m月%-d日星期{weekday_cn}%-H:%M'").strip()
        self.assert_ocr_exist(time)

    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1918675(self):
        """前置和后置"""
        yield
        #【后置】:1.移动鼠标,取消hover
        dock = DdeDockPublicWidget()
        dock.move_to(960,540)
