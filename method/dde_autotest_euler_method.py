#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from time import sleep

from dnf.yum.misc import import_key_to_pubring
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]

from youqu3 import log
from youqu3.gui import pylinuxauto
from config import config
from method.base_method import BaseMethod


@log
class DdeMethod(BaseMethod):
    """应用方法主类"""

    def dde_method_click_dde_file_manager_on_dock_by_attr(self):
        """在任务栏点击文件管理器"""
        pylinuxauto.find_element_by_attr_path("/dde-dock/Btn_文件管理器").click()

    def dde_method_click_by_ocr(self, text):
        pylinuxauto.find_element_by_ocr(text).click()

    def dde_method_click_by_attr(self, PATH):
        pylinuxauto.find_element_by_attr_path(PATH).click()

    def dde_method_click_by_img(self, img_name):
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").click()

    def dde_method_click_launcher_on_dock_by_attr(self):
        DdeMethod().dde_method_click_by_attr(
            "/dde-dock/Form_mainwindow/Btn_mainpanelcontrol/Form_fixedarea/Btn_launcheritem"
        )

    def dde_method_search_software_in_dock(self):
        DdeMethod().dde_method_click_launcher_on_dock_by_attr()
        DdeMethod().dde_method_click_by_attr(
            "/dde-launcher/Form_windowedframe/Form_rightwidget/Form_searcheredit/Editable_dlineeditchildlineedit"
        )

    def dde_method_click_all_categories_in_launcher(self):
        DdeMethod().dde_method_click_launcher_on_dock_by_attr()
        DdeMethod().dde_method_click_by_attr(
            "/dde-launcher/Form_windowedframe/Form_rightwidget/Btn_switchbtn/AllIcon"
        )

    def dde_method_click_back_in_all_categories_view(self):
        DdeMethod().dde_method_click_by_attr(
            "/dde-launcher/Form_windowedframe/Form_rightwidget/Btn_switchbtn/AllIcon"
        )

    def dde_method_click_system_manager_in_all_categories_view(self):
        DdeMethod().dde_method_click_by_img("system_manager_in_all_categories_view.png")

    def dde_method_open_control_center_by_dock(self):
        pylinuxauto.find_element_by_attr_path("/dde-dock/Btn_控制中心").click()

    def dde_method_click_keyboard_and_language_in_control_center(self):
        pylinuxauto.find_element_by_attr_path(
            "/dde-control-center/DMainWindow/contentwindow/键盘和语言"
        ).click()

    def dde_method_click_keyboard_layout_in_control_center(self):
        DdeMethod().dde_method_click_by_attr(
            "/dde-control-center/DMainWindow/contentwindow/Form_modulepage/Form_keyboardwidget/List_keyboardlist/键盘布局"
        )

    def dde_method_close_control_center_by_window(self):
        DdeMethod().dde_method_click_by_img("close_window_btn.png")

    def dde_method_add_keyboard_layout_in_control_center(self):
        DdeMethod().dde_method_open_control_center_by_dock()
        sleep(3)
        DdeMethod().dde_method_click_keyboard_and_language_in_control_center()
        DdeMethod().dde_method_click_keyboard_layout_in_control_center()
        DdeMethod().dde_method_click_by_attr(
            "/dde-control-center/DMainWindow/contentwindow/Form_modulepage/Form_kblayoutsettingwidget/Btn_addlayout"
        )
        DdeMethod().dde_method_click_by_attr(
            "/dde-control-center/DMainWindow/contentwindow/Form_modulepage/ContentWidget_contentArea/TranslucentFrame/List_keyboardmenulist/汉语"
        )
        DdeMethod().dde_method_click_by_attr(
            "/dde-control-center/DMainWindow/contentwindow/Form_modulepage/ContentWidget_contentArea/ButtonTuple/Btn_添加"
        )




if __name__ == "__main__":
    sleep(3)
    DdeMethod().dde_method_close_control_center_by_window()