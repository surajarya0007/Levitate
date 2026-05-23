import requests
import time
import sys
import os

BASE_URL = "http://localhost:8000"

def test_job_lifecycle():
    print(f"Triggering job at {BASE_URL}/generate...")
    try:
        resp = requests.post(f"{BASE_URL}/generate", json={"prompt": "Test Website"})
        resp.raise_for_status()
    except Exception as e:
        print(f"Failed to trigger job: {e}")
        sys.exit(1)
        
    data = resp.json()
    job_id = data["job_id"]
    print(f"Job started with ID: {job_id}")
    
    status = "UNKNOWN"
    while status not in ["DONE", "FAILED"]:
        try:
            resp = requests.get(f"{BASE_URL}/status/{job_id}")
            resp.raise_for_status()
            data = resp.json()
            status = data["status"]
            print(f"Status: {status}")
            if status in ["DONE", "FAILED"]:
                print(f"Final Result: {data}")
                break
        except Exception as e:
            print(f"Error polling status: {e}")
        
        time.sleep(1)

    if status == "DONE":
        print("SUCCESS: Job completed successfully.")
        
        # Verify file generation
        base_dir = os.path.dirname(os.path.abspath(__file__))
        app_page_path = os.path.join(base_dir, "..", "templates", "nextjs-landing", "app", "page.tsx")
        
        if os.path.exists(app_page_path):
             print(f"SUCCESS: Generated file found at {app_page_path}")
             with open(app_page_path, "r") as f:
                 content = f.read()
                 if "import" in content and "export default function" in content:
                     print("SUCCESS: File content looks valid.")
                 else:
                     print("FAILURE: File content invalid.")
                     sys.exit(1)
        else:
            print(f"FAILURE: Generated file NOT found at {app_page_path}")
            sys.exit(1)
            
    else:
        print("FAILURE: Job failed.")
        sys.exit(1)

if __name__ == "__main__":
    test_job_lifecycle()
