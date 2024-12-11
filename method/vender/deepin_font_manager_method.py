from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import Src, sleep


class DeepinFontManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-font-manager")

    def method_click_by_attr(self, path):
        """在字体管理器中通过元素点击"""
        self.dog.element_click(path)

    def method_click_search_box_attr(self):
        """在字体管理器中点击搜索框"""
        self.method_click_by_attr("DSearchEditIconButton")

    def method_click_menu(self):
        """字体管理其中点击菜单"""
        self.click_by_img("dde_fonts_menu_icon.png")
        # self.method_click_by_attr("添加字体")

    def method_click_add_font(self):
        """菜单添加字体"""
        self.click(*self.ocr("添加字体"))

    def method_search_fonts(self, fonts_path):
        """字体文件路径查找字体"""
        self.click_by_img("dde_fonts_search_icon.png")
        Src.input_message(fonts_path)
        sleep(6)
        Src.enter()
        sleep(2)

    def method_import_one_fonts(self):
        """选择一个字体添加"""
        self.click_by_ocr("fangzhenglvjiandexingkai")
        self.click(*self.ocr("打开"))

    def method_import_many_fonts(self):
        """添加多个字体"""
        self.click_by_ocr("fangzhenglvjiandexingkai")
        Src.ctrl_a()
        self.click(*self.ocr("打开"))

    def search_font_in_font_manager(self, font_name):
        """在字体管理器中搜索字体"""
        self.deepin_font_manager.method_click_search_box_attr()
        self.input_message(font_name)
        sleep(3)
        self.enter()

    def method_del_font(self, font_name=None):
        """删除字体"""
        if font_name:
            self.search_font_in_font_manager(font_name)
            self.click_by_ocr(font_name)
        Src.delete()
        self.click_by_img("dde_fonts_delete_btn_icon.png")


