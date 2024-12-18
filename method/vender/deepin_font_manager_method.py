from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import Src, sleep


class DeepinFontManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-font-manager")

    def method_click_by_attr(self, path):
        """在字体管理器中通过元素点击"""
        self.dog.element_click(path)

    def method_click_font_by_ocr(self, font_name):
        """通过ocr点击字体"""
        self.click_by_ocr(font_name)

    def method_click_search_box_attr(self):
        """在字体管理器中点击搜索框"""
        self.method_click_by_attr("DSearchEditIconButton")

    def method_click_menu_by_image(self):
        """字体管理其中点击菜单"""
        self.click_by_img("dde_fonts_menu_icon.png")

    def method_click_add_font_by_ocr(self):
        """菜单添加字体"""
        self.click(*self.ocr("添加字体"))

    def method_click_activated_by_ocr(self):
        """点击已激活"""
        self.click(*self.ocr("已激活"))

    def method_click_user_fonts_by_ocr(self):
        """点击用户字体"""
        self.click(*self.ocr("用户字体"))

    def method_forbidden_font_by_ocr(self, font_name):
        """禁用字体"""
        self.right_click(*self.ocr(font_name))
        self.right_click(*self.ocr("禁用字体"))

    def method_active_font_by_ocr(self, font_name):
        """启用字体"""
        self.right_click(*self.ocr(font_name))
        self.right_click(*self.ocr("启用字体"))

    def method_search_fonts_by_image(self, fonts_path):
        """字体文件路径查找字体"""
        self.click_by_img("dde_fonts_search_icon.png")
        Src.input_message(fonts_path)
        sleep(6)
        Src.enter()
        sleep(2)

    def method_import_one_fonts_by_ocr(self, font_name="fangzhenglvjiandexingkai"):
        """选择一个字体添加"""
        self.click_by_ocr(font_name)
        self.click(*self.ocr("打开"))

    def method_import_many_fonts_by_ocr(self):
        """添加多个字体"""
        self.click_by_ocr("fangzhenglvjiandexingkai")
        Src.ctrl_a()
        self.click(*self.ocr("打开"))

    def method_del_font_by_image(self):
        """删除字体"""
        Src.delete()
        self.click_by_img("dde_fonts_delete_btn_icon.png")


