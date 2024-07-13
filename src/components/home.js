import React, { useEffect, useState } from "react";

export function Home() {
    const [content, setContent] = useState(<TransactionsList showForm={showForm} />);
    
    function showList() {
        setContent(<TransactionsList showForm={showForm} />);
    }
    
    function showForm(transaction) {
        setContent(<TransactionsForm transaction={transaction} showList={showList} />);
    }
    
    return (
        <div className="container my-5">
            {content}
        </div>
    );
}

function TransactionsList(props) {
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetchTransactions();
        fetchCustomers();
    }, []);

    function fetchTransactions() {
        fetch('http://localhost:3004/transactions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data);
                setRecords(data); // Initialize records with all transactions
            })
            .catch(error => console.log(error));
    }

    function fetchCustomers() {
        fetch('http://localhost:3004/customers')
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

    function deleteTransaction(id) {
        fetch(`http://localhost:3004/transactions/${id}`, {
            method: 'DELETE'
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
            if (!customer) return false; // If no customer found, skip this transaction

            const customerName = customer.name.toLowerCase();
            const amountString = transaction.amount.toString();

            return (
                customerName.includes(query) ||
                amountString.includes(query)
            );
        });

        setRecords(filteredTransactions); // Update records with filtered transactions
    }

    return (
        <>
            <h2 className="text-center mb-3">Transactions List</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Make Transaction</button>
            <button onClick={() => fetchTransactions()} type="button" className="btn btn-outline-primary me-2">Refresh</button>

            <br /><br />
            <input type="text" className="form-control" placeholder="Search by name or amount" aria-label="Search" onChange={(e) => filter(e)} />

            <table className="table table-bordered mt-3">
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

function TransactionsForm(props) {
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(props.transaction.customer_id || '');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchTransactions();

        if (props.transaction.customer_id) {
            setSelectedCustomerId(props.transaction.customer_id);
        }
    }, [props.transaction]);

    function fetchCustomers() {
        fetch('http://localhost:3004/customers')
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

    function fetchTransactions() {
        fetch('http://localhost:3004/transactions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTransactions(data);
            })
            .catch(error => console.log(error));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const transaction = new FormData(event.target);
        const data = Object.fromEntries(transaction.entries());
        if (!data.customer_id || !data.amount) {
            setErrorMessage(
                <div className="alert alert-danger" role="alert">
                    Please fill all the fields
                </div>
            );
            return;
        }

        if (props.transaction.id) {
            fetch(`http://localhost:3004/transactions/${props.transaction.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    props.showList();
                })
                .catch(error => console.log(error));
        } else {
            const highestId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) : 0;
            data.id = highestId + 1;
            data.date = new Date().toISOString().slice(0, 10);
            fetch('http://localhost:3004/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    props.showList();
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <>
            <h2 className="text-center mb-3">{props.transaction.id ? 'Edit Transaction' : 'Make Transaction'}</h2>
            <div className="row">
                <div className="col-lg-6">
                    {errorMessage}
                    <form onSubmit={handleSubmit}>
                        {props.transaction.id && (
                            <div className="mb-3">
                                <label htmlFor="transaction_id" className="form-label">Transaction ID</label>
                                <input type="number" readOnly name="id" className="plaintext form-control" id="transaction_id" defaultValue={props.transaction.id} />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="customer_id" className="form-label">Customer</label>
                            <select
                                name="customer_id"
                                className="form-select"
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                            >
                                <option value="">Select Customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                            <input type="hidden" name="customer_id" value={selectedCustomerId} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Amount</label>
                            <input type="number" name="amount" className="form-control" id="amount" defaultValue={props.transaction.amount} />
                        </div>
                        <div className="row align-items-center justify-content-center">
                            <div className="offset-sm-4 col-sm-4 d-grid">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                            <div className="col-sm-4 d-grid">
                                <button onClick={props.showList} type="button" className="btn btn-secondary me-2">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
