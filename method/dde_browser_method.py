from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3 import log
from youqu3.gui import pylinuxauto
from config import config
from method.base_method import BaseMethod
from method.dde_dock_method import DdeDockMethod


class DdeBrowserMethod(BaseMethod):
    def dde_browser_method_click_by_attr(self, path):
        pylinuxauto.find_element_by_attr_path(f"/Firefox/{path}").click()

    def dde_browser_method_click_menu_icon_by_img(self):
        self.dde_method_click_by_img("firefox_menu_icon.png")

    def dde_browser_method_click_close_btn_by_attr(self):
        self.dde_method_click_by_img("firefox_close_btn.png")
