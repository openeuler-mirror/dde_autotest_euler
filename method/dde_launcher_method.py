from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeLauncherMethod(BaseMethod):
    def dde_launcher_method_click_search_box_by_attr(self):
        """在启动器中点击搜索框"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-launcher/Editable_dlineeditchildlineedit"
        ).click()

    def dde_launcher_method_click_all_categories_or_back_by_attr(self):
        """点击启动器下方的 所有分类 或者 返回"""
        pylinuxauto.find_element_by_attr_path("/dde-launcher/AllIcon").click()

    def dde_launcher_method_click_system_manager_in_all_categories_view(self):
        """在启动器的 所有分类 界面点击 系统管理"""
        self.base_method_click_by_ocr("系统管理")
