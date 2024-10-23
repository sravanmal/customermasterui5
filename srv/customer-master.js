const cds = require('@sap/cds');

module.exports = async function () {
    const { CustomerMaster, ShiptoAddress, BilltoAddress } = this.entities;

    // Define the 'addCustomer' action
    this.on('addCustomer', async (req) => {
        const { ID, CustomerNumber, Soldto, Shipto, Billto, Payer, PARNR, PARAU, NAMEV, NAME1, TELF1, SORTL } = req.data;

        // Validate required fields
        if (!CustomerNumber || !Soldto || !Payer) {
            return { success: false, message: 'Missing required fields' };
        }

        try {
            // Create the customer in the CustomerMaster table
            const newCustomer = await cds.run(INSERT.into(CustomerMaster).entries({
                ID: ID || cds.utils.uuid(),  // Use provided ID or generate a new one
                CustomerNumber,
                Soldto,
                Payer,
                PARNR,
                PARAU,
                NAMEV,
                NAME1,
                TELF1,
                SORTL
            }));

            // Handle Shipto addresses
            if (Shipto && Shipto.length > 0) {
                const shiptoEntries = Shipto.map(shipto => ({
                    CustomerID: newCustomer.ID,  // Foreign key for composition
                    ShiptoNr: shipto.ShiptoNr
                }));
                await cds.run(INSERT.into(ShiptoAddress).entries(shiptoEntries));
            }

            // Handle Billto addresses
            if (Billto && Billto.length > 0) {
                const billtoEntries = Billto.map(billto => ({
                    CustomerID: newCustomer.ID,  // Foreign key for composition
                    BilltoNr: billto.BilltoNr
                }));
                await cds.run(INSERT.into(BilltoAddress).entries(billtoEntries));
            }

            // Return success response with the created customer details
            return {
                success: true,
                message: 'Customer successfully added',
                customer: {
                    ID: newCustomer.ID,
                    CustomerNumber,
                    Soldto,
                    Shipto: Shipto.map(shipto => ({ ShiptoNr: shipto.ShiptoNr })),
                    Billto: Billto.map(billto => ({ BilltoNr: billto.BilltoNr })),
                    Payer,
                    PARNR,
                    PARAU,
                    NAMEV,
                    NAME1,
                    TELF1,
                    SORTL
                }
            };
        } catch (error) {
            console.error('Error adding customer:', error);
            return { success: false, message: 'Error adding customer' };
        }
    });
};