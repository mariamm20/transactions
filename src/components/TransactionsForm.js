import React, { useState, useEffect } from "react";

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
            fetch(`https://api.jsonbin.io/v3/b/669313b5ad19ca34f8874c9d/${props.transaction.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$payfSoPMocKhjmQiX9zvvOd6dRk4D2UVFXLawNePInd4YTkQ6uGJe'
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
            fetch('https://api.jsonbin.io/v3/b/669313b5ad19ca34f8874c9d', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$payfSoPMocKhjmQiX9zvvOd6dRk4D2UVFXLawNePInd4YTkQ6uGJe'
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

export default TransactionsForm;
