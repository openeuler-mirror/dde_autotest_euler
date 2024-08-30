#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from time import sleep
from funnylog2.config import config as funnylog2_config

from config import config
from method.base_method import BaseMethod

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3 import log
from youqu3.gui import pylinuxauto
from method.dde_dock_method import DdeDockMethod
from method.dde_control_center_method import DdeControlCenterMethod
from method.dde_launcher_method import DdeLauncherMethod


@log
class DdeMethod(DdeDockMethod, DdeControlCenterMethod, DdeLauncherMethod):
    """应用方法主类"""

    def dde_method_open_software_by_launcher(self, text):
        """通过启动器打开软件"""
        self.dde_dock_method_click_launcher_btn_by_attr()
        self.dde_launcher_method_click_search_box_by_attr()
        pylinuxauto.input_message(text)
        pylinuxauto.enter()

    def dde_method_close_window(self):
        """关闭窗口"""
        self.dde_method_click_by_img("close_window_btn.png")

    def dde_method_delete_keyboard_layout_in_control_center(self):
        """在控制中心的键盘布局视图删除除选中之外的布局"""
        self.dde_control_center_method_click_edit_btn_in_keyboard_layout()
        self.dde_control_center_click_delete_btn_by_img()

    def dde_method_add_hanyu_keyboard_layout_in_control_center(self):
        """在控制中心中添加 汉语 键盘布局"""
        self.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center_method_click_keyboard_and_language_by_attr()
        self.dde_control_center_method_click_keyboard_layout_by_attr()
        self.dde_control_center_method_click_add_keyboard_layout_btn_by_attr()
        self.dde_control_center_method_click_hanyu_keyboard_layout_at_list()
        self.dde_control_center_method_click_bottom_add_btn_by_attr()

    def dde_method_add_english_system_language_in_control_center(self):
        """在控制中心中添加 英语 系统语言"""
        self.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center_enter_view_by_search_box("xitongyuyan")
        sleep(2)
        self.dde_control_center_method_click_by_attr("American English - 美国英语")
        self.dde_control_center_method_click_bottom_add_btn_by_attr()

    def dde_method_delete_system_language_by_img(self):
        """在 系统语言 视图中删除其他的系统语言"""
        self.dde_control_center_method_click_edit_btn_in_system_language()
        self.dde_control_center_click_delete_btn_by_img()

    def dde_method_add_common_account_by_control_center(self):
        """在控制中心中添加新的账户 test"""
        self.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center_enter_view_by_search_box("zhanghu")
        sleep(2)
        self.dde_control_center_method_click_by_attr("Btn_创建帐户")
        self.dde_control_center_method_click_by_attr("Editable_usernameedit")
        pylinuxauto.input_message("test")
        sleep(2)
        pylinuxauto.tab()
        pylinuxauto.input_message("test")
        sleep(2)
        pylinuxauto.tab()
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        pylinuxauto.tab()
        pylinuxauto.tab()
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Btn_创建")
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        pylinuxauto.enter()
        sleep(5)

    def dde_method_add_root_account_by_control_center(self):
        """在控制中心中添加新的账户 test"""
        self.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center_enter_view_by_search_box("zhanghu")
        self.dde_control_center_method_click_by_attr("Btn_创建帐户")
        self.dde_control_center_method_click_by_attr("标准用户")
        self.dde_control_center_method_click_by_attr("管理员")
        self.dde_control_center_method_click_by_attr("Editable_usernameedit")
        pylinuxauto.input_message("test")
        sleep(2)
        pylinuxauto.tab()
        pylinuxauto.input_message("test")
        sleep(2)
        pylinuxauto.tab()
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        pylinuxauto.tab()
        pylinuxauto.tab()
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Btn_创建")
        pylinuxauto.input_message(self.account_massage)
        sleep(3)
        pylinuxauto.enter()
        sleep(5)

    def dde_method_delete_test_account_by_control_center(self):
        """在控制中心中将新添加的账户test删除"""
        self.dde_control_center_method_click_by_attr("test")
        self.dde_control_center_method_click_by_attr("Btn_删除帐户")
        self.dde_control_center_method_click_by_attr("Btn_删除")
        sleep(5)

    def dde_method_change_current_account_password_by_control_center(self):
        """在控制中心中修改当前用户密码"""
        self.dde_control_center_enter_view_by_search_box("xiugaimima")
        self.dde_control_center_method_click_by_attr("Btn_修改密码")
        self.dde_control_center_method_click_by_attr("Editable_oldpasswordedit")
        pylinuxauto.input_message(BaseMethod.account_massage)
        self.dde_control_center_method_click_by_attr("Editable_newpasswordedit")
        pylinuxauto.input_message(BaseMethod.change_password)
        self.dde_control_center_method_click_by_attr("Editable_repeatpasswordedit")
        pylinuxauto.input_message(BaseMethod.change_password)
        self.dde_control_center_method_click_by_attr("Btn_保存")

    def dde_method_reset_current_account_password_from_change_password_by_control_center(self):
        """在控制中心中将修改的当前用户密码重置为修改前的密码"""
        self.dde_control_center_method_click_by_attr("Btn_修改密码")
        self.dde_control_center_method_click_by_attr("Editable_oldpasswordedit")
        pylinuxauto.input_message(BaseMethod.change_password)
        self.dde_control_center_method_click_by_attr("Editable_newpasswordedit")
        pylinuxauto.input_message(BaseMethod.account_massage)
        self.dde_control_center_method_click_by_attr("Editable_repeatpasswordedit")
        pylinuxauto.input_message(BaseMethod.account_massage)
        self.dde_control_center_method_click_by_attr("Btn_保存")

    def dde_method_change_other_account_password_by_control(self):
        """在控制中心中修改非当前用户密码"""
        self.dde_control_center_method_click_reset_password_btn_by_attr()
        self.dde_control_center_method_click_by_attr("Editable_newpasswordedit")
        pylinuxauto.input_message(BaseMethod.change_password)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Editable_repeatpasswordedit")
        pylinuxauto.input_message(BaseMethod.change_password)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Btn_保存")
        sleep(5)

    def dde_method_reset_other_account_password_from_change_password_by_control_center(self):
        """在控制中心中将修改的非当前用户密码重置为修改前的密码（该方法主要用于对修改密码的重置，修改密码方法包含鉴权，因此本方法内无鉴权操作）"""
        self.dde_control_center_method_click_reset_password_btn_by_attr()
        self.dde_control_center_method_click_by_attr("Editable_newpasswordedit")
        pylinuxauto.input_message(BaseMethod.account_massage)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Editable_repeatpasswordedit")
        pylinuxauto.input_message(BaseMethod.account_massage)
        sleep(3)
        self.dde_control_center_method_click_by_attr("Btn_保存")


if __name__ == "__main__":
    sleep(3)
    DdeMethod().dde_method_reset_other_account_password_from_change_password_by_control_center()
