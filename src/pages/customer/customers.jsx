import React from "react";
import { PeopleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import useFetch from "../../utilities/useFetch";

export const Customers = () => {
  const { customers } = useFetch("customers");

  return (
    <div className="container py-lg-2 my-lg-4">
      <p className="text-secondary">Welcome Admin</p>

      <div className="d-flex align-items-center gap-3 py-1 mb-3">
        <PeopleFill color="black" size={32} />
        <h2 className="m-0">Customers List</h2>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Customer Id</th>
            <th scope="col">Customer Name</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.id}</td>
              <td>
                <Link
                  to={`/customers/${customer.id}`}
                  className="text-decoration-none">
                  {customer.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
