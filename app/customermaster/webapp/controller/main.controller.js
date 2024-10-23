sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, ODataModel, JSONModel) {
        "use strict";

        return Controller.extend("sravan.ust.customermaster.controller.main", {
            onInit: function () {
                this.read();
            },

            read: async function () {
                // Define the OData V4 model correctly with proper parameters
                var oModel = new ODataModel({
                    serviceUrl: "/odata/v4/customer-master/",
                    synchronizationMode: "None", // This is required for V4
                    groupId: "$auto"
                });

                // Bind the list and request the contexts
                var oListBinding = oModel.bindList("/CustomerMaster");

                try {
                    // Fetch the first 10 records
                    var aContexts = await oListBinding.requestContexts(0, 10);

                    var Customer_data = [];

                    // Loop through each context and get the object data
                    aContexts.forEach(function (oContext) {
                        var oData = oContext.getObject();
                        Customer_data.push(oData);
                    });

                    // Convert to JSON and log the customer data
                    console.log(JSON.stringify(Customer_data));
                    const oModel = new JSONModel(Customer_data);
                    this.getView().setModel(oModel , "customerModel");
                } catch (oError) {
                    console.error("Error fetching customer data:", oError);
                }
            }
        });
    });

