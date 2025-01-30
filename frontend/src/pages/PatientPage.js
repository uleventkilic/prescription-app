import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const userId = localStorage.getItem('userId'); // Hasta ID'si
                const response = await axios.get(`http://localhost:5000/api/v1/prescriptions/patient/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                alert('Failed to load prescriptions.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    return (
        <div className="patient-page">
            <h1>My Prescriptions</h1>
            {loading ? (
                <p>Loading prescriptions...</p>
            ) : prescriptions.length === 0 ? (
                <p>No prescriptions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Prescription ID</th>
                            <th>Doctor</th>
                            <th>Medicines</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((prescription) => (
                            <tr key={prescription._id}>
                                <td>{prescription._id}</td>
                                <td>{prescription.doctor?.name || 'Unknown'}</td>
                                <td>
                                    {prescription.medicines.map((med) => (
                                        <div key={med.medicine._id}>
                                            {med.medicine.name} - {med.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PatientPage;
