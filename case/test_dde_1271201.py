from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271201(self):
        """检查设备管理器的设备信息导出"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shebeiguanliqi")
        sleep(6)
        euler.export_file_by_attr("概况")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.deepin_editor.choose_open_file_option_by_ocr()
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        Src.ctrl_a()
        Src.enter()
        sleep(2)
        self.assert_ocr_exist("概况", "处理器", "CPU数量", "内存")

    def teardown_method(self):
        """通过命令删除测试文件，关闭设备管理器以及文本编辑器器"""
        DdeMethod().dde_dock.kill_process_by_cmd("deepin-devicemanager")
        DdeMethod().dde_dock.kill_process_by_cmd("deepin-editor")
        DdeMethod().dde_dock.delete_all_file_in_documents_by_cmd()
        sleep(3)
