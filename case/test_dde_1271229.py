from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.dde_fcitx_config_method import DeepinFcitxConfigMethod
from src import Src

class TestDdeCase(BaseCase):

    def test_dde_1271229_1(self):
        """输入法配置-关闭输入法-右上角x号关闭"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shurufapeizhi")
        sleep(6)
        DeepinFcitxConfigMethod().close_by_x()

        process_num = Src.get_daemon_process_num("fcitx-config-gtk3")
        self.assert_equal(0, process_num)

    def test_dde_1271229_2(self):
        """输入法配置-关闭输入法-弹出菜单栏关闭"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shurufapeizhi")
        DeepinFcitxConfigMethod().close_by_menu()
        process_num = Src.get_daemon_process_num("fcitx-config-gtk3")
        self.assert_equal(0, process_num)



    # def teardown_method(self):
    #     """通过命令关闭日志收集工具"""
    #     DdeMethod().kill_process("fcitx-config-gtk3")
