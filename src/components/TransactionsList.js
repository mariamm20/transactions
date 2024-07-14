import React, { useState, useEffect } from "react";
import { Search, Grid, PeopleFill, Wallet ,List } from 'react-bootstrap-icons';
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
import { Bar, Pie } from 'react-chartjs-2';

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

function TransactionsList(props) {
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [records, setRecords] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactionsPerDay, setTransactionsPerDay] = useState({});
    const [isTouched, setIsTouched] = useState(false);

    useEffect(() => {
        fetchTransactions();
        fetchCustomers();
    }, []);

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
                setRecords(data);
                setFilteredTransactions(data); // Initialize filteredTransactions with all transactions
                calculateTransactionsPerDay(data);
            })
            .catch(error => console.log(error));
    }

    function fetchCustomers() {
        fetch('https://my-json-server.typicode.com/mariamm20/transactions/customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomers(data);
            })
            .catch(error => console.log(error));
    }

    function calculateTransactionsPerDay(data) {
        const transactionsPerDay = {};
        data.forEach(transaction => {
            const date = transaction.date.split('T')[0]; // Extract date without time
            if (transactionsPerDay[date]) {
                transactionsPerDay[date]++;
            } else {
                transactionsPerDay[date] = 1;
            }
        });
        setTransactionsPerDay(transactionsPerDay);
    }

    function filterTransactions(event) {
        setIsTouched(true); // Mark input as touched when filtering starts
        const query = event.target.value.trim().toLowerCase();

        if (!query) {
            setFilteredTransactions(records); // Show all records when query is empty
            calculateTransactionsPerDay(records);
            return;
        }

        const filtered = transactions.filter(transaction => {
            const customer = customers.find(customer => customer.id === transaction.customer_id);
            const customerName = customer ? customer.name.toLowerCase() : '';
            return (
                customerName.includes(query) ||
                transaction.amount.toString() === query
            );
        });

        setFilteredTransactions(filtered);
    }



    // Prepare data for Chart.js
    const chartLabels = Object.keys(transactionsPerDay);
    const chartDataValues = Object.values(transactionsPerDay);

    return (
        <>
            <div className="d-flex align-items-center gap-3 py-1 mb-3">
                <Grid color="black" size={32} />
                <h2 className="m-0">
                    Dashboard
                </h2>
            </div>
            <div className=" row d-flex justify-content-around">
                <div className="col-lg-4 col-12 d-flex gap-3 flex-column">
                <div className=" p-3 bg-success text-white">
                        <div className="d-flex justify-content-between">
                            <Wallet color="white" size={32} />
                            <h3 className="">
                            {transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0)}

                            </h3>

                        </div>
                        <h5 className="mt-4 fw-normal">Total Revenue</h5>

                    </div>
                    <div className=" p-3 bg-danger text-white">
                        <div className="d-flex justify-content-between">
                            <PeopleFill color="white" size={32} />
                            <h3 className="">
                                {customers.length}
                            </h3>

                        </div>
                        <h5 className="mt-4 fw-normal">Number Of Customers</h5>

                    </div>
                    
                </div>
                <div className="col-lg-6 col-12">
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
                />
                </div>

            </div>


            <div className="d-flex align-items-center gap-3 py-2 mb-3 mt-5">
                <List color="black" size={32} />
                <h2 className="m-0">
                    Transaction List
                </h2>
            </div>
<div className="container px-5">
            <div className="input-group mb-3">
                <div className="input-group-prepend d-flex">
                    <span className="border-end-0 bg-none border-start border-bottom border-top p-2" id="basic-addon1">
                        <Search size={24} color="black" />
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control border-start-0 rounded-0 "
                    placeholder="Search by name or amount"
                    aria-label="Search"
                    onChange={(e) => filterTransactions(e)}
                />
            </div>

            <table className="table table-bordered table-responsive">
                <thead>
                    <tr>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Customer Id</th>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {isTouched ? (
                        filteredTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.id}</td>
                                <td>{customers.find(customer => customer.id === transaction.customer_id)?.name}</td>
                                <td>{transaction.customer_id}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.amount}</td>
                            </tr>
                        ))
                    ) : (
                        records.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.id}</td>
                                <td>{customers.find(customer => customer.id === transaction.customer_id)?.name}</td>
                                <td>{transaction.customer_id}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.amount}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
</div>
            {/* <div className="d-flex ">
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
                />
                <div>

                </div>
            </div> */}
        </>
    );
}

export default TransactionsList;
