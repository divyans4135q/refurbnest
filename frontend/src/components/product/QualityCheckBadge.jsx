import React from 'react';
import { ShieldCheck } from 'lucide-react';

const QUALITY_CHECKS = [
    "Body frame alignment", "Screen scratch test", "Screen crack detection", "Dead pixel test", "Touch responsiveness",
    "Button functionality", "SIM tray condition", "Camera lens scratches", "Speaker grill condition", "Cosmetic grading (A/B/C)",
    "Battery health %", "Charging speed test", "Charging port check", "Overheating test", "Battery cycle count",
    "Power button response", "Backup duration test", "Rear camera focus", "Front camera clarity", "Flash test",
    "Microphone clarity", "Loudspeaker test", "Earpiece audio test", "WiFi connectivity", "Bluetooth pairing",
    "GPS accuracy", "Mobile network strength", "Fingerprint sensor", "Face unlock", "Proximity sensor",
    "Accelerometer & Gyroscope", "Processor benchmark", "RAM stability", "Storage health", "OS authenticity",
    "Latest update installed", "Factory reset verification", "IMEI verification", "No blacklisting check", "App installation test",
    "Stress performance test", "Data wipe certification", "Anti-virus scan", "Water damage indicator check", "Internal hardware scan",
    "Final quality audit", "Cleaning & sanitization", "Secure packaging", "Refurbnest Quality Seal Approval"
];

const QualityCheckBadge = ({ isChecked }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    if (!isChecked) return null;

    return (
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <div
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#f0fdf4', color: '#16a34a', padding: '0.6rem 1rem',
                    borderRadius: '50px', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', border: '1px solid #bbf7d0'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <ShieldCheck size={20} /> 49/49 Tests Passed
            </div>

            {isOpen && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem',
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    textAlign: 'left'
                }}>
                    {QUALITY_CHECKS.map((check, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--dark)' }}>
                            <ShieldCheck size={14} color="#16a34a" style={{ flexShrink: 0 }} /> {check}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QualityCheckBadge;
