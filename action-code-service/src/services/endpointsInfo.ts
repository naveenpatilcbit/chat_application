const endpointsInfo = {
  endpoints: [
    {
      methodName: "create",
      description: "Creates a new action code",
      operationType: "POST",
      endpointURL: "/action-codes",
      parameters: [
        {
          name: "name",
          description: "Name of the action code",
          type: "String",
          required: true,
        },
        {
          name: "description",
          description: "Description of the action code",
          type: "String",
          required: true,
        },
      ],
    },
    {
      methodName: "getAll",
      description: "Retrieves all action codes",
      operationType: "GET",
      endpointURL: "/action-codes",
      parameters: [],
    },
    {
      methodName: "getById",
      description: "Retrieves a specific action code by ID",
      operationType: "GET",
      endpointURL: "/action-codes/:id",
      parameters: [
        {
          name: "id",
          description: "ID of the action code to retrieve",
          type: "Number",
          required: true,
        },
      ],
    },
    {
      methodName: "update",
      description: "Updates an existing action code",
      operationType: "PUT",
      endpointURL: "/action-codes/:id",
      parameters: [
        {
          name: "id",
          description: "ID of the action code to update",
          type: "Number",
          required: true,
        },
        {
          name: "name",
          description: "New name of the action code",
          type: "String",
          required: true,
        },
        {
          name: "description",
          description: "New description of the action code",
          type: "String",
          required: true,
        },
      ],
    },
    {
      methodName: "delete",
      description: "Soft deletes an action code by setting isActive to false",
      operationType: "DELETE",
      endpointURL: "/action-codes/:id",
      parameters: [
        {
          name: "id",
          description: "ID of the action code to delete",
          type: "Number",
          required: true,
        },
      ],
    },
  ],
};

export default endpointsInfo;
