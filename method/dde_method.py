#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from time import sleep
from funnylog2.config import config as funnylog2_config
funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3 import log
from youqu3.gui import pylinuxauto
from config import config
from method.base_method import BaseMethod
from method.dde_dock_method import DdeDockMethod
from method.dde_control_center_method import DdeControlCenterMethod
from method.dde_launcher_method import DdeLauncherMethod


@log
class DdeMethod(BaseMethod):
    """应用方法主类"""


    def dde_method_open_software_by_launcher(self, text):
        """通过启动器打开软件"""
        DdeDockMethod().dde_dock_method_click_launcher_btn_by_attr()
        DdeLauncherMethod().dde_launcher_method_click_search_box_by_attr()
        pylinuxauto.input_message(text)
        pylinuxauto.enter()

    def dde_method_close_window(self):
        """关闭窗口"""
        DdeMethod().dde_method_click_by_img("close_window_btn.png")

    def dde_method_add_hanyu_keyboard_layout_in_control_center(self):
        """在 键盘布局 界面添加 汉语"""
        DdeDockMethod().dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().dde_control_center_method_click_keyboard_and_language_by_attr()
        DdeControlCenterMethod().dde_control_center_method_click_keyboard_layout_by_attr()
        DdeControlCenterMethod().dde_control_center_method_click_add_keyboard_layout_btn_by_attr()
        DdeControlCenterMethod().dde_control_center_method_click_hanyu_keyboard_layout_at_list()
        DdeControlCenterMethod().dde_control_center_method_click_bottom_add_btn_by_attr()


    def dde_method_delete_keyboard_layout_by_img(self):
        """在键盘布局界面删除列表中的其他布局"""
        DdeControlCenterMethod().dde_control_center_method_click_edit_btn_in_keyboard_layout()
        DdeControlCenterMethod().dde_control_center_click_delete_keyboard_layout_btn_by_img()



if __name__ == "__main__":
    DdeMethod().dde_method_add_hanyu_keyboard_layout_in_control_center()