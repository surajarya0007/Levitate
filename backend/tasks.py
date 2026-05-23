import time
import os
import shutil
from worker import celery_app
from agents.planner_agent import PlannerAgent
from agents.ui_agent import UiAgent
from agents.fixer_agent import FixerAgent
from build_manager import BuildManager
from deployment_manager import DeploymentManager

# Job States
JOB_STATES = {
    "CREATED": "CREATED",
    "PLANNING": "PLANNING",
    "GENERATING": "GENERATING",
    "BUILDING": "BUILDING",
    "DEPLOYING": "DEPLOYING",
    "DONE": "DONE",
    "FAILED": "FAILED",
}

@celery_app.task(bind=True)
def generate_website(self, prompt: str):
    """
    Background task for website generation lifecycle.
    """
    # Helper to update state with optional log messages
    def update_state(state, logs=""):
        self.update_state(state=state, meta={"status": state, "logs": logs})

    try:
        # Initial State
        update_state(JOB_STATES["CREATED"])
        time.sleep(1)

        # Planning
        update_state(JOB_STATES["PLANNING"], "Analyzing prompt and creating site architecture...")

        planner = PlannerAgent()
        site_plan = planner.plan_website(prompt)

        total_features = sum(len(p.features) for p in site_plan.pages)
        update_state(JOB_STATES["PLANNING"], f"Site plan ready: {site_plan.site_name} — {len(site_plan.pages)} page(s), {total_features} section(s)")
        time.sleep(1)

        # Generating
        update_state(JOB_STATES["GENERATING"], "Starting code generation...")

        # Directory setup
        base_dir = os.path.dirname(os.path.abspath(__file__))
        template_dir = os.path.join(base_dir, "..", "templates", "nextjs-landing")

        # Ensure components directory is clean
        components_dir = os.path.join(template_dir, "components")
        if os.path.exists(components_dir):
            shutil.rmtree(components_dir)
        os.makedirs(components_dir)

        ui_agent = UiAgent()

        # Batch generation
        print("Generating site files...")
        project_files = ui_agent.generate_site(site_plan)

        files_written = []
        # STRICT ALLOW-LIST ENFORCEMENT
        for file_path, code in project_files.files.items():
            # Validate path
            is_valid_component = file_path.startswith("components/") and file_path.endswith(".tsx")
            is_valid_page = file_path == "app/page.tsx"

            if not (is_valid_component or is_valid_page):
                print(f"SECURITY WARNING: Agent attempted to write to restricted file: {file_path}. SKIPPING.")
                continue

            # Construct full path
            full_path = os.path.join(template_dir, file_path)

            # Additional safety: Ensure path stays within template_dir
            if os.path.commonpath([os.path.abspath(full_path), os.path.abspath(template_dir)]) != os.path.abspath(template_dir):
                 print(f"SECURITY WARNING: Path traversal detected: {file_path}. SKIPPING.")
                 continue

            # Ensure directory exists (for components/)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            # Write file
            with open(full_path, "w") as f:
                f.write(code)
            files_written.append(file_path)
            print(f"Wrote file: {file_path}")
            update_state(JOB_STATES["GENERATING"], f"Generated {len(files_written)} file(s): {', '.join(files_written)}")



        # Building & Self-Healing Loop
        update_state(JOB_STATES["BUILDING"], "Starting Docker build...")

        sandbox_dir = os.path.join(base_dir, "..", "sandbox")
        build_manager = BuildManager(sandbox_dir)

        # Keep track of current file state for the fixer
        current_files_state = project_files.files.copy()

        max_retries = 3
        build_success = False
        final_logs = ""

        for attempt in range(max_retries + 1):
            attempt_msg = f"Build attempt {attempt + 1}/{max_retries + 1}"
            print(f"{attempt_msg}...")
            update_state(JOB_STATES["BUILDING"], f"{attempt_msg} — Running npm install && next build...")

            # Run Build
            success, logs = build_manager.run_build(template_dir)
            final_logs = logs

            if success:
                build_success = True
                update_state(JOB_STATES["BUILDING"], f"Build succeeded on attempt {attempt + 1}")
                print("Build SUCCESS.")
                break

            # If not successful and we have retries left -> FIX IT
            if attempt < max_retries:
                print(f"Build FAILED. Attempting to auto-fix (Replanning)...")
                update_state(JOB_STATES["BUILDING"], f"Build failed on attempt {attempt + 1}. Auto-fixing with FixerAgent...")
                try:
                    fixer = FixerAgent()
                    print(f"Running FixerAgent...")
                    # Ask Fixer for changes
                    fixes = fixer.fix_code(logs, current_files_state)

                    fixed_files = []
                    # Apply changes to disk and memory
                    for file_path, code in fixes.files.items():
                        full_path = os.path.join(template_dir, file_path)
                        # Ensure dir exists
                        os.makedirs(os.path.dirname(full_path), exist_ok=True)
                        with open(full_path, "w") as f:
                            f.write(code)
                        fixed_files.append(file_path)
                        print(f"Fixer updated: {file_path}")

                        # Update memory state
                        current_files_state[file_path] = code

                    update_state(JOB_STATES["BUILDING"], f"FixerAgent patched {len(fixed_files)} file(s). Retrying build...")

                except Exception as fix_error:
                    print(f"FixerAgent failed: {fix_error}")
                    update_state(JOB_STATES["BUILDING"], f"FixerAgent error: {fix_error}. Retrying build anyway...")

        if not build_success:
            print("Build FAILED after retries.")
            return {
                "status": JOB_STATES["FAILED"],
                "message": f"Build failed after {max_retries} auto-fix attempts",
                "logs": final_logs,
                "plan": site_plan.model_dump()
            }

        # Deploying
        update_state(JOB_STATES["DEPLOYING"], "Uploading to Vercel...")

        vercel_token = os.getenv("VERCEL_TOKEN")
        if not vercel_token:
            print("WARNING: VERCEL_TOKEN not found. Skipping deployment.")
            deploy_url = None
            deploy_logs = "VERCEL_TOKEN not found. Deployment skipped."
        else:
            deployer = DeploymentManager(vercel_token)
            print("Starting deployment...")
            update_state(JOB_STATES["DEPLOYING"], "Deploying to Vercel edge network...")
            d_success, d_logs, deploy_url = deployer.deploy(template_dir)

            if not d_success:
                print(f"Deployment FAILED. Logs: {d_logs}")
                return {
                     "status": JOB_STATES["FAILED"],
                     "message": "Deployment failed",
                     "logs": logs + "\n\nDEPLOYMENT LOGS:\n" + d_logs,
                     "plan": site_plan.model_dump()
                }
            print(f"Deployment SUCCESS: {deploy_url}")
            deploy_logs = d_logs


        # Done
        return {
            "status": JOB_STATES["DONE"],
            "message": "Website generation complete",
            "prompt": prompt,
            "plan": site_plan.model_dump(),
            "build_logs": logs,
            "deploy_url": deploy_url
        }

    except Exception as e:
        self.update_state(state=JOB_STATES["FAILED"], meta={"error": str(e)})
        raise e
