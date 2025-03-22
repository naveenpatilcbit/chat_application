const endpointsInfo = {
  endpoints: [
    {
      methodName: "create",
      methodDesc: "Creates a new action code",
      endPoint: "/action-codes",
      methodParams: [
        {
          paramName: "name",
          paramDesc: "Name of the action code",
          paramType: "String",
        },
        {
          paramName: "description",
          paramDesc: "Description of the action code",
          paramType: "String",
        },
      ],
    },
    {
      methodName: "getAll",
      methodDesc: "Retrieves all action codes",
      endPoint: "/action-codes",
      methodParams: [],
    },
    {
      methodName: "getById",
      methodDesc: "Retrieves a specific action code by ID",
      endPoint: "/action-codes/:id",
      methodParams: [
        {
          paramName: "id",
          paramDesc: "ID of the action code to retrieve",
          paramType: "Number",
        },
      ],
    },
    {
      methodName: "update",
      methodDesc: "Updates an existing action code",
      endPoint: "/action-codes/:id",
      methodParams: [
        {
          paramName: "id",
          paramDesc: "ID of the action code to update",
          paramType: "Number",
        },
        {
          paramName: "name",
          paramDesc: "New name of the action code",
          paramType: "String",
        },
        {
          paramName: "description",
          paramDesc: "New description of the action code",
          paramType: "String",
        },
      ],
    },
    {
      methodName: "delete",
      methodDesc: "Soft deletes an action code by setting isActive to false",
      endPoint: "/action-codes/:id",
      methodParams: [
        {
          paramName: "id",
          paramDesc: "ID of the action code to delete",
          paramType: "Number",
        },
      ],
    },
  ],
};

export default endpointsInfo;
