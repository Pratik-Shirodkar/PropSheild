import os
import csv
import json
import sys

def calculate_score(rent_roll_path):
    total_income = 0
    late_payments = 0
    total_tenants = 0

    try:
        with open(rent_roll_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                total_tenants += 1
                rent = float(row['Monthly_Rent'])
                status = row['Payment_Status'].strip().lower()

                if status == 'paid':
                    total_income += rent
                elif status == 'late':
                    late_payments += 1
                
                # Simple logic: Late payment doesn't count towards income 
                # (or we could count it but penalize score)
    except FileNotFoundError:
        print(f"Error: File not found at {rent_roll_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(1)

    # Score Calculation (0-100)
    # Base score 100
    # -10 for each late payment
    score = 100 - (late_payments * 10)
    if score < 0:
        score = 0
    
    # Risk Assessment
    risk = "LOW"
    if score < 80:
        risk = "MEDIUM"
    if score < 50:
        risk = "HIGH"

    return {
        "verified_annual_income": total_income * 12, # Annualized
        "credit_score": score,
        "risk_rating": risk,
        "tenant_count": total_tenants,
        "late_payments": late_payments
    }

def main():
    # In iExec TEE, input files are usually in /iexec_in
    # We allow overriding via env var or arg for local testing
    input_dir = os.environ.get("IEXEC_IN", ".")
    output_dir = os.environ.get("IEXEC_OUT", ".")
    
    input_file = os.path.join(input_dir, "rent_roll.csv")
    
    print(f"Processing data from {input_file}...")
    
    result = calculate_score(input_file)
    
    # Save result to /iexec_out/result.json (standard iExec output)
    # Also usually we write a 'computed.json' or strict output file.
    # For this demo, we'll write a JSON.
    
    output_file = os.path.join(output_dir, "result.json")
    
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
        
    print(f"Computation complete. Results saved to {output_file}")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
