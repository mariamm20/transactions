import React, { useState } from "react";
import TransactionsList from "./TransactionsList";
import TransactionsForm from "./TransactionsForm";

export default function Home() {
    const [content, setContent] = useState(<TransactionsList showForm={showForm} />);
    
    function showList() {
        setContent(<TransactionsList showForm={showForm} />);
    }
    
    function showForm(transaction) {
        setContent(<TransactionsForm transaction={transaction} showList={showList} />);
    }
    
    return (
        <div className="container my-5 py-2">
            {content}
        </div>
    );
}


