from apps.dde_autotest_euler.method.base_method import BaseMethod


class DeepinFontManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-font-manager")
    def dde_font_manager_method_click_by_attr(self, path):
        """在字体管理器中通过元素点击"""
        self.dog.element_click(path)

    def dde_font_manager_method_click_search_box_attr(self):
        """在字体管理器中点击搜索框"""
        self.dde_font_manager_method_click_by_attr("DSearchEditIconButton")
