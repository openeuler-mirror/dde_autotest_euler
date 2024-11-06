from time import sleep

from apps.dde_autotest_euler.method.base_method import BaseMethod


class DdeControlCenterMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-control-center")
    def dde_control_center_method_click_by_attr(self, path):
        """在控制中心中通过元素点击"""
        self.dog.element_click(path)

    def dde_control_center_method_click_keyboard_and_language_by_attr(self):
        """在控制中心主界面中点击 键盘和语言"""
        self.dde_control_center_method_click_by_attr("键盘和语言")

    def dde_control_center_method_click_system_info_by_attr(self):
        """在控制中心主界面中点击 系统信息"""
        self.dde_control_center_method_click_by_attr("系统信息")

    def dde_control_center_method_click_keyboard_layout_by_attr(self):
        """在 键盘和语言 模块点击 键盘布局"""
        self.dde_control_center_method_click_by_attr("键盘布局")

    def dde_control_center_method_click_add_keyboard_layout_btn_by_attr(self):
        """点击 键盘布局 模块下方的加号按钮添加键盘布局"""
        self.dde_control_center_method_click_by_attr("Btn_addlayout")

    def dde_control_center_method_click_hanyu_keyboard_layout_at_list(self):
        """在 添加键盘布局 界面点击 汉语"""
        self.dde_control_center_method_click_by_attr("汉语")

    def dde_control_center_method_click_bottom_add_btn_by_attr(self):
        """点击 添加键盘布局 界面下方的添加按钮，从而确认添加"""
        self.dde_control_center_method_click_by_attr("Btn_添加")

    def dde_control_center_method_click_edit_btn_in_keyboard_layout(self):
        """点击 键盘布局 界面右侧的编辑按钮"""
        self.dde_control_center_method_click_by_attr("Btn_dcommandlinkbutton")

    def dde_control_center_click_delete_btn_by_img(self):
        """点击控制中心列表项目编辑状态下旁边的红色删除按钮"""
        self.base_method_click_by_img("delete_keyboard_layout_icon.png")

    def dde_control_center_enter_view_by_search_box(self, view_name):
        """通过控制中心上方的搜索框进入到对应的视图之中"""
        self.dde_control_center_method_click_by_attr("Editable_searchmodulelineedit")
        self.input_message(view_name)
        sleep(3)
        self.enter()
        sleep(1)

    def dde_control_center_method_click_edit_btn_in_system_language(self):
        """点击 系统语言 列表旁边的编辑按钮"""
        self.dde_control_center_method_click_by_attr("Btn_dcommandlinkbutton")

    def dde_control_center_method_click_automatic_login_btn_by_attr(self):
        """点击 账户 视图下的 自动登录 按钮"""
        self.dde_control_center_method_click_by_attr("Btn_自动登录")

    def dde_control_center_method_click_reset_password_btn_by_attr(self):
        """点击 账户 视图下非当前账户的 重设密码 按钮"""
        self.dde_control_center_method_click_by_attr("Btn_重设密码")

    def dde_control_center_method_reduce_password_effective_time(self):
        """账户视图下，减少账户密码有效时间"""
        self.dde_control_center_method_click_by_attr("Editable_dspinboxchilddlineedit")
        self.enter()

    def dde_control_center_method_click_add_dsl_btn(self):
        """在网络的dsl视图中点击添加按钮"""
        self.dde_control_center_method_click_by_attr("Btn_创建pppoe连接")

    def dde_control_center_method_click_time_synchronization_btn_by_attr(self):
        """在控制中心的 时间设置 模块点击 时间同步 按钮"""
        self.dde_control_center_method_click_by_attr("Btn_自动同步配置")

    def dde_control_center_method_click_time_setting_by_attr(self):
        """在时间与日期模块中点击 时间设置"""
        self.dde_control_center_method_click_by_attr("时间设置")
