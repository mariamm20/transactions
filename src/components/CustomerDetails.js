import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [transactionsPerDay, setTransactionsPerDay] = useState({});

    useEffect(() => {
        fetchCustomerDetails();
        fetchTransactions();
    }, []);

    function fetchCustomerDetails() {
        fetch(`https://my-json-server.typicode.com/mariamm20/transactions/customers/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setCustomer(data);
            })
            .catch(error => console.log(error));
    }
    function fetchTransactions() {
        fetch('https://my-json-server.typicode.com/mariamm20/transactions/transactions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data);
                calculateTransactionsPerDay(data);
            })
            .catch(error => console.log(error));
    }

    function calculateTransactionsPerDay(data) {
        const transactionsPerDay = {};
        data.forEach(transaction => {
            if (transaction.customer_id === id) {
                const date = transaction.date.split('T')[0]; // Extract date without time
                if (transactionsPerDay[date]) {
                    transactionsPerDay[date]++;
                } else {
                    transactionsPerDay[date] = 1;
                }
            }
        });
        setTransactionsPerDay(transactionsPerDay);
    }

    // Prepare data for Chart.js
    const chartLabels = Object.keys(transactionsPerDay);
    const chartDataValues = Object.values(transactionsPerDay);

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container py-lg-2 my-lg-5">
            <p className="text-secondary">Welcome Admin</p>
            <div className="d-flex align-items-center gap-3 py-1 mb-3">

                <h2 className="m-0">
                    Customer Details
                </h2>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Customer Id</th>
                        <th scope="col">Customer Name</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>

                        </tr>
                    }
                </tbody>
            </table>


            <div className="d-flex align-items-center gap-3 py-2 mb-3 mt-5">
                <h2 className="m-0">
                    Transaction Per Day Chart
                </h2>
            </div>
<div className="w-75">
            <Bar
                data={{
                    labels: chartLabels,
                    datasets: [
                        {
                            label: "Transactions per Day",
                            data: chartDataValues,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                }}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: 0,
                            max: Math.max(...chartDataValues) + 1,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                    return Number.isInteger(value) ? value : null;
                                }
                            }
                        }
                    }
                }}
            />
</div>
        </div>
    );
}
