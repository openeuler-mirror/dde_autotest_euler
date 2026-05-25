import pytest

from src import sleep
from src import Src
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1450519(self):
        dock = DdeDockPublicWidget()
        dde = DdeMethod()
        DdeMethod().dde_dock.double_click_by_ocr("testdir")

        """新建办公文档"""
        Src.right_click(350, 350)
        dde.dde_dock.click_by_ocr("新建文档")
        dde.dde_dock.click_by_ocr("办公文档")
        self.assert_image_exist_in_dde('test_dde_1450519_doc.png')

        """新建电子表格"""
        Src.right_click(350, 350)
        dde.dde_dock.click_by_ocr("新建文档")
        dde.dde_dock.click_by_ocr("电子表格")
        self.assert_image_exist_in_dde('test_dde_1450519_xls.png')

        """新建演示文档"""
        Src.right_click(350, 350)
        dde.dde_dock.click_by_ocr("新建文档")
        dde.dde_dock.click_by_ocr("演示文档")
        self.assert_image_exist_in_dde('test_dde_1450519_ppt.png')

        """新建文本文档"""
        Src.right_click(350, 350)
        dde.dde_dock.click_by_ocr("新建文档")
        dde.dde_dock.click_by_ocr("文本文档")
        self.assert_image_exist_in_dde('test_dde_1450519_txt.png')

        DdeMethod().kill_process('dde-file-manager')

        Cmd.run_cmd("mkdir ~/Desktop/testdir_read;chmod 444 ~/Desktop/testdir_read ")
        DdeMethod().dde_dock.double_click_by_ocr("testdir_read")
        Src.right_click(350, 350)

        self.assert_image_exist_in_dde('test_dde_1450519_new.png')
        DdeMethod().kill_process('dde-file-manager')

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1940063(self):
        """前置和后置"""
        Cmd.run_cmd("mkdir ~/Desktop/testdir ")
        yield
        DdeMethod().kill_process('dde-file-manager')
        Cmd.run_cmd("rm -rf ~/Desktop/testdir ~/Desktop/testdir_read")
