from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_159819(self):
        """控制中心中显示所有菜单"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        Src.hot_key("winleft", "up")
        sleep(6)
        self.assert_ocr_exist('显示', '默认程序', '个性化', '通知', '声音',
                         '时间日期', '电源管理', '鼠标', '键盘和语言', '系统信息')

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
