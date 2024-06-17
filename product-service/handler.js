'use strict';

const products = [
  {
    count: 4,
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    title: "Anachrony",
    price: 29.99,
    description: "Heavy euro board game",
    image: "/assets/anachrony.webp",
  },
  {
    count: 6,
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    title: "Ark Nova",
    price: 40.99,
    description: "Heavy euro board game",
    image: "/assets/ark_nova.webp",
  },
  {
    count: 7,
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    title: "Bloodrage",
    price: 13.99,
    description: "Confrontative celtic action board game",
    image: "/assets/bloodrage.webp",
  },
  {
    count: 12,
    description: "Heavy euro board game",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "Brass Birmingham",
    image: "/assets/brass_birmingham.webp"
  },
  {
    count: 2,
    description: "Role play card game",
    id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    price: 23,
    title: "Citadella",
    image: "/assets/citadella.webp"
  },
  {
    count: 7,
    description: "Strategic board game",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Five Tribes",
    image: "/assets/five_tribes.jpg"
  },
  {
    count: 8,
    description: "Heavy euro board game",
    id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    price: 15,
    title: "Gaia Project",
    image: "/assets/gaia_project.webp"
  },
  {
    count: 3,
    description: "Euro board game",
    id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    price: 15,
    title: "Terraforming Mars",
    image: "/assets/terraforming_mars.jpg"
  }
];

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

module.exports.getProductsById = async (event) => {
  const productId = event.pathParameters.productId;
  const product = products.find(p => p.id === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Product not found' }),
    };
  }
};
