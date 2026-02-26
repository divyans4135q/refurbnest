import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee, Calendar, Percent, Info, TrendingUp } from 'lucide-react';

const EMICalculator = () => {
    const [price, setPrice] = useState(50000);
    const [downPayment, setDownPayment] = useState(10000);
    const [interestRate, setInterestRate] = useState(0);
    const [months, setMonths] = useState(12);

    const [emi, setEmi] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    const calculateEMI = () => {
        // Base Principal to finance
        const principal = Math.max(0, price - downPayment);

        // Custom formula requested: EMI = (P - D) / N + Interest
        let baseEmi = principal / months;
        let totalInt = 0;

        if (interestRate > 0) {
            // Apply standard simple interest for the loan structure
            totalInt = principal * (interestRate / 100) * (months / 12);
            baseEmi += (totalInt / months);
        }

        const exactEmi = isNaN(baseEmi) || !isFinite(baseEmi) ? 0 : baseEmi;

        setEmi(Math.round(exactEmi));
        setTotalInterest(Math.round(totalInt));
        setTotalPayment(Math.round(exactEmi * months + downPayment));
    };

    useEffect(() => {
        calculateEMI();
    }, [price, downPayment, interestRate, months]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="emi-page section" style={{ marginTop: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}
                >
                    Smart <span style={{ color: 'var(--primary)' }}>EMI Calculator</span>
                </motion.h1>
                <p style={{ color: 'var(--gray)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Plan your purchase with zero-surprise EMIs. Calculate monthly installments for your dream gadgets.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                {/* Inputs Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass"
                    style={{ padding: '2.5rem', borderRadius: '24px', background: 'white' }}
                >
                    <div style={{ display: 'grid', gap: '2.5rem' }}>
                        {/* Price of device */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee size={18} color="var(--primary)" /> Product Price (P)
                                </label>
                                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>{formatCurrency(price)}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="500000"
                                step="1000"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                style={rangeStyle}
                            />
                        </div>

                        {/* Down Payment */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee size={18} color="var(--primary)" /> Down Payment (D)
                                </label>
                                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>{formatCurrency(downPayment)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={price}
                                step="1000"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                style={rangeStyle}
                            />
                        </div>

                        {/* Months */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={18} color="var(--primary)" /> Tenure in Months (N)
                                </label>
                                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>{months} Months</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="60"
                                step="1"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                style={rangeStyle}
                            />
                        </div>

                        {/* Optional Interest Rate */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Percent size={18} color="var(--primary)" /> Interest Rate (Optional)
                                </label>
                                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}>{interestRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="0.5"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                style={rangeStyle}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gray)' }}>
                                <span>0%</span>
                                <span>30%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'grid', gap: '1.5rem' }}
                >
                    <div className="glass" style={{
                        padding: '2.5rem',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: 'white',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', fontWeight: 500 }}>Monthly Installment</p>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: '1rem 0' }}>{formatCurrency(emi)}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                            <TrendingUp size={20} />
                            <span>Affordable payment plan</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
                            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 600 }}>Total Interest</p>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>{formatCurrency(totalInterest)}</h3>
                        </div>
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
                            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 600 }}>Total Payable</p>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark)' }}>{formatCurrency(totalPayment)}</h3>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(13, 148, 136, 0.05)',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        border: '1px dashed var(--primary)',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start'
                    }}>
                        <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                            *This is an indicative calculator. Actual EMI and interest rates may vary based on credit score and lender policies.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem' }}
                        onClick={() => alert(`Checking EMI eligibility for a loan of ₹${loanAmount.toLocaleString()}...`)}
                    >
                        Check Eligibility
                    </button>
                </motion.div>
            </div>

            <style>{`
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: var(--primary);
                    cursor: pointer;
                    margin-top: -8px;
                    box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.3);
                    border: 3px solid white;
                    transition: 0.2s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    background: var(--primary-dark);
                }
            `}</style>
        </div>
    );
};

const rangeStyle = {
    marginTop: '1rem'
};

export default EMICalculator;
