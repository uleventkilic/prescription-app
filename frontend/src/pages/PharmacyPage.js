import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PharmacyPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patientDetails, setPatientDetails] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [viewingPrescription, setViewingPrescription] = useState(null);
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState('');
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/patients', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                alert('Failed to load patients.');
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/medicines', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setMedicines(response.data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchMedicines();
    }, []);

    const handlePatientSelect = async (e) => {
        const patientId = e.target.value;
        setSelectedPatient(patientId);

        const patient = patients.find((p) => p._id === patientId);
        setPatientDetails(patient);

        if (patient && patient._id) {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/v1/patients/id/${patientId}/prescriptions`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                alert('Failed to load prescriptions for the selected patient.');
            }
        }
    };

    const handleViewDetails = async (prescriptionId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/v1/prescriptions/${prescriptionId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setViewingPrescription(response.data);
            setAddedMedicines(
                response.data.medicines.map((med) => ({
                    medicine: {
                        ...med.medicine,
                        price: med.medicine.price || 0,
                    },
                    quantity: med.quantity,
                }))
            );
        } catch (error) {
            console.error('Error fetching prescription details:', error);
            alert('Failed to load prescription details.');
        }
    };

    const handleAddMedicine = () => {
        if (!selectedMedicine || !quantity) {
            alert('Please select a medicine and enter a quantity.');
            return;
        }

        const medicine = medicines.find((m) => m._id === selectedMedicine);
        setAddedMedicines([...addedMedicines, { medicine, quantity }]);
        setSelectedMedicine('');
        setQuantity('');
    };

    const handleRemoveMedicine = (medicineId) => {
        setAddedMedicines(addedMedicines.filter((med) => med.medicine._id !== medicineId));
    };

    const calculateTotalPrice = () => {
        return addedMedicines.reduce(
            (total, med) => total + (med.medicine.price || 0) * med.quantity,
            0
        ).toFixed(2);
    };

    const handleUpdatePrescription = async () => {
        if (!viewingPrescription || addedMedicines.length === 0) {
            alert('Please add at least one medicine.');
            return;
        }

        const prescriptionData = {
            medicines: addedMedicines.map((med) => ({
                medicine: med.medicine._id,
                quantity: med.quantity,
            })),
        };

        try {
            await axios.put(
                `http://localhost:5000/api/v1/prescriptions/${viewingPrescription._id}`,
                prescriptionData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert('Prescription updated successfully!');
            setViewingPrescription(null);
            setAddedMedicines([]);
        } catch (error) {
            console.error('Error updating prescription:', error);
            alert('Failed to update prescription.');
        }
    };

    return (
        <div>
            <h1>Pharmacy Dashboard</h1>
            <div>
                <label>Patient:</label>
                <select value={selectedPatient} onChange={handlePatientSelect}>
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.name} - {patient.tcNo}
                        </option>
                    ))}
                </select>
            </div>
            {patientDetails && (
                <div>
                    <h3>Patient Details</h3>
                    <p><strong>Fullname:</strong> {patientDetails.name}</p>
                    <p><strong>TC ID No:</strong> {patientDetails.tcNo}</p>
                </div>
            )}
            {viewingPrescription ? (
                <div>
                    <h2>Edit Prescription</h2>
                    <div>
                        <label>Medicine:</label>
                        <select
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                        >
                            <option value="">Select a medicine</option>
                            {medicines.map((medicine) => (
                                <option key={medicine._id} value={medicine._id}>
                                    {medicine.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Quantity"
                        />
                        <button onClick={handleAddMedicine}>Add Medicine</button>
                    </div>
                    <h3>Added Medicines:</h3>
                    <ul>
                        {addedMedicines.map((med, index) => (
                            <li key={index}>
                                {med.medicine.name} - {med.quantity} pcs - {med.medicine.price.toFixed(2)} TL each
                                <button onClick={() => handleRemoveMedicine(med.medicine._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total Price: {calculateTotalPrice()} TL</h3>
                    <button onClick={handleUpdatePrescription}>Update Prescription</button>
                </div>
            ) : (
                <div>
                    <h2>Patient's Prescription History</h2>
                    {prescriptions.length > 0 ? (
                        <table className="prescriptions-table">
                            <thead>
                                <tr>
                                    <th>Prescription ID</th>
                                    <th>Medicines</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map((prescription) => (
                                    <tr key={prescription._id}>
                                        <td>{prescription._id}</td>
                                        <td>
                                            {prescription.medicines.map((med) => (
                                                <div key={med.medicine._id}>
                                                    {med.medicine.name} - (x{med.quantity})
                                                </div>
                                            ))}
                                        </td>
                                        <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleViewDetails(prescription._id)}>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No prescriptions found for the selected patient.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PharmacyPage;
