import React, { useState, useEffect } from "react";
import { PeopleFill } from "react-bootstrap-icons";


export function Customers() {
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        fetchCustomers();
    }, []);

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
    return (
        <div className="container my-5">
            <div className="d-flex align-items-center gap-3 py-1 mb-3">
                <PeopleFill color="black" size={32} />
                <h2 className="m-0">
                    Customers List
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
                        customers.map((customer, index) => (
                            <tr key={index}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}