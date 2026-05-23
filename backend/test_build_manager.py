import unittest
from unittest.mock import patch, MagicMock
import os
import shutil
from build_manager import BuildManager

class TestBuildManager(unittest.TestCase):
    def setUp(self):
        self.sandbox_dir = os.path.abspath("../sandbox")
        self.project_path = os.path.abspath("../templates/nextjs-landing")
        self.bm = BuildManager(self.sandbox_dir)

    @patch('subprocess.run')
    def test_build_image_success(self, mock_run):
        # Mock successful build
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_run.return_value = mock_result
        
        # Create dummy Dockerfile for existence check
        os.makedirs(self.sandbox_dir, exist_ok=True)
        with open(os.path.join(self.sandbox_dir, "Dockerfile"), "w") as f:
            f.write("FROM node")

        success = self.bm.build_image()
        self.assertTrue(success)
        mock_run.assert_called_with(
            ["docker", "build", "-t", "levitate-build-agent:latest", self.sandbox_dir],
            capture_output=True, text=True, check=True
        )

    @patch('subprocess.run')
    def test_run_build_success(self, mock_run):
        # Mock successful image build and run
        mock_result_build = MagicMock()
        mock_result_build.returncode = 0
        
        mock_result_run = MagicMock()
        mock_result_run.returncode = 0
        mock_result_run.stdout = "Build finished"
        mock_result_run.stderr = ""
        
        # Side effect: first call is build (optional if mocked inside build_image), but here we mock subprocess.run generically
        # Better to mock build_image and just test run_build logic
        
        # Mock build_image method to always return True
        with patch.object(BuildManager, 'build_image', return_value=True):
             mock_run.return_value = mock_result_run
             
             success, logs = self.bm.run_build(self.project_path)
             
             self.assertTrue(success)
             self.assertIn("Build finished", logs)
             
             # Check command arguments
             args = mock_run.call_args[0][0]
             self.assertEqual(args[0], "docker")
             self.assertEqual(args[1], "run")
             self.assertIn("--cpus=1.0", args)
             self.assertIn(f"{self.project_path}:/app", args[6]) # Volume mount check

    @patch('subprocess.run')
    def test_run_build_failure(self, mock_run):
         with patch.object(BuildManager, 'build_image', return_value=True):
             mock_result_run = MagicMock()
             mock_result_run.returncode = 1
             mock_result_run.stderr = "npm install failed"
             mock_run.return_value = mock_result_run
             
             success, logs = self.bm.run_build(self.project_path)
             
             self.assertFalse(success)
             self.assertIn("npm install failed", logs)

if __name__ == '__main__':
    unittest.main()
