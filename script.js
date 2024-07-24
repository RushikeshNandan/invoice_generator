document.addEventListener('DOMContentLoaded', () => {
    const invoiceData = {
        seller: {
            name: "Seller Name",
            address: "Seller Address, City, State, Pincode",
            pan: "Seller PAN No.",
            gst: "Seller GST No."
        },
        placeOfSupply: "Place of Supply",
        billing: {
            name: "Billing Name",
            address: "Billing Address, City, State, Pincode",
            code: "Billing State/UT Code"
        },
        shipping: {
            name: "Shipping Name",
            address: "Shipping Address, City, State, Pincode",
            code: "Shipping State/UT Code"
        },
        placeOfDelivery: "Place of Delivery",
        order: {
            no: "Order No.",
            date: "Order Date"
        },
        invoice: {
            no: "Invoice No.",
            date: "Invoice Date",
            reverseCharge: "No"
        },
        items: [
            {
                description: "Item 1",
                unitPrice: 100,
                quantity: 2,
                discount: 10,
                taxRate: 18
            },
            {
                description: "Item 2",
                unitPrice: 200,
                quantity: 1,
                discount: 20,
                taxRate: 18
            }
        ],
        signature: "signature.png"
    };

    function populateInvoice(data) {
        document.getElementById('seller-name').innerText = data.seller.name;
        document.getElementById('seller-address').innerText = data.seller.address;
        document.getElementById('seller-pan').innerText = `PAN: ${data.seller.pan}`;
        document.getElementById('seller-gst').innerText = `GST: ${data.seller.gst}`;

        document.getElementById('billing-name').innerText = data.billing.name;
        document.getElementById('billing-address').innerText = data.billing.address;
        document.getElementById('billing-code').innerText = `State/UT Code: ${data.billing.code}`;

        document.getElementById('shipping-name').innerText = data.shipping.name;
        document.getElementById('shipping-address').innerText = data.shipping.address;
        document.getElementById('shipping-code').innerText = `State/UT Code: ${data.shipping.code}`;

        document.getElementById('order-no').innerText = data.order.no;
        document.getElementById('order-date').innerText = data.order.date;

        document.getElementById('invoice-no').innerText = data.invoice.no;
        document.getElementById('invoice-date').innerText = data.invoice.date;
        document.getElementById('reverse-charge').innerText = data.invoice.reverseCharge;

        let totalAmount = 0;
        let totalTax = 0;

        data.items.forEach(item => {
            const netAmount = item.unitPrice * item.quantity - item.discount;
            const taxAmount = netAmount * (item.taxRate / 100);
            totalTax += taxAmount;
            totalAmount += netAmount + taxAmount;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.unitPrice}</td>
                <td>${item.quantity}</td>
                <td>${item.discount}</td>
                <td>${netAmount.toFixed(2)}</td>
                <td>${item.taxRate}%</td>
                <td>${taxAmount.toFixed(2)}</td>
                <td>${(netAmount + taxAmount).toFixed(2)}</td>
            `;
            document.getElementById('items').appendChild(row);
        });

        document.getElementById('total-amount').innerText = totalAmount.toFixed(2);
        document.getElementById('amount-words').innerText = numberToWords(totalAmount);

        const signature = document.createElement('img');
        signature.src = data.signature;
        signature.alt = "Signature";
        document.getElementById('signature').appendChild(signature);
    }

    function numberToWords(num) {
        const a = [
            '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
        ];
        const b = [
            '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
        ];

        const words = (n) => {
            if (n < 20) return a[n];
            const digit = n % 10;
            if (n < 100) return b[Math.floor(n / 10)] + (digit ? "-" + a[digit] : "");
            if (n < 1000) return a[Math.floor(n / 100)] + " hundred" + (n % 100 == 0 ? "" : " and " + words(n % 100));
            return words(Math.floor(n / 1000)) + " thousand" + (n % 1000 != 0 ? " " + words(n % 1000) : "");
        };

        return words(num);
    }

    populateInvoice(invoiceData);

    document.getElementById('generate-pdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.html(document.getElementById('invoice'), {
            callback: function (doc) {
                doc.save('invoice.pdf');
            },
            x: 10,
            y: 10
        });
    });
});
