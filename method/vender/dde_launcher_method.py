from apps.dde_autotest_euler.method.base_method import BaseMethod


class DdeLauncherMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-launcher")
    def dde_launcher_method_click_search_box_by_attr(self):
        """在启动器中点击搜索框"""
        self.dde_launcher_method_click_by_attr("Editable_dlineeditchildlineedit")

    def dde_launcher_method_click_by_attr(self, path):
        """在启动器中通过元素点击"""
        self.dog.element_click(path)

    def dde_launcher_method_right_click_by_attr(self, path):
        """在启动器中通过元素右键点击"""
        self.dog.element_click(path, button=3)

    def dde_launcher_method_click_all_categories_or_back_by_attr(self):
        """点击启动器下方的 所有分类 或者 返回"""
        self.dde_launcher_method_click_by_attr("AllIcon")

    def dde_launcher_method_click_system_manager_in_all_categories_view(self):
        """在启动器的 所有分类 界面点击 系统管理"""
        self.base_method_click_by_ocr("系统管理")
