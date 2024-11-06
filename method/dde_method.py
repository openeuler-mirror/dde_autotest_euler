#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from time import sleep

from apps.dde_autotest_euler.method.base_method import BaseMethod
from apps.dde_autotest_euler.method.vender.browser_method import BrowserMethod
from apps.dde_autotest_euler.method.vender.dde_desktop_method import DdeDesktopMethod
from apps.dde_autotest_euler.method.vender.dde_polkit_agent_method import DdePolkitAgentMethod
from apps.dde_autotest_euler.method.vender.deepin_device_manager_method import DeepinDeviceManagerMethod
from apps.dde_autotest_euler.method.vender.deepin_editor_method import DeepinEditorMethod
from apps.dde_autotest_euler.method.vender.deepin_font_manager_method import DeepinFontManagerMethod
from apps.dde_autotest_euler.method.vender.deepin_log_viewer_method import DeepinLogViewerMethod

from apps.dde_autotest_euler.method.vender.dde_dock_method import DdeDockMethod
from apps.dde_autotest_euler.method.vender.dde_control_center_method import DdeControlCenterMethod
from apps.dde_autotest_euler.method.vender.dde_launcher_method import DdeLauncherMethod
from apps.dde_autotest_euler.method.vender.deepin_draw_method import DeepinDrawMethod
from apps.dde_autotest_euler.method.vender.deepin_system_monitor_method import DeepinSystemMonitorMethod
from apps.dde_autotest_euler.method.vender.deepin_terminal_method import DeepinTerminalMethod

from src import log
from src.shortcut import ShortCut
from src import custom_exception
from src import Src

@log
class DdeMethod(Src):
    """应用方法主类"""

    @property
    def dde_polkit_agent(self):
        return DdePolkitAgentMethod()

    @property
    def dde_dock(self):
        return DdeDockMethod()

    @property
    def dde_control_center(self):
        return DdeControlCenterMethod()

    @property
    def dde_launcher(self):
        return DdeLauncherMethod()

    @property
    def deepin_font_manager(self):
        return DeepinFontManagerMethod()

    @property
    def browser(self):
        return BrowserMethod()

    @property
    def deepin_editor(self):
        return DeepinEditorMethod()

    @property
    def deepin_devicemanager(self):
        return DeepinDeviceManagerMethod()

    @property
    def deepin_log_viewer(self):
        return DeepinLogViewerMethod()

    @property
    def deepin_terminal(self):
        return DeepinTerminalMethod()

    @property
    def deepin_draw(self):
        return DeepinDrawMethod()

    @property
    def deepin_system_monitor(self):
        return DeepinSystemMonitorMethod()

    @property
    def dde_desktop(self):
        return DdeDesktopMethod()


    def open_software_by_launcher(self, text):
        """通过启动器打开软件"""
        self.dde_dock.click_launcher_btn_by_attr()
        self.dde_launcher.click_search_box_by_attr()
        ShortCut.input_message(text)
        ShortCut.enter()

    def close_window(self):
        """关闭窗口"""
        try:
            self.base_method_click_by_img("close_window_btn.png")
        except custom_exception.TemplateElementNotFound:
            self.base_method_click_by_img(f"close_window_btn_1.png")

    def delete_keyboard_layout_in_control_center(self):
        """在控制中心的键盘布局视图删除除选中之外的布局"""
        self.dde_control_center.click_edit_btn_in_keyboard_layout()
        self.dde_control_center.click_delete_btn_by_img()

    def add_hanyu_keyboard_layout_in_control_center(self):
        """在控制中心中添加 汉语 键盘布局"""
        self.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center.click_keyboard_and_language_by_attr()
        self.dde_control_center.click_keyboard_layout_by_attr()
        self.dde_control_center.click_add_keyboard_layout_btn_by_attr()
        self.dde_control_center.click_hanyu_keyboard_layout_at_list()
        self.dde_control_center.click_bottom_add_btn_by_attr()

    def add_english_system_language_in_control_center(self):
        """在控制中心中添加 英语 系统语言"""
        self.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center.enter_view_by_search_box("xitongyuyan")
        sleep(2)
        self.dde_control_center.click_by_attr("American English - 美国英语")
        self.dde_control_center.click_bottom_add_btn_by_attr()

    def delete_system_language_by_img(self):
        """在 系统语言 视图中删除其他的系统语言"""
        self.dde_control_center.click_edit_btn_in_system_language()
        self.dde_control_center.click_delete_btn_by_img()

    def add_common_account_by_control_center(self):
        """在控制中心中添加新的账户 test"""
        self.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center.enter_view_by_search_box("zhanghu")
        sleep(2)
        self.dde_control_center.click_by_attr("Btn_创建帐户")
        self.dde_control_center.click_by_attr("Editable_usernameedit")
        self.input_message("test")
        sleep(2)
        self.tab()
        self.input_message("test")
        sleep(2)
        self.tab()
        self.input_message(self.account_message)
        sleep(3)
        self.tab()
        self.tab()
        self.input_message(self.account_message)
        sleep(3)
        self.dde_control_center.click_by_attr("Btn_创建")
        sleep(1)
        self.input_message(self.account_message)
        sleep(3)
        self.enter()
        sleep(5)

    def add_root_account_by_control_center(self):
        """在控制中心中添加新的账户 test"""
        self.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        self.dde_control_center.enter_view_by_search_box("zhanghu")
        self.dde_control_center.click_by_attr("Btn_创建帐户")
        self.dde_control_center.click_by_attr("标准用户")
        self.dde_control_center.click_by_attr("管理员")
        self.dde_control_center.click_by_attr("Editable_usernameedit")
        self.input_message("test")
        sleep(2)
        self.tab()
        self.input_message("test")
        sleep(2)
        self.tab()
        self.input_message(self.account_message)
        sleep(3)
        self.tab()
        self.tab()
        self.input_message(self.account_message)
        sleep(3)
        self.dde_control_center.click_by_attr("Btn_创建")
        sleep(1)
        self.input_message(self.account_message)
        sleep(3)
        self.enter()
        sleep(5)

    def delete_test_account_by_control_center(self):
        """在控制中心中将新添加的账户test删除"""
        self.dde_control_center.click_by_attr("test")
        self.dde_control_center.click_by_attr("Btn_删除帐户")
        self.dde_control_center.click_by_attr("Btn_删除")
        sleep(5)

    def change_current_account_password_by_control_center(self):
        """在控制中心中修改当前用户密码"""
        self.dde_control_center.enter_view_by_search_box("xiugaimima")
        self.dde_control_center.click_by_attr("Btn_修改密码")
        self.dde_control_center.click_by_attr("Editable_oldpasswordedit")
        self.input_message(BaseMethod.account_message)
        self.dde_control_center.click_by_attr("Editable_newpasswordedit")
        self.input_message(BaseMethod.change_password)
        self.dde_control_center.click_by_attr("Editable_repeatpasswordedit")
        self.input_message(BaseMethod.change_password)
        self.dde_control_center.click_by_attr("Btn_保存")

    def reset_current_account_password_from_change_password_by_control_center(self):
        """在控制中心中将修改的当前用户密码重置为修改前的密码"""
        self.dde_control_center.click_by_attr("Btn_修改密码")
        self.dde_control_center.click_by_attr("Editable_oldpasswordedit")
        self.input_message(BaseMethod.change_password)
        self.dde_control_center.click_by_attr("Editable_newpasswordedit")
        self.input_message(BaseMethod.account_message)
        self.dde_control_center.click_by_attr("Editable_repeatpasswordedit")
        self.input_message(BaseMethod.account_message)
        self.dde_control_center.click_by_attr("Btn_保存")

    def change_other_account_password_by_control(self):
        """在控制中心中修改非当前用户密码"""
        self.dde_control_center.click_reset_password_btn_by_attr()
        self.dde_control_center.click_by_attr("Editable_newpasswordedit")
        self.input_message(BaseMethod.change_password)
        sleep(3)
        self.dde_control_center.click_by_attr("Editable_repeatpasswordedit")
        self.input_message(BaseMethod.change_password)
        sleep(3)
        self.dde_control_center.click_by_attr("Btn_保存")
        sleep(5)

    def reset_other_account_password_from_change_password_by_control_center(self):
        """在控制中心中将修改的非当前用户密码重置为修改前的密码（该方法主要用于对修改密码的重置，方法内无鉴权操作）"""
        self.dde_control_center.click_reset_password_btn_by_attr()
        self.dde_control_center.click_by_attr("Editable_newpasswordedit")
        self.input_message(BaseMethod.account_message)
        sleep(3)
        self.dde_control_center.click_by_attr("Editable_repeatpasswordedit")
        self.input_message(BaseMethod.account_message)
        sleep(3)
        self.dde_control_center.click_by_attr("Btn_保存")

    def change_resolution_by_control_center(self):
        """在控制中心中修改屏幕分辨率"""
        self.dde_control_center.enter_view_by_search_box("xianshi")
        self.dde_control_center.click_by_attr("1920×1080")
        self.dde_control_center.click_by_attr("1280×800")
        sleep(1)
        self.dde_control_center.click_by_attr("Btn_保存")
        sleep(2)

    def reset_resolution_by_control_center(self):
        """在控制中心中将修改的分辨率调回1920x1080"""
        self.dde_control_center.click_by_attr("1280×800")
        self.dde_control_center.click_by_attr("1920×1080")
        sleep(1)
        self.dde_control_center.click_by_attr("Btn_保存")
        sleep(2)

    def add_network_dsl_by_control_center(self):
        """在控制中心的 网络 模块中添加DSL"""
        self.dde_control_center.enter_view_by_search_box("dsl")
        self.dde_control_center.click_add_dsl_btn()
        self.dde_control_center.click_by_attr("Btn_自动连接")
        self.dde_control_center.click_by_attr("Editable_用户名")
        self.input_message("test")
        sleep(2)
        self.dde_control_center.click_by_attr("Editable_密码")
        self.input_message(BaseMethod.account_message)
        sleep(3)
        self.dde_control_center.click_by_attr("Btn_保 存")

    def delete_network_dsl_by_control_center(self):
        """在控制中心的网络DSL模块中删除添加的测试DSL连接"""
        self.base_method_click_by_img("dsl_connection_details_btn.png")
        self.dde_control_center.click_by_attr("Btn_删 除")
        sleep(1)
        self.dde_control_center.click_by_attr("Btn_删 除_1")
        sleep(2)

    def change_time_by_control_center(self):
        """在控制中心中手动修改时间"""
        self.dde_control_center.enter_view_by_search_box("shijianshezhi")
        self.dde_control_center.click_time_synchronization_btn_by_attr()
        self.dde_control_center.click_by_attr("TIME_HOUR_WIDGET")
        self.backspace()
        self.backspace()
        self.input_message("12")
        sleep(2)
        self.dde_control_center.click_by_attr("TIME_MIN_WIDGET")
        self.backspace()
        self.backspace()
        self.input_message("12")
        sleep(2)
        self.dde_control_center.click_by_attr("Btn_确定")

    def change_time_area_by_control_center(self):
        """在控制中心中更改时区"""
        self.dde_control_center.click_by_attr("时间日期")
        self.dde_control_center.click_by_attr("时区列表")
        self.dde_control_center.click_by_attr("Btn_修改系统时区")
        sleep(2)
        self.dde_control_center.click_by_attr("Editable_qlineedit")
        self.input_message("New_York")
        sleep(2)
        self.enter()
        self.dde_control_center.click_by_attr("Btn_确定")
        sleep(2)

    def delete_other_time_area_by_control_center(self):
        """删除时区列表多余的一个时区"""
        self.dde_control_center.click_by_attr("Btn_时区列表")
        self.dde_control_center.click_delete_btn_by_img()
        sleep(1)

    def search_font_in_font_manager(self, fontname):
        """在字体管理器中搜索字体"""
        self.deepin_font_manager.method_click_search_box_attr()
        self.input_message(fontname)
        sleep(3)
        self.enter()

    def click_documents_in_pop_window_by_img(self):
        """在文本编辑器的文件管理器弹窗中点击左侧 文档 目录"""
        self.base_method_click_by_ocr("系统盘")
        self.base_method_click_by_img("file_manager_left_view_documents.png")

    def rename_file_in_pop_window_by_attr(self, filename):
        """在弹出的文件保存窗口中对文件进行重命名并且保存,文件名需要包含后缀名，且文件名不可与文档目录下其他文件重复"""
        self.dde_desktop.click_by_attr("file_name_edit")

        self.ctrl_a()
        self.input_message(filename)
        self.click_save_btn_in_pop_window()

    def rename_file_same_name_in_pop_window_by_attr(self, filename):
        """在弹出的文件保存窗口中将文件重命名为重复名称并且点击保存，方法输入的名称为目标文件名称"""
        self.dde_desktop.click_by_attr("file_name_edit")
        self.ctrl_a()
        self.input_message(filename)
        self.click_save_btn_in_pop_window()

    def click_save_btn_in_pop_window(self):
        """在弹出的文件保存窗口中点击保存"""
        self.dde_desktop.dog.app_element("statusBar").child("保 存").click()

    def export_file_by_attr(self, module):
        """
        module:目标模块的名称，概况，处理器，主板......
        """
        self.deepin_devicemanager.right_click_by_attr(module)
        self.select_menu(1)
        sleep(2)
        self.click_documents_in_pop_window_by_img()
        self.click_save_btn_in_pop_window()
        sleep(2)

    def export_log_by_attr(self, log_name, log_type):
        """
        输入需要导出的日志名称以及类型，通过元素右键点击日志进行导出，注意不包括启动日志
        log_name:Xorg Log,Application Log,Boot-Shutdown Event
        log_type:TEXT (*.txt),Doc (*.doc),Xls (*.xls),Html (*.html)
        """
        self.deepin_log_viewer.click_by_attr(log_name)
        sleep(2)
        self.deepin_log_viewer.click_export_btn_by_attr()
        self.click_documents_in_pop_window_by_img()
        self.dde_desktop.click_by_attr("TEXT (*.txt)")
        sleep(1)
        self.dde_desktop.click_by_attr(log_type)
        self.click_save_btn_in_pop_window()

    def export_all_log_by_attr(self):
        """导出所有的日志"""
        self.base_method_click_by_img("deepin_log_viewer_export_all_log_icon.png")
        sleep(2)
        self.deepin_log_viewer.deepin_log_viewer_input_root_password()
        self.click_documents_in_pop_window_by_img()
        self.click_save_btn_in_pop_window()
        sleep(1)

    def click_restore(self):
        """
        点击左上角
        """
        self.click(10, 10)
