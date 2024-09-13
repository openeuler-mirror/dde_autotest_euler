from pylinuxauto import sleep, find_element_by_attr_path
import pylinuxauto
from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271319_1(self):
        """任务栏-应用区域的添加&移除"""
        euler = DdeMethod()
        euler.dde_dock_method_click_launcher_btn_by_attr()
        euler.dde_launcher_method_click_search_box_by_attr()
        pylinuxauto.input("kantu")
        sleep(2)
        euler.dde_launcher_method_right_click_by_attr("看图")
        pylinuxauto.select_menu(3)
        sleep(2)
        self.assert_element_exist("/dde-dock/Btn_看图")
        euler.dde_launcher_method_right_click_by_attr("看图")
        pylinuxauto.select_menu(3)
        sleep(2)
        self.assert_element_not_exist("/dde-dock/Btn_看图")

    def test_dde_1271319_2(self):
        """任务栏-应用区域的添加&移除"""
        euler = DdeMethod()
        euler.dde_dock_method_click_launcher_btn_by_attr()
        euler.dde_launcher_method_click_search_box_by_attr()
        pylinuxauto.input("kantu")
        sleep(2)
        euler.dde_launcher_method_right_click_by_attr("看图")
        pylinuxauto.select_menu(3)
        pylinuxauto.win()
        sleep(2)
        self.assert_element_exist("/dde-dock/Btn_看图")
        euler.dde_dock_method_right_click_by_attr("Btn_看图")
        pylinuxauto.select_menu(2)
        sleep(2)
        self.assert_element_not_exist("/dde-dock/Btn_看图")

    def teardown_method(self):
        """通过命令关闭启动器"""
        DdeMethod().base_method_kill_process_by_cmd("dde-launcher")
        sleep(3)
