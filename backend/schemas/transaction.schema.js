import { productProperties } from "./product.schema.js";

// Shared response schemas
const transactionProperties = {
  _id: { type: "string" },
  detailsId: { type: "string" },
  detailsCid: { type: "string" },
  product: {
    type: "object",
    properties: productProperties,
  },
  quantity: { type: "integer" },
  price: { type: "number" },
  status: { type: "string" },
  buyer: { type: "string" },
  seller: { type: "string" },
  transactionId: { type: "string" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" }
};

/* -----------------------------------------------------
   CREATE TRANSACTION
----------------------------------------------------- */
export const createTransactionSchema = {
  body: {
    type: "object",
    required: ["buyer", "seller", "buyerEmail", "productId", "quantity", "price"],
    properties: {
      buyer: { type: "string" },
      seller: { type: "string" },
      buyerEmail: { type: "string" },
      productId: { type: "string" },
      quantity: { type: "integer", minimum: 1 },
      price: { type: "number" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "transaction"],
      properties: {
        success: { type: "boolean" },
        transaction: {
          type: "object",
          properties: transactionProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   UPDATE TRANSACTION
----------------------------------------------------- */
export const updateTransactionSchema = {
  body: {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      status: { type: "string", enum: ["pending", "disputed", "completed", "refunded"] }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "transaction"],
      properties: {
        success: { type: "boolean" },
        transaction: {
          type: "object",
          properties: transactionProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   GET TRANSACTIONS (PAGINATION + SEARCH)
----------------------------------------------------- */
export const getTransactionsSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      status: { type: "string", enum: ["pending", "disputed", "completed", "refunded"] }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "meta", "transactions"],
      properties: {
        success: { type: "boolean" },
        meta: {
          type: "object",
          properties: {
            total: { type: "integer" },
            page: { type: "integer" },
            limit: { type: "integer" },
            totalPages: { type: "integer" }
          }
        },
        transactions: {
          type: "array",
          items: {
            type: "object",
            properties: transactionProperties
          }
        }
      }
    }
  }
};

/* -----------------------------------------------------
   GET SINGLE TRANSACTION
----------------------------------------------------- */
export const getTransactionSchema = {
  querystring: {
    type: "object",
    oneOf: [
      { required: ["id"] },
      { required: ["transactionId"] }
    ],
    properties: {
      id: { type: "string" },
      transactionId: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "data"],
      properties: {
        success: { type: "boolean" },
        data: {
          type: ["object", "null"],
          properties: transactionProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   DELETE TRANSACTION
----------------------------------------------------- */
export const deleteTransactionSchema = {
  body: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "message"],
      properties: {
        success: { type: "boolean" },
        message: { type: "string" }
      }
    }
  }
};
