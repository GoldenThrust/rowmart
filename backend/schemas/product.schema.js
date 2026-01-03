// Shared response schemas
export const review = {
  reviewer: { type: "string" },
  rating: { type: "string" },
  comment: { type: "string" },
};

export const productProperties = {
  _id: { type: "string" },
  imageId: { type: "string" },
  imageCid: { type: "string" },
  name: { type: "string" },
  email: { type: "string" },
  price: { type: "string" },
  seller: { type: "string" },
  active: { type: "boolean" },
  reviews: {
    type: "array",
    items: review
  },
  description: { type: "string" },
  productId: { type: "string" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" }
};

/* -----------------------------------------------------
   CREATE PRODUCT
----------------------------------------------------- */
export const createProductSchema = {
  consumes: ["multipart/form-data"],
  body: {
    type: "object",
    required: ["name", "email", "seller", "price", "description"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      seller: { type: "string" },
      price: { type: "string" },
      description: { type: "string", minLength: 1 },
      file: {
        type: "object",
        properties: {
          buffer: { type: "object" },
          metadata: { type: "object" }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "product"],
      properties: {
        success: { type: "boolean" },
        product: {
          type: "object",
          properties: productProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   UPDATE PRODUCT
----------------------------------------------------- */
export const updateProductSchema = {
  body: {
    type: "object",
    required: ["id"],
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      price: { type: "string" },
      description: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "product"],
      properties: {
        success: { type: "boolean" },
        product: {
          type: "object",
          properties: productProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   GET PRODUCTS (PAGINATION + SEARCH)
----------------------------------------------------- */
export const getProductsSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 12 },
      search: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "meta", "products"],
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
        products: {
          type: "array",
          items: {
            type: "object",
            properties: productProperties
          }
        }
      }
    }
  }
};

/* -----------------------------------------------------
   GET SINGLE PRODUCT
----------------------------------------------------- */
export const getProductSchema = {
  querystring: {
    type: "object",
    oneOf: [
      { required: ["id"] },
      { required: ["productId"] }
    ],
    properties: {
      id: { type: "string" },
      productId: { type: "string" }
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
          properties: productProperties
        }
      }
    }
  }
};

/* -----------------------------------------------------
   DELETE PRODUCT
----------------------------------------------------- */
export const deleteProductSchema = {
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


/* -----------------------------------------------------
   RATE PRODUCT
----------------------------------------------------- */
export const rateProductSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        minLength: 24,
        maxLength: 24,
      },
    },
  },

  body: {
    type: "object",
    required: ["rating", "comment", "reviewer"],
    additionalProperties: false,
    properties: {
      rating: {
        type: "number",
        minimum: 1,
        maximum: 5,
      },
      seller: {
        type: "string"
      },
      reviewer: {
        type: "string",
        maxLength: 500,
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        product: {
          type: "object",
          properties: productProperties
        },
      },
    },
  },
};