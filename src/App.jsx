import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State to hold the order data (you fill this)
    const [orderData, setOrderData] = useState({
        orderPickupDate: '',
        customerName: '',
        occasion: '',
        cakeSize: '',
        cakeFlavor: '',
        cakeDecorationDetails: '', // Now a textarea
        totalPrice: '',
        amountPayableToday: '',
        amountPayableWhilePickup: '' // Will be calculated
    });

    // State to manage the current view
    const [viewMode, setViewMode] = useState('business-input'); // 'business-input', 'customer-review', 'whatsapp-sent'
    // State to hold the simulated pre-filled form URL
    const [prefilledFormUrl, setPrefilledFormUrl] = useState('');
    // State to hold the simulated WhatsApp message content
    const [simulatedWhatsappMessage, setSimulatedWhatsappMessage] = useState('');

    // !!! IMPORTANT: Replace this with your actual WhatsApp Business number in international format (no +) !!!
    const YOUR_BUSINESS_WHATSAPP_NUMBER = "19453425041"; 

    // Handler for your input form
    const handleBusinessInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Effect to calculate Amount Payable While Pickup
    useEffect(() => {
        const total = parseFloat(orderData.totalPrice) || 0;
        const paidToday = parseFloat(orderData.amountPayableToday) || 0;
        const payableWhilePickup = (total - paidToday).toFixed(2); // Ensure 2 decimal places

        // Only update if the calculated value is different to prevent infinite loops
        if (orderData.amountPayableWhilePickup !== payableWhilePickup) {
            setOrderData(prevData => ({
                ...prevData,
                amountPayableWhilePickup: payableWhilePickup
            }));
        }
    }, [orderData.totalPrice, orderData.amountPayableToday, orderData.amountPayableWhilePickup]);


    // Function to generate the pre-filled form URL (simulated)
    const generatePrefilledForm = () => {
        const encodedData = btoa(JSON.stringify(orderData));
        setPrefilledFormUrl(`https://simulated-form.com/order-review?data=${encodedData}`);
        setViewMode('business-link-generated'); 
    };

    // Simulate sending the link to the customer (moves to customer review view)
    const simulateCustomerAccess = () => {
        if (prefilledFormUrl) {
            setViewMode('customer-review');
        } else {
            console.log('Please generate the pre-filled form link first!');
        }
    };

    // Function for the customer to "submit" the form and trigger WhatsApp link
    const handleCustomerSubmission = () => {
        const message = `
*Cake Order Confirmation*
Customer Name: ${orderData.customerName}
Occasion: ${orderData.occasion}
Cake Flavor: ${orderData.cakeFlavor}
Cake Size: ${orderData.cakeSize}
Decoration Details: ${orderData.cakeDecorationDetails}
Pickup Date: ${orderData.orderPickupDate}
Total Price: $${parseFloat(orderData.totalPrice).toFixed(2)}
Amount Payable Today: $${parseFloat(orderData.amountPayableToday).toFixed(2)}
Amount Payable While Pickup: $${parseFloat(orderData.amountPayableWhilePickup).toFixed(2)}

Please confirm this order.
        `.trim(); 

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${YOUR_BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank'); 
        
        setSimulatedWhatsappMessage(whatsappLink); 
        setViewMode('whatsapp-sent'); 
    };

    // Reset the entire simulation
    const startNewOrder = () => {
        setOrderData({
            orderPickupDate: '',
            customerName: '',
            occasion: '',
            cakeSize: '',
            cakeFlavor: '',
            cakeDecorationDetails: '',
            totalPrice: '',
            amountPayableToday: '',
            amountPayableWhilePickup: ''
        });
        setPrefilledFormUrl('');
        setSimulatedWhatsappMessage('');
        setViewMode('business-input');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 flex items-center justify-center font-['Lato']"> {/* Applied Lato */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
                {/* Removed the H1 tag as requested */}
                {viewMode === 'business-input' && (
                    <BusinessInputForm
                        orderData={orderData}
                        handleChange={handleBusinessInputChange}
                        generatePrefilledForm={generatePrefilledForm}
                    />
                )}

                {viewMode === 'business-link-generated' && (
                    <LinkGeneratedView
                        prefilledFormUrl={prefilledFormUrl}
                        simulateCustomerAccess={simulateCustomerAccess}
                        startNewOrder={startNewOrder}
                    />
                )}

                {viewMode === 'customer-review' && (
                    <CustomerReviewForm
                        orderData={orderData}
                        handleCustomerSubmission={handleCustomerSubmission}
                    />
                )}

                {viewMode === 'whatsapp-sent' && (
                    <WhatsappSentView
                        simulatedWhatsappMessage={simulatedWhatsappMessage}
                        startNewOrder={startNewOrder}
                    />
                )}
            </div>
        </div>
    );
};

// Component for Business Owner to input details
const BusinessInputForm = ({ orderData, handleChange, generatePrefilledForm }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center font-['Lato']">Step 1: Fill Order Details (Your View)</h2> {/* Applied Lato */}
        <p className="text-gray-600 text-center mb-6 font-['Lato']">Enter the finalized cake order details below.</p> {/* Applied Lato */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField type="date" label="Order Pickup Date" name="orderPickupDate" value={orderData.orderPickupDate} onChange={handleChange} />
            <InputField label="Customer Name" name="customerName" value={orderData.customerName} onChange={handleChange} placeholder="Aisha Khan" />
            <InputField label="Occasion" name="occasion" value={orderData.occasion} onChange={handleChange} placeholder="Birthday, Anniversary, Wedding" />
            <InputField label="Cake Size" name="cakeSize" value={orderData.cakeSize} onChange={handleChange} placeholder="10 inch, 3 layers" />
            <InputField label="Cake Flavor" name="cakeFlavor" value={orderData.cakeFlavor} onChange={handleChange} placeholder="Chocolate Fudge" />
            {/* Changed to TextAreaField for more space */}
            <TextAreaField label="Cake Decoration Details" name="cakeDecorationDetails" value={orderData.cakeDecorationDetails} onChange={handleChange} placeholder="Detailed description of design, colors, themes, etc." />
            
            <InputField type="number" label="Total Price ($)" name="totalPrice" value={orderData.totalPrice} onChange={handleChange} placeholder="75.00" />
            <InputField type="number" label="Amount Payable Today ($)" name="amountPayableToday" value={orderData.amountPayableToday} onChange={handleChange} placeholder="25.00" />
            {/* Amount Payable While Pickup is now read-only and calculated */}
            <InputField 
                type="number" 
                label="Amount Payable While Pickup ($)" 
                name="amountPayableWhilePickup" 
                value={orderData.amountPayableWhilePickup} 
                readOnly // Make it read-only
                className="bg-gray-100 cursor-not-allowed" // Add styling for read-only
            />
        </div>

        <div className="mt-8">
            <button
                onClick={generatePrefilledForm}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 font-['Lato']"
            >
                Generate Customer Confirmation Link
            </button>
        </div>
    </div>
);

// Component to display the generated link and prompt to simulate customer access
const LinkGeneratedView = ({ prefilledFormUrl, simulateCustomerAccess, startNewOrder }) => (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 font-['Lato']">Step 2: Link Generated!</h2> {/* Applied Lato */}
        <p className="text-gray-600 mb-6 font-['Lato']">
            Imagine sending this link to your customer via Instagram DM:
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-800 text-sm break-all mb-8 shadow-inner font-['Lato']"> {/* Applied Lato */}
            <p className="font-semibold mb-2">Simulated Customer Link:</p>
            <p className="overflow-auto whitespace-normal font-mono text-xs sm:text-sm">{prefilledFormUrl}</p>
        </div>
        <button
            onClick={simulateCustomerAccess}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 font-['Lato']"
        >
            Simulate Customer Opening Link
        </button>
        <button
            onClick={startNewOrder}
            className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 font-['Lato']"
        >
            Start Over
        </button>
    </div>
);

// Component for Customer to review and submit the pre-filled form
const CustomerReviewForm = ({ orderData, handleCustomerSubmission }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-200 font-['Lato']">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-800 mb-4 font-['Cormorant_Garamond']">
                Cake Carving By Shivani
            </h1>
            <p className="text-xl text-center text-gray-700 mb-8 font-['Lato']">Order Confirmation</p>

            <p className="text-gray-600 text-center mb-6 font-['Lato']">
                Please review the details below. If everything is correct, confirm and send your order.
            </p>

            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 mb-6 shadow-inner">
                <DisplayField label="Customer Name" value={orderData.customerName} />
                <DisplayField label="Occasion" value={orderData.occasion} />
                <DisplayField label="Cake Flavor" value={orderData.cakeFlavor} />
                <DisplayField label="Cake Size" value={orderData.cakeSize} />
                <DisplayField label="Cake Decoration Details" value={orderData.cakeDecorationDetails} />
                <DisplayField label="Order Pickup Date" value={orderData.orderPickupDate} />
                <DisplayField label="Total Price" value={`$${parseFloat(orderData.totalPrice).toFixed(2)}`} />
                <DisplayField label="Amount Payable Today" value={`$${parseFloat(orderData.amountPayableToday).toFixed(2)}`} />
                <DisplayField label="Amount Payable While Pickup" value={`$${parseFloat(orderData.amountPayableWhilePickup).toFixed(2)}`} />
            </div>

            {/* Terms and Conditions Section - Shortened and Formatted */}
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 mb-6 shadow-md max-h-60 overflow-y-auto">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3 font-['Lato']">Terms and Conditions</h3>
                <p className="text-gray-700 text-sm mb-3 font-['Lato']">By confirming your order, you agree to the terms and conditions below.</p>
                
                <h4 className="text-md font-semibold text-gray-800 mb-1 font-['Lato']">1. Order & Payment</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mb-3 font-['Lato']">
                    <li><span className="font-semibold">Confirmation:</span> Orders are confirmed upon a 50% non-refundable down payment.</li>
                    <li><span className="font-semibold">Final Payment:</span> Remaining 50% due before pickup/delivery.</li>
                    <li><span className="font-semibold">No Cancellations:</span> All confirmed orders are final; no refunds/cancellations after deposit.</li>
                </ul>

                <h4 className="text-md font-semibold text-gray-800 mb-1 font-['Lato']">2. Design & Appearance</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mb-3 font-['Lato']">
                    <li><span className="font-semibold">Artistic Interpretation:</span> We will create a beautiful cake inspired by your chosen reference photos. However, many reference pictures, especially those that are computer or AI-generated, are not 100% replicable.</li>
                    <li><span className="font-semibold">Final Product:</span> Please do not expect a cake that is an exact duplicate of the reference picture. The final design will be a professional interpretation of your request, reflecting our unique style and artistic expertise. You can view examples of our finished work on our Instagram profile to see our quality and style.</li>
                </ul>

                <h4 className="text-md font-semibold text-gray-800 mb-1 font-['Lato']">3. Texas Cottage Food Law</h4>
                <p className="text-gray-700 text-sm mb-3 font-['Lato']">This food is prepared in a home kitchen and is not inspected by state/local health departments, as required by law. We prioritize safe and hygienic preparation.</p>

                <h4 className="text-md font-semibold text-gray-800 mb-1 font-['Lato']">4. Customer Responsibility</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li><span className="font-semibold">Pickup/Transport:</span> Cake Carving By Shivani is not responsible for damage after pickup.</li>
                    <li><span className="font-semibold">Allergen Warning:</span> Our cakes may contain or come into contact with common allergens, including but not limited to milk, wheat, soy, nuts, and tree nuts. Please let us know of any allergies when placing your order, but be aware that we are not an allergen-free facility.</li>
                </ul>
            </div>

            <div className="flex items-center mb-6">
                <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="termsAccepted" className="ml-3 text-gray-800 text-base font-medium select-none font-['Lato']">
                    I have read and agree to the terms and conditions.
                </label>
            </div>

            <button
                onClick={handleCustomerSubmission}
                disabled={!termsAccepted} // Button is disabled until terms are accepted
                className={`w-full text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-opacity-75 font-['Lato']
                    ${termsAccepted 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-700 hover:-translate-y-1 hover:scale-105 hover:from-purple-700 hover:to-pink-800 focus:ring-purple-500'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
            >
                Confirm Order & Send to WhatsApp
            </button>
        </div>
    );
};

// Component to simulate the WhatsApp message being sent
const WhatsappSentView = ({ simulatedWhatsappMessage, startNewOrder }) => (
    <div className="text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4 font-['Lato']">Order Confirmation Process Initiated!</h2>
        <p className="text-lg text-gray-800 mb-6 font-['Lato']">
            🎉 Your customer has been redirected to WhatsApp.
            They will see the following message pre-typed, and **they just need to hit 'Send'** for it to arrive at your WhatsApp Business number:
        </p>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-left space-y-3 mb-8 shadow-inner font-['Lato']">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Pre-typed WhatsApp Message Content:</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-900 bg-green-100 p-3 rounded-md border border-green-200 font-mono">
                {decodeURIComponent(simulatedWhatsappMessage.split('?text=')[1])}
            </pre>
            <p className="mt-4 text-center text-gray-700">
                (This message will appear to come from the customer's number after they click 'Send' in WhatsApp)
            </p>
        </div>
        <button
            onClick={startNewOrder}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 font-['Lato']"
        >
            Start New Order
        </button>
    </div>
);

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '', readOnly = false, className = '' }) => (
    <div>
        <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1 font-['Lato']">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out font-['Lato'] ${className}`}
            required // All fields are required based on your list
        />
    </div>
);

// Reusable Text Area Field Component
const TextAreaField = ({ label, name, value, onChange, placeholder = '' }) => (
    <div className="mb-4 col-span-1 md:col-span-2"> {/* Make it span two columns on medium screens and up */}
        <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1 font-['Lato']">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows="4" // Increased rows for more text
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out font-['Lato']"
        ></textarea>
    </div>
);

// Reusable Display Field Component for read-only views
const DisplayField = ({ label, value }) => (
    <div>
        <p className="text-gray-600 text-sm font-medium font-['Lato']">{label}:</p>
        <p className="text-gray-900 font-semibold text-base font-['Lato']">{value || 'N/A'}</p>
    </div>
);

export default App;
