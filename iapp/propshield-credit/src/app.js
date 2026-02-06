import fs from 'node:fs/promises';
import { IExecDataProtectorDeserializer } from '@iexec/dataprotector-deserializer';

/**
 * PropShield Credit Scoring iApp
 * 
 * This TEE application processes encrypted rent roll data and computes
 * a credit score without revealing tenant details.
 * 
 * Input: Protected data containing "rentRollCsv" field
 * Output: JSON with verified_annual_income, credit_score, risk_rating
 */

const main = async () => {
  const { IEXEC_OUT } = process.env;
  let computedJsonObj = {};

  try {
    console.log("PropShield Credit Scoring iApp starting...");

    // Deserialize protected data
    const deserializer = new IExecDataProtectorDeserializer();

    let rentRollCsv;
    try {
      rentRollCsv = await deserializer.getValue('rentRollCsv', 'string');
      console.log('Successfully decrypted protected rent roll data');
    } catch (e) {
      console.log('Error loading protected data:', e.message);
      throw new Error('Failed to load protected rent roll data');
    }

    // Parse CSV data
    const lines = rentRollCsv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    let totalIncome = 0;
    let latePayments = 0;
    let totalTenants = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });

      totalTenants++;
      const rent = parseFloat(row['Monthly_Rent'] || row['Rent'] || '0');
      const status = (row['Payment_Status'] || row['Status'] || '').toLowerCase();

      if (status === 'paid') {
        totalIncome += rent;
      } else if (status === 'late') {
        latePayments++;
      }
    }

    // Calculate credit score (0-100)
    let creditScore = 100 - (latePayments * 10);
    if (creditScore < 0) creditScore = 0;

    // Risk assessment
    let riskRating = "LOW";
    if (creditScore < 80) riskRating = "MEDIUM";
    if (creditScore < 50) riskRating = "HIGH";

    const result = {
      verified_annual_income: totalIncome * 12,
      credit_score: creditScore,
      risk_rating: riskRating,
      tenant_count: totalTenants,
      late_payments: latePayments,
      computed_at: new Date().toISOString()
    };

    console.log("Credit scoring complete:", JSON.stringify(result, null, 2));

    // Write result
    await fs.writeFile(`${IEXEC_OUT}/result.json`, JSON.stringify(result, null, 2));

    computedJsonObj = {
      'deterministic-output-path': `${IEXEC_OUT}/result.json`,
    };

  } catch (e) {
    console.error("PropShield iApp error:", e);
    computedJsonObj = {
      'deterministic-output-path': IEXEC_OUT,
      'error-message': e.message || 'Credit scoring computation failed',
    };
  } finally {
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );
  }
};

main();
