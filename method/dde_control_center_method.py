from time import sleep
from funnylog2.config import config as funnylog2_config
from pylinuxauto.attr.dogtail.rawinput import click
funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3 import log
from youqu3.gui import pylinuxauto
from config import config
from method.base_method import BaseMethod
from method.dde_dock_method import DdeDockMethod


@log
class DdeControlCenterMethod(BaseMethod):


    def dde_control_center_method_click_keyboard_and_language_by_attr(self):
        """在控制中心主界面中点击 键盘和语言"""
        pylinuxauto.find_element_by_attr_path(
        "/dde-control-center/键盘和语言"
    ).click()

    def dde_control_center_method_click_keyboard_layout_by_attr(self):
        """在 键盘和语言 模块点击 键盘布局"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/键盘布局"
        ).click()

    def dde_control_center_method_click_add_keyboard_layout_btn_by_attr(self):
        """点击 键盘布局 模块下方的加号按钮添加键盘布局"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/Btn_addlayout"
        ).click()

    def dde_control_center_method_click_hanyu_keyboard_layout_at_list(self):
        """在 添加键盘布局 界面点击 汉语"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/汉语"
        ).click()

    def dde_control_center_method_click_bottom_add_btn_by_attr(self):
        """点击 添加键盘布局 界面下方的添加按钮，从而确认添加"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/Btn_添加"
        ).click()

    def dde_control_center_method_click_edit_btn_in_keyboard_layout(self):
        """点击 键盘布局 界面右侧的编辑按钮"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/Btn_dcommandlinkbutton"
        ).click()

    def dde_control_center_click_delete_keyboard_layout_btn_by_img(self):
        """进入 键盘布局 的编辑界面之后，点击键盘布局列表右侧的红色按钮删除键盘布局"""
        DdeControlCenterMethod().dde_method_click_by_img("delete_keyboard_layout_icon.png")



if __name__ == '__main__':
    DdeDockMethod().dde_dock_method_click_control_center_btn_by_attr()
