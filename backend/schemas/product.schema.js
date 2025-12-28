export const createProductSchema = {
    body: {
        type: "object",
        required: ["name", "email", "price", "description"],
        properties: {
            name: {
                type: "string",
                minLength: 3,
                maxLength: 100,
            },
            price: {
                type: "string",
                pattern: "^[0-9]+(\\.[0-9]+)?$",
            },
            description: {
                type: "string",
                minLength: 10,
                maxLength: 500,
            },
            email: {
                type: "string",
                format: "email",
            },
        },
        additionalProperties: true,
    },
};


export const getProductSchema = {
    params: {
        type: "object",
        required: ["cid"],
        properties: {
            cid: {
                type: "string",
                minLength: 10,
            },
        },
        additionalProperties: false,
    },
};

export const deleteProductSchema = {
    body: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "string",
                minLength: 10,
            },
        },
        additionalProperties: false,
    },
};
