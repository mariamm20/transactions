import React, { useState, useEffect } from "react";
function TransactionsList(props) {
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetchTransactions();
        fetchCustomers();
    }, []);

    function fetchTransactions() {
        fetch('https://api.jsonbin.io/v3/b/669313b5ad19ca34f8874c9d', {
            headers: {
                'X-Master-Key': '$2a$10$payfSoPMocKhjmQiX9zvvOd6dRk4D2UVFXLawNePInd4YTkQ6uGJe'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data.record.transactions);
                setCustomers(data.record.customers);
                setRecords(data.record.transactions);
            })
            .catch(error => console.log(error));
    }

    function fetchCustomers() {
        fetch('https://api.jsonbin.io/v3/b/669313b5ad19ca34f8874c9d', {
            headers: {
                'X-Master-Key': '$2a$10$payfSoPMocKhjmQiX9zvvOd6dRk4D2UVFXLawNePInd4YTkQ6uGJe'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomers(data.record.customers);
            })
            .catch(error => console.log(error));
    }


    function deleteTransaction(id) {
        fetch(`https://api.jsonbin.io/v3/b/669313b5ad19ca34f8874c9d/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$payfSoPMocKhjmQiX9zvvOd6dRk4D2UVFXLawNePInd4YTkQ6uGJe'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                fetchTransactions();
            })
            .catch(error => console.log(error));
    }

    function filter(event) {
        const query = event.target.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => {
            const customer = customers.find(customer => customer.id === transaction.customer_id);
            const customerName = customer ? customer.name.toLowerCase() : '';
            return (
                customerName.includes(query) ||
                transaction.amount.toString().includes(query)
            );
        });
        setRecords(filteredTransactions);
    }

    return (
        <>
            <h2 className="text-center mb-3">Transactions List</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Make Transaction</button>
            <button onClick={() => fetchTransactions()} type="button" className="btn btn-outline-primary me-2">Refresh</button>

            <br />
            <br />
            <input type="text" className="form-control" placeholder="Search by name" aria-label="Search" onChange={(e) => filter(e)} />

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Customer Id</th>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.id}</td>
                            <td>{customers.find(customer => customer.id === transaction.customer_id)?.name}</td>
                            <td>{transaction.customer_id}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.amount}</td>
                            <td style={{ width: '10px', whiteSpace: 'nowrap' }}>
                                <button onClick={() => props.showForm(transaction)} type="button" className="btn btn-warning btn-sm me-2">Edit</button>
                                <button onClick={() => deleteTransaction(transaction.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TransactionsList;
