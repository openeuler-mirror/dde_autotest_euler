import random
import string

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod

from src import CmdCtl as Cmd
from src import Src, sleep


from apps.dde_autotest_euler.config import config


class TestDdeCase(BaseCase):

    def setup(self):
        rtail = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        self.dir = f"/tmp/test_dde_1271107_{rtail}"
        Cmd.run_cmd(f"mkdir {self.dir}")
        Cmd.run_cmd(f"cp {config.ASSERT_RES}/test_dde_1271107.pdf {self.dir}")
        Cmd.run_cmd(f"dde-file-manager {self.dir} &")
        sleep(2)

    def step_setup(self):
        euler = DdeMethod()
        euler.dde_dock.double_click_by_ocr("pdf")
        sleep(2)

    def test_dde_1271107(self):
        self.step_setup()
        euler = DdeMethod()

        # Add book mark, save by menu
        euler.dde_dock.right_click_by_ocr("测试文件PDF")
        sleep(2)
        Src.select_menu(2)
        sleep(2)
        self.assert_image_exist_in_dde("test_dde_1271107_1.png")
        Src.ctrl_s()
        sleep(0.5)
        self.assert_ocr_exist("保存成功")

        # Add custom marks, make save by ctrl + S
        euler.dde_dock.right_click_by_ocr("测试文件PDF")
        sleep(2)
        Src.select_menu(3)
        sleep(1)
        euler.dde_dock.click_by_img("dde_reader_comment.png")
        sleep(1)
        Src.input("hello")
        Src.hot_key("esc")
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        sleep(1)
        euler.dde_dock.click_by_ocr("保存")
        sleep(0.5)
        self.assert_ocr_exist("保存成功")

        Src.alt_f4()

        # reopen file, check the book mark and mark has been saved.
        self.step_setup()
        self.assert_image_exist_in_dde("test_dde_1271107_1.png")
        self.assert_image_exist_in_dde("test_dde_1271107_2.png")

    def teardown(self):
        Src.alt_f4()
        DdeMethod().kill_process("dde-reader")
        DdeMethod().kill_process("dde-file-manager")
        Cmd.run_cmd(f"rm -rf {self.dir}")
        DdeMethod().click_restore()
