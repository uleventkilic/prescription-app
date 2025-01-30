import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorPage.css';

const DoctorPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patientDetails, setPatientDetails] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState('');
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [editingPrescription, setEditingPrescription] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/patients', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
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

        if (patient && patient.tcNo) {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/prescriptions/patient/${patientId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                alert('Failed to load prescriptions for the selected patient.');
            }
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

    const handleSavePrescription = async () => {
        if (!selectedPatient || addedMedicines.length === 0) {
            alert('Please select a patient and add at least one medicine.');
            return;
        }

        const prescriptionData = {
            doctorId: localStorage.getItem('userId'),
            patientId: selectedPatient,
            medicines: addedMedicines.map((med) => ({
                medicine: med.medicine._id,
                quantity: med.quantity,
            })),
        };

        try {
            if (editingPrescription) {
                await axios.put(
                    `http://localhost:5000/api/v1/prescriptions/${editingPrescription._id}`,
                    prescriptionData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                alert('Prescription updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/v1/prescriptions', prescriptionData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                alert('Prescription created successfully!');
            }
            setAddedMedicines([]);
            setEditingPrescription(null);
        } catch (error) {
            console.error('Error saving prescription:', error);
            alert('Failed to save prescription.');
        }
    };

    const handleEditPrescription = (prescription) => {
        setEditingPrescription(prescription);
        setAddedMedicines(
            prescription.medicines.map((med) => ({
                medicine: med.medicine,
                quantity: med.quantity,
            }))
        );
    };

    const handleRemoveMedicine = (medicineId) => {
        setAddedMedicines(addedMedicines.filter((med) => med.medicine._id !== medicineId));
    };

    return (
        <div>
            <h1>Prescription Management</h1>
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
                    <p>Fullname: {patientDetails.name}</p>
                    <p>TC ID No: {patientDetails.tcNo}</p>
                </div>
            )}
            <div>
                <label>Medicine:</label>
                <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)}>
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
            <div>
                <h3>Added Medicines:</h3>
                <ul>
                    {addedMedicines.map((med, index) => (
                        <li key={index}>
                            {med.medicine.name} - {med.quantity}{' '}
                            <button onClick={() => handleRemoveMedicine(med.medicine._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleSavePrescription}>
                {editingPrescription ? 'Update Prescription' : 'Create Prescription'}
            </button>
            <div>
                <h2>Patient's Prescription History</h2>
                <table>
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
                                            {med.medicine.name} - {med.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEditPrescription(prescription)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorPage;
